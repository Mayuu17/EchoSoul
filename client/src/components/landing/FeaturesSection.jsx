function FeaturesSection() {
  const features = [
    {
      icon: "💙",
      title: "AI Persona",
      description:
        "Build a personalized AI companion inspired by your loved one's personality, memories and speaking style.",
    },
    {
      icon: "🎤",
      title: "Voice Technology",
      description:
        "Experience natural AI-generated responses with expressive voice technology for a more personal interaction.",
    },
    {
      icon: "🔒",
      title: "Private Memories",
      description:
        "Keep your conversations and meaningful memories connected to your personal EchoSoul experience.",
    },
  ];

  return (
    <section
      id="features"
      className="w-full max-w-full overflow-hidden bg-slate-900 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">

        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Why EchoSoul?
          </h2>

          <p className="mt-4 px-2 text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
            Designed to preserve memories with empathy and AI.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                group
                w-full
                min-w-0
                rounded-2xl
                border
                border-slate-700
                bg-slate-800
                p-6
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-cyan-400/50
                hover:shadow-cyan-400/10
                sm:p-7
              "
            >
              <div className="mb-5 text-4xl sm:text-5xl">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-cyan-400 sm:text-2xl">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base sm:leading-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;