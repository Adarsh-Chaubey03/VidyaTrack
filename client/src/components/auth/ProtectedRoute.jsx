import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Loading from '../student/Loading.jsx';

const ProtectedRoute = ({ children, requireEducator = false }) => {
  const { user, loading, isAuthenticated, isEducator } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEducator && !isEducator()) {
    // Redirect to home if user is not an educator
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

