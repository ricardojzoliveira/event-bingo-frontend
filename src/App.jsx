import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GamePage from "./pages/GamePage";
import Homepage from './pages/Homepage.jsx'

function App() {
  const [role, setRole] = useState(null);

  return (
    <div className="min-h-screen bg-[#010B13] text-white flex flex-col">
      <Navbar role={role} setRole={setRole} />
      
      <main className="flex-grow"> 
        <Routes>
          <Route path="/card/:id" element={<GamePage role={role} />} />
          <Route path="/" element={<Homepage role={role} setRole={setRole}/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;