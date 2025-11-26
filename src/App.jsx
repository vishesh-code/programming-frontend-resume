import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './Landing';  // Your main landing component
import LoginPage from './Login'; // Your login page component

// Dummy Auth Logic (global for demonstration)
const isLoggedIn = () => {
  // For now always return true as per your instructions!
  return true;
};

function AppRouter() {
  // If you want to store auth globally, use context or Redux for actual projects
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginWrapper />} />
        <Route path="/app" element={<Landing />} />
        {/* Fallback: redirect to Login for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

// Custom wrapper for login, handles redirect after dummy login
function LoginWrapper() {
  const navigate = useNavigate();
  // Handler for your login button (receives credentials)
  const handleLogin = (email, password) => {
    // Dummy login logic (always succeeds)
    // You can add real logic later
    if (isLoggedIn()) {
      navigate('/app');
    }
  };

  // Pass the handler to LoginPage via props
  return <LoginPage onDummyLogin={handleLogin} />;
}

export default AppRouter;
