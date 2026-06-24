const { prisma } = require("../../config/database");

async function findAll() {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      imageUrl: true,
    },
  });
}

async function findByUsernameOrEmail(username, email, excludeId = null) {
  return prisma.user.findFirst({
    where: {
      OR: [{ username }, { email: email.toLowerCase() }],
      ...(excludeId && { NOT: { id: excludeId } }),
    },
    select: { id: true },
  });
}

async function create(data) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      imageUrl: true,
    },
  });
}

async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      imageUrl: true,
    },
  });
}

async function updateStatus(id, isActive) {
  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
    },
  });
}

async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
    select: { id: true, username: true, email: true, fullName: true },
  });
}

module.exports = {
  findAll,
  findById,
  findByUsernameOrEmail,
  create,
  updateUser,
  updateStatus,
  deleteUser,
};
