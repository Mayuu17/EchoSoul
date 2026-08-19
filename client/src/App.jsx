import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Chat from "./pages/Chat/Chat";
import MemoryManager from "./pages/Memory/MemoryManager";

function App() {
  return (
    <Routes>
      {/* Handle Render SPA Redirect Issue */}
      <Route path="/index.html" element={<Navigate to="/" replace />} />

      <Route path="/" element={<Landing />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/chat" element={<Chat />} />

      {/* Memory Manager */}
      <Route
        path="/memory"
        element={<MemoryManager />}
      />

      {/* Wildcard Fallback for any other unknown path */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;