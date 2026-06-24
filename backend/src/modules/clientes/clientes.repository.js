const { prisma } = require("../../config/database");

async function findAll(search = "") {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { dni: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};
  return prisma.customer.findMany({ where, orderBy: { createdAt: "desc" } });
}

async function findById(id) {
  return prisma.customer.findUnique({ where: { id } });
}

async function findByDni(dni, excludeId = null) {
  return prisma.customer.findFirst({
    where: { dni, ...(excludeId && { NOT: { id: excludeId } }) },
  });
}

async function create(data) {
  return prisma.customer.create({ data });
}

async function update(id, data) {
  return prisma.customer.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.customer.delete({ where: { id } });
}

module.exports = { findAll, findById, findByDni, create, update, remove };
