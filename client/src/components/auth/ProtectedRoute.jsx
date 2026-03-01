import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Loading from '../student/Loading.jsx';

const ProtectedRoute = ({ children, requireEducator = false, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isEducator, isActiveEducator, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (requireEducator && !isEducator()) {
    // Redirect to educator access page instead of home
    return <Navigate to="/educator-access" replace />;
  }

  return children;
};

export default ProtectedRoute;

