import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginPage from "./pages/Login";
import { UserProvider, useUser } from "./context/userContext";
import ResetPassword from "./pages/PasswordReset";
import MyFiles from "./pages/MyFiles";
import AppLayout from "./components/layout/AppLayout"; 
import Notes from "./pages/Notes.jsx";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-600 font-semibold">Loading...</div>
      </div>
    );
  if (!user) return <Navigate to="/" replace />;
  return children;
};

function AppRouter() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginWrapper />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
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

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

function LoginWrapper() {
  const { user } = useUser();
  if (user) return <Navigate to="/app" replace />;
  return <LoginPage />;
}

export default AppRouter;
