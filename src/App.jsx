import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCurrentUser } from "./hooks/use-auth.js";

import AdminPanel from "./pages/admin/AdminPanel.jsx";

import CardManagement from "./pages/admin/cards/CardManagement.jsx";
import CreateCard from "./pages/admin/cards/CreateCard.jsx";
import EditCard from "./pages/admin/cards/EditCard.jsx";

import EventManagement from "./pages/admin/events/EventsManagement.jsx";
import CreateEvent from "./pages/admin/events/CreateEvent.jsx";
import EditEvent from "./pages/admin/events/EditEvent.jsx";

import UserManagementPage from "./pages/admin/users/UserManagementPage.jsx";
import EditUserPage from "./pages/admin/users/EditUserPage.jsx";
import UserTransactionsPage from "./pages/admin/users/TransactionsUser.jsx";

import AdminStatistics from "./pages/admin/statistics/Statistics.jsx";

import RecentActivity from "./pages/admin/logs/RecentActivity.jsx";
import AuditLogsPage from "./pages/admin/logs/LogsPage.jsx";

import ProfilePage from "./pages/users/ProfilePage.jsx";
import SettingsPage from "./pages/users/UpdateProfilePage.jsx";
import WalletPage from "./pages/users/WalletPage.jsx";

import Navbar from "./components/Navbar";
import GamePage from "./pages/GamePage";
import Homepage from "./pages/Homepage.jsx";

import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

import LoadingState from "./components/LoadingState.jsx";
import NotFound from "./components/NotFound.jsx";

function App() {
  const { data: user, isLoading, isError, error } = useCurrentUser();

  if (isLoading) {
    return <LoadingState />
  }

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
              role === "user" ? <WalletPage role={role} /> : <Navigate to="/" />
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
              role === "admin" ? <UserManagementPage /> : <Navigate to="/" />
            }
          />

          <Route 
            path="/admin/users/transactions/:userId"
            element={
              role === "admin" ? <UserTransactionsPage /> : <Navigate to="/" />
            }
          />

          <Route
            path="/admin/statistics"
            element={
              role === "admin" ? <AdminStatistics /> : <Navigate to="/" />
            }
          />

          <Route path="/admin/users/edit/:userId" element={<EditUserPage />} />

          <Route path="*" element={<NotFound />} />

          <Route path="/admin/recentActivity" element={ role === "admin" ? <RecentActivity /> : <Navigate to="/" />}/>
          <Route path="/admin/logs" element={ role === "admin" ? <AuditLogsPage /> : <Navigate to="/" />}/>

        </Routes>
      </main>
    </div>
  );
}

export default App;
