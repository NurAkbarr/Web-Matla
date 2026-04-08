const prisma = require("../utils/prisma");

// Get all users (for Admin Dashboard)
exports.getAllUsers = async (req, res) => {
  try {
    // Exclude passwords for security
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data user." });
  }
};

// Update a user's role
exports.updateUserRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    // Validate role
    const validRoles = ["STUDENT", "ADMIN", "SUPER_ADMIN"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Role tidak valid." });
    }

    // Check if updating self (prevent self-demotion from SUPER_ADMIN)
    if (
      req.user.id === userId &&
      req.user.role === "SUPER_ADMIN" &&
      role !== "SUPER_ADMIN"
    ) {
      return res.status(400).json({
        message: "Super Admin tidak dapat mengubah role-nya sendiri.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json({
      message: "Role berhasil diperbarui",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    if (error.code === "P2025") {
      // Prisma error code for Record to update not found
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memperbarui role." });
  }
};

// Create a new user (Admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nama, Email, dan Password wajib diisi." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(201).json({ message: "User berhasil dibuat", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Gagal membuat user baru." });
  }
};

// Delete a user (Super Admin only usually, but allowed for ADMIN per req)
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent deleting self
    if (req.user.id === userId) {
      return res
        .status(400)
        .json({ message: "Anda tidak dapat menghapus akun Anda sendiri." });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userToDelete) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    // Prevent ADMIN from deleting SUPER_ADMIN (optional but good practice)
    if (
      req.user.role !== "SUPER_ADMIN" &&
      userToDelete.role === "SUPER_ADMIN"
    ) {
      return res
        .status(403)
        .json({
          message: "Anda tidak memiliki izin untuk menghapus Super Admin.",
        });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Gagal menghapus user." });
  }
};
