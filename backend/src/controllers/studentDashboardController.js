const prisma = require("../utils/prisma");

// Fetch data for student dashboard
const getStudentDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get Student Profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        programStudi: true,
        user: true,
      },
    });

    if (!studentProfile) {
      return res.status(404).json({ message: "Profil mahasiswa tidak ditemukan. Hubungi admin." });
    }

    // 2. Get Announcements
    const announcements = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // 3. Get Today's Schedule
    const today = new Date().getDay(); // 0(Sun) - 6(Sat)
    const dayOfWeek = today === 0 ? 7 : today; // Map Sunday(0) to 7, otherwise 1-6

    const schedule = await prisma.courseSchedule.findMany({
      where: {
        programStudiId: studentProfile.programStudiId,
        semester: studentProfile.semester,
        dayOfWeek: dayOfWeek,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Determine the "next" class based on current time
    const now = new Date();
    const currentHourMin = now.getHours() * 60 + now.getMinutes();

    let nextClass = null;
    let nextClassStatus = null;

    for (const cls of schedule) {
      const [startH, startM] = cls.startTime.split(':').map(Number);
      const [endH, endM] = cls.endTime.split(':').map(Number);
      
      const startMinTotal = startH * 60 + startM;
      const endMinTotal = endH * 60 + endM;

      if (currentHourMin >= startMinTotal && currentHourMin <= endMinTotal) {
        // Class is currently ongoing
        nextClass = cls;
        const minsLeft = endMinTotal - currentHourMin;
        nextClassStatus = `Berlangsung. Selesai dalam ${minsLeft}m`;
        break;
      } else if (currentHourMin < startMinTotal) {
        // This is the next class
        nextClass = cls;
        const minsToStart = startMinTotal - currentHourMin;
        if (minsToStart < 60) {
           nextClassStatus = `Mulai dalam ${minsToStart}m`;
        } else {
           nextClassStatus = `Mulai pukul ${cls.startTime}`;
        }
        break;
      }
    }

    return res.json({
      profile: {
        name: studentProfile.user.name,
        nim: studentProfile.nim,
        programStudi: studentProfile.programStudi.nama,
        semester: studentProfile.semester,
        ipk: studentProfile.ipk,
        sksDitempuh: studentProfile.sksDitempuh,
        totalSks: studentProfile.totalSks,
      },
      announcements,
      nextClass: nextClass ? { ...nextClass, statusText: nextClassStatus } : null
    });
  } catch (error) {
    console.error("Get Student Dashboard Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Fetch grades for student
const getStudentGrades = async (req, res) => {
  try {
    const userId = req.user.id;
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!studentProfile) {
       return res.status(404).json({ message: "Profil mahasiswa tidak ditemukan" });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentProfileId: studentProfile.id },
      include: {
        course: {
          include: {
            dosen: { select: { name: true } }
          }
        }
      },
      orderBy: [
        { semester: 'desc' },
        { course: { courseName: 'asc' } }
      ]
    });

    const formattedEnrollments = enrollments.map(enroll => {
      // Sembunyikan nilai jika belum di-publish
      if (!enroll.course.isGradesPublished) {
         return {
            ...enroll,
            gradeScore: null,
            gradeLetter: null,
            status: "DRAFT"
         };
      }
      return enroll;
    });

    res.json(formattedEnrollments);
  } catch (error) {
    console.error("Get Student Grades Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  getStudentDashboardData,
  getStudentGrades
};
