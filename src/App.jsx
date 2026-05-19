import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Landing from "./Landing";
import LoginPage from "./Login";
import { UserProvider, useUser } from "./context/userContext"; // Import context

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  // 1. Wait for UserContext to finish checking localStorage/Expiration
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-600 font-semibold">
          Loading authentication...
        </div>
      </div>
    );
  }

  // 2. If after loading, user is null (because token was missing OR expired), redirect
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 2. Main AppRouter
function AppRouter() {
  return (
    // Wrap everything in UserProvider so auth state is accessible
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginWrapper />} />

          {/* Protect the /app route */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

// LoginWrapper helps handle the redirect logic after login
function LoginWrapper() {
  const { user } = useUser();

  // If user is already logged in, redirect them to App
  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <LoginPage />;
}

export default AppRouter;
