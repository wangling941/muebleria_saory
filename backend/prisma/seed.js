const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123*", 10);
  const sellerPassword = await bcrypt.hash("Seller123*", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@muebleriaigen.com",
      fullName: "Administrador General",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { username: "vendedor" },
    update: {},
    create: {
      username: "vendedor",
      email: "vendedor@muebleriaigen.com",
      fullName: "Vendedor Principal",
      passwordHash: sellerPassword,
      role: UserRole.SELLER,
      isActive: true,
    },
  });

  console.log("✅ Seed ejecutado correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
