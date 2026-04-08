const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const user = await prisma.user.update({
      where: { email: "authTest2@example.com" },
      data: { role: "SUPER_ADMIN" },
    });
    console.log("Success!", user);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
