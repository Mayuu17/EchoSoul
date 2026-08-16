const express = require("express");

const {
  createPersona,
  updatePersona,
  getPersona,
  uploadVoiceSample,
} = require("../controllers/personaController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================================
// Create Persona
// ==========================================

router.post(
  "/",
  authMiddleware,
  createPersona
);

// ==========================================
// Get Persona
// ==========================================

router.get(
  "/",
  authMiddleware,
  getPersona
);

// ==========================================
// Update Persona
// ==========================================

router.put(
  "/",
  authMiddleware,
  updatePersona
);

// ==========================================
// Upload Voice
// ==========================================

router.post(
  "/voice",
  authMiddleware,
  upload.single("voice"),
  uploadVoiceSample
);

module.exports = router;