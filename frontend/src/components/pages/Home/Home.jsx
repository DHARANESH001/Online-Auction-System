import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <div className="hero-section">
          <h1>Welcome to Online Auction System</h1>
          <p className="hero-text">Discover unique items and participate in exciting auctions from the comfort of your home</p>
        </div>

        <div className="features-section">
          <h2>Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>Secure Bidding</h3>
              <p>Our platform ensures safe and transparent bidding processes with real-time updates</p>
            </div>
            <div className="feature">
              <h3>Wide Selection</h3>
              <p>Browse through a diverse collection of items from trusted sellers</p>
            </div>
            <div className="feature">
              <h3>Fair Competition</h3>
              <p>Equal opportunities for all bidders with clear rules and guidelines</p>
            </div>
            <div className="feature">
              <h3>Real-time Updates</h3>
              <p>Get instant notifications about your bids and auction status</p>
            </div>
          </div>
        </div>

        <div className="intro-section">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <h3>1. Sign Up</h3>
              <p>Create your free account to start your auction journey</p>
              <ul className="step-details">
                <li>Quick and easy registration</li>
                <li>Verify your email</li>
                <li>Set up your profile</li>
              </ul>
            </div>
            <div className="step">
              <h3>2. Browse Items</h3>
              <p>Explore our wide range of auction items</p>
              <ul className="step-details">
                <li>Filter by categories</li>
                <li>View detailed descriptions</li>
                <li>Check item history</li>
              </ul>
            </div>
            <div className="step">
              <h3>3. Place Bids</h3>
              <p>Participate in active auctions</p>
              <ul className="step-details">
                <li>Set your maximum bid</li>
                <li>Get outbid notifications</li>
                <li>Track your active bids</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="categories-section">
          <h2>Popular Categories</h2>
          <div className="categories-grid">
            <div className="category">Antiques & Collectibles</div>
            <div className="category">Electronics & Gadgets</div>
            <div className="category">Art & Photography</div>
            <div className="category">Jewelry & Watches</div>
            <div className="category">Sports Memorabilia</div>
            <div className="category">Vintage Fashion</div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Start Bidding?</h2>
          <p>Join our community of auction enthusiasts today!</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
