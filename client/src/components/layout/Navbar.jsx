import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  // Home
  const handleHome = () => {
    setMenuOpen(false);
    navigate("/");
  };

  // Scroll to section
  const scrollToSection = (id) => {
    setMenuOpen(false);

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

  // Login
  const handleLogin = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  // Get Started
  const handleGetStarted = () => {
    setMenuOpen(false);

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // Chat
  const handleChat = () => {
    setMenuOpen(false);

    if (token) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };

  // Dashboard
  const handleDashboard = () => {
    setMenuOpen(false);
    navigate("/dashboard");
  };

  // Logout
  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md text-white border-b border-slate-800">
      
      {/* Navbar Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-16">

          {/* =========================
              LOGO
          ========================== */}
          <button
            type="button"
            onClick={handleHome}
            className="text-2xl sm:text-3xl font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer shrink-0"
          >
            Echo<span className="text-white">Soul</span>
          </button>

          {/* =========================
              DESKTOP MENU
          ========================== */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7">

            <button
              type="button"
              onClick={handleHome}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              About
            </button>

            <button
              type="button"
              onClick={handleChat}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              Chat
            </button>

            {!token && (
              <button
                type="button"
                onClick={handleLogin}
                className="text-gray-300 hover:text-cyan-400 transition"
              >
                Login
              </button>
            )}

            {token && (
              <button
                type="button"
                onClick={handleDashboard}
                className="text-gray-300 hover:text-cyan-400 transition"
              >
                Dashboard
              </button>
            )}

            {!token && (
              <button
                type="button"
                onClick={handleGetStarted}
                className="bg-cyan-400 text-slate-950 px-4 lg:px-5 py-2.5 rounded-xl font-semibold hover:bg-cyan-300 transition"
              >
                Get Started
              </button>
            )}

            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="border border-slate-700 px-4 lg:px-5 py-2.5 rounded-xl text-gray-300 hover:border-red-400 hover:text-red-400 transition"
              >
                Logout
              </button>
            )}

          </div>

          {/* =========================
              MOBILE MENU BUTTON
          ========================== */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 text-gray-200 hover:text-cyan-400 hover:border-cyan-400 transition"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

        </div>

        {/* =========================
            MOBILE MENU
        ========================== */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 py-4">
            
            <div className="flex flex-col gap-2">

              <button
                type="button"
                onClick={handleHome}
                className="text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-900 hover:text-cyan-400 transition"
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-900 hover:text-cyan-400 transition"
              >
                Features
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-900 hover:text-cyan-400 transition"
              >
                About
              </button>

              <button
                type="button"
                onClick={handleChat}
                className="text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-900 hover:text-cyan-400 transition"
              >
                Chat
              </button>

              {!token && (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-900 hover:text-cyan-400 transition"
                >
                  Login
                </button>
              )}

              {token && (
                <button
                  type="button"
                  onClick={handleDashboard}
                  className="text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-900 hover:text-cyan-400 transition"
                >
                  Dashboard
                </button>
              )}

              {!token && (
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="mt-2 bg-cyan-400 text-slate-950 px-5 py-3 rounded-xl font-semibold hover:bg-cyan-300 transition"
                >
                  Get Started
                </button>
              )}

              {token && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 border border-slate-700 px-5 py-3 rounded-xl text-gray-300 hover:border-red-400 hover:text-red-400 transition"
                >
                  Logout
                </button>
              )}

            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;