const mongoose = require("mongoose");

// =========================================================
// ECHOSOUL CHAT SCHEMA
// =========================================================

const chatSchema = new mongoose.Schema(
  {
    // =======================================================
    // CHAT OWNER
    // =======================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =======================================================
    // PERSONA
    // =======================================================

    persona: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Persona",
      required: true,
      index: true,
    },

    // =======================================================
    // MESSAGES
    // =======================================================

    messages: [
      {
        sender: {
          type: String,
          enum: ["user", "ai"],
          required: true,
        },

        text: {
          type: String,
          required: true,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  // =========================================================
  // AUTOMATIC CREATED / UPDATED TIMESTAMPS
  // =========================================================

  {
    timestamps: true,
  }
);

// =========================================================
// PRIVACY / DATA ISOLATION INDEX
// =========================================================
//
// A user can have only ONE chat for a particular persona.
//
// This also makes:
// Chat.findOne({ user, persona })
// faster.
//
// Most importantly, it prevents accidental duplicate
// chat documents for the same user + persona combination.
//

chatSchema.index(
  {
    user: 1,
    persona: 1,
  },
  {
    unique: true,
  }
);

// =========================================================
// EXPORT
// =========================================================

module.exports = mongoose.model(
  "Chat",
  chatSchema
);