const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

// Get all students (Users with role STUDENT) and their profiles
const getStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        studentProfile: {
          include: {
            programStudi: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(students);
  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Create a new student user and their profile
const createStudent = async (req, res) => {
  try {
    const { name, email, password, nim, programStudiId, semester, angkatan, ipk, sksDitempuh, totalSks } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Check if NIM already exists
    if (nim) {
        const existingNim = await prisma.studentProfile.findUnique({ where: { nim } });
        if (existingNim) {
            return res.status(400).json({ message: "NIM sudah terdaftar" });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      // Create profile if nim and programStudiId are provided
      if (nim && programStudiId) {
        await prisma.studentProfile.create({
          data: {
            userId: user.id,
            nim,
            programStudiId: parseInt(programStudiId),
            semester: semester ? parseInt(semester) : 1,
            angkatan: angkatan || "2024",
            ipk: ipk ? parseFloat(ipk) : 0.0,
            sksDitempuh: sksDitempuh ? parseInt(sksDitempuh) : 0,
            totalSks: totalSks ? parseInt(totalSks) : 144,
          },
        });
      }

      return user;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Update student and profile
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params; // userId
    const { name, email, password, nim, programStudiId, semester, angkatan, ipk, sksDitempuh, totalSks } = req.body;

    // Update data object
    const updateData = { name, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Update User
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      // Handle Profile
      if (nim && programStudiId) {
        // Upsert profile (create if not exists, update if exists)
        await prisma.studentProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            nim,
            programStudiId: parseInt(programStudiId),
            semester: semester ? parseInt(semester) : 1,
            ipk: ipk ? parseFloat(ipk) : 0.0,
            sksDitempuh: sksDitempuh ? parseInt(sksDitempuh) : 0,
            totalSks: totalSks ? parseInt(totalSks) : 144,
          },
          update: {
            nim,
            programStudiId: parseInt(programStudiId),
            semester: semester ? parseInt(semester) : undefined,
            angkatan: angkatan || undefined,
            ipk: ipk ? parseFloat(ipk) : undefined,
            sksDitempuh: sksDitempuh ? parseInt(sksDitempuh) : undefined,
            totalSks: totalSks ? parseInt(totalSks) : undefined,
          },
        });
      }

      return user;
    });

    res.json(result);
  } catch (error) {
    console.error("Update Student Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    // Prisma will cascade delete studentProfile because of onDelete: Cascade
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
};
