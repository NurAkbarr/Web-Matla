const prisma = require("../utils/prisma");

const getCourseSchedules = async (req, res) => {
  try {
    const schedules = await prisma.courseSchedule.findMany({
      include: {
        programStudi: true,
        dosen: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: [
        { programStudiId: "asc" },
        { semester: "asc" },
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });
    res.json(schedules);
  } catch (error) {
    console.error("Get Course Schedules Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const createCourseSchedule = async (req, res) => {
  try {
    const { courseName, lecturer, lecturerId, room, dayOfWeek, startTime, endTime, programStudiId, semester } = req.body;
    
    const schedule = await prisma.courseSchedule.create({
      data: {
        courseName,
        lecturer,
        lecturerId: lecturerId ? parseInt(lecturerId) : null,
        room,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        programStudiId: parseInt(programStudiId),
        semester: parseInt(semester),
      },
      include: {
        programStudi: true,
        dosen: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    res.status(201).json(schedule);
  } catch (error) {
    console.error("Create Course Schedule Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const updateCourseSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, lecturer, lecturerId, room, dayOfWeek, startTime, endTime, programStudiId, semester } = req.body;
    
    const schedule = await prisma.courseSchedule.update({
      where: { id: parseInt(id) },
      data: {
        courseName,
        lecturer,
        lecturerId: lecturerId ? parseInt(lecturerId) : null,
        room,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        programStudiId: parseInt(programStudiId),
        semester: parseInt(semester),
      },
      include: {
        programStudi: true,
        dosen: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    res.json(schedule);
  } catch (error) {
    console.error("Update Course Schedule Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const deleteCourseSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.courseSchedule.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Jadwal berhasil dihapus" });
  } catch (error) {
    console.error("Delete Course Schedule Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  getCourseSchedules,
  createCourseSchedule,
  updateCourseSchedule,
  deleteCourseSchedule
};
