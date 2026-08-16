import Button from "../ui/Button";
import Container from "../ui/Container";

function HeroSection() {
  // ==========================================
  // Get Started
  // ==========================================

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");

    if (token) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  };

  // ==========================================
  // Learn More
  // ==========================================

  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features");

    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="min-h-[90vh] bg-slate-950 flex items-center">
      <Container>
        <div className="text-center max-w-4xl mx-auto">

          {/* Logo / Title */}

          <h1 className="text-5xl md:text-7xl font-extrabold text-white">
            Echo<span className="text-cyan-400">Soul</span>
          </h1>

          {/* Tagline */}

          <p className="mt-6 text-xl md:text-2xl text-gray-300">
            Keeping Memories Alive Through AI
          </p>

          {/* Description */}

          <p className="mt-6 text-gray-400 leading-8 max-w-2xl mx-auto">
            Create a personalized AI companion inspired by your loved one's
            personality, memories and conversations.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">

            {/* Get Started */}

            <Button
              variant="primary"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>

            {/* Learn More */}

            <Button
              variant="secondary"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>

          </div>

        </div>
      </Container>
    </section>
  );
}

export default HeroSection;