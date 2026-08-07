// ==========================================
// EchoSoul AI Project
// File: app.js
// Purpose: Configure Express App
// ==========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to EchoSoul Backend 🚀",
  });
});

module.exports = app;