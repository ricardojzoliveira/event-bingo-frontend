import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GamePage from "./pages/GamePage";
import Homepage from "./pages/Homepage.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPanel from "./components/admin/AdminPanel.jsx";
import EventManagement from "./pages/EventsManagement.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import { Navigate } from "react-router-dom";
import EditEvent from "./pages/EditEvent.jsx";

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
          <Route path="/login" element={<LoginPage setRole={setRole} />} />

          <Route
            path="/admin"
            element={
              role === "admin" ? <AdminPanel /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/events"
            element={
              role === "admin" ? <EventManagement /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/events/create"
            element={role === "admin" ? <CreateEvent /> : <Navigate to="/" />}
          />
          <Route path="/admin/events/edit/:id" element={role === "admin" ? <EditEvent /> : <Navigate to="/" />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
