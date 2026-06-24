const { prisma } = require("../../config/database");
const { AppError } = require("../../shared/errors/AppError");

async function obtenerReporte(filters = {}) {
  const where = buildDateWhere(filters);
  const [sales, totalOrdenes, customers, topProductsRaw] = await Promise.all([
    prisma.sale.findMany({
      where,
      select: { subtotal: true, igv: true, total: true, discount: true },
    }),
    prisma.sale.count({ where }),
    prisma.sale.count({ where: { ...where, customerId: { not: null } } }),
    prisma.saleItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, lineTotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);
  const totalVentas = sales.reduce((acc, s) => acc + Number(s.total), 0);
  const ticketPromedio = totalOrdenes > 0 ? totalVentas / totalOrdenes : 0;
  const totalIgv = sales.reduce((acc, s) => acc + Number(s.igv), 0);
  const totalSubtotal = sales.reduce((acc, s) => acc + Number(s.subtotal), 0);
  const totalDiscount = sales.reduce(
    (acc, s) => acc + Number(s.discount || 0),
    0,
  );

  const productIds = topProductsRaw.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, imageUrl: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));
  const topProductos = topProductsRaw.map((item) => ({
    productId: item.productId,
    nombre: productMap.get(item.productId)?.name || "Producto eliminado",
    imagen: productMap.get(item.productId)?.imageUrl || null,
    cantidadVendida: item._sum.quantity || 0,
    totalVendido: Number(item._sum.lineTotal || 0),
  }));

  return {
    ventasTotales: totalVentas,
    subtotalTotal: totalSubtotal,
    igvTotal: totalIgv,
    descuentoTotal: totalDiscount,
    totalOrdenes,
    ticketPromedio: Number(ticketPromedio.toFixed(2)),
    clientesAtendidos: customers,
    topProductos,
  };
}

async function obtenerVentasPorDia(filters = {}) {
  const where = buildDateWhere(filters);
  const salesByDay = await prisma.sale.groupBy({
    by: ["createdAt"],
    where,
    _sum: { total: true },
    orderBy: { createdAt: "asc" },
  });
  return salesByDay.map((item) => ({
    date: item.createdAt.toISOString().split("T")[0],
    total: Number(item._sum.total || 0),
  }));
}

function buildDateWhere(filters) {
  const where = {};
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lt = new Date(filters.to);
  }
  return where;
}

module.exports = { obtenerReporte, obtenerVentasPorDia };
