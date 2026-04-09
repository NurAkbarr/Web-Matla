const express = require("express");
const pmbController = require("../controllers/pmbController");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Setup Multer Storage untuk Bukti Transfer
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
    cb(null, "tf-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|pdf/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Hanya file gambar (JPG/PNG) atau PDF yang diperbolehkan untuk bukti bayar.",
        ),
      );
    }
  },
});

// =====================================
// RATE LIMITING
// =====================================
// Batasi pendaftaran agar tidak di-spam bot (maksimal 5 request per jam per IP)
const pmbLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 5, // Cukup 5 daftar per 1 IP selama 1 jam
  message: {
    message: "Terlalu banyak permintaan pendaftaran. Silakan coba 1 jam lagi.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// =====================================
// PUBLIC ROUTES
// =====================================
// Endpoint submit pendaftaran (Bisa diakses publik, dengan file upload)
router.post(
  "/register",
  pmbLimiter,
  upload.single("paymentProofUrl"),
  pmbController.registerPmb,
);

router.get("/track", pmbController.checkApplicantStatus);

// =====================================
// PROTECTED ROUTES (Admin Only)
// =====================================
router.use(authMiddleware);
router.use(restrictTo("ADMIN", "SUPER_ADMIN"));

router.get("/", pmbController.getAllApplicants);
router.get("/:id", pmbController.getApplicantById);
router.put("/:id/status", pmbController.updateApplicantStatus);
router.delete("/:id", pmbController.deleteApplicant);
router.post("/bulk-delete", pmbController.bulkDeleteApplicants);

module.exports = router;
