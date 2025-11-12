const { Router } = require("express");
const {
  checkExpert,
  getAllDetectionHistory,
  getExpertAnalytics
} = require("../controllers/Expert.controller");

const router = Router();

// All routes require expert or admin authentication
router.use(checkExpert);

// Get all detection history across users
router.get("/detection-history", getAllDetectionHistory);

// Get expert analytics
router.get("/analytics", getExpertAnalytics);

module.exports = router;
