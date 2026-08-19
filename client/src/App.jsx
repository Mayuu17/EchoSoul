import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Chat from "./pages/Chat/Chat";
import MemoryManager from "./pages/Memory/MemoryManager";

function App() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Routes>
        {/* Handle Render SPA Redirect Issue */}
        <Route
          path="/index.html"
          element={<Navigate to="/" replace />}
        />

        {/* Landing */}
        <Route
          path="/"
          element={<Landing />}
        />

        {/* Authentication */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Application */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/chat"
          element={<Chat />}
        />

        {/* Memory Manager */}
        <Route
          path="/memory"
          element={<MemoryManager />}
        />

        {/* Unknown Route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;