import { useNavigate } from "react-router-dom";

function HowItWorksSection() {
  const navigate = useNavigate();

  const checkAuthAndNavigate = (path) => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const steps = [
    {
      icon: "👤",
      title: "Create Persona",
      description:
        "Add your loved one's name, relationship, personality and memories.",
      action: "Click to create →",
      path: "/dashboard",
    },
    {
      icon: "🎤",
      title: "Upload Voice",
      description:
        "Upload a short voice sample to personalize the conversation.",
      action: "Go to dashboard →",
      path: "/dashboard",
    },
    {
      icon: "🧠",
      title: "AI Learns",
      description:
        "EchoSoul understands personality, memories and conversation style.",
      action: "Manage persona →",
      path: "/dashboard",
    },
    {
      icon: "💬",
      title: "Start Chat",
      description:
        "Talk naturally with your AI companion through text or voice.",
      action: "Start conversation →",
      path: "/chat",
    },
  ];

  return (
    <section className="w-full max-w-full overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            How EchoSoul Works
          </h2>

          <p className="mt-4 px-2 text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
            Create your AI companion in four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {steps.map((step) => (
            <button
              key={step.title}
              type="button"
              onClick={() => checkAuthAndNavigate(step.path)}
              className="
                group
                w-full
                min-w-0
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                p-6
                text-center
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-cyan-400
                hover:shadow-cyan-400/10
                focus:outline-none
                focus:ring-2
                focus:ring-cyan-400
                focus:ring-offset-2
                focus:ring-offset-slate-950
                sm:p-7
              "
            >
              {/* Icon */}
              <div className="text-4xl transition-transform duration-300 group-hover:scale-110 sm:text-5xl">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
                {step.description}
              </p>

              {/* Action */}
              <p className="mt-4 text-sm font-medium text-cyan-400">
                {step.action}
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorksSection;