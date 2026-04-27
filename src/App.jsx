import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import GamePage from "./pages/GamePage";
import Homepage from "./pages/Homepage.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ProfilePage from "./pages/auth/ProfilePage.jsx";
import Logout from "./pages/auth/LogoutPage.jsx";
import AdminPanel from "./components/admin/AdminPanel.jsx";
import EventManagement from "./pages/events/EventsManagement.jsx";
import CreateEvent from "./pages/events/CreateEvent.jsx";
import EditEvent from "./pages/events/EditEvent.jsx";
import CardManagement from "./pages/cards/CardManagement.jsx";
import CreateCard from "./pages/cards/CreateCard.jsx"
import WalletPage from "./pages/auth/WalletPage.jsx"

function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("user_role") || null;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role={role} setRole={setRole} />

      <main className="flex-grow flex flex-col">
        <Routes>
          <Route
            path="/"
            element={<Homepage role={role} setRole={setRole} />}
          />
          <Route path="/card/:id" element={<GamePage role={role} />} />

          <Route path="/login" element={<LoginPage setRole={setRole} />} />
          <Route
            path="/register"
            element={<RegisterPage setRole={setRole} />}
          />
          <Route path="/logout" element={<Logout setRole={setRole} />} />

          <Route
            path="/profile"
            element={
              role ? <ProfilePage role={role} /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/wallet"
            element={
              role ? <WalletPage role={role} /> : <Navigate to="/login" />
            }
          />

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
          <Route
            path="/admin/events/edit/:id"
            element={role === "admin" ? <EditEvent /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/cards"
            element={
              role === "admin" ? <CardManagement /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/cards/create"
            element={role === "admin" ? <CreateCard /> : <Navigate to="/" />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
