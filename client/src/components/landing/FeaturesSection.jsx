function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-slate-900 text-white py-20 px-6"
    >
      <div className="max-w-6xl mx-auto">

        {/* ==========================================
            Section Heading
        ========================================== */}

        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why EchoSoul?
          </h2>

          <p className="text-center text-gray-400 mt-4 text-lg">
            Designed to preserve memories with empathy and AI.
          </p>
        </div>

        {/* ==========================================
            Feature Cards
        ========================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">

          {/* ==========================================
              AI Persona
          ========================================== */}

          <div
            className="
              bg-slate-800
              rounded-2xl
              p-7
              border
              border-slate-700
              hover:border-cyan-400/50
              hover:-translate-y-2
              transition
              duration-300
              shadow-lg
            "
          >
            <div className="text-5xl mb-5">
              💙
            </div>

            <h3 className="text-xl font-semibold text-cyan-400">
              AI Persona
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              Build a personalized AI companion inspired by your loved
              one's personality, memories and speaking style.
            </p>
          </div>

          {/* ==========================================
              Voice Technology
          ========================================== */}

          <div
            className="
              bg-slate-800
              rounded-2xl
              p-7
              border
              border-slate-700
              hover:border-cyan-400/50
              hover:-translate-y-2
              transition
              duration-300
              shadow-lg
            "
          >
            <div className="text-5xl mb-5">
              🎤
            </div>

            <h3 className="text-xl font-semibold text-cyan-400">
              Voice Technology
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              Experience natural AI-generated responses with expressive
              voice technology for a more personal interaction.
            </p>
          </div>

          {/* ==========================================
              Private Memories
          ========================================== */}

          <div
            className="
              bg-slate-800
              rounded-2xl
              p-7
              border
              border-slate-700
              hover:border-cyan-400/50
              hover:-translate-y-2
              transition
              duration-300
              shadow-lg
            "
          >
            <div className="text-5xl mb-5">
              🔒
            </div>

            <h3 className="text-xl font-semibold text-cyan-400">
              Private Memories
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              Keep your conversations and meaningful memories connected
              to your personal EchoSoul experience.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;