// backend/src/modules/reportes/reportes.service.js
const { prisma } = require("../../config/database");
const { AppError } = require("../../shared/errors/AppError");

async function obtenerReporte(filters = {}) {
  const where = buildDateWhere(filters);
  // Obtener todas las ventas del período (solo campos necesarios)
  const sales = await prisma.sale.findMany({
    where,
    select: {
      subtotal: true,
      igv: true,
      total: true,
      discount: true,
      customerId: true,
    },
  });

  const totalOrdenes = sales.length;
  const totalVentas = sales.reduce((acc, s) => acc + Number(s.total), 0);
  const totalSubtotal = sales.reduce((acc, s) => acc + Number(s.subtotal), 0);
  const totalIgv = sales.reduce((acc, s) => acc + Number(s.igv), 0);
  const totalDiscount = sales.reduce(
    (acc, s) => acc + Number(s.discount || 0),
    0,
  );
  const clientesAtendidos = new Set(sales.map((s) => s.customerId)).size;
  const ticketPromedio = totalOrdenes > 0 ? totalVentas / totalOrdenes : 0;

  // Top productos (usamos Prisma directamente)
  const topProductsRaw = await prisma.saleItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true, lineTotal: true },
    where: {
      sale: { createdAt: where.createdAt }, // filtro por fecha
    },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

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
    clientesAtendidos,
    topProductos,
  };
}

async function obtenerVentasPorDia(filters = {}) {
  const where = buildDateWhere(filters);
  // Obtener todas las ventas del período (solo fecha y total)
  const sales = await prisma.sale.findMany({
    where,
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Agrupar por fecha (sin hora) en JavaScript
  const map = new Map();
  sales.forEach((s) => {
    const dateStr = s.createdAt.toISOString().split("T")[0];
    const total = Number(s.total);
    if (map.has(dateStr)) {
      map.set(dateStr, map.get(dateStr) + total);
    } else {
      map.set(dateStr, total);
    }
  });

  return Array.from(map.entries()).map(([date, total]) => ({ date, total }));
}

function buildDateWhere(filters) {
  const where = {};
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) {
      const fromDate = new Date(filters.from);
      if (!isNaN(fromDate)) where.createdAt.gte = fromDate;
    }
    if (filters.to) {
      const toDate = new Date(filters.to);
      if (!isNaN(toDate)) {
        // Para que incluya el día completo, sumamos un día y restamos 1 ms
        const endDate = new Date(toDate);
        endDate.setDate(endDate.getDate() + 1);
        where.createdAt.lt = endDate;
      }
    }
  }
  return where;
}

module.exports = { obtenerReporte, obtenerVentasPorDia };
