import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/userContext';

const AdminRoute = () => {
  const { user } = useUser();

  // If there's no user, send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user exists but is NOT an admin, send them to the normal dashboard
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />; 
  }

  // If they are an admin, render the child routes!
  return <Outlet />;
};

export default AdminRoute;