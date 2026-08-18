// ==========================================
// EchoSoul AI Project
// File: MemoryManager.jsx
// Purpose:
// Add / View / Edit / Delete Persona Memories
// ==========================================

import { useEffect, useState } from "react";

function MemoryManager() {
  const token = localStorage.getItem("token");

  // ==========================================
  // STATES
  // ==========================================

  const [memories, setMemories] = useState([]);

  const [newMemory, setNewMemory] = useState("");

  const [editingIndex, setEditingIndex] =
    useState(null);

  const [editingMemory, setEditingMemory] =
    useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD MEMORIES
  // ==========================================

  const loadMemories = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🧠 Loading memories...");

      const response = await fetch(
  "https://echosoul-q61j.onrender.com/api/memory",
  {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "🧠 Memories response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load memories"
        );
      }

      setMemories(data.memories || []);

    } catch (error) {
      console.error(
        "❌ Load memories error:",
        error
      );

      setError(
        error.message ||
          "Failed to load memories"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    if (token) {
      loadMemories();
    } else {
      setLoading(false);
      setError(
        "Please login to manage memories."
      );
    }
  }, []);

  // ==========================================
  // ADD MEMORY
  // ==========================================

  const handleAddMemory = async (e) => {
    e.preventDefault();

    const memory =
      newMemory.trim();

    if (!memory) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      console.log(
        "🧠 Adding memory:",
        memory
      );

      const response = await fetch(
        "http://localhost:5000/api/memory",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            memory,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "🧠 Add memory response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add memory"
        );
      }

      // --------------------------------------
      // Update UI
      // --------------------------------------

      setMemories(
        data.memories || []
      );

      setNewMemory("");

      console.log(
        "✅ Memory added successfully"
      );

    } catch (error) {
      console.error(
        "❌ Add memory error:",
        error
      );

      setError(
        error.message ||
          "Failed to add memory"
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // START EDITING
  // ==========================================

  const startEditing = (
    index
  ) => {
    setEditingIndex(index);

    setEditingMemory(
      memories[index]
    );

    setError("");
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingMemory("");
  };

  // ==========================================
  // UPDATE MEMORY
  // ==========================================

  const handleUpdateMemory =
    async (index) => {
      const memory =
        editingMemory.trim();

      if (!memory) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        console.log(
          "✏️ Updating memory:",
          index
        );

        const response =
          await fetch(
            `http://localhost:5000/api/memory/${index}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                memory,
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "✏️ Update memory response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update memory"
          );
        }

        setMemories(
          data.memories || []
        );

        setEditingIndex(null);

        setEditingMemory("");

        console.log(
          "✅ Memory updated successfully"
        );

      } catch (error) {
        console.error(
          "❌ Update memory error:",
          error
        );

        setError(
          error.message ||
            "Failed to update memory"
        );

      } finally {
        setSaving(false);
      }
    };

  // ==========================================
  // DELETE MEMORY
  // ==========================================

  const handleDeleteMemory =
    async (index) => {
      const shouldDelete =
        window.confirm(
          "Are you sure you want to delete this memory?"
        );

      if (!shouldDelete) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        console.log(
          "🗑️ Deleting memory:",
          index
        );

        const response =
          await fetch(
            `http://localhost:5000/api/memory/${index}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        console.log(
          "🗑️ Delete memory response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to delete memory"
          );
        }

        setMemories(
          data.memories || []
        );

        // --------------------------------------
        // Reset editing if needed
        // --------------------------------------

        if (
          editingIndex === index
        ) {
          cancelEditing();
        }

        console.log(
          "✅ Memory deleted successfully"
        );

      } catch (error) {
        console.error(
          "❌ Delete memory error:",
          error
        );

        setError(
          error.message ||
            "Failed to delete memory"
        );

      } finally {
        setSaving(false);
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
            🧠
          </div>

          <p className="text-gray-400">
            Loading your memories...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="border-b border-slate-800 bg-slate-900/90">

        <div className="max-w-4xl mx-auto px-6 py-8">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-3xl">
              🧠
            </div>

            <div>

              <h1 className="text-3xl font-bold">
                Memory Manager
              </h1>

              <p className="text-gray-400 mt-1">
                Keep the memories that make
                your connection special.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/10 text-red-300 rounded-xl px-4 py-3">
            ⚠️ {error}
          </div>
        )}

        {/* ====================================
            ADD MEMORY
        ==================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

          <div className="flex items-center gap-2 mb-4">

            <span className="text-xl">
              💭
            </span>

            <h2 className="text-xl font-semibold">
              Add a Memory
            </h2>

          </div>

          <form
            onSubmit={handleAddMemory}
          >

            <textarea
              value={newMemory}
              onChange={(e) =>
                setNewMemory(
                  e.target.value
                )
              }
              placeholder="Example: Grandma loved making puran poli for the family during festivals."
              rows={4}
              disabled={saving}
              className="w-full resize-none bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition disabled:opacity-50"
            />

            <div className="flex justify-end mt-4">

              <button
                type="submit"
                disabled={
                  saving ||
                  !newMemory.trim()
                }
                className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : "➕ Save Memory"}
              </button>

            </div>

          </form>

        </section>

        {/* ====================================
            MEMORY COUNT
        ==================================== */}

        <div className="flex items-center justify-between mt-8 mb-4">

          <div>

            <h2 className="text-xl font-semibold">
              Saved Memories
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {memories.length}{" "}
              {memories.length === 1
                ? "memory"
                : "memories"}{" "}
              saved
            </p>

          </div>

        </div>

        {/* ====================================
            EMPTY STATE
        ==================================== */}

        {memories.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <div className="text-6xl mb-4">
              💙
            </div>

            <h3 className="text-xl font-semibold">
              No memories yet
            </h3>

            <p className="text-gray-500 mt-2">
              Add your first meaningful
              memory above.
            </p>

          </div>
        )}

        {/* ====================================
            MEMORY LIST
        ==================================== */}

        <div className="space-y-4">

          {memories.map(
            (memory, index) => {

              const isEditing =
                editingIndex === index;

              return (
                <div
                  key={index}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg"
                >

                  {/* ==========================
                      EDIT MODE
                  ========================== */}

                  {isEditing ? (
                    <div>

                      <div className="flex items-center gap-2 mb-3">

                        <span>
                          ✏️
                        </span>

                        <span className="text-sm text-cyan-400 font-medium">
                          Editing memory
                        </span>

                      </div>

                      <textarea
                        value={
                          editingMemory
                        }
                        onChange={(e) =>
                          setEditingMemory(
                            e.target.value
                          )
                        }
                        rows={4}
                        disabled={saving}
                        className="w-full resize-none bg-slate-950 border border-cyan-500/50 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
                      />

                      <div className="flex justify-end gap-3 mt-4">

                        <button
                          type="button"
                          onClick={
                            cancelEditing
                          }
                          disabled={saving}
                          className="px-4 py-2 border border-slate-700 text-gray-300 rounded-lg hover:bg-slate-800 transition"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateMemory(
                              index
                            )
                          }
                          disabled={
                            saving ||
                            !editingMemory.trim()
                          }
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg transition disabled:opacity-40"
                        >
                          {saving
                            ? "Saving..."
                            : "💾 Save Changes"}
                        </button>

                      </div>

                    </div>
                  ) : (

                    /* ========================
                       VIEW MODE
                    ======================== */

                    <div>

                      <div className="flex gap-4">

                        <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                          🧠
                        </div>

                        <div className="flex-1 min-w-0">

                          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {memory}
                          </p>

                        </div>

                      </div>

                      {/* ======================
                          ACTIONS
                      ====================== */}

                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-800">

                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              index
                            )
                          }
                          disabled={saving}
                          className="px-4 py-2 text-sm text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10 rounded-lg transition"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteMemory(
                              index
                            )
                          }
                          disabled={saving}
                          className="px-4 py-2 text-sm text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition"
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>

        {/* ====================================
            INFO
        ==================================== */}

        <div className="mt-8 bg-cyan-500/5 border border-cyan-400/10 rounded-2xl p-5">

          <p className="text-sm text-gray-400 leading-relaxed">
            💙 <span className="text-gray-300">
              These memories help EchoSoul
              understand the persona and
              respond more naturally. Only
              memories you save here are treated
              as factual memories by the AI.
            </span>
          </p>

        </div>

      </main>

    </div>
  );
}

export default MemoryManager;