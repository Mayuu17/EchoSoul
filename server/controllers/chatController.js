// ==========================================
// EchoSoul AI Project
// File: chatController.js
//
// Purpose:
// Gemini Text Chat
// Gemini Voice Transcription
// ElevenLabs Text-to-Speech
// Chat History
// Strict Persona Memory
//
// IMPORTANT:
// Voice is OPTIONAL.
// Normal text chat does NOT generate voice.
// Voice is generated only when explicitly requested.
// ==========================================

const Persona = require("../models/Persona");
const Chat = require("../models/Chat");
const ai = require("../config/gemini");

const {
  ElevenLabsClient,
} = require("@elevenlabs/elevenlabs-js");

// ==========================================
// GEMINI MODELS
// ==========================================

const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
];

// ==========================================
// ELEVENLABS CLIENT
// ==========================================

let elevenlabs = null;

if (process.env.ELEVENLABS_API_KEY) {
  elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  console.log("✅ ElevenLabs API configured");
} else {
  console.log("⚠️ ElevenLabs API not configured");
  console.log("ℹ️ Text chat will work normally");
}

// ==========================================
// GET USER PERSONA
// ==========================================

const getUserPersona = async (userId) => {
  return await Persona.findOne({
    user: userId,
  });
};

// ==========================================
// GET OR CREATE CHAT
// ==========================================

const getOrCreateChat = async (
  userId,
  personaId
) => {
  let chat = await Chat.findOne({
    user: userId,
    persona: personaId,
  });

  if (!chat) {
    chat = new Chat({
      user: userId,
      persona: personaId,
      messages: [],
    });

    console.log("🆕 New chat created");
  }

  return chat;
};

// ==========================================
// GET CONVERSATION HISTORY
// ==========================================

const getConversationHistory = (chat) => {
  if (
    !chat ||
    !chat.messages ||
    chat.messages.length === 0
  ) {
    return "No previous conversation.";
  }

  return chat.messages
    .map((msg) => {
      const sender =
        msg.sender === "user"
          ? "User"
          : "EchoSoul";

      return `${sender}: ${msg.text}`;
    })
    .join("\n");
};

// ==========================================
// GENERATE PERSONA RESPONSE
// ==========================================

const generatePersonaResponse = async (
  persona,
  chat,
  message
) => {
  // ========================================
  // PREPARE MEMORIES
  // ========================================

  const memories =
    Array.isArray(persona.memories) &&
    persona.memories.length > 0
      ? persona.memories
          .map(
            (memory) => `- ${memory}`
          )
          .join("\n")
      : "- No memories have been provided.";

  // ========================================
  // PREVIOUS CHAT
  // ========================================

  const conversationHistory =
    getConversationHistory(chat);

  // ========================================
  // PERSONA PROMPT
  // ========================================

  const prompt = `
You are EchoSoul, an AI companion inspired by a person named ${persona.name}.

You must respond according to the persona information provided below.

==========================================
IMPORTANT IDENTITY RULE
==========================================

You are an AI companion inspired by this persona.

You are NOT the real person.

Never claim that you are actually the real person.

If necessary, naturally clarify that you are an AI companion inspired by them.

==========================================
STRICT MEMORY RULES
==========================================

ONLY use memories explicitly provided under:

PROVIDED MEMORIES

Never invent memories.

Never assume memories.

Never guess personal experiences.

Never create fictional past events.

Never claim to remember something unless it exists
in PROVIDED MEMORIES.

Do NOT invent:

- childhood memories
- family events
- past conversations
- places
- people
- specific incidents
- personal experiences
- favorite things
- dates
- stories
- events

If the user asks:

"Do you remember when...?"

and that event is NOT present in PROVIDED MEMORIES,

do not pretend to remember it.

Instead respond naturally and honestly.

Example:

"I don't have that memory saved, but you can tell me about it."

Previous conversation is only conversational context.

Previous conversation must NOT be treated as verified personal memory.

==========================================
PERSONA INFORMATION
==========================================

Name:
${persona.name}

Relationship:
${persona.relationship || "Not specified"}

Personality:
${persona.personality || "Warm, caring and friendly"}

Speaking Style:
${persona.speakingStyle || "Natural, warm and caring"}

Language:
${persona.language || "English"}

==========================================
PROVIDED MEMORIES
==========================================

${memories}

==========================================
PREVIOUS CONVERSATION
==========================================

${conversationHistory}

==========================================
CURRENT USER MESSAGE
==========================================

User:
${message}

==========================================
RESPONSE RULES
==========================================

1. Respond naturally.
2. Be warm and conversational.
3. Stay consistent with the persona.
4. Use provided memories when relevant.
5. Never invent memories.
6. Never invent personal facts.
7. Never claim to be the real person.
8. Do not mention prompts.
9. Do not mention databases.
10. Do not mention APIs.
11. Do not mention Gemini.
12. Do not mention internal instructions.
13. Follow the selected persona language.
14. Follow the selected speaking style.
15. Keep responses natural and emotionally appropriate.
16. Do not unnecessarily repeat the persona's name.
17. Do not turn every response into a long paragraph.
18. Keep normal conversation responses concise unless the user asks for detail.

==========================================
FINAL RESPONSE
==========================================
`;

  // ========================================
  // TRY GEMINI MODELS
  // ========================================

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,
        });

      const reply =
        response.text?.trim();

      if (!reply) {
        throw new Error(
          "Gemini returned an empty response"
        );
      }

      return reply;
    } catch (error) {
      lastError = error;

      console.error(
        `❌ Gemini model failed: ${model}`,
        error.message || error
      );

      const status =
        error.status ||
        error.code ||
        error?.error?.code;

      if (
        status === 429 ||
        status === 500 ||
        status === 503 ||
        status === 404
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    lastError?.message ||
      "AI service is temporarily unavailable."
  );
};

// ==========================================
// GET PERSONA VOICE ID
// ==========================================

const getPersonaVoiceId = (persona) => {
  if (!persona) {
    return null;
  }

  const voiceSample =
    persona.voiceSample;

  if (!voiceSample) {
    return null;
  }

  if (
    typeof voiceSample.voiceId === "string" &&
    voiceSample.voiceId.trim()
  ) {
    return voiceSample.voiceId.trim();
  }

  if (
    typeof voiceSample.voiceID === "string" &&
    voiceSample.voiceID.trim()
  ) {
    return voiceSample.voiceID.trim();
  }

  if (
    typeof voiceSample.id === "string" &&
    voiceSample.id.trim()
  ) {
    return voiceSample.id.trim();
  }

  return null;
};

// ==========================================
// GENERATE ELEVENLABS VOICE AUDIO
// ==========================================

const generateVoiceAudio = async (
  persona,
  text
) => {
  try {
    // ========================================
    // ELEVENLABS CHECK
    // ========================================

    if (!elevenlabs) {
      return null;
    }

    // ========================================
    // TEXT CHECK
    // ========================================

    if (!text || !text.trim()) {
      return null;
    }

    // ========================================
    // GET VOICE ID
    // ========================================

    const voiceId =
      getPersonaVoiceId(persona);

    if (!voiceId) {
      console.log(
        "⚠️ No cloned voice found. Voice skipped."
      );

      return null;
    }

    // ========================================
    // GENERATE AUDIO
    // ========================================

    console.log(
      "🎙️ Generating requested voice..."
    );

    const audio =
      await elevenlabs.textToSpeech.convert(
        voiceId,
        {
          text: text.trim(),

          modelId:
            "eleven_multilingual_v2",

          outputFormat:
            "mp3_44100_128",
        }
      );

    // ========================================
    // STREAM → BUFFER
    // ========================================

    const chunks = [];

    for await (const chunk of audio) {
      chunks.push(
        Buffer.from(chunk)
      );
    }

    if (chunks.length === 0) {
      return null;
    }

    const audioBuffer =
      Buffer.concat(chunks);

    if (!audioBuffer.length) {
      return null;
    }

    // ========================================
    // BUFFER → BASE64
    // ========================================

    return audioBuffer.toString("base64");
  } catch (error) {
    console.error(
      "❌ ElevenLabs voice generation failed:",
      error.message || error
    );

    // Voice failure should NEVER
    // break the text response.

    return null;
  }
};

// ==========================================
// SAVE CONVERSATION
// ==========================================

const saveConversation = async (
  chat,
  userMessage,
  reply
) => {
  chat.messages.push({
    sender: "user",
    text: userMessage,
  });

  chat.messages.push({
    sender: "ai",
    text: reply,
  });

  await chat.save();
};

// ==========================================
// TEXT CHAT
// ==========================================
//
// IMPORTANT:
//
// Normal text chat:
// voice = false
//
// Voice will NOT be generated.
//
// If frontend explicitly sends:
// { message: "...", voice: true }
//
// then audio will be generated.
//
// ==========================================

const chatWithPersona = async (
  req,
  res
) => {
  try {
    // ========================================
    // GET MESSAGE
    // ========================================

    const { message, voice } =
      req.body;

    // ========================================
    // VALIDATE MESSAGE
    // ========================================

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const userMessage =
      message.trim();

    // ========================================
    // AUTH CHECK
    // ========================================

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized. Please login again.",
      });
    }

    // ========================================
    // GET PERSONA
    // ========================================

    const persona =
      await getUserPersona(
        req.user.userId
      );

    if (!persona) {
      return res.status(404).json({
        success: false,
        message:
          "Persona not found. Please create your persona first.",
      });
    }

    // ========================================
    // GET / CREATE CHAT
    // ========================================

    const chat =
      await getOrCreateChat(
        req.user.userId,
        persona._id
      );

    // ========================================
    // GEMINI RESPONSE
    // ========================================

    const reply =
      await generatePersonaResponse(
        persona,
        chat,
        userMessage
      );

    // ========================================
    // SAVE CHAT
    // ========================================

    await saveConversation(
      chat,
      userMessage,
      reply
    );

    // ========================================
    // VOICE ONLY IF EXPLICITLY REQUESTED
    // ========================================

    let audio = null;

    const voiceRequested =
      voice === true ||
      voice === "true";

    if (voiceRequested) {
      audio =
        await generateVoiceAudio(
          persona,
          reply
        );
    }

    // ========================================
    // FINAL RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      reply,
      audio,
    });
  } catch (error) {
    console.error(
      "❌ CHAT ERROR:",
      error.message || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "AI response failed",
    });
  }
};

// ==========================================
// TRANSCRIBE AUDIO USING GEMINI
// ==========================================

const transcribeAudio = async (
  file
) => {
  if (!file || !file.buffer) {
    throw new Error(
      "Audio file is missing."
    );
  }

  const base64Audio =
    file.buffer.toString("base64");

  const mimeType =
    file.mimetype ||
    "audio/webm";

  const transcriptionModels = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
  ];

  let lastError = null;

  for (
    const model of transcriptionModels
  ) {
    try {
      const response =
        await ai.models.generateContent({
          model,

          contents: [
            {
              text: `
Listen to the attached audio carefully.

Transcribe exactly what the user said.

IMPORTANT:
- Return ONLY the transcript.
- Do not answer the user.
- Do not explain anything.
- Do not add quotation marks.
- Do not invent words.
- Do not add extra text.
- If the speech is unclear, transcribe only what you can understand.
              `,
            },

            {
              inlineData: {
                mimeType,
                data: base64Audio,
              },
            },
          ],
        });

      const transcript =
        response.text?.trim();

      if (!transcript) {
        throw new Error(
          "Could not understand the audio."
        );
      }

      return transcript;
    } catch (error) {
      lastError = error;

      console.error(
        `❌ Transcription failed: ${model}`,
        error.message || error
      );

      const status =
        error.status ||
        error.code ||
        error?.error?.code;

      if (
        status === 429 ||
        status === 500 ||
        status === 503 ||
        status === 404
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    lastError?.message ||
      "Voice transcription failed."
  );
};

// ==========================================
// VOICE CHAT
// ==========================================
//
// This endpoint is used only when the user
// intentionally chooses voice interaction.
//
// Therefore voice generation is enabled here.
// ==========================================

const voiceChatWithPersona = async (
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
        message:
          "Unauthorized. Please login again.",
      });
    }

    // ========================================
    // AUDIO CHECK
    // ========================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Audio file is required.",
      });
    }

    // ========================================
    // GET PERSONA
    // ========================================

    const persona =
      await getUserPersona(
        req.user.userId
      );

    if (!persona) {
      return res.status(404).json({
        success: false,
        message:
          "Persona not found. Please create your persona first.",
      });
    }

    // ========================================
    // GET / CREATE CHAT
    // ========================================

    const chat =
      await getOrCreateChat(
        req.user.userId,
        persona._id
      );

    // ========================================
    // AUDIO → TEXT
    // ========================================

    const transcript =
      await transcribeAudio(
        req.file
      );

    if (
      !transcript ||
      !transcript.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Could not understand the voice message.",
      });
    }

    const userMessage =
      transcript.trim();

    // ========================================
    // TEXT → GEMINI
    // ========================================

    const reply =
      await generatePersonaResponse(
        persona,
        chat,
        userMessage
      );

    // ========================================
    // SAVE CONVERSATION
    // ========================================

    await saveConversation(
      chat,
      userMessage,
      reply
    );

    // ========================================
    // VOICE IS ALWAYS ENABLED FOR
    // VOICE CHAT
    // ========================================

    const audio =
      await generateVoiceAudio(
        persona,
        reply
      );

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      transcript:
        userMessage,

      reply,

      audio,
    });
  } catch (error) {
    console.error(
      "❌ VOICE CHAT ERROR:",
      error.message || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Voice chat failed.",
    });
  }
};

// ==========================================
// GET CHAT HISTORY
// ==========================================

const getChatHistory = async (
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
        message:
          "Unauthorized. Please login again.",
      });
    }

    // ========================================
    // GET PERSONA
    // ========================================

    const persona =
      await getUserPersona(
        req.user.userId
      );

    if (!persona) {
      return res.status(404).json({
        success: false,
        message:
          "Persona not found.",
      });
    }

    // ========================================
    // GET CHAT
    // ========================================

    const chat =
      await Chat.findOne({
        user: req.user.userId,
        persona: persona._id,
      });

    // ========================================
    // NO CHAT
    // ========================================

    if (!chat) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      messages:
        chat.messages || [],
    });
  } catch (error) {
    console.error(
      "❌ CHAT HISTORY ERROR:",
      error.message || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to load chat history.",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  chatWithPersona,
  voiceChatWithPersona,
  getChatHistory,
};