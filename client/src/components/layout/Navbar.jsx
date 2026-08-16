import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ==========================================
  // Home
  // ==========================================

  const handleHome = () => {
    navigate("/");
  };

  // ==========================================
  // Scroll to Landing Page Section
  // ==========================================

  const scrollToSection = (id) => {
    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        const section = document.getElementById(id);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 300);

      return;
    }

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // ==========================================
  // Login
  // ==========================================

  const handleLogin = () => {
    navigate("/login");
  };

  // ==========================================
  // Get Started
  // ==========================================

  const handleGetStarted = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // ==========================================
  // Chat
  // ==========================================

  const handleChat = () => {
    if (token) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="flex items-center justify-between">

          {/* ==========================================
              Logo
          ========================================== */}

          <button
            type="button"
            onClick={handleHome}
            className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
          >
            EchoSoul
          </button>

          {/* ==========================================
              Navigation Links
          ========================================== */}

          <div className="flex items-center gap-8">

            {/* Home */}

            <button
              type="button"
              onClick={handleHome}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              Home
            </button>

            {/* Features */}

            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              Features
            </button>

            {/* About / How It Works */}

            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              About
            </button>

            {/* Chat */}

            <button
              type="button"
              onClick={handleChat}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              Chat
            </button>

            {/* Login */}

            {!token && (
              <button
                type="button"
                onClick={handleLogin}
                className="text-gray-300 hover:text-cyan-400 transition"
              >
                Login
              </button>
            )}

            {/* Dashboard */}

            {token && (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="text-gray-300 hover:text-cyan-400 transition"
              >
                Dashboard
              </button>
            )}

            {/* Get Started */}

            {!token && (
              <button
                type="button"
                onClick={handleGetStarted}
                className="bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold hover:bg-cyan-300 transition"
              >
                Get Started
              </button>
            )}

            {/* Logout */}

            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="border border-slate-700 px-5 py-2.5 rounded-xl text-gray-300 hover:border-red-400 hover:text-red-400 transition"
              >
                Logout
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;