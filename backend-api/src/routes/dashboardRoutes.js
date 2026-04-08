const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(restrictTo("ADMIN", "SUPER_ADMIN"));

router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
