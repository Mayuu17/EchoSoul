import { useEffect, useState } from "react";

function Persona() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    relationship: "",
    personality: "",
    memories: "",
    speakingStyle: "",
    language: "English",
  });

  const [voiceFile, setVoiceFile] = useState(null);

  const [persona, setPersona] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVoice, setUploadingVoice] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PERSONA
  // ==========================================

  useEffect(() => {
    const loadPersona = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
  "https://echosoul-q61j.onrender.com/api/persona",
  {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log(
          "👤 Persona response:",
          data
        );

        // Persona doesn't exist yet
        if (response.status === 404) {
          setPersona(null);
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load persona"
          );
        }

        const loadedPersona =
          data.persona;

        setPersona(loadedPersona);

        setForm({
          name:
            loadedPersona.name || "",

          relationship:
            loadedPersona.relationship ||
            "",

          personality:
            loadedPersona.personality ||
            "",

          memories:
            Array.isArray(
              loadedPersona.memories
            )
              ? loadedPersona.memories.join(
                  "\n"
                )
              : "",

          speakingStyle:
            loadedPersona.speakingStyle ||
            "",

          language:
            loadedPersona.language ||
            "English",
        });
      } catch (err) {
        console.error(
          "❌ Persona loading error:",
          err
        );

        setError(
          err.message ||
            "Failed to load persona"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadPersona();
    } else {
      setLoading(false);
      setError(
        "Please login first."
      );
    }
  }, [token]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  // ==========================================
  // SAVE PERSONA
  // ==========================================

  const savePersona = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Please enter a persona name."
      );
      return;
    }

    if (!form.relationship.trim()) {
      setError(
        "Please enter the relationship."
      );
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      // Convert memories textarea
      // into array
      const memories =
        form.memories
          .split("\n")
          .map((memory) =>
            memory.trim()
          )
          .filter(Boolean);

      const payload = {
        name: form.name.trim(),

        relationship:
          form.relationship.trim(),

        personality:
          form.personality.trim(),

        memories,

        speakingStyle:
          form.speakingStyle.trim(),

        language:
          form.language,
      };

      // --------------------------------------
      // CREATE OR UPDATE
      // --------------------------------------

      const method = persona
        ? "PUT"
        : "POST";

      const response = await fetch(
  "https://echosoul-q61j.onrender.com/api/persona",
  {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      console.log(
        "💾 Save persona response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save persona"
        );
      }

      setPersona(data.persona);

      setMessage(
        persona
          ? "✅ Persona updated successfully!"
          : "✅ Persona created successfully!"
      );
    } catch (err) {
      console.error(
        "❌ Save persona error:",
        err
      );

      setError(
        err.message ||
          "Failed to save persona"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // VOICE FILE SELECT
  // ==========================================

  const handleVoiceChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    console.log(
      "🎤 Voice file selected:",
      file.name
    );

    setVoiceFile(file);
    setMessage("");
    setError("");
  };

  // ==========================================
  // UPLOAD VOICE
  // ==========================================

  const uploadVoice = async () => {
    if (!voiceFile) {
      setError(
        "Please select a voice recording first."
      );
      return;
    }

    if (!persona) {
      setError(
        "Please create the persona first."
      );
      return;
    }

    setUploadingVoice(true);
    setMessage("");
    setError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "voice",
        voiceFile
      );

      console.log(
        "🎤 Uploading voice..."
      );

      const response = await fetch(
  "https://echosoul-q61j.onrender.com/api/persona/voice",
  {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );

      const data =
        await response.json();

      console.log(
        "🎤 Voice upload response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Voice upload failed"
        );
      }

      // Update persona voice
      setPersona((prev) => ({
        ...prev,
        voiceSample:
          data.voiceSample,
      }));

      setVoiceFile(null);

      setMessage(
        "🎉 Voice uploaded and cloned successfully!"
      );
    } catch (err) {
      console.error(
        "❌ Voice upload error:",
        err
      );

      setError(
        err.message ||
          "Voice upload failed"
      );
    } finally {
      setUploadingVoice(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-5">
            💙
          </div>

          <p className="text-gray-400">
            Loading your persona...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">

      <div className="max-w-3xl mx-auto">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="text-center mb-8">

          <div className="text-6xl mb-4">
            💙
          </div>

          <h1 className="text-4xl font-bold">
            EchoSoul Persona
          </h1>

          <p className="text-gray-400 mt-3">
            Create the personality and memories
            that shape your AI companion.
          </p>

        </div>

        {/* ==================================
            STATUS
        ================================== */}

        {message && (
          <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 px-4 py-3">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3">
            ❌ {error}
          </div>
        )}

        {/* ==================================
            PERSONA FORM
        ================================== */}

        <form
          onSubmit={savePersona}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl"
        >

          <h2 className="text-2xl font-semibold mb-6">
            👤 Persona Details
          </h2>

          {/* NAME */}

          <div className="mb-5">

            <label className="block text-sm text-gray-300 mb-2">
              Persona Name *
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Example: Aaji"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

          </div>

          {/* RELATIONSHIP */}

          <div className="mb-5">

            <label className="block text-sm text-gray-300 mb-2">
              Relationship *
            </label>

            <input
              type="text"
              name="relationship"
              value={
                form.relationship
              }
              onChange={handleChange}
              placeholder="Example: Grandmother"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

          </div>

          {/* PERSONALITY */}

          <div className="mb-5">

            <label className="block text-sm text-gray-300 mb-2">
              Personality
            </label>

            <textarea
              name="personality"
              value={
                form.personality
              }
              onChange={handleChange}
              rows="4"
              placeholder="Example: Caring, loving, funny, supportive..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 resize-none"
            />

          </div>

          {/* MEMORIES */}

          <div className="mb-5">

            <label className="block text-sm text-gray-300 mb-2">
              💭 Memories
            </label>

            <p className="text-xs text-gray-500 mb-2">
              Add one memory per line.
            </p>

            <textarea
              name="memories"
              value={form.memories}
              onChange={handleChange}
              rows="7"
              placeholder={`Example:
She used to make my favorite food.
She always encouraged me during exams.
We used to spend evenings together.`}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 resize-none"
            />

          </div>

          {/* SPEAKING STYLE */}

          <div className="mb-5">

            <label className="block text-sm text-gray-300 mb-2">
              🗣️ Speaking Style
            </label>

            <textarea
              name="speakingStyle"
              value={
                form.speakingStyle
              }
              onChange={handleChange}
              rows="4"
              placeholder="Example: Warm, caring, simple Marathi mixed with English..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 resize-none"
            />

          </div>

          {/* LANGUAGE */}

          <div className="mb-7">

            <label className="block text-sm text-gray-300 mb-2">
              🌐 Language
            </label>

            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
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

              <option value="Marathi + English">
                Marathi + English
              </option>

              <option value="Hindi + English">
                Hindi + English
              </option>

            </select>

          </div>

          {/* SAVE */}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 rounded-xl transition disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : persona
              ? "💾 Update Persona"
              : "✨ Create Persona"}
          </button>

        </form>

        {/* ==================================
            VOICE SECTION
        ================================== */}

        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">

          <h2 className="text-2xl font-semibold">
            🎤 AI Voice
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Upload a voice sample to create
            the EchoSoul companion voice.
          </p>

          {/* VOICE STATUS */}

          {persona?.voiceSample?.voiceId ? (
            <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4">

              <p className="text-green-400 font-semibold">
                ✅ Voice Clone Connected
              </p>

              <p className="text-xs text-gray-400 mt-2 break-all">
                Voice ID:{" "}
                {
                  persona.voiceSample
                    .voiceId
                }
              </p>

            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">

              <p className="text-yellow-400">
                ⚠️ No cloned voice yet
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Upload a voice sample below.
              </p>

            </div>
          )}

          {/* FILE */}

          <div className="mt-5">

            <label className="block text-sm text-gray-300 mb-2">
              Voice Sample
            </label>

            <input
              type="file"
              accept="audio/*"
              onChange={
                handleVoiceChange
              }
              className="w-full text-sm text-gray-400 bg-slate-950 border border-slate-700 rounded-xl p-3"
            />

          </div>

          {/* SELECTED FILE */}

          {voiceFile && (
            <div className="mt-3 text-sm text-cyan-400">
              🎵 Selected:{" "}
              {voiceFile.name}
            </div>
          )}

          {/* UPLOAD */}

          <button
            type="button"
            onClick={uploadVoice}
            disabled={
              uploadingVoice ||
              !voiceFile ||
              !persona
            }
            className="w-full mt-5 bg-purple-500 hover:bg-purple-400 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploadingVoice
              ? "🎤 Creating Voice Clone..."
              : "🎤 Upload & Create Voice Clone"}
          </button>

          {!persona && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Create your persona before
              uploading a voice.
            </p>
          )}

        </div>

        {/* ==================================
            FOOTER
        ================================== */}

        <p className="text-center text-xs text-gray-600 mt-6">
          EchoSoul — Keeping meaningful
          memories alive through AI. 💙
        </p>

      </div>

    </div>
  );
}

export default Persona;