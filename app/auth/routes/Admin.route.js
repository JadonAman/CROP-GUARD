const { Router } = require("express");
const {
  checkAdmin,
  getAllUsers,
  updateUserType,
  changeUserPassword,
  deleteUser,
  getUserStats,
  createUser,
  getSystemAnalytics,
  deleteDetection
} = require("../controllers/Admin.controller");

const router = Router();

// All routes require admin authentication
router.use(checkAdmin);

// Get all users
router.get("/users", getAllUsers);

// Get user statistics
router.get("/users/stats", getUserStats);

// Get system analytics
router.get("/analytics", getSystemAnalytics);

// Create new user
router.post("/users", createUser);

// Update user type (farmer/expert/admin)
router.patch("/users/:userId/type", updateUserType);

// Change user password
router.patch("/users/:userId/password", changeUserPassword);

// Delete user
router.delete("/users/:userId", deleteUser);

// Delete detection
router.delete("/detections/:detectionId", deleteDetection);

module.exports = router;
