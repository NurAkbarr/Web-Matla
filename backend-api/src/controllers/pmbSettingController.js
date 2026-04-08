const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// GET /api/pmb-settings
const getSettings = async (req, res) => {
  try {
    let setting = await prisma.pmbSetting.findFirst();

    if (!setting) {
      // Create default settings if none exist
      setting = await prisma.pmbSetting.create({
        data: {
          tahunAjaran: "2024/2025",
          gelombangAktif: "Gelombang 1",
          deadlinePendaftaran: new Date("2025-12-31T23:59:59"),
          tagline: "Mulai Perjalanan Ilmu Anda Bersama Kami",
          deskripsi: "Daftarkan diri Anda sekarang dan raih gelar S1 resmi.",
          brosurUrl: null,
          brosurImages: null,
          isOpen: true,
        },
      });
    }

    // Parse brosurImages from JSON string
    const result = {
      ...setting,
      brosurImages: setting.brosurImages
        ? JSON.parse(setting.brosurImages)
        : [],
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching PMB Settings:", error);
    res
      .status(500)
      .json({
        message: "Gagal mengambil pengaturan PMB.",
        error: error.message,
      });
  }
};

// PUT /api/pmb-settings
const updateSettings = async (req, res) => {
  try {
    const {
      tahunAjaran,
      gelombangAktif,
      deadlinePendaftaran,
      tagline,
      deskripsi,
      isOpen,
    } = req.body;

    // Get current settings to get current images
    const current = await prisma.pmbSetting.findFirst();
    const currentImages = current?.brosurImages
      ? JSON.parse(current.brosurImages)
      : [];

    // Handle single brosurUrl (legacy)
    let brosurUrl = current?.brosurUrl || null;
    if (req.file) {
      brosurUrl = `/uploads/${req.file.filename}`;
    }

    // Handle multiple brosur images
    let brosurImages = [...currentImages];
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map((f) => `/uploads/${f.filename}`);
      brosurImages = [...brosurImages, ...newImageUrls];
    }

    // Update or create settings
    let updatedSetting;
    if (current) {
      updatedSetting = await prisma.pmbSetting.update({
        where: { id: current.id },
        data: {
          tahunAjaran,
          gelombangAktif,
          deadlinePendaftaran: new Date(deadlinePendaftaran),
          tagline,
          deskripsi,
          brosurUrl,
          brosurImages: JSON.stringify(brosurImages),
          isOpen: isOpen === "true" || isOpen === true,
        },
      });
    } else {
      updatedSetting = await prisma.pmbSetting.create({
        data: {
          tahunAjaran,
          gelombangAktif,
          deadlinePendaftaran: new Date(deadlinePendaftaran),
          tagline,
          deskripsi,
          brosurUrl,
          brosurImages: JSON.stringify(brosurImages),
          isOpen: isOpen === "true" || isOpen === true,
        },
      });
    }

    res.json({
      ...updatedSetting,
      brosurImages,
    });
  } catch (error) {
    console.error("Error updating PMB Settings:", error);
    res
      .status(500)
      .json({
        message: "Gagal memperbarui pengaturan PMB.",
        error: error.message,
        stack: error.stack,
      });
  }
};

// DELETE /api/pmb-settings/image  (delete a specific image from the slide list)
const deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl wajib diisi." });
    }

    const current = await prisma.pmbSetting.findFirst();
    if (!current) {
      return res
        .status(404)
        .json({ message: "Pengaturan PMB tidak ditemukan." });
    }

    const currentImages = current.brosurImages
      ? JSON.parse(current.brosurImages)
      : [];
    const newImages = currentImages.filter((url) => url !== imageUrl);

    // Delete the file from disk
    const filePath = path.join(
      __dirname,
      "../../uploads",
      path.basename(imageUrl),
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.pmbSetting.update({
      where: { id: current.id },
      data: { brosurImages: JSON.stringify(newImages) },
    });

    res.json({ message: "Gambar berhasil dihapus.", brosurImages: newImages });
  } catch (error) {
    console.error("Error deleting image:", error);
    res
      .status(500)
      .json({ message: "Gagal menghapus gambar.", error: error.message });
  }
};

// GET /api/pmb-settings/download/:filename
const downloadBrosur = (req, res) => {
  try {
    const filename = req.params.filename;
    const customName = req.query.customName;
    
    // Path traversal mitigation
    if (filename.includes("..") || filename.includes("/")) {
      return res.status(400).json({ message: "Nama file tidak valid" });
    }
    
    const filePath = path.join(__dirname, "../../uploads", filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File tidak ditemukan" });
    }
    
    // Add extension to custom name
    const ext = path.extname(filename);
    const downloadName = customName ? `${customName}${ext}` : filename;
    
    res.download(filePath, downloadName);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: "Gagal mendownload brosur" });
  }
};

module.exports = { getSettings, updateSettings, deleteImage, downloadBrosur };

