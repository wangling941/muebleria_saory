const { prisma } = require("../../config/database");

async function findAll(search = "", estado) {
  const where = {};
  if (search) {
    where.OR = [{ name: { contains: search, mode: "insensitive" } }];
  }
  if (estado === "active") where.isActive = true;
  else if (estado === "inactive") where.isActive = false;
  return prisma.product.findMany({ where, orderBy: { name: "asc" } });
}

async function findById(id) {
  return prisma.product.findUnique({ where: { id } });
}

async function create(data) {
  return prisma.product.create({ data });
}

async function update(id, data) {
  return prisma.product.update({ where: { id }, data });
}

async function updateStatus(id, isActive) {
  return prisma.product.update({ where: { id }, data: { isActive } });
}

async function remove(id) {
  return prisma.product.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, updateStatus, remove };
