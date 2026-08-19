import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function HeroSection() {
  const navigate = useNavigate();

  // Get Started
  const handleGetStarted = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // Learn More
  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features");

    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full max-w-full overflow-hidden bg-slate-950">
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        <div className="mx-auto w-full max-w-4xl text-center">

          {/* Title */}
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Echo<span className="text-cyan-400">Soul</span>
          </h1>

          {/* Tagline */}
          <p className="mt-5 text-lg leading-relaxed text-gray-300 sm:text-xl md:text-2xl">
            Keeping Memories Alive Through AI
          </p>

          {/* Description */}
          <p className="mx-auto mt-6 w-full max-w-2xl px-2 text-sm leading-7 text-gray-400 sm:text-base sm:leading-8 md:text-lg">
            Create a personalized AI companion inspired by your loved one's
            personality, memories and conversations.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex w-full flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-5">

            <div className="w-full max-w-xs sm:w-auto">
              <Button
                variant="primary"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>

            <div className="w-full max-w-xs sm:w-auto">
              <Button
                variant="secondary"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;