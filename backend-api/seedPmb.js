const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedApplicants() {
  console.log("Menghapus data pendaftar lama...");
  await prisma.applicant.deleteMany();

  console.log("Membuat 5 data pendaftar baru...");

  const dummyData = [
    {
      registrationNo: "PMB240011",
      fullName: "Budi Santoso",
      email: "budi.s@example.com",
      phone: "081122334455",
      program: "Teknik Informatika",
      status: "DIPROSES",
    },
    {
      registrationNo: "PMB240012",
      fullName: "Ani Yudhoyono",
      email: "ani.y@example.com",
      phone: "082233445566",
      program: "Ilmu Komunikasi",
      status: "DITERIMA",
    },
    {
      registrationNo: "PMB240013",
      fullName: "Cici Paramida",
      email: "cici.p@example.com",
      phone: "083344556677",
      program: "Pendidikan Agama Islam",
      status: "DITOLAK",
    },
    {
      registrationNo: "PMB240014",
      fullName: "Deni Sumargo",
      email: "deni.s@example.com",
      phone: "084455667788",
      program: "Hukum Ekonomi Syariah",
      status: "DIPROSES",
    },
    {
      registrationNo: "PMB240015",
      fullName: "Euis Darliah",
      email: "euis.d@example.com",
      phone: "085566778899",
      program: "Pendidikan Guru MI",
      status: "DIPROSES",
    },
  ];

  for (const data of dummyData) {
    await prisma.applicant.create({ data });
  }

  console.log("Selesai membuat data pendaftar!");
}

seedApplicants()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
