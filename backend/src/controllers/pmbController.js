const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Fungsi helper untuk men-generate Nomor Pendaftaran (misal: PMB240001)
const generateRegistrationNo = async () => {
  const currentYear = new Date().getFullYear().toString().slice(-2); // "24", "25", "26" dsb
  const prefix = `PMB${currentYear}`;

  // Cari pendaftaran terakhir di tahun ini
  const lastApplicant = await prisma.applicant.findFirst({
    where: {
      registrationNo: {
        startsWith: prefix,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  if (!lastApplicant) {
    return `${prefix}0001`;
  }

  // Ambil 4 digit terakhir dan tambah 1
  const lastNumber = parseInt(lastApplicant.registrationNo.slice(-4), 10);
  const nextNumber = lastNumber + 1;
  return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
};

// ==========================================================
// ENDPOINT PUBLIK
// ==========================================================

// POST /api/pmb/register - Submit Pendaftaran PMB (Multistep Form)
const registerPmb = async (req, res) => {
  try {
    // Tangkap file bukti TF
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Bukti transfer (paymentProof) wajib diunggah." });
    }
    const paymentProofUrl = `/uploads/${req.file.filename}`;

    const {
      fullName,
      infoSource,
      nik,
      birthPlace,
      birthDate,
      gender,
      phone,
      email,
      address,
      employmentStatus, // Aspek 1
      lastEducation,
      schoolName,
      graduationYear,
      program, // Aspek 2
      techSkillLevel,
      importanceOpinion,
      focusOpinion,
      comparisonOpinion,
      newSkillInterest,
      preferredField,
      motivation, // Aspek 3
      termsAgreed,
    } = req.body;

    // Validasi basic
    if (!nik || !fullName || !program || termsAgreed !== "true") {
      return res.status(400).json({
        message: "Data tidak lengkap atau Syarat & Ketentuan belum disetujui.",
      });
    }

    // Generate Nomor Pendaftaran Baru
    const registrationNo = await generateRegistrationNo();

    // Buat data pendaftar baru
    const newApplicant = await prisma.applicant.create({
      data: {
        registrationNo,
        fullName,
        infoSource,
        nik,
        birthPlace,
        birthDate: new Date(birthDate),
        gender,
        phone,
        email,
        address,
        employmentStatus,
        lastEducation,
        schoolName,
        graduationYear,
        program,
        techSkillLevel: parseInt(techSkillLevel, 10),
        importanceOpinion,
        focusOpinion,
        comparisonOpinion,
        newSkillInterest,
        preferredField,
        motivation,
        paymentProofUrl,
        termsAgreed: true,
      },
    });

    res.status(201).json({
      message: "Pendaftaran berhasil disubmit.",
      registrationNo: newApplicant.registrationNo,
      gender: newApplicant.gender, // Dipakai di frontend untuk menentukan link grup WA
    });
  } catch (error) {
    console.error("Error register PMB:", error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "NIK sudah terdaftar sebelumnya." });
    }
    res.status(500).json({
      message: "Terjadi kesalahan sistem saat mendaftar.",
      error: error.message,
    });
  }
};

// GET /api/pmb/track - Cek Status Pendaftaran (Publik)
const checkApplicantStatus = async (req, res) => {
  try {
    const { registrationNo, identifier } = req.query; // identifier bisa Email atau NIK

    if (!registrationNo || !identifier) {
      return res.status(400).json({
        message: "Nomor Pendaftaran dan Email/NIK wajib diisi.",
      });
    }

    const applicant = await prisma.applicant.findFirst({
      where: {
        registrationNo: registrationNo,
        OR: [{ email: identifier }, { nik: identifier }],
      },
      select: {
        id: true,
        fullName: true,
        registrationNo: true,
        program: true,
        status: true,
        appliedDate: true,
      },
    });

    if (!applicant) {
      return res.status(404).json({
        message:
          "Data pendaftaran tidak ditemukan. Pastikan Nomor Pendaftaran dan Email/NIK benar.",
      });
    }

    res.json(applicant);
  } catch (error) {
    console.error("Error check PMB status:", error);
    res.status(500).json({
      message: "Terjadi kesalahan sistem saat mengecek status.",
    });
  }
};

// ==========================================================
// ENDPOINT ADMIN
// ==========================================================

// GET /api/pmb - Ambil Semua Pendaftar
const getAllApplicants = async (req, res) => {
  try {
    const applicants = await prisma.applicant.findMany({
      orderBy: { appliedDate: "desc" },
    });
    res.json(applicants);
  } catch (error) {
    console.error("Error get applicants:", error);
    res.status(500).json({ message: "Gagal mengambil data pendaftar." });
  }
};

// GET /api/pmb/:id - Ambil Detail Pendaftar
const getApplicantById = async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await prisma.applicant.findUnique({
      where: { id: parseInt(id) },
    });

    if (!applicant) {
      return res.status(404).json({ message: "Pendaftar tidak ditemukan." });
    }
    res.json(applicant);
  } catch (error) {
    console.error("Error get applicant by id:", error);
    res.status(500).json({ message: "Gagal mengambil detail pendaftar." });
  }
};

// PUT /api/pmb/:id/status - Update Status (DIPROSES, DITERIMA, DITOLAK)
const updateApplicantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const applicant = await prisma.applicant.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json({
      message: `Status berhasil diubah menjadi ${status}.`,
      applicant,
    });
  } catch (error) {
    console.error("Error update applicant status:", error);
    res.status(500).json({ message: "Gagal mengubah status pendaftar." });
  }
};

// DELETE /api/pmb/:id - Hapus Satu Pendaftar
const deleteApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await prisma.applicant.findUnique({
      where: { id: parseInt(id) },
    });

    if (!applicant) {
      return res.status(404).json({ message: "Pendaftar tidak ditemukan." });
    }

    // Hapus file gambar dari server
    if (applicant.paymentProofUrl) {
      const filePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(applicant.paymentProofUrl),
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.applicant.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Pendaftar berhasil dihapus." });
  } catch (error) {
    console.error("Error delete applicant:", error);
    res.status(500).json({ message: "Gagal menghapus data pendaftar." });
  }
};

// POST /api/pmb/bulk-delete - Hapus Banyak Pendaftar Sekaligus
const bulkDeleteApplicants = async (req, res) => {
  try {
    const { ids } = req.body; // array tipe [1, 2, 3]

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Tidak ada ID yang dipilih untuk dihapus." });
    }

    // Ambil data untuk hapus filenya
    const applicants = await prisma.applicant.findMany({
      where: { id: { in: ids } },
    });

    applicants.forEach((app) => {
      if (app.paymentProofUrl) {
        const filePath = path.join(
          __dirname,
          "../../uploads",
          path.basename(app.paymentProofUrl),
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await prisma.applicant.deleteMany({
      where: { id: { in: ids } },
    });

    res.json({ message: `${ids.length} data pendaftar berhasil dihapus.` });
  } catch (error) {
    console.error("Error bulk delete applicants:", error);
    res.status(500).json({ message: "Gagal menghapus massal data pendaftar." });
  }
};

module.exports = {
  registerPmb,
  checkApplicantStatus,
  getAllApplicants,
  getApplicantById,
  updateApplicantStatus,
  deleteApplicant,
  bulkDeleteApplicants,
};
