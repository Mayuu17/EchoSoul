// ==========================================
// EchoSoul AI Project
// File: app.js
// Purpose: Express App Configuration
// ==========================================

const express = require("express");
const cors = require("cors");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const personaRoutes = require("./routes/personaRoutes");
const chatRoutes = require("./routes/chatRoutes");
const memoryRoutes = require("./routes/memoryRoutes");

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
   origin: [
      "http://localhost:5173",
      "https://echosoul-frontend.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/persona", personaRoutes);

app.use("/api/chat", chatRoutes);

// IMPORTANT:
// Frontend MemoryManager.jsx uses /api/memory
// So backend must also use /api/memory
app.use("/api/memory", memoryRoutes);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to EchoSoul Backend 🚀",
  });
});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==========================================
// EXPORT
// ===========56===============================

module.exports = app;