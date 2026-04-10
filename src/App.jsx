import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GamePage from "./pages/GamePage";

function App() {
  const [role, setRole] = useState(null);

  return (
    <div className="min-h-screen bg-[#010B13] text-white">
      <Navbar role={role} setRole={setRole} />
      
      <main className="p-6">
        <Routes>
          <Route path="/card/:id" element={<GamePage role={role} />} />
          <Route path="/" element={<div className="text-center py-20">Home (Colega)</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;