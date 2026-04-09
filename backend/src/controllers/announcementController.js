const prisma = require("../utils/prisma");

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(announcements);
  } catch (error) {
    console.error("Get Announcements Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, isActive } = req.body;
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type: type || "info",
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    res.status(201).json(announcement);
  } catch (error) {
    console.error("Create Announcement Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, isActive } = req.body;
    
    const announcement = await prisma.announcement.update({
      where: { id: parseInt(id) },
      data: { title, content, type, isActive },
    });
    res.json(announcement);
  } catch (error) {
    console.error("Update Announcement Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Pengumuman berhasil dihapus" });
  } catch (error) {
    console.error("Delete Announcement Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
