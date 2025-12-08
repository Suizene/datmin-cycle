// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return null; // Don't show anything while loading
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;