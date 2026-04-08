const express = require("express");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");
const {
  getCourseSchedules,
  createCourseSchedule,
  updateCourseSchedule,
  deleteCourseSchedule,
} = require("../controllers/courseScheduleController");

const router = express.Router();

// All schedule routes should be admin only
router.use(authMiddleware, restrictTo("ADMIN", "SUPER_ADMIN"));

router.get("/", getCourseSchedules);
router.post("/", createCourseSchedule);
router.put("/:id", updateCourseSchedule);
router.delete("/:id", deleteCourseSchedule);

module.exports = router;
