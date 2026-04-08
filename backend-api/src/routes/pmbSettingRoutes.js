const express = require("express");
const pmbSettingController = require("../controllers/pmbSettingController");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Setup Multer Storage for Brochures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // __dirname is src/routes, so we need to go up two levels to reach the backend-api root
    const uploadPath = path.join(__dirname, "../../uploads");
    // Create uploads folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "brosur-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Hanya file gambar (JPG/PNG/GIF/WEBP) dan PDF yang diperbolehkan.",
        ),
      );
    }
  },
});

// PUBLIC ROUTE (Used by the Frontend PMB Landing Page)
router.get("/", pmbSettingController.getSettings);
router.get("/download/:filename", pmbSettingController.downloadBrosur);

// PROTECTED ROUTES (Admin Only)
router.use(authMiddleware);
router.use(restrictTo("ADMIN", "SUPER_ADMIN"));

// Accept single 'brosur' or multiple 'brosurImages' file(s) via multipart/form-data
// Using .fields() to support both legacy single upload and multiple image upload
router.put(
  "/",
  upload.fields([
    { name: "brosur", maxCount: 1 },
    { name: "brosurImages", maxCount: 10 },
  ]),
  (req, res, next) => {
    // Flatten: if 'brosurImages' present, set req.files; else handle single 'brosur'
    if (req.files) {
      if (req.files.brosur) req.file = req.files.brosur[0];
      if (req.files.brosurImages) req.files = req.files.brosurImages;
      else req.files = [];
    }
    next();
  },
  pmbSettingController.updateSettings,
);

// DELETE a specific brosur image from the carousel
router.delete("/image", pmbSettingController.deleteImage);

module.exports = router;
