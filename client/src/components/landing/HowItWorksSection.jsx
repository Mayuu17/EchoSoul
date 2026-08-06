function HowItWorksSection() {
  return (
    <section className="bg-slate-950 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center">
          How EchoSoul Works
        </h2>

        <p className="text-center text-gray-400 mt-4">
          Create your AI companion in four simple steps.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-14">
          {/* Step 1 */}
          <div className="bg-slate-900 rounded-xl p-6 text-center shadow-lg">
            <div className="text-5xl">👤</div>
            <h3 className="text-xl font-semibold mt-4">
              Create Persona
            </h3>
            <p className="text-gray-400 mt-3">
              Add your loved one's name, relationship, personality and memories.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900 rounded-xl p-6 text-center shadow-lg">
            <div className="text-5xl">🎤</div>
            <h3 className="text-xl font-semibold mt-4">
              Upload Voice
            </h3>
            <p className="text-gray-400 mt-3">
              Upload a short voice sample to personalize the conversation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900 rounded-xl p-6 text-center shadow-lg">
            <div className="text-5xl">🧠</div>
            <h3 className="text-xl font-semibold mt-4">
              AI Learns
            </h3>
            <p className="text-gray-400 mt-3">
              EchoSoul understands personality, memories and conversation style.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-900 rounded-xl p-6 text-center shadow-lg">
            <div className="text-5xl">💬</div>
            <h3 className="text-xl font-semibold mt-4">
              Start Chat
            </h3>
            <p className="text-gray-400 mt-3">
              Talk naturally with your AI companion through text or voice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;