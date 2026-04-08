const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes below this middleware require a valid JWT token
router.use(authMiddleware);

// Only ADMIN and SUPER_ADMIN can access user management routes
router.use(restrictTo("ADMIN", "SUPER_ADMIN"));

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.put("/:id/role", userController.updateUserRole);
router.delete("/:id", userController.deleteUser);

module.exports = router;
