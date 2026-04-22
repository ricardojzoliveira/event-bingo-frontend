import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GamePage from "./pages/GamePage";
import Homepage from "./pages/Homepage.jsx";

function App() {
  const [role, setRole] = useState(null);

  return (
    <div className="min-h-screen bg-[#010B13] text-white flex flex-col">
      <Navbar role={role} setRole={setRole} />

      <main className="flex-grow">
        <Routes>
          <Route path="/card/:id" element={<GamePage role={role} />} />
          <Route
            path="/"
            element={<Homepage role={role} setRole={setRole} />}
          />

          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center p-20 text-center">
                <h1 className="text-6xl font-black text-bingo-red">404</h1>
                <p className="text-xl mt-4">
                  Oops! This page went to another bingo hall.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
