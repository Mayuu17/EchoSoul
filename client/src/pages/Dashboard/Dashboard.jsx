import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://echosoul-q61j.onrender.com/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [persona, setPersona] = useState(null);
  const [loadingPersona, setLoadingPersona] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    personality: "",
    memories: "",
    speakingStyle: "",
    language: "English",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [voiceFile, setVoiceFile] = useState(null);
  const [voiceUploading, setVoiceUploading] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }, [navigate]);

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken) {
      navigate("/login");
      return;
    }

    setToken(storedToken);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User data error:", error);
      }
    }
  }, [navigate]);

  // ==========================================
  // GET PERSONA
  // ==========================================

  useEffect(() => {
    if (!token) return;

    const fetchPersona = async () => {
      try {
        setLoadingPersona(true);

        const response = await fetch(`${API_URL}/persona`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("📚 Persona response:", data);

        if (response.status === 401) {
          handleLogout();
          return;
        }

        if (response.ok) {
          setPersona(data.persona);
        } else if (response.status !== 404) {
          setMessage(data.message || "Failed to load persona.");
        }
      } catch (error) {
        console.error("Get Persona Error:", error);

        setMessage(
          "Unable to connect to server. Please try again."
        );
      } finally {
        setLoadingPersona(false);
      }
    };

    fetchPersona();
  }, [token, handleLogout]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      relationship: "",
      personality: "",
      memories: "",
      speakingStyle: "",
      language: "English",
    });
  };

  // ==========================================
  // CREATE PERSONA
  // ==========================================

  const handleCreatePersona = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.name.trim()) {
      setMessage("Please enter persona name.");
      return;
    }

    if (!formData.relationship.trim()) {
      setMessage("Please enter relationship.");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        name: formData.name.trim(),
        relationship: formData.relationship.trim(),
        personality: formData.personality.trim(),

        memories: formData.memories
          .split(",")
          .map((memory) => memory.trim())
          .filter(Boolean),

        speakingStyle: formData.speakingStyle.trim(),
        language: formData.language,
      };

      const response = await fetch(`${API_URL}/persona`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message || "Failed to create persona."
        );
        return;
      }

      setPersona(data.persona);

      resetForm();

      setMessage(
        "Persona created successfully! 🎉"
      );
    } catch (error) {
      console.error("CREATE PERSONA ERROR:", error);

      setMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // START EDITING
  // ==========================================

  const startEditing = () => {
    if (!persona) return;

    setFormData({
      name: persona.name || "",

      relationship: persona.relationship || "",

      personality: persona.personality || "",

      memories: Array.isArray(persona.memories)
        ? persona.memories.join(", ")
        : "",

      speakingStyle: persona.speakingStyle || "",

      language: persona.language || "English",
    });

    setMessage("");
    setVoiceMessage("");
    setVoiceFile(null);

    setIsEditing(true);

    setTimeout(() => {
      document
        .getElementById("edit-persona-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  // ==========================================
  // CANCEL EDITING
  // ==========================================

  const cancelEditing = () => {
    setIsEditing(false);

    setMessage("");
    setVoiceMessage("");
    setVoiceFile(null);

    resetForm();
  };

  // ==========================================
  // UPDATE PERSONA
  // ==========================================

  const handleUpdatePersona = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.name.trim()) {
      setMessage("Please enter persona name.");
      return;
    }

    if (!formData.relationship.trim()) {
      setMessage("Please enter relationship.");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        name: formData.name.trim(),

        relationship: formData.relationship.trim(),

        personality: formData.personality.trim(),

        memories: formData.memories
          .split(",")
          .map((memory) => memory.trim())
          .filter(Boolean),

        speakingStyle: formData.speakingStyle.trim(),

        language: formData.language,
      };

      const response = await fetch(`${API_URL}/persona`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message || "Failed to update persona."
        );
        return;
      }

      setPersona(data.persona);

      setMessage(
        "Persona updated successfully! 🎉"
      );
    } catch (error) {
      console.error("UPDATE PERSONA ERROR:", error);

      setMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SELECT VOICE
  // ==========================================

  const handleVoiceChange = (e) => {
    const file = e.target.files?.[0];

    setVoiceMessage("");

    if (!file) {
      setVoiceFile(null);
      return;
    }

    if (!file.type.startsWith("audio/")) {
      setVoiceFile(null);

      setVoiceMessage(
        "Please select an audio file only."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setVoiceFile(null);

      setVoiceMessage(
        "Voice file must be smaller than 50 MB."
      );

      e.target.value = "";
      return;
    }

    setVoiceFile(file);

    setVoiceMessage(
      "Voice file selected successfully. 🎤"
    );
  };

  // ==========================================
  // UPLOAD VOICE
  // ==========================================

  const handleVoiceUpload = async () => {
    if (!voiceFile) {
      setVoiceMessage(
        "Please select a voice file first."
      );
      return;
    }

    setVoiceUploading(true);
    setVoiceMessage("");

    try {
      const uploadData = new FormData();

      uploadData.append("voice", voiceFile);

      const response = await fetch(
        `${API_URL}/persona/voice`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: uploadData,
        }
      );

      const data = await response.json();

      console.log(
        "🎤 Voice upload response:",
        data
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Voice upload failed."
        );
      }

      setPersona((prev) => ({
        ...prev,
        voiceSample: data.voiceSample,
      }));

      setVoiceFile(null);

      setVoiceMessage(
        "Voice sample uploaded successfully! 🎉"
      );

      const fileInput =
        document.getElementById("voice-upload");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "VOICE UPLOAD ERROR:",
        error
      );

      setVoiceMessage(
        error.message ||
          "Voice upload failed. Please try again."
      );
    } finally {
      setVoiceUploading(false);
    }
  };

  // ==========================================
  // PERSONA FORM
  // ==========================================

  function PersonaForm({ editMode = false }) {
    return (
      <form
        id={
          editMode
            ? "edit-persona-form"
            : "create-persona-form"
        }
        onSubmit={
          editMode
            ? handleUpdatePersona
            : handleCreatePersona
        }
        className="mt-8 space-y-6"
      >
        {/* NAME */}

        <div>
          <label
            htmlFor={
              editMode
                ? "edit-name"
                : "create-name"
            }
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Person's Name
          </label>

          <input
            id={
              editMode
                ? "edit-name"
                : "create-name"
            }
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Aaji"
            autoComplete="off"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition"
          />
        </div>

        {/* RELATIONSHIP */}

        <div>
          <label
            htmlFor={
              editMode
                ? "edit-relationship"
                : "create-relationship"
            }
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Relationship
          </label>

          <input
            id={
              editMode
                ? "edit-relationship"
                : "create-relationship"
            }
            type="text"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            placeholder="e.g. Grandmother"
            autoComplete="off"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition"
          />
        </div>

        {/* PERSONALITY */}

        <div>
          <label
            htmlFor={
              editMode
                ? "edit-personality"
                : "create-personality"
            }
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Personality
          </label>

          <textarea
            id={
              editMode
                ? "edit-personality"
                : "create-personality"
            }
            name="personality"
            value={formData.personality}
            onChange={handleChange}
            rows={4}
            placeholder="Warm, caring, funny, emotional..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition resize-none"
          />
        </div>

        {/* MEMORIES */}

        <div>
          <label
            htmlFor={
              editMode
                ? "edit-memories"
                : "create-memories"
            }
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Memories
          </label>

          <textarea
            id={
              editMode
                ? "edit-memories"
                : "create-memories"
            }
            name="memories"
            value={formData.memories}
            onChange={handleChange}
            rows={4}
            placeholder="Sunday breakfast, childhood stories, family trips..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition resize-none"
          />

          <p className="text-xs text-gray-500 mt-2">
            Separate multiple memories using commas.
          </p>
        </div>

        {/* SPEAKING STYLE */}

        <div>
          <label
            htmlFor={
              editMode
                ? "edit-speaking-style"
                : "create-speaking-style"
            }
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Speaking Style
          </label>

          <textarea
            id={
              editMode
                ? "edit-speaking-style"
                : "create-speaking-style"
            }
            name="speakingStyle"
            value={formData.speakingStyle}
            onChange={handleChange}
            rows={3}
            placeholder="Caring, uses Marathi words, calls me Sonya..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition resize-none"
          />
        </div>

        {/* LANGUAGE */}

        <div>
          <label
            htmlFor={
              editMode
                ? "edit-language"
                : "create-language"
            }
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Language
          </label>

          <select
            id={
              editMode
                ? "edit-language"
                : "create-language"
            }
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition"
          >
            <option value="English">
              English
            </option>

            <option value="Marathi">
              Marathi
            </option>

            <option value="Hindi">
              Hindi
            </option>
          </select>
        </div>

        {/* VOICE */}

        {editMode && (
          <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-2xl">
                🎤
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-semibold">
                  Voice Sample
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Upload a short audio sample to personalize your companion.
                </p>
              </div>
            </div>

            {persona?.voiceSample?.url && (
              <div className="mt-5 bg-slate-900 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-400">
                    ✓
                  </span>

                  <span className="text-sm text-green-400 font-medium">
                    Voice sample uploaded
                  </span>
                </div>

                <audio
                  controls
                  src={persona.voiceSample.url}
                  className="w-full"
                />
              </div>
            )}

            <div className="mt-5">
              <label
                htmlFor="voice-upload"
                className="block border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-xl p-6 text-center cursor-pointer transition"
              >
                <div className="text-3xl">
                  🎧
                </div>

                <p className="text-gray-300 mt-2">
                  Choose an audio file
                </p>

                <p className="text-gray-600 text-xs mt-1">
                  MP3, WAV, M4A and other audio formats • Max 50 MB
                </p>

                <input
                  id="voice-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceChange}
                  className="hidden"
                />
              </label>
            </div>

            {voiceFile && (
              <div className="mt-4 bg-slate-900 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">
                      🎵 {voiceFile.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {(
                        voiceFile.size /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setVoiceFile(null);
                      setVoiceMessage("");

                      const fileInput =
                        document.getElementById(
                          "voice-upload"
                        );

                      if (fileInput) {
                        fileInput.value = "";
                      }
                    }}
                    className="text-gray-500 hover:text-red-400 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {voiceMessage && (
              <div
                className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                  voiceMessage.includes(
                    "successfully"
                  )
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                }`}
              >
                {voiceMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handleVoiceUpload}
              disabled={
                voiceUploading || !voiceFile
              }
              className="w-full mt-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {voiceUploading
                ? "Uploading Voice... ⏳"
                : persona?.voiceSample?.url
                ? "Replace Voice 🎤"
                : "Upload Voice 🎤"}
            </button>
          </div>
        )}

        {/* MESSAGE */}

        {message && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-4 py-3 text-cyan-400 text-sm">
            {message}
          </div>
        )}

        {/* BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading
              ? "Saving... ⏳"
              : editMode
              ? "Save Changes 💾"
              : "Create Persona 🧠"}
          </button>

          {editMode && (
            <button
              type="button"
              onClick={cancelEditing}
              disabled={loading}
              className="sm:px-6 py-3 border border-slate-700 hover:border-red-400 hover:text-red-400 rounded-xl transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (!token || loadingPersona) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">
            💙
          </div>

          <p className="text-cyan-400 text-lg">
            Loading your EchoSoul...
          </p>

          <p className="text-gray-500 text-sm mt-2">
            Preparing your memories
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xl sm:text-2xl font-bold text-cyan-400"
          >
            💙 EchoSoul
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 px-3 sm:px-4 py-2 rounded-lg text-sm transition"
            >
              💬 <span className="hidden sm:inline">Chat</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="border border-slate-700 hover:border-red-400 hover:text-red-400 px-3 sm:px-4 py-2 rounded-lg text-sm transition"
            >
              🚪 <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* WELCOME */}

        <div className="mb-8 sm:mb-10">
          <p className="text-cyan-400 font-medium text-sm">
            YOUR PERSONAL SPACE
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
            Welcome back
            {user?.fullName
              ? `, ${user.fullName}`
              : ""}{" "}
            👋
          </h1>

          <p className="text-gray-400 mt-3 text-base sm:text-lg">
            Your memories, your stories, your connection.
          </p>
        </div>

        {/* QUICK ACTIONS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="text-left bg-gradient-to-br from-cyan-500/20 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 hover:border-cyan-400 hover:-translate-y-1 transition"
          >
            <div className="text-4xl">
              💬
            </div>

            <h3 className="text-lg font-semibold mt-4">
              Start Chat
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Continue your conversation with your AI companion.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              if (persona) {
                startEditing();
              } else {
                document
                  .getElementById("create-persona-form")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }
            }}
            className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-cyan-400 hover:-translate-y-1 transition"
          >
            <div className="text-4xl">
              🧠
            </div>

            <h3 className="text-lg font-semibold mt-4">
              {persona
                ? "Edit Persona"
                : "Create Persona"}
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Manage personality, memories, voice and speaking style.
            </p>
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <div className="text-4xl">
              💭
            </div>

            <h3 className="text-lg font-semibold mt-4">
              Memories
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              {persona?.memories?.length || 0} memories saved
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <div className="text-4xl">
              🎤
            </div>

            <h3 className="text-lg font-semibold mt-4">
              Voice
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              {persona?.voiceSample?.url
                ? "Voice sample ready ✓"
                : "Voice sample not added"}
            </p>
          </div>
        </div>

        {/* PERSONA */}

        {persona ? (
          <section className="bg-slate-900 border border-cyan-500/20 rounded-3xl overflow-hidden">
            {/* HEADER */}

            <div className="bg-gradient-to-r from-cyan-500/10 to-transparent p-5 sm:p-8 border-b border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-3xl sm:text-4xl">
                    💙
                  </div>

                  <div className="min-w-0">
                    <p className="text-cyan-400 text-sm font-medium">
                      YOUR AI COMPANION
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold mt-1 break-words">
                      {persona.name}
                    </h2>

                    <p className="text-gray-400 mt-1">
                      {persona.relationship}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition"
                >
                  💬 Talk to {persona.name}
                </button>
              </div>
            </div>

            {/* DETAILS */}

            <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <h3 className="text-lg font-semibold">
                  🧠 Personality
                </h3>

                <p className="text-gray-400 mt-3 leading-7 break-words">
                  {persona.personality ||
                    "Not added yet."}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <h3 className="text-lg font-semibold">
                  🗣️ Speaking Style
                </h3>

                <p className="text-gray-400 mt-3 leading-7 break-words">
                  {persona.speakingStyle ||
                    "Not added yet."}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <h3 className="text-lg font-semibold">
                  🌐 Language
                </h3>

                <p className="text-cyan-400 mt-3">
                  {persona.language ||
                    "English"}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <h3 className="text-lg font-semibold">
                  🎙️ Voice
                </h3>

                {persona.voiceSample?.url ? (
                  <div className="mt-3">
                    <p className="text-green-400 mb-3">
                      Voice sample saved ✓
                    </p>

                    <audio
                      controls
                      src={
                        persona.voiceSample.url
                      }
                      className="w-full"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 mt-3">
                    Voice sample not added yet.
                  </p>
                )}
              </div>
            </div>

            {/* MEMORIES */}

            <div className="px-5 sm:px-8 pb-5 sm:pb-8">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">
                    💭 Memories
                  </h3>

                  <span className="text-xs text-gray-500">
                    {persona.memories?.length || 0} saved
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {persona.memories?.length > 0 ? (
                    persona.memories.map(
                      (memory, index) => (
                        <div
                          key={index}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-gray-300 break-words"
                        >
                          <span className="text-cyan-400 mr-2">
                            💙
                          </span>

                          {memory}
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-gray-500">
                      No memories added yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* EDIT BUTTON */}

            <div className="px-5 sm:px-8 pb-5 sm:pb-8">
              <button
                type="button"
                onClick={startEditing}
                className="w-full border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-semibold py-3 rounded-xl transition"
              >
                ✏️ Edit Persona
              </button>
            </div>
          </section>
        ) : (
          <section className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-5 sm:p-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-5xl sm:text-6xl mb-5">
                🧠
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold">
                Create Your AI Companion
              </h2>

              <p className="text-gray-400 mt-3 leading-7">
                Tell EchoSoul about the person whose personality and memories you want to preserve.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <PersonaForm
  editMode={isEditing}
  formData={formData}
  handleChange={handleChange}
  handleCreatePersona={handleCreatePersona}
  handleUpdatePersona={handleUpdatePersona}
  loading={loading}
  cancelEditing={cancelEditing}
  persona={persona}
  voiceFile={voiceFile}
  handleVoiceChange={handleVoiceChange}
  handleVoiceUpload={handleVoiceUpload}
  voiceUploading={voiceUploading}
  voiceMessage={voiceMessage}
  setVoiceFile={setVoiceFile}
  setVoiceMessage={setVoiceMessage}
  message={message}
/>
            </div>
          </section>
        )}

        {/* EDIT PERSONA */}

        {persona && isEditing && (
          <section
            id="edit-persona-form"
            className="mt-8 bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-cyan-400 text-sm font-medium">
                  PERSONALIZE
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Edit Your Persona ✏️
                </h2>
              </div>

              <button
                type="button"
                onClick={cancelEditing}
                className="text-gray-500 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="max-w-3xl">
              <PersonaForm editMode />
            </div>
          </section>
        )}

        {/* FOOTER */}

        <div className="text-center mt-12 pb-6">
          <p className="text-gray-600 text-sm">
            EchoSoul • Keeping Memories Alive Through AI 💙
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

function PersonaForm({
  editMode = false,
  formData,
  handleChange,
  handleCreatePersona,
  handleUpdatePersona,
  loading,
  cancelEditing,
  persona,
  voiceFile,
  handleVoiceChange,
  handleVoiceUpload,
  voiceUploading,
  voiceMessage,
  setVoiceFile,
  setVoiceMessage,
  message,
}) {
  return (
    <form
      id={editMode ? "edit-persona-form" : "create-persona-form"}
      onSubmit={editMode ? handleUpdatePersona : handleCreatePersona}
      className="mt-8 space-y-6"
    >
      {/* Inputs aur Buttons ka code yahan aayega */}
    </form>
  );
}