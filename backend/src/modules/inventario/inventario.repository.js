const { prisma } = require("../../config/database");

async function findProductById(id) {
  return prisma.product.findUnique({ where: { id } });
}

async function updateStock(id, stock) {
  return prisma.product.update({ where: { id }, data: { stock } });
}

async function createStockMovement(data) {
  return prisma.stockMovement.create({ data });
}

module.exports = { findProductById, updateStock, createStockMovement };
