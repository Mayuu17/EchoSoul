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

const MAX_VOICE_FILE_SIZE = 10 * 1024 * 1024;

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

    const existingPersona = await Persona.findOne({
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

    const persona = await Persona.create({
      user: req.user.userId,

      name: name.trim(),

      relationship: relationship.trim(),

      personality:
        typeof personality === "string"
          ? personality.trim()
          : "",

      memories: cleanMemories(memories),

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

    const persona = await Persona.findOne({
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
// Original audio is NOT stored on Cloudinary.
// ==========================================

const uploadVoiceSample = async (req, res) => {
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
      return res.status(503).json({
        success: false,
        code: "ELEVENLABS_NOT_CONFIGURED",
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
        code: "VOICE_FILE_REQUIRED",
        message:
          "Voice sample is required.",
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
        code: "INVALID_VOICE_FILE",
        message:
          "Invalid voice sample.",
      });
    }

    // ========================================
    // MIME TYPE CHECK
    // ========================================

    const mimeType = String(
      req.file.mimetype || ""
    )
      .toLowerCase()
      .trim();

    if (
      !ALLOWED_AUDIO_TYPES.includes(
        mimeType
      )
    ) {
      return res.status(400).json({
        success: false,
        code: "UNSUPPORTED_AUDIO_FORMAT",
        message:
          "Unsupported audio format. Please use OGG, MP3, WAV, M4A or another supported audio format.",
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
        code: "VOICE_FILE_TOO_LARGE",
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

    // ========================================
    // FIND CURRENT USER'S PERSONA
    // ========================================

    const persona = await Persona.findOne({
      user: req.user.userId,
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        code: "PERSONA_NOT_FOUND",
        message:
          "Persona not found.",
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
    // SAVE VOICE INFORMATION
    // ========================================

    persona.voiceSample = {
      url: "",

      voiceId: voiceId.trim(),

      uploadedAt: new Date(),
    };

    await persona.save();

    // ========================================
    // SUCCESS LOG
    // ========================================

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

    return res.status(200).json({
      success: true,

      message:
        "Voice uploaded and cloned successfully.",

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
      error?.message || error
    );

    if (error?.status) {
      console.error(
        "Status:",
        error.status
      );
    }

    if (error?.code) {
      console.error(
        "Code:",
        error.code
      );
    }

    // ========================================
    // EXTRACT ELEVENLABS ERROR MESSAGE
    // ========================================

    const rawMessage =
      error?.body?.detail?.message ||
      error?.body?.detail ||
      error?.message ||
      "";

    const message =
      typeof rawMessage === "string"
        ? rawMessage
        : JSON.stringify(rawMessage);

    console.error(
      "ElevenLabs message:",
      message
    );

    // ========================================
    // PLAN / PERMISSION ERROR
    // ========================================

    const lowerMessage =
      message.toLowerCase();

    const isVoiceClonePlanError =
      lowerMessage.includes(
        "instant voice cloning"
      ) ||
      lowerMessage.includes(
        "create_instant_voice_clone"
      ) ||
      lowerMessage.includes(
        "subscription does not include"
      ) ||
      lowerMessage.includes(
        "permission"
      );

    if (isVoiceClonePlanError) {
      console.error(
        "⚠️ ElevenLabs Instant Voice Cloning is not available on the current subscription."
      );

      return res.status(402).json({
        success: false,

        code:
          "INSTANT_VOICE_CLONING_UNAVAILABLE",

        message:
          "Your ElevenLabs subscription does not include Instant Voice Cloning. Please upgrade your ElevenLabs plan to enable voice cloning.",
      });
    }

    // ========================================
    // ELEVENLABS RATE LIMIT
    // ========================================

    if (
      error?.status === 429 ||
      lowerMessage.includes(
        "rate limit"
      )
    ) {
      return res.status(429).json({
        success: false,

        code:
          "ELEVENLABS_RATE_LIMIT",

        message:
          "Voice cloning is temporarily unavailable because the ElevenLabs rate limit was reached. Please try again later.",
      });
    }

    // ========================================
    // ELEVENLABS AUTH ERROR
    // ========================================

    if (
      error?.status === 401 ||
      lowerMessage.includes(
        "invalid api key"
      ) ||
      lowerMessage.includes(
        "unauthorized"
      )
    ) {
      return res.status(502).json({
        success: false,

        code:
          "ELEVENLABS_AUTH_ERROR",

        message:
          "EchoSoul could not authenticate with ElevenLabs. Please check the ElevenLabs API key.",
      });
    }

    // ========================================
    // ELEVENLABS GENERAL ERROR
    // ========================================

    if (
      error?.status &&
      error.status >= 400 &&
      error.status < 500
    ) {
      return res.status(502).json({
        success: false,

        code:
          "ELEVENLABS_REQUEST_ERROR",

        message:
          "ElevenLabs could not process the voice cloning request.",
      });
    }

    // ========================================
    // INTERNAL SERVER ERROR
    // ========================================

    return res.status(500).json({
      success: false,

      code:
        "VOICE_CLONE_SERVER_ERROR",

      message:
        "Voice upload and cloning failed. Please try again.",
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
// ==========================================

const getPersona = async (req, res) => {
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

    const persona = await Persona.findOne({
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