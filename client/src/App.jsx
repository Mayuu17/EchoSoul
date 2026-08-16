import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Chat from "./pages/Chat/Chat";
import MemoryManager from "./pages/Memory/MemoryManager";

function App() {
  return (
    <Routes>
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
    </Routes>
  );
}

export default App;