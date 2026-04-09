const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                dosenProfile: true
            }
        });

        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        // Calculate statistics for the Dosen Dashboard/Profile
        // E.g. How many courses they are teaching currently
        // NOTE: If we want to filter by active semester we'd need that logic, but let's just get all right now
        const courses = await prisma.courseSchedule.findMany({
            where: { lecturerId: userId },
            include: { _count: { select: { enrollments: true } } }
        });

        const totalCourses = courses.length;
        const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0);

        // Calculate if there are grades waiting to be published
        const draftCourses = courses.filter(c => !c.isGradesPublished).length;

        // Return a unified profile object
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            profile: user.dosenProfile || {},
            stats: {
                totalCourses,
                totalStudents,
                draftCourses
            }
        });

    } catch (error) {
        console.error("Get Dosen Profile Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { academicTitle, phoneNumber, address, gender, birthPlace, birthDate, expertise, profilePictureUrl } = req.body;

        const parsedBirthDate = birthDate ? new Date(birthDate) : null;

        // Note: we do not update 'name', 'email', or 'nidn' here because those are admin-controlled.
        await prisma.dosenProfile.upsert({
            where: { userId },
            update: {
                academicTitle,
                phoneNumber,
                address,
                gender,
                birthPlace,
                birthDate: parsedBirthDate,
                expertise,
                profilePictureUrl
            },
            create: {
                userId,
                academicTitle,
                phoneNumber,
                address,
                gender,
                birthPlace,
                birthDate: parsedBirthDate,
                expertise,
                profilePictureUrl
            }
        });

        // Fetch user data again to return combined standard format
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { dosenProfile: true }
        });

        res.json({ message: "Profil berhasil diperbarui", profile: user.dosenProfile });
    } catch (error) {
        console.error("Update Dosen Profile Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password saat ini salah." });
        }

        if (newPassword.length < 6) {
             return res.status(400).json({ message: "Password baru harus minimal 6 karakter." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ message: "Password berhasil diubah" });
    } catch (error) {
        console.error("Update Password Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ message: "File gambar tidak ditemukan." });
        }

        const profilePictureUrl = `/uploads/${req.file.filename}`;

        // Update database
        await prisma.dosenProfile.upsert({
            where: { userId },
            update: { profilePictureUrl },
            create: {
                userId,
                profilePictureUrl
            }
        });

        res.json({ 
            message: "Foto profil berhasil diunggah", 
            profilePictureUrl 
        });
    } catch (error) {
        console.error("Upload Avatar Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengunggah foto" });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updatePassword,
    uploadAvatar
};
