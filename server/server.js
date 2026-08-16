// ==========================================
// EchoSoul AI Project
// File: server.js
// Purpose: Start Express Server
// ==========================================

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// ==========================================
// Connect MongoDB
// ==========================================

connectDB();

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});