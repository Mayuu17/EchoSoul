const mongoose = require("mongoose");

// =========================================================
// ECHOSOUL PERSONA SCHEMA
// =========================================================

const personaSchema = new mongoose.Schema(
  {
    // =======================================================
    // PERSONA OWNER
    // =======================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // =======================================================
    // PERSONA BASIC INFORMATION
    // =======================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    relationship: {
      type: String,
      required: true,
      trim: true,
    },

    // =======================================================
    // PERSONALITY
    // =======================================================

    personality: {
      type: String,
      default: "",
      trim: true,
    },

    // =======================================================
    // PRIVATE MEMORIES
    // =======================================================

    memories: [
      {
        type: String,
        trim: true,
      },
    ],

    // =======================================================
    // SPEAKING STYLE
    // =======================================================

    speakingStyle: {
      type: String,
      default: "",
      trim: true,
    },

    // =======================================================
    // LANGUAGE
    // =======================================================

    language: {
      type: String,
      default: "English",
      trim: true,
    },

    // =======================================================
    // VOICE SAMPLE
    // =======================================================

    voiceSample: {
      url: {
        type: String,
        default: "",
        trim: true,
      },

      voiceId: {
        type: String,
        default: "",
        trim: true,
      },

      uploadedAt: {
        type: Date,
      },
    },

    // =======================================================
    // PROFILE IMAGE
    // =======================================================

    profileImage: {
      type: String,
      default: "",
      trim: true,
    },
  },

  // =========================================================
  // AUTOMATIC TIMESTAMPS
  // =========================================================

  {
    timestamps: true,
  }
);

// =========================================================
// EXPORT
// =========================================================

module.exports = mongoose.model(
  "Persona",
  personaSchema
);