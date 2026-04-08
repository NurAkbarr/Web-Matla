const express = require("express");
const dosenController = require("../controllers/dosenController");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Setup Multer Storage for Dosen Profile Pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "dosen-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar (JPG/PNG/WEBP) yang diperbolehkan."));
    }
  },
});

router.use(authMiddleware);

// Endpoint required for Admin (Admin needing list of Dosen)
router.get("/list", restrictTo("ADMIN", "SUPER_ADMIN"), dosenController.getAllDosen);
router.post("/enroll", restrictTo("ADMIN", "SUPER_ADMIN"), dosenController.adminEnrollStudent);
router.get("/enroll/:courseId", restrictTo("ADMIN", "SUPER_ADMIN"), dosenController.adminGetCourseEnrollments);
router.delete("/enroll/:enrollmentId", restrictTo("ADMIN", "SUPER_ADMIN"), dosenController.adminRemoveEnrollment);
router.post("/courses/:courseId/unlock", restrictTo("ADMIN", "SUPER_ADMIN"), dosenController.adminUnlockGrades);

const dosenProfileController = require("../controllers/dosenProfileController");

// Endpoints strictly for DOSEN
router.use(restrictTo("DOSEN"));

// Profile endpoints
router.get("/profile", dosenProfileController.getProfile);
router.put("/profile", dosenProfileController.updateProfile);
router.post("/profile/upload", upload.single("profilePicture"), dosenProfileController.uploadAvatar);
router.put("/profile/password", dosenProfileController.updatePassword);

router.get("/courses", dosenController.getCourses);
router.get("/courses/:courseId/students", dosenController.getCourseStudents);
router.put("/courses/:courseId/grades", dosenController.inputGrades);

router.get("/courses/:courseId/grade-components", dosenController.getGradeComponents);
router.post("/courses/:courseId/grade-components", dosenController.saveGradeComponents);

router.post("/courses/:courseId/publish", dosenController.publishGrades);
router.get("/courses/:courseId/audit-logs", dosenController.getGradeAuditLogs);

// Unlock route for Admin (Needs to bypass the DOSEN restriction on this router, 
// so we should add it in an admin-accessible scope. Wait, this router is mounted.
// Let's mount the /unlock route at the top block before restrictTo("DOSEN"))

module.exports = router;
