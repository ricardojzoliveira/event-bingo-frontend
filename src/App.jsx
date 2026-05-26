import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCurrentUser } from "./hooks/useAuth.js";
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
import EditCard from "./pages/cards/EditCard.jsx";
import LoadingState from "./components/common/LoadingState.jsx";
import SettingsPage from "./pages/auth/UpdateProfilePage.jsx";
import SuspendedScreen from "./pages/auth/SuspendedScreen.jsx";
import UserManagementPage from "./pages/users/UserManagementPage.jsx";
import EditUserPage from "./pages/users/EditUserPage.jsx";

function App() {
  const { data: user, isLoading, isError, error } = useCurrentUser();

  if (isLoading) {
    return <LoadingState />
  }

  /*if (user?.status === "SUSPENDED"){
    return <SuspendedScreen />
  }*/

  const role = user?.role || null;

  return (

    <div className="min-h-screen flex flex-col">
      <Navbar user={user} role={role} />

      <main className="flex-grow flex flex-col">
        <Routes>
          <Route
            path="/"
            element={<Homepage role={role} />}
          />
          <Route path="/card/:id" element={<GamePage role={role} />} />

          <Route path="/login" element={!role ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!role ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/logout" element={<Logout />} />

          <Route
            path="/profile"
            element={
              role ? <ProfilePage role={role} /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/settings"
            element={
              role ? <SettingsPage role={role} /> : <Navigate to="/login" />}
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

          <Route
            path="/admin/cards/edit/:id"
            element={role === "admin" ? <EditCard /> : <Navigate to="/" />}
          />

          <Route
            path="/admin/users"
            element={
              role === "admin" ? <UserManagementPage /> : <Navigate to="/login" />
            }
          />

          <Route path="/admin/users/edit/:userId" element={<EditUserPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
