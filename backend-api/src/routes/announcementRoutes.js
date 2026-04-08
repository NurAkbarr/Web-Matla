const express = require("express");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const router = express.Router();

// All announcement routes should be admin only
router.use(authMiddleware, restrictTo("ADMIN", "SUPER_ADMIN"));

router.get("/", getAnnouncements);
router.post("/", createAnnouncement);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

module.exports = router;
