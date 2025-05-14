import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>Admin Dashboard</span>
      </div>
      <div className="navbar-links">
        <button onClick={handleLogout} className="nav-link logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
