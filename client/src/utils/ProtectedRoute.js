import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import Spinner from '../components/Spinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Check if the user is logged in and has one of the allowed roles
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // Redirect to login page if not authorized
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
