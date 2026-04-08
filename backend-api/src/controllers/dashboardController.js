const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Pendaftar (Applicants)
    const totalApplicants = await prisma.applicant.count();

    // 2. Mahasiswa Aktif (Users dengan role STUDENT)
    const activeStudents = await prisma.user.count({
      where: { role: "STUDENT" },
    });

    // 3. Total Program Studi
    const totalPrograms = await prisma.programStudi.count();

    // 4. Pengunjung Web (Mock for now, as we don't have a tracker)
    const webVisitors = 3240; // Static mock value to match previous design

    // 5. Recent 3 Applicants
    const recentApplicants = await prisma.applicant.findMany({
      take: 3,
      orderBy: { appliedDate: "desc" },
      select: {
        id: true,
        fullName: true,
        program: true,
        status: true,
        appliedDate: true,
      },
    });

    res.json({
      stats: {
        totalApplicants,
        activeStudents,
        totalPrograms,
        webVisitors,
      },
      recentApplicants,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data statistik dashboard." });
  }
};
