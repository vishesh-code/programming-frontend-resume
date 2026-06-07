import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Landing from "./pages/Landing";
import LoginPage from "./pages/Login";
import { UserProvider, useUser } from "./context/userContext";
import ResetPassword from "./pages/PasswordReset";
import MyFiles from "./pages/MyFiles";
import AppLayout from "./components/layout/AppLayout";
import Notes from "./pages/Notes.jsx";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminFiles from "./pages/admin/AdminFiles";
import AdminNotes from "./pages/admin/AdminNotes";
import AdminTaxonomy from "./pages/admin/AdminTaxonomy";
import AdminSettings from "./pages/admin/AdminSettings";
// 1. Standard Protected Route (For normal users ONLY)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-600 font-semibold">Loading...</div>
      </div>
    );

  if (!user) return <Navigate to="/" replace />;

  // 🔥 Prevent Admins from accessing user pages
  if (user.role === "admin") return <Navigate to="/admin" replace />;

  return children;
};

// 2. Admin Protected Route Guard (For admins ONLY)
const AdminRoute = () => {
  const { user, loading } = useUser();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-600 font-semibold">Loading...</div>
      </div>
    );

  if (!user) return <Navigate to="/" replace />;

  // 🔥 Prevent normal users from accessing admin pages
  if (user.role !== "admin") return <Navigate to="/app" replace />;

  return <Outlet />;
};

function AppRouter() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginWrapper />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Routes (Completely Isolated) */}
          {/* <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Route> */}

          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />

              <Route path="users" element={<AdminUsers />} />
              <Route path="files" element={<AdminFiles />} />
              <Route path="notes" element={<AdminNotes />} />
              <Route path="taxonomy" element={<AdminTaxonomy />} />
            </Route>
          </Route>

          {/* Standard User Routes (Completely Isolated) */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Landing />} />
            <Route path="files" element={<MyFiles />} />
            <Route path="notes" element={<Notes />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

// 3. Login Wrapper that checks roles initially
function LoginWrapper() {
  const { user } = useUser();

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/app" replace />;
    }
  }

  return <LoginPage />;
}

export default AppRouter;
