import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = () => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    return !!adminToken;
  };

  if (!isAuthenticated()) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

ProtectedAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedAdminRoute;
