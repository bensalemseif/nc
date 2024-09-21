import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import Spinner from '../components/Spinner';

const PublicRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  return <Outlet />;
};

export default PublicRoute;
