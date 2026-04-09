const prisma = require("../utils/prisma");

/**
 * Middleware to verify that the logged-in lecturer owns the course they are trying to access.
 * expects 'courseId' in req.params
 */
const verifyCourseOwnership = async (req, res, next) => {
    try {
        const dosenId = req.user.id;
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ message: "ID Mata Kuliah diperlukan" });
        }

        const course = await prisma.courseSchedule.findUnique({
            where: { id: parseInt(courseId) }
        });

        if (!course) {
            return res.status(404).json({ message: "Mata kuliah tidak ditemukan" });
        }

        if (course.lecturerId !== dosenId) {
            console.warn(`Security Warning: User ${dosenId} attempted illegal access to course ${courseId}`);
            return res.status(403).json({ message: "Akses ditolak: Anda bukan pengampu mata kuliah ini." });
        }

        // Attach course to request object for later use if needed
        req.course = course;
        next();
    } catch (error) {
        console.error("Course Ownership Verification Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan keamanan" });
    }
};

module.exports = {
    verifyCourseOwnership
};
