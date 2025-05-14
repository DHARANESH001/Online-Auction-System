import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const UserNavbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/auction">Auction System</Link>
      </div>
      <div className="navbar-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/auction" className="nav-link">Auctions</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
