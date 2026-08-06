function HeroSection() {
  return (
    <section className="min-h-[90vh] bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center max-w-4xl">

        <h1 className="text-5xl md:text-7xl font-extrabold text-white">
          Echo<span className="text-cyan-400">Soul</span>
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-gray-300">
          Keeping Memories Alive Through AI
        </p>

        <p className="mt-6 text-gray-400 leading-8">
          Create a personalized AI companion inspired by your loved one's
          personality, memories, and conversations. Experience meaningful,
          multilingual, and emotionally aware interactions.
        </p>

        <div className="mt-10 flex justify-center gap-5">
          <button className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition text-white font-semibold">
            Get Started
          </button>

          <button className="px-6 py-3 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition font-semibold">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;