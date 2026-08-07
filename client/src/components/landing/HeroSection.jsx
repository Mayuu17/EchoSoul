import Button from "../ui/Button";
import Container from "../ui/Container";

function HeroSection() {
  return (
    <section className="min-h-[90vh] bg-slate-950 flex items-center">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white">
            Echo<span className="text-cyan-400">Soul</span>
          </h1>

          <p className="mt-6 text-xl text-gray-300">
            Keeping Memories Alive Through AI
          </p>

          <p className="mt-6 text-gray-400 leading-8">
            Create a personalized AI companion inspired by your loved one's
            personality, memories and conversations.
          </p>

          <div className="mt-10 flex justify-center gap-5">
            <Button variant="primary">
              Get Started
            </Button>

            <Button variant="secondary">
              Learn More
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;