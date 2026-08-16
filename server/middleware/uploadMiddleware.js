// ==========================================
// EchoSoul AI Project
// File: uploadMiddleware.js
//
// Purpose:
// Secure voice/audio upload handling
// ==========================================

const multer = require("multer");

// =========================================================
// MEMORY STORAGE
// =========================================================
//
// Audio ko disk par permanently save nahi kiya jayega.
// File temporary memory mein rahegi aur controller ke baad
// automatically request lifecycle ke saath dispose ho jayegi.
//

const storage = multer.memoryStorage();

// =========================================================
// ALLOWED AUDIO TYPES
// =========================================================
//
// Sirf wahi audio formats allow karenge jo EchoSoul
// voice recording ke liye actually use kar raha hai.
//

const ALLOWED_AUDIO_TYPES = [
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/ogg;codecs=opus",
];

// =========================================================
// FILE FILTER
// =========================================================

const fileFilter = (req, file, cb) => {
  try {
    const mimeType = String(
      file.mimetype || ""
    )
      .toLowerCase()
      .trim();

    // -------------------------------------------------------
    // ALLOW ONLY KNOWN AUDIO TYPES
    // -------------------------------------------------------

    if (
      ALLOWED_AUDIO_TYPES.includes(
        mimeType
      )
    ) {
      return cb(null, true);
    }

    // -------------------------------------------------------
    // REJECT EVERYTHING ELSE
    // -------------------------------------------------------

    console.warn(
      "⚠️ Rejected upload:",
      mimeType || "unknown"
    );

    return cb(
      new Error(
        "Unsupported audio format. Please record using a supported audio format."
      ),
      false
    );
  } catch (error) {
    console.error(
      "❌ Upload filter error:",
      error
    );

    return cb(
      new Error(
        "Invalid audio upload."
      ),
      false
    );
  }
};

// =========================================================
// MULTER CONFIGURATION
// =========================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    // -------------------------------------------------------
    // 10 MB MAXIMUM
    // -------------------------------------------------------
    //
    // Voice messages normally do not need 50 MB.
    // This reduces unnecessary memory usage and abuse risk.
    //

    fileSize: 50 * 1024 * 1024,

    // Only one audio file is expected.
    files: 1,
  },
});

// =========================================================
// EXPORT
// =========================================================

module.exports = upload;