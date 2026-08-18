import { useEffect, useRef, useState } from "react";

// Live Render Backend Base URL
const API_BASE_URL = "https://echosoul-q61j.onrender.com";

function Chat() {
  const token = localStorage.getItem("token");

  // =========================================================
  // STATES
  // =========================================================

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceProcessing, setVoiceProcessing] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);

  // =========================================================
  // REFS
  // =========================================================

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  // =========================================================
  // DATE / TIME
  // =========================================================

  const getMessageDate = (msg) => {
    return msg?.createdAt || msg?.timestamp || msg?.date || null;
  };

  const formatMessageDate = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMessageTime = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // LOAD CHAT HISTORY
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const fetchChatHistory = async () => {
      if (!token) {
        setLoadingHistory(false);
        return;
      }

      try {
        console.log("📚 Loading chat history...");

        const response = await fetch(
          `${API_BASE_URL}/api/chat/history`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("📚 History response:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load chat history"
          );
        }

        if (!cancelled) {
          setMessages(
            Array.isArray(data.messages) ? data.messages : []
          );
        }
      } catch (error) {
        console.error("❌ Chat History Error:", error);
        if (!cancelled) {
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingHistory(false);
        }
      }
    };

    fetchChatHistory();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // =========================================================
  // CHECK VOICE SUPPORT
  // =========================================================

  useEffect(() => {
    const supported =
      !!navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia &&
      !!window.MediaRecorder;

    setVoiceSupported(supported);

    if (supported) {
      console.log("✅ Audio recording supported");
    } else {
      console.log("❌ Audio recording is not supported");
    }
  }, []);

  // =========================================================
  // STOP AI SPEAKING
  // =========================================================

  const stopSpeaking = () => {
    console.log("🔇 Stopping AI voice...");

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = "";
      } catch (error) {
        console.error("Audio stop error:", error);
      }
      audioRef.current = null;
    }

    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        console.error("Speech synthesis stop error:", error);
      }
    }

    setIsSpeaking(false);
  };

  // =========================================================
  // PLAY ELEVENLABS AUDIO
  // =========================================================

  const playElevenLabsAudio = (base64Audio) => {
    if (!base64Audio) return false;

    try {
      console.log("🔊 Playing ElevenLabs audio...");
      stopSpeaking();

      const audio = new Audio(
        `data:audio/mpeg;base64,${base64Audio}`
      );

      audioRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = (error) => {
        console.error("❌ Audio playback error:", error);
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.play().catch((error) => {
        console.error("❌ Audio play failed:", error);
        setIsSpeaking(false);
        audioRef.current = null;
      });

      return true;
    } catch (error) {
      console.error("❌ ElevenLabs playback error:", error);
      setIsSpeaking(false);
      return false;
    }
  };

  // =========================================================
  // BROWSER TTS
  // =========================================================

  const speakResponse = (text) => {
    if (!text || !text.trim() || !window.speechSynthesis) return;

    try {
      stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("❌ Speech Synthesis Error:", error);
      setIsSpeaking(false);
    }
  };

  // =========================================================
  // LISTEN TO SPECIFIC MESSAGE
  // =========================================================

  const listenToMessage = (text, audioBase64 = null) => {
    if (!text) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (audioBase64 && playElevenLabsAudio(audioBase64)) {
      return;
    }

    speakResponse(text);
  };

  // =========================================================
  // STOP RECORDING
  // =========================================================

  const stopRecording = () => {
    console.log("⏹️ Stopping recording...");

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch (error) {
        console.error("Recorder stop error:", error);
      }
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
  };

  // =========================================================
  // SEND RECORDED AUDIO
  // =========================================================

  const sendRecordedAudio = async (audioBlob) => {
    if (!audioBlob || audioBlob.size === 0 || !token) {
      console.error("❌ Empty audio blob or token missing");
      return;
    }

    try {
      setVoiceProcessing(true);
      setLoading(true);

      console.log("📤 Sending recorded audio...");

      const formData = new FormData();
      let extension = "webm";

      if (audioBlob.type.includes("mp4")) {
        extension = "mp4";
      } else if (audioBlob.type.includes("webm")) {
        extension = "webm";
      }

      const audioFile = new File(
        [audioBlob],
        `voice-message-${Date.now()}.${extension}`,
        { type: audioBlob.type || "audio/webm" }
      );

      formData.append("audio", audioFile);

      const response = await fetch(
        `${API_BASE_URL}/api/chat/voice`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("🎤 Voice chat response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Voice chat failed");
      }

      const transcript =
        typeof data.transcript === "string" ? data.transcript.trim() : "";
      const reply =
        typeof data.reply === "string" ? data.reply.trim() : "";

      if (!reply) {
        throw new Error("AI returned an empty response.");
      }

      const now = new Date().toISOString();

      setMessages((prev) => {
        const newMessages = [...prev];
        if (transcript) {
          newMessages.push({
            sender: "user",
            text: transcript,
            createdAt: now,
          });
        }
        newMessages.push({
          sender: "ai",
          text: reply,
          createdAt: now,
          audio: data.audio || null,
        });
        return newMessages;
      });

      if (data.audio) {
        playElevenLabsAudio(data.audio);
      } else {
        speakResponse(reply);
      }

      console.log("✅ Voice chat completed");
    } catch (error) {
      console.error("❌ Voice Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Sorry, I couldn't process your voice message right now. Please try again. 💙",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setVoiceProcessing(false);
      setLoading(false);
    }
  };

  // =========================================================
  // START RECORDING
  // =========================================================

  const startRecording = async () => {
    if (!voiceSupported) {
      alert("Voice recording is not supported in this browser.");
      return;
    }

    if (loading || isRecording) return;

    try {
      stopSpeaking();
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      mediaStreamRef.current = stream;

      let mimeType = "";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const finalMimeType =
          recorder.mimeType || mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, {
          type: finalMimeType,
        });

        audioChunksRef.current = [];
        mediaRecorderRef.current = null;

        await sendRecordedAudio(audioBlob);
      };

      recorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event.error);
        setIsRecording(false);
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("❌ Microphone error:", error);
      setIsRecording(false);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      if (error.name === "NotAllowedError") {
        alert("Microphone permission was denied.");
      } else if (error.name === "NotFoundError") {
        alert("No microphone was found on this device.");
      } else {
        alert("Could not access your microphone.");
      }
    }
  };

  // =========================================================
  // TOGGLE RECORDING
  // =========================================================

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // =========================================================
  // SEND TEXT TO AI
  // =========================================================

  const sendTextToAI = async (userMessage) => {
    if (!userMessage || !userMessage.trim()) return;
    if (!token) {
      alert("Please login again.");
      return;
    }

    stopSpeaking();
    if (isRecording) stopRecording();

    const cleanMessage = userMessage.trim();
    const now = new Date().toISOString();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: cleanMessage,
        createdAt: now,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      console.log("📤 Sending text message:", cleanMessage);

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: cleanMessage }),
      });

      const data = await response.json();
      console.log("🤖 AI response:", data);

      if (!response.ok) {
        throw new Error(data.message || "AI response failed");
      }

      const reply =
        typeof data.reply === "string" ? data.reply.trim() : "";

      if (!reply) {
        throw new Error("AI returned an empty response");
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
          createdAt: new Date().toISOString(),
          audio: data.audio || null,
        },
      ]);
    } catch (error) {
      console.error("❌ Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Sorry, I couldn't respond right now. Please try again. 💙",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    const userMessage = message.trim();
    if (!userMessage || loading || isRecording) return;

    await sendTextToAI(userMessage);
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!loading && !isRecording) {
        sendMessage(e);
      }
    }
  };

  // =========================================================
  // AUTO SCROLL
  // =========================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error("Recorder cleanup error:", error);
        }
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = "";
        } catch (error) {}
        audioRef.current = null;
      }

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // =========================================================
  // LOADING HISTORY
  // =========================================================

  if (loadingHistory) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-5">💙</div>
          <p className="text-gray-400">Loading your memories...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-2xl">
                💙
              </div>
              <div>
                <h1 className="text-2xl font-bold">EchoSoul</h1>
                <p className="text-gray-400 text-sm">
                  Your memories, your stories, your connection.
                </p>
              </div>
            </div>

            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="border border-red-500/40 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm transition"
              >
                🔇 Stop Voice
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="h-[68vh] overflow-y-auto space-y-5 pr-2">

          {/* EMPTY STATE */}
          {messages.length === 0 && !loading && (
            <div className="h-full flex items-center justify-center text-center">
              <div className="max-w-md">
                <div className="text-7xl mb-5">💙</div>
                <h2 className="text-3xl font-bold">Welcome to EchoSoul</h2>
                <p className="text-gray-400 mt-3 leading-relaxed">
                  Start a conversation with your AI companion and keep meaningful memories alive.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setMessage("Tell me about some happy memories.")
                    }
                    className="bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl px-4 py-3 text-sm text-gray-300 transition"
                  >
                    💭 Happy memories
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMessage("Tell me a story from the past.")
                    }
                    className="bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl px-4 py-3 text-sm text-gray-300 transition"
                  >
                    📖 Tell me a story
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MESSAGE LIST */}
          {messages.map((msg, index) => {
            const messageDate = getMessageDate(msg);
            const dateText = formatMessageDate(messageDate);
            const timeText = formatMessageTime(messageDate);
            const isUser = msg.sender === "user";

            return (
              <div
                key={
                  msg._id ||
                  msg.id ||
                  `${messageDate}-${index}`
                }
                className={`flex ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-5 py-4 shadow-lg ${
                    isUser
                      ? "bg-cyan-500 text-slate-950 rounded-br-sm"
                      : "bg-slate-900 border border-slate-800 text-gray-100 rounded-bl-sm"
                  }`}
                >
                  <p className="text-xs mb-2 opacity-60 font-medium">
                    {isUser ? "You" : "EchoSoul 💙"}
                  </p>
                  <p className="whitespace-pre-wrap leading-relaxed break-words">
                    {msg.text}
                  </p>

                  {messageDate && (
                    <div
                      className={`mt-3 text-[10px] flex gap-2 ${
                        isUser
                          ? "text-slate-800/60 justify-end"
                          : "text-gray-500 justify-start"
                      }`}
                    >
                      {dateText && <span>📅 {dateText}</span>}
                      {timeText && <span>🕐 {timeText}</span>}
                    </div>
                  )}

                  {!isUser && msg.text && (
                    <button
                      type="button"
                      onClick={() =>
                        listenToMessage(msg.text, msg.audio)
                      }
                      className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                    >
                      {isSpeaking ? "🔇 Stop" : "🔊 Listen"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* THINKING */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-sm px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    {voiceProcessing
                      ? "Processing your voice"
                      : "EchoSoul is thinking"}
                  </span>
                  <span className="animate-pulse">
                    {voiceProcessing ? "🎤" : "💭"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FORM */}
        <form onSubmit={sendMessage} className="mt-5">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRecording
                  ? "🔴 Recording... click stop when finished"
                  : voiceProcessing
                  ? "🎤 Processing your voice..."
                  : "Talk to your companion..."
              }
              disabled={loading || isRecording}
              className={`flex-1 bg-slate-900 border rounded-xl px-5 py-4 text-white outline-none transition ${
                isRecording
                  ? "border-red-400 ring-1 ring-red-400"
                  : "border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              } disabled:opacity-50`}
            />

            <button
              type="button"
              onClick={toggleRecording}
              disabled={loading || !voiceSupported}
              title={isRecording ? "Stop Recording" : "Start Recording"}
              className={`p-4 rounded-xl border transition flex items-center justify-center ${
                isRecording
                  ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                  : "bg-slate-900 border-slate-700 text-cyan-400 hover:border-cyan-400"
              } disabled:opacity-50`}
            >
              🎤
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;