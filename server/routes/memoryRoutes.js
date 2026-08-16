// ==========================================
// EchoSoul AI Project
// File: memoryRoutes.js
// Purpose:
// Persona Memory Routes
// ==========================================

const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addMemory,
  getMemories,
  updateMemory,
  deleteMemory,
} = require("../controllers/memoryController");

// ==========================================
// ADD MEMORY
// ==========================================

router.post(
  "/",
  authMiddleware,
  addMemory
);

// ==========================================
// GET ALL MEMORIES
// ==========================================

router.get(
  "/",
  authMiddleware,
  getMemories
);

// ==========================================
// UPDATE MEMORY
// ==========================================

router.put(
  "/:index",
  authMiddleware,
  updateMemory
);

// ==========================================
// DELETE MEMORY
// ==========================================

router.delete(
  "/:index",
  authMiddleware,
  deleteMemory
);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;