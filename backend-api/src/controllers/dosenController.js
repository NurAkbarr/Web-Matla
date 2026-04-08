const prisma = require("../utils/prisma");

const getCourses = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const courses = await prisma.courseSchedule.findMany({
      where: { lecturerId: dosenId },
      include: {
        programStudi: true,
        _count: {
          select: { enrollments: true },
        },
      },
    });
    res.json(courses);
  } catch (error) {
    console.error("Get Dosen Courses Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const getCourseStudents = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { courseId } = req.params;

    // Verify course belongs to dosen
    const course = await prisma.courseSchedule.findFirst({
      where: { id: parseInt(courseId), lecturerId: dosenId },
    });

    if (!course) {
      return res.status(403).json({ message: "Akses ditolak atau mata kuliah tidak ditemukan" });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseScheduleId: parseInt(courseId) },
      include: {
        student: {
          include: {
            user: {
              select: { name: true, email: true },
            },
            programStudi: true,
          },
        },
        gradeDetails: true,
      },
    });
    res.json(enrollments);
  } catch (error) {
    console.error("Get Course Students Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const inputGrades = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { courseId } = req.params;
    const { grades } = req.body; // Array of { enrollmentId, details: [{componentId, score}] }

    const course = await prisma.courseSchedule.findFirst({
      where: { id: parseInt(courseId), lecturerId: dosenId },
    });

    if (!course) return res.status(403).json({ message: "Akses ditolak" });
    if (course.isGradesPublished) return res.status(400).json({ message: "Nilai telah terkunci karena sudah dipublis. Hubungi Admin untuk membuka kunci." });

    // Fetch components to calculate final score
    const components = await prisma.gradeComponent.findMany({
      where: { courseScheduleId: parseInt(courseId) }
    });

    const updatePromises = grades.map(async (g) => {
      // Upsert details
      let totalScore = 0;
      for (const d of g.details) {
         const newScore = parseFloat(d.score) || 0;
         
         // Ambil nilai lama untuk mendeteksi perubahan
         const existingDetail = await prisma.gradeDetail.findUnique({
            where: {
               enrollmentId_gradeComponentId: {
                  enrollmentId: parseInt(g.enrollmentId),
                  gradeComponentId: parseInt(d.componentId)
               }
            }
         });
         
         if (!existingDetail || existingDetail.score !== newScore) {
             const oldScore = existingDetail ? existingDetail.score : null;
             // Catat riwayat audit
             await prisma.gradeAuditLog.create({
                 data: {
                     enrollmentId: parseInt(g.enrollmentId),
                     gradeComponentId: parseInt(d.componentId),
                     oldScore: oldScore,
                     newScore: newScore,
                     changedByUserId: dosenId
                 }
             });
         }

         await prisma.gradeDetail.upsert({
            where: {
               enrollmentId_gradeComponentId: {
                  enrollmentId: parseInt(g.enrollmentId),
                  gradeComponentId: parseInt(d.componentId)
               }
            },
            update: { score: parseFloat(d.score) || 0 },
            create: {
               enrollmentId: parseInt(g.enrollmentId),
               gradeComponentId: parseInt(d.componentId),
               score: parseFloat(d.score) || 0
            }
         });
         const comp = components.find(c => c.id === parseInt(d.componentId));
         if (comp) {
            totalScore += (parseFloat(d.score) || 0) * (comp.percentage / 100);
         }
      }

      // Auto-calculate letter
      let letter = 'E';
      if (totalScore >= 85) letter = 'A';
      else if (totalScore >= 80) letter = 'A-';
      else if (totalScore >= 75) letter = 'B+';
      else if (totalScore >= 70) letter = 'B';
      else if (totalScore >= 65) letter = 'C+';
      else if (totalScore >= 60) letter = 'C';
      else if (totalScore >= 50) letter = 'D';

      return prisma.enrollment.update({
        where: { id: parseInt(g.enrollmentId) },
        data: {
          gradeScore: totalScore,
          gradeLetter: letter,
          status: "COMPLETED"
        },
      });
    });

    await Promise.all(updatePromises);
    res.json({ message: "Berhasil menyimpan nilai" });
  } catch (error) {
    console.error("Input Grades Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat menyimpan nilai" });
  }
};

const getGradeComponents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const components = await prisma.gradeComponent.findMany({
      where: { courseScheduleId: parseInt(courseId) },
      orderBy: { id: 'asc' }
    });
    res.json(components);
  } catch (error) {
    console.error("Get Grade Components Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

const saveGradeComponents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { components } = req.body; // Array of { name, percentage }
    
    // Verifikasi total 100%
    const total = components.reduce((sum, c) => sum + parseFloat(c.percentage), 0);
    if (Math.abs(total - 100) > 0.01) {
       return res.status(400).json({ message: "Total persentase harus exactly 100%" });
    }

    // Delete existing and recreate for simplicity (or update if needed)
    await prisma.gradeComponent.deleteMany({
       where: { courseScheduleId: parseInt(courseId) }
    });

    await prisma.gradeComponent.createMany({
       data: components.map(c => ({
          courseScheduleId: parseInt(courseId),
          name: c.name,
          percentage: parseFloat(c.percentage)
       }))
    });

    res.json({ message: "Berhasil mengatur komponen nilai" });
  } catch (error) {
    console.error("Save Grade Components Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

// Admin helper - enroll a student directly
const adminEnrollStudent = async (req, res) => {
    try {
        const { studentProfileId, courseScheduleId, semester } = req.body;
        
        // check if already enrolled
        const existing = await prisma.enrollment.findUnique({
            where: {
                studentProfileId_courseScheduleId: {
                    studentProfileId: parseInt(studentProfileId),
                    courseScheduleId: parseInt(courseScheduleId)
                }
            }
        });

        if (existing) {
            return res.status(400).json({ message: "Mahasiswa sudah terdaftar di mata kuliah ini" });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                studentProfileId: parseInt(studentProfileId),
                courseScheduleId: parseInt(courseScheduleId),
                semester: parseInt(semester) || 1
            }
        });
        res.status(201).json(enrollment);
    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}

// Admin helper - get enrollments for a course
const adminGetCourseEnrollments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const enrollments = await prisma.enrollment.findMany({
            where: { courseScheduleId: parseInt(courseId) },
            include: {
                student: {
                    include: {
                        user: { select: { name: true, email: true } },
                        programStudi: true
                    }
                }
            }
        });
        res.json(enrollments);
    } catch (error) {
        console.error("Get Enrollments Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}

// Admin helper - remove an enrollment
const adminRemoveEnrollment = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        await prisma.enrollment.delete({
            where: { id: parseInt(enrollmentId) }
        });
        res.json({ message: "Berhasil menghapus mahasiswa dari kelas" });
    } catch (error) {
        console.error("Remove Enrollment Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}

// Fetch all dosen users for admin dropdown
const getAllDosen = async (req, res) => {
    try {
        const dosens = await prisma.user.findMany({
            where: { role: "DOSEN" },
            select: { id: true, name: true, email: true }
        });
        res.json(dosens);
    } catch (error) {
        console.error("Get Dosen List Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}

// Publish Grades
const publishGrades = async (req, res) => {
    try {
        const dosenId = req.user.id;
        const { courseId } = req.params;

        const course = await prisma.courseSchedule.findFirst({
            where: { id: parseInt(courseId), lecturerId: dosenId },
        });

        if (!course) return res.status(403).json({ message: "Akses ditolak" });

        await prisma.courseSchedule.update({
            where: { id: parseInt(courseId) },
            data: { isGradesPublished: true }
        });

        res.json({ message: "Nilai berhasil dipublis dan dikunci." });
    } catch (error) {
        console.error("Publish Grades Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

// Admin Unlock Grades
const adminUnlockGrades = async (req, res) => {
    try {
        const { courseId } = req.params;
        await prisma.courseSchedule.update({
            where: { id: parseInt(courseId) },
            data: { isGradesPublished: false }
        });
        res.json({ message: "Kunci nilai berhasil dibuka kembali." });
    } catch (error) {
        console.error("Unlock Grades Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

// Get Audit Logs
const getGradeAuditLogs = async (req, res) => {
    try {
        const { courseId } = req.params;
        const logs = await prisma.gradeAuditLog.findMany({
            where: {
                enrollment: {
                    courseScheduleId: parseInt(courseId)
                }
            },
            include: {
                enrollment: {
                    include: {
                        student: { select: { nim: true, user: { select: { name: true } } } }
                    }
                },
                component: { select: { name: true } },
                changedByUser: { select: { name: true, role: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 100 // Get latest 100 records for sanity
        });

        const formatted = logs.map(l => ({
            id: l.id,
            nim: l.enrollment.student.nim,
            studentName: l.enrollment.student.user.name,
            componentName: l.component.name,
            oldScore: l.oldScore,
            newScore: l.newScore,
            changedBy: l.changedByUser.name,
            role: l.changedByUser.role,
            timestamp: l.createdAt
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Get Audit Logs Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

module.exports = {
  getCourses,
  getCourseStudents,
  inputGrades,
  adminEnrollStudent,
  adminGetCourseEnrollments,
  adminRemoveEnrollment,
  getAllDosen,
  getGradeComponents,
  saveGradeComponents,
  publishGrades,
  adminUnlockGrades,
  getGradeAuditLogs
};
