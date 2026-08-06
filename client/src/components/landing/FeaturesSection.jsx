function FeaturesSection() {
  return (
    <section className="bg-slate-900 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold text-center">
          Why EchoSoul?
        </h2>

        <p className="text-center text-gray-400 mt-4">
          Designed to preserve memories with empathy and AI.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-14">

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-cyan-400">
              💙 AI Persona
            </h3>

            <p className="text-gray-400 mt-3">
              Build an AI companion inspired by your loved one's personality.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-cyan-400">
              🎤 Voice Clone
            </h3>

            <p className="text-gray-400 mt-3">
              Hear responses in a familiar voice using AI voice technology.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-cyan-400">
              🔒 Private & Secure
            </h3>

            <p className="text-gray-400 mt-3">
              Your chats, memories, and profile stay protected and encrypted.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;