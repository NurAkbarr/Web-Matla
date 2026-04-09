const express = require("express");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentProfileController");

const router = express.Router();

// All student profile routes should be admin only
router.use(authMiddleware, restrictTo("ADMIN", "SUPER_ADMIN"));

router.get("/", getStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
