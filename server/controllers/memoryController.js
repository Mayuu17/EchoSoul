// ==========================================
// EchoSoul AI Project
// File: memoryController.js
// Purpose:
// Add / Get / Update / Delete Persona Memories
// ==========================================

const Persona = require("../models/Persona");

// ==========================================
// ADD MEMORY
// ==========================================

const addMemory = async (req, res) => {
  try {
    const { memory } = req.body;

    if (!memory || !memory.trim()) {
      return res.status(400).json({
        success: false,
        message: "Memory is required",
      });
    }

    const persona = await Persona.findOne({
      user: req.user.userId,
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: "Persona not found",
      });
    }

    persona.memories.push(memory.trim());

    await persona.save();

    console.log("====================================");
    console.log("🧠 MEMORY ADDED");
    console.log("Persona:", persona.name);
    console.log("Memory:", memory.trim());
    console.log("Total Memories:", persona.memories.length);
    console.log("====================================");

    return res.status(201).json({
      success: true,
      message: "Memory added successfully",
      memory: memory.trim(),
      memories: persona.memories,
    });
  } catch (error) {
    console.error("❌ Add Memory Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add memory",
    });
  }
};

// ==========================================
// GET MEMORIES
// ==========================================

const getMemories = async (req, res) => {
  try {
    const persona = await Persona.findOne({
      user: req.user.userId,
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: "Persona not found",
      });
    }

    return res.status(200).json({
      success: true,
      memories: persona.memories || [],
    });
  } catch (error) {
    console.error("❌ Get Memories Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get memories",
    });
  }
};

// ==========================================
// UPDATE MEMORY
// ==========================================

const updateMemory = async (req, res) => {
  try {
    const { index } = req.params;
    const { memory } = req.body;

    if (!memory || !memory.trim()) {
      return res.status(400).json({
        success: false,
        message: "Memory is required",
      });
    }

    const memoryIndex = Number(index);

    if (!Number.isInteger(memoryIndex) || memoryIndex < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid memory index",
      });
    }

    const persona = await Persona.findOne({
      user: req.user.userId,
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: "Persona not found",
      });
    }

    if (memoryIndex >= persona.memories.length) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    persona.memories[memoryIndex] = memory.trim();

    await persona.save();

    console.log("====================================");
    console.log("✏️ MEMORY UPDATED");
    console.log("Persona:", persona.name);
    console.log("Index:", memoryIndex);
    console.log("Memory:", memory.trim());
    console.log("====================================");

    return res.status(200).json({
      success: true,
      message: "Memory updated successfully",
      memory: memory.trim(),
      memories: persona.memories,
    });
  } catch (error) {
    console.error("❌ Update Memory Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update memory",
    });
  }
};

// ==========================================
// DELETE MEMORY
// ==========================================

const deleteMemory = async (req, res) => {
  try {
    const { index } = req.params;

    const memoryIndex = Number(index);

    if (!Number.isInteger(memoryIndex) || memoryIndex < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid memory index",
      });
    }

    const persona = await Persona.findOne({
      user: req.user.userId,
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: "Persona not found",
      });
    }

    if (memoryIndex >= persona.memories.length) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    const deletedMemory = persona.memories[memoryIndex];

    persona.memories.splice(memoryIndex, 1);

    await persona.save();

    console.log("====================================");
    console.log("🗑️ MEMORY DELETED");
    console.log("Persona:", persona.name);
    console.log("Memory:", deletedMemory);
    console.log("====================================");

    return res.status(200).json({
      success: true,
      message: "Memory deleted successfully",
      deletedMemory,
      memories: persona.memories,
    });
  } catch (error) {
    console.error("❌ Delete Memory Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete memory",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  addMemory,
  getMemories,
  updateMemory,
  deleteMemory,
};