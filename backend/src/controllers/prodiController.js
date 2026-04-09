const prisma = require("../utils/prisma");

// Mendapatkan semua program studi (Bisa dilihat oleh publik)
exports.getAllProdi = async (req, res) => {
  try {
    const prodiList = await prisma.programStudi.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(prodiList);
  } catch (error) {
    console.error("Error fetching prodi:", error);
    res.status(500).json({ message: "Gagal mengambil data Program Studi." });
  }
};

// Mendapatkan detail satu program studi
exports.getProdiById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const prodi = await prisma.programStudi.findUnique({
      where: { id },
    });

    if (!prodi)
      return res
        .status(404)
        .json({ message: "Program Studi tidak ditemukan." });

    res.json(prodi);
  } catch (error) {
    console.error("Error fetching prodi detail:", error);
    res.status(500).json({ message: "Gagal mengambil detail Program Studi." });
  }
};

// Menambahkan program studi baru (Hanya Admin)
exports.createProdi = async (req, res) => {
  try {
    const {
      kode,
      nama,
      jenjang,
      fakultas,
      deskripsi,
      akreditasi,
      status,
      gambarUrl,
    } = req.body;

    // Validasi dasar
    if (!kode || !nama || !jenjang || !fakultas) {
      return res
        .status(400)
        .json({ message: "Kode, Nama, Jenjang, dan Fakultas wajib diisi." });
    }

    const newProdi = await prisma.programStudi.create({
      data: {
        kode,
        nama,
        jenjang,
        fakultas,
        deskripsi,
        akreditasi,
        status: status || "AKTIF",
        gambarUrl,
      },
    });

    res
      .status(201)
      .json({
        message: "Program Studi berhasil ditambahkan.",
        prodi: newProdi,
      });
  } catch (error) {
    console.error("Error creating prodi:", error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Kode Program Studi sudah terdaftar." });
    }
    res.status(500).json({ message: "Gagal menambahkan Program Studi." });
  }
};

// Mengupdate program studi (Hanya Admin)
exports.updateProdi = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;

    const updatedProdi = await prisma.programStudi.update({
      where: { id },
      data,
    });

    res.json({
      message: "Program Studi berhasil diperbarui.",
      prodi: updatedProdi,
    });
  } catch (error) {
    console.error("Error updating prodi:", error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Program Studi tidak ditemukan." });
    }
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({
          message: "Kode Program Studi sudah digunakan oleh prodi lain.",
        });
    }
    res.status(500).json({ message: "Gagal memperbarui Program Studi." });
  }
};

// Menghapus program studi (Hanya Admin)
exports.deleteProdi = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.programStudi.delete({
      where: { id },
    });

    res.json({ message: "Program Studi berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting prodi:", error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Program Studi tidak ditemukan." });
    }
    res.status(500).json({ message: "Gagal menghapus Program Studi." });
  }
};
