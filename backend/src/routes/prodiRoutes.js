const express = require("express");
const prodiController = require("../controllers/prodiController");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes (Dapat diakses oleh siapa saja untuk melihat informasi prodi)
router.get("/", prodiController.getAllProdi);
router.get("/:id", prodiController.getProdiById);

// Protected Routes (Hanya Admin & Super Admin yang bisa mengelola)
router.use(authMiddleware);
router.use(restrictTo("ADMIN", "SUPER_ADMIN"));

router.post("/", prodiController.createProdi);
router.put("/:id", prodiController.updateProdi);
router.delete("/:id", prodiController.deleteProdi);

module.exports = router;
