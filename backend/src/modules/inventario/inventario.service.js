const { prisma } = require("../../config/database");
const { AppError } = require("../../shared/errors/AppError");

async function obtenerResumen() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, stock: true, price: true, name: true },
  });
  const totalProductos = products.length;
  const productosSinStock = products.filter((p) => p.stock <= 0).length;
  const productosStockBajo = products.filter(
    (p) => p.stock > 0 && p.stock <= 5,
  ).length;
  const valorizacionTotal = products.reduce(
    (acc, p) => acc + Number(p.price) * p.stock,
    0,
  );
  return {
    totalProductos,
    productosSinStock,
    productosStockBajo,
    valorizacionTotal,
  };
}

async function obtenerProductosCriticos(search = "") {
  const where = { isActive: true };
  if (search) {
    where.OR = [{ name: { contains: search, mode: "insensitive" } }];
  }
  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      minStock: true,
      imageUrl: true,
    },
    orderBy: { stock: "asc" },
  });
  const criticos = products.filter((p) => p.stock <= (p.minStock || 5));
  return criticos;
}

async function actualizarStock(id, payload) {
  const { stock, note } = payload;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError("Producto no encontrado", 404);
  if (stock < 0) throw new AppError("El stock no puede ser negativo", 400);
  const updated = await prisma.$transaction(async (tx) => {
    const productUpdated = await tx.product.update({
      where: { id },
      data: { stock },
    });
    await tx.stockMovement.create({
      data: {
        type: "ADJUSTMENT",
        quantity: stock - product.stock,
        note: note || "Ajuste de stock",
        productId: id,
      },
    });
    return productUpdated;
  });
  return updated;
}

module.exports = { obtenerResumen, obtenerProductosCriticos, actualizarStock };
