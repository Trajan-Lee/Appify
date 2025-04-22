import React from 'react';
import { Navigate } from 'react-router-dom';
import authUtils from '../utils/authUtils';

const ProtectedRoute = ({ children }) => {
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;