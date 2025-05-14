import React from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/components/pages/Home/Home';
import Login from '@/components/pages/Login/Login';
import Signup from '@/components/pages/Signup/Signup';
import Profile from '@/components/pages/Profile/Profile';
import Admin from '@/components/pages/Admin/Admin';
import AdminLogin from '@/components/pages/Admin/AdminLogin';
import ProtectedAdminRoute from '@/components/Auth/ProtectedAdminRoute';
import AuctionPage from '@/components/pages/AuctionPage';
import '@/styles/global.css';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const verifyToken = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsLoading(false);
    };
    verifyToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return token ? children : <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate token and role verification
    const verifyAccess = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsLoading(false);
    };
    verifyAccess();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/auction" replace />;
  }

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/auction"
        element={
          <PrivateRoute>
            <AuctionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <Admin />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
