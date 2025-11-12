const { Router } = require("express");
const {
  saveDetection,
  saveMyDetection
} = require("../controllers/Detection.controller");

const router = Router();

// Public endpoint - can save detection without user ID or with user ID
router.post("/save", saveDetection);

// Protected endpoint - saves detection for authenticated user  
router.post("/save-my-detection", saveMyDetection);

// Handle OPTIONS for CORS preflight
router.options("/save", (req, res) => res.sendStatus(200));
router.options("/save-my-detection", (req, res) => res.sendStatus(200));

module.exports = router;
