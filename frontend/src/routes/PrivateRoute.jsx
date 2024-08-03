import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.admin);

  return isAuthenticated ? <Outlet /> : <Navigate to="/pages/login/login3" replace />;
};

export default PrivateRoute;
