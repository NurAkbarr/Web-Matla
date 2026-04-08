const express = require("express");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");
const { getStudentDashboardData, getStudentGrades } = require("../controllers/studentDashboardController");

const router = express.Router();

router.get("/dashboard", authMiddleware, restrictTo("STUDENT"), getStudentDashboardData);
router.get("/grades", authMiddleware, restrictTo("STUDENT"), getStudentGrades);

module.exports = router;
