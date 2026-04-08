const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Rate limiting for auth routes (30 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Terlalu banyak permintaan, silakan coba lagi dalam 15 menit." },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginValidation = [
  body("email").isEmail().withMessage("Format email tidak valid"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
];

const registerValidation = [
  body("name").notEmpty().withMessage("Nama wajib diisi"),
  body("email").isEmail().withMessage("Format email tidak valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal harus 6 karakter"),
];

router.post("/register", authLimiter, registerValidation, register);
router.post("/login", authLimiter, loginValidation, login);

module.exports = router;
