// ==========================================
// EchoSoul AI Project
// File: personaController.js
//
// Purpose:
// Persona APIs
// Secure Persona Management
// Private Voice Clone Handling
//
// IMPORTANT PRIVACY RULE:
// Voice recordings are NOT permanently stored
// by EchoSoul on Cloudinary.
// The uploaded audio is kept in memory only
// for the voice-cloning request.
// ==========================================

const Persona = require("../models/Persona");

const {
  ElevenLabsClient,
} = require("@elevenlabs/elevenlabs-js");

// ==========================================
// ELEVENLABS CLIENT
// ==========================================

let elevenlabs = null;

if (process.env.ELEVENLABS_API_KEY) {
  elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  console.log("====================================");
  console.log("✅ ElevenLabs API Key Loaded");
  console.log("====================================");
} else {
  console.log("====================================");
  console.log("⚠️ ElevenLabs API Key NOT configured");
  console.log("====================================");
}

// ==========================================
// ALLOWED AUDIO TYPES
// ==========================================

const ALLOWED_AUDIO_TYPES = [
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/ogg;codecs=opus",
];

// ==========================================
// MAX VOICE FILE SIZE
// ==========================================

const MAX_VOICE_FILE_SIZE =
  10 * 1024 * 1024;

// ==========================================
// CLEAN ARRAY HELPER
// ==========================================

const cleanMemories = (memories) => {
  if (!Array.isArray(memories)) {
    return [];
  }

  return memories
    .filter(
      (memory) =>
        typeof memory === "string" &&
        memory.trim()
    )
    .map((memory) => memory.trim());
};

// ==========================================
// CREATE PERSONA
// ==========================================

const createPersona = async (req, res) => {
  try {
    const {
      name,
      relationship,
      personality,
      memories,
      speakingStyle,
      language,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Persona name is required",
      });
    }

    if (
      typeof relationship !== "string" ||
      !relationship.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Relationship is required",
      });
    }

    // ========================================
    // AUTH CHECK
    // ========================================

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ========================================
    // CHECK EXISTING PERSONA
    // ========================================

    const existingPersona =
      await Persona.findOne({
        user: req.user.userId,
      });

    if (existingPersona) {
      return res.status(400).json({
        success: false,
        message: "Persona already exists",
      });
    }

    // ========================================
    // CREATE PERSONA
    // ========================================

    const persona =
      await Persona.create({
        user: req.user.userId,

        name: name.trim(),

        relationship:
          relationship.trim(),

        personality:
          typeof personality === "string"
            ? personality.trim()
            : "",

        memories:
          cleanMemories(memories),

        speakingStyle:
          typeof speakingStyle === "string"
            ? speakingStyle.trim()
            : "",

        language:
          typeof language === "string" &&
          language.trim()
            ? language.trim()
            : "English",
      });

    console.log(
      "===================================="
    );

    console.log("✅ Persona created");

    console.log(
      "Persona ID:",
      persona._id.toString()
    );

    console.log(
      "User ID:",
      req.user.userId
    );

    console.log(
      "===================================="
    );

    return res.status(201).json({
      success: true,

      message:
        "Persona created successfully",

      persona,
    });
  } catch (error) {
    console.error(
      "❌ Create Persona Error:",
      error.message || error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create persona",
    });
  }
};

// ==========================================
// UPDATE PERSONA
// ==========================================

const updatePersona = async (req, res) => {
  try {
    const {
      name,
      relationship,
      personality,
      memories,
      speakingStyle,
      language,
    } = req.body;

    // ========================================
    // AUTH CHECK
    // ========================================

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ========================================
    // FIND ONLY CURRENT USER'S PERSONA
    // ========================================

    const persona =
      await Persona.findOne({
        user: req.user.userId,
      });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: "Persona not found",
      });
    }

    // ========================================
    // NAME
    // ========================================

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Persona name cannot be empty",
        });
      }

      persona.name = name.trim();
    }

    // ========================================
    // RELATIONSHIP
    // ========================================

    if (relationship !== undefined) {
      if (
        typeof relationship !== "string" ||
        !relationship.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Relationship cannot be empty",
        });
      }

      persona.relationship =
        relationship.trim();
    }

    // ========================================
    // PERSONALITY
    // ========================================

    if (personality !== undefined) {
      persona.personality =
        typeof personality === "string"
          ? personality.trim()
          : "";
    }

    // ========================================
    // MEMORIES
    // ========================================

    if (memories !== undefined) {
      persona.memories =
        cleanMemories(memories);
    }

    // ========================================
    // SPEAKING STYLE
    // ========================================

    if (speakingStyle !== undefined) {
      persona.speakingStyle =
        typeof speakingStyle === "string"
          ? speakingStyle.trim()
          : "";
    }

    // ========================================
    // LANGUAGE
    // ========================================

    if (language !== undefined) {
      persona.language =
        typeof language === "string" &&
        language.trim()
          ? language.trim()
          : "English";
    }

    // ========================================
    // SAVE
    // ========================================

    await persona.save();

    console.log(
      "===================================="
    );

    console.log("✅ Persona updated");

    console.log(
      "Persona ID:",
      persona._id.toString()
    );

    console.log(
      "===================================="
    );

    return res.status(200).json({
      success: true,

      message:
        "Persona updated successfully",

      persona,
    });
  } catch (error) {
    console.error(
      "❌ Update Persona Error:",
      error.message || error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update persona",
    });
  }
};

// ==========================================
// UPLOAD VOICE + ELEVENLABS CLONE
// ==========================================
//
// PRIVACY:
// The uploaded audio is NOT uploaded to Cloudinary.
//
// Flow:
//
// Browser
//    ↓
// Backend memory
//    ↓
// ElevenLabs
//    ↓
// Voice ID saved in MongoDB
//    ↓
// Request finishes
//    ↓
// Temporary audio buffer released
//
// ==========================================

const uploadVoiceSample = async (
  req,
  res
) => {
  try {
    console.log(
      "\n===================================="
    );

    console.log(
      "🎤 VOICE CLONE REQUEST"
    );

    console.log(
      "===================================="
    );

    // ========================================
    // AUTH CHECK
    // ========================================

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ========================================
    // ELEVENLABS CHECK
    // ========================================

    if (!elevenlabs) {
      return res.status(500).json({
        success: false,
        message:
          "Voice cloning service is not configured.",
      });
    }

    // ========================================
    // FILE CHECK
    // ========================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Voice sample is required",
      });
    }

    // ========================================
    // BUFFER CHECK
    // ========================================

    if (
      !req.file.buffer ||
      !Buffer.isBuffer(req.file.buffer) ||
      req.file.buffer.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid voice sample.",
      });
    }

    // ========================================
    // MIME TYPE CHECK
    // ========================================

    const mimeType =
      String(req.file.mimetype || "")
        .toLowerCase()
        .trim();

    if (
      !ALLOWED_AUDIO_TYPES.includes(
        mimeType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported audio format.",
      });
    }

    // ========================================
    // FILE SIZE CHECK
    // ========================================

    if (
      req.file.size >
      MAX_VOICE_FILE_SIZE
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Voice file must be 10 MB or smaller.",
      });
    }

    console.log(
      "🎤 Valid voice sample received"
    );

    console.log(
      "MIME:",
      mimeType
    );

    console.log(
      "Size:",
      req.file.size,
      "bytes"
    );

    // IMPORTANT:
    // Do NOT log:
    // - audio buffer
    // - Cloudinary URL
    // - voice recording contents
    // - sensitive metadata

    // ========================================
    // FIND CURRENT USER'S PERSONA
    // ========================================

    const persona =
      await Persona.findOne({
        user: req.user.userId,
      });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message:
          "Persona not found",
      });
    }

    console.log(
      "👤 Persona found:",
      persona._id.toString()
    );

    // ========================================
    // CREATE ELEVENLABS VOICE CLONE
    // ========================================

    console.log(
      "🎙️ Creating private voice clone..."
    );

    const voice =
      await elevenlabs.voices.ivc.create({
        name:
          `EchoSoul-${persona._id.toString()}`,

        files: [
          req.file.buffer,
        ],

        description:
          "Private EchoSoul persona voice",
      });

    // ========================================
    // GET VOICE ID
    // ========================================

    const voiceId =
      voice?.voiceId;

    if (
      !voiceId ||
      typeof voiceId !== "string"
    ) {
      throw new Error(
        "Voice clone was created but no voice ID was returned."
      );
    }

    // ========================================
    // SAVE ONLY REQUIRED VOICE INFORMATION
    // ========================================
    //
    // IMPORTANT:
    // We do NOT save the original audio URL.
    //
    // The voice ID is only stored server-side
    // and should not be exposed unnecessarily
    // to the frontend.
    //

    persona.voiceSample = {
      url: "",

      voiceId: voiceId.trim(),

      uploadedAt:
        new Date(),
    };

    await persona.save();

    // ========================================
    // REMOVE LOCAL REFERENCES
    // ========================================
    //
    // We do not write the audio to disk.
    // The request's memory buffer will be released
    // after request processing completes.
    //

    console.log(
      "===================================="
    );

    console.log(
      "✅ VOICE CLONE CREATED"
    );

    console.log(
      "Persona ID:",
      persona._id.toString()
    );

    console.log(
      "Voice clone saved successfully."
    );

    console.log(
      "Original audio was NOT stored by EchoSoul."
    );

    console.log(
      "===================================="
    );

    // ========================================
    // SAFE RESPONSE
    // ========================================
    //
    // Do NOT send the ElevenLabs voice ID
    // or original audio URL to the browser.
    //

    return res.status(200).json({
      success: true,

      message:
        "Voice uploaded and cloned successfully",

      voiceSample: {
        uploadedAt:
          persona.voiceSample.uploadedAt,

        available: true,
      },
    });
  } catch (error) {
    console.error(
      "\n===================================="
    );

    console.error(
      "❌ VOICE CLONE ERROR"
    );

    console.error(
      "Message:",
      error.message || error
    );

    if (error.status) {
      console.error(
        "Status:",
        error.status
      );
    }

    if (error.code) {
      console.error(
        "Code:",
        error.code
      );
    }

    console.error(
      "====================================\n"
    );

    return res.status(500).json({
      success: false,

      message:
        "Voice upload and cloning failed.",
    });
  }
};

// ==========================================
// GET USER PERSONA
// ==========================================
//
// IMPORTANT:
// Never expose the ElevenLabs voiceId
// to the frontend unless absolutely required.
//
// ==========================================

const getPersona = async (
  req,
  res
) => {
  try {
    // ========================================
    // AUTH CHECK
    // ========================================

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ========================================
    // FIND CURRENT USER'S PERSONA
    // ========================================

    const persona =
      await Persona.findOne({
        user: req.user.userId,
      }).lean();

    if (!persona) {
      return res.status(404).json({
        success: false,
        message:
          "Persona not found",
      });
    }

    // ========================================
    // REMOVE SENSITIVE SERVER DATA
    // ========================================

    if (persona.voiceSample) {
      persona.voiceSample = {
        uploadedAt:
          persona.voiceSample.uploadedAt ||
          null,

        available:
          Boolean(
            persona.voiceSample.voiceId
          ),
      };
    }

    // ========================================
    // REMOVE INTERNAL USER REFERENCE
    // ========================================

    delete persona.user;

    // ========================================
    // SAFE RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      persona,
    });
  } catch (error) {
    console.error(
      "❌ Get Persona Error:",
      error.message || error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get persona",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createPersona,
  updatePersona,
  getPersona,
  uploadVoiceSample,
};