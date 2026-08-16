import { useNavigate } from "react-router-dom";

function HowItWorksSection() {
  const navigate = useNavigate();

  // ==========================================
  // Check Login & Navigate
  // ==========================================

  const goToDashboard = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const goToChat = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="bg-slate-950 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ==========================================
            Heading
        ========================================== */}

        <h2 className="text-4xl md:text-5xl font-bold text-center">
          How EchoSoul Works
        </h2>

        <p className="text-center text-gray-400 mt-4 text-lg">
          Create your AI companion in four simple steps.
        </p>

        {/* ==========================================
            Steps
        ========================================== */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-14">

          {/* ==========================================
              Step 1 - Create Persona
          ========================================== */}

          <div
            onClick={goToDashboard}
            className="
              bg-slate-900
              rounded-2xl
              p-6
              text-center
              shadow-lg
              cursor-pointer
              border
              border-transparent
              hover:border-cyan-400
              hover:-translate-y-2
              transition
              duration-300
            "
          >
            <div className="text-5xl">
              👤
            </div>

            <h3 className="text-xl font-semibold mt-4">
              Create Persona
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              Add your loved one's name, relationship, personality and
              memories.
            </p>

            <p className="text-cyan-400 text-sm mt-4">
              Click to create →
            </p>
          </div>

          {/* ==========================================
              Step 2 - Upload Voice
          ========================================== */}

          <div
            onClick={goToDashboard}
            className="
              bg-slate-900
              rounded-2xl
              p-6
              text-center
              shadow-lg
              cursor-pointer
              border
              border-transparent
              hover:border-cyan-400
              hover:-translate-y-2
              transition
              duration-300
            "
          >
            <div className="text-5xl">
              🎤
            </div>

            <h3 className="text-xl font-semibold mt-4">
              Upload Voice
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              Upload a short voice sample to personalize the conversation.
            </p>

            <p className="text-cyan-400 text-sm mt-4">
              Go to dashboard →
            </p>
          </div>

          {/* ==========================================
              Step 3 - AI Learns
          ========================================== */}

          <div
            onClick={goToDashboard}
            className="
              bg-slate-900
              rounded-2xl
              p-6
              text-center
              shadow-lg
              cursor-pointer
              border
              border-transparent
              hover:border-cyan-400
              hover:-translate-y-2
              transition
              duration-300
            "
          >
            <div className="text-5xl">
              🧠
            </div>

            <h3 className="text-xl font-semibold mt-4">
              AI Learns
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              EchoSoul understands personality, memories and conversation
              style.
            </p>

            <p className="text-cyan-400 text-sm mt-4">
              Manage persona →
            </p>
          </div>

          {/* ==========================================
              Step 4 - Start Chat
          ========================================== */}

          <div
            onClick={goToChat}
            className="
              bg-slate-900
              rounded-2xl
              p-6
              text-center
              shadow-lg
              cursor-pointer
              border
              border-transparent
              hover:border-cyan-400
              hover:-translate-y-2
              transition
              duration-300
            "
          >
            <div className="text-5xl">
              💬
            </div>

            <h3 className="text-xl font-semibold mt-4">
              Start Chat
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              Talk naturally with your AI companion through text or voice.
            </p>

            <p className="text-cyan-400 text-sm mt-4">
              Start conversation →
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;