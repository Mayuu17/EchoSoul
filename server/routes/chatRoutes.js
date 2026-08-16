// ==========================================
// EchoSoul AI Project
// File: chatRoutes.js
//
// Purpose:
// Chat API Routes
// Authentication Protected
// Voice Upload Protected
// ==========================================

const express = require("express");

const {
  chatWithPersona,
  getChatHistory,
  voiceChatWithPersona,
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =========================================================
// GET CHAT HISTORY
// =========================================================
// Only authenticated users can access their chat history.

router.get(
  "/history",
  authMiddleware,
  getChatHistory
);

// =========================================================
// SEND TEXT MESSAGE
// =========================================================
// Only authenticated users can send messages.

router.post(
  "/",
  authMiddleware,
  chatWithPersona
);

// =========================================================
// SEND VOICE MESSAGE
// =========================================================
// Authentication happens BEFORE file processing.
// This prevents unauthenticated users from using
// the voice-chat endpoint.

router.post(
  "/voice",
  authMiddleware,
  upload.single("audio"),
  voiceChatWithPersona
);

// =========================================================
// EXPORT
// =========================================================

module.exports = router;