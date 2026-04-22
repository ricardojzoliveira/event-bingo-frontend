import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GamePage from "./pages/GamePage";
import Homepage from "./pages/Homepage.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Logout from "./pages/LogoutPage.jsx";

function App() {
  const [role, setRole] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role={role} setRole={setRole} />

      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/card/:id" element={<GamePage role={role} />} />
          <Route
            path="/"
            element={<Homepage role={role} setRole={setRole} />}
          />
          <Route path="/login" element={<LoginPage setRole={setRole}/>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/logout" element={<Logout setRole={setRole} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
