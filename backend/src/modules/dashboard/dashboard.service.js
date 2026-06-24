const { prisma } = require("../../config/database");

async function obtenerDashboard() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  // Ventas hoy
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const salesToday = await prisma.sale.aggregate({
    _sum: { total: true },
    where: { createdAt: { gte: today } },
  });

  // Ventas del mes
  const salesMonth = await prisma.sale.aggregate({
    _sum: { total: true },
    where: { createdAt: { gte: startOfMonth } },
  });

  // Productos más vendidos (top 5)
  const topProducts = await prisma.saleItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });
  const productIds = topProducts.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, imageUrl: true, stock: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));
  const topProductsData = topProducts.map((item) => ({
    ...productMap.get(item.productId),
    ventas: item._sum.quantity,
  }));

  // Ventas semanales (agrupadas por día)
  const weeklySales = await prisma.sale.groupBy({
    by: ["createdAt"],
    _sum: { total: true },
    where: { createdAt: { gte: startOfWeek } },
    orderBy: { createdAt: "asc" },
  });

  // Resumen
  return {
    totalSales: salesToday._sum.total || 0,
    monthlySales: salesMonth._sum.total || 0,
    totalProducts: await prisma.product.count({ where: { isActive: true } }),
    totalCustomers: await prisma.customer.count(),
    topProducts: topProductsData,
    weeklySales: weeklySales.map((item) => ({
      date: item.createdAt.toISOString().slice(0, 10),
      total: item._sum.total || 0,
    })),
  };
}

module.exports = { obtenerDashboard };
