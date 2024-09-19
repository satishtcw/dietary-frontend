import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;