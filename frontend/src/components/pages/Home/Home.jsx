import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Welcome to Online Auction System</h1>
        <div className="intro-section">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <h3>1. Sign Up</h3>
              <p>Create your account to start bidding</p>
            </div>
            <div className="step">
              <h3>2. Browse Items</h3>
              <p>Explore available auction items</p>
            </div>
            <div className="step">
              <h3>3. Place Bids</h3>
              <p>Bid on items you're interested in</p>
            </div>
          </div>
        </div>
        <div className="cta-buttons">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
