import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Import Font Awesome CSS in index.html instead
const fontAwesomeLink = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Helmet>
        <link rel="stylesheet" href={fontAwesomeLink} />
        <title>Online Auction System</title>
        <meta name="description" content="Discover unique items and participate in exciting auctions from the comfort of your home" />
      </Helmet>
      <nav className="home-nav">
        <div className="nav-brand">Online Auction System</div>
        <div className="nav-buttons">
          <Link to="/login" className="btn btn-primary nav-btn">Login</Link>
          <Link to="/signup" className="btn btn-secondary nav-btn">Sign Up</Link>
        </div>
      </nav>
      <div className="home-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Welcome to Online Auction System</h1>
            <p className="hero-text">Discover unique items and participate in exciting auctions from the comfort of your home</p>
          </div>
          <div className="hero-image">
            <img src="https://img.freepik.com/free-vector/online-auction-isometric-landing-page-website-template_107791-1040.jpg" alt="Online Auction Illustration" />
          </div>
        </div>

        <div className="features-section">
          <h2>Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-image">
                <img src="https://img.freepik.com/free-vector/secure-data-concept-illustration_114360-2248.jpg" alt="Secure Bidding" />
              </div>
              <h3>Secure Bidding</h3>
              <p>Our platform ensures safe and transparent bidding processes with real-time updates</p>
            </div>
            <div className="feature">
              <div className="feature-image">
                <img src="https://img.freepik.com/free-vector/ecommerce-web-page-concept-illustration_114360-8204.jpg" alt="Wide Selection" />
              </div>
              <h3>Wide Selection</h3>
              <p>Browse through a diverse collection of items from trusted sellers</p>
            </div>
            <div className="feature">
              <div className="feature-image">
                <img src="https://img.freepik.com/free-vector/business-competition-concept-illustration_114360-8766.jpg" alt="Fair Competition" />
              </div>
              <h3>Fair Competition</h3>
              <p>Equal opportunities for all bidders with clear rules and guidelines</p>
            </div>
            <div className="feature">
              <div className="feature-image">
                <img src="https://img.freepik.com/free-vector/push-notifications-concept-illustration_114360-4986.jpg" alt="Real-time Updates" />
              </div>
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

        <footer className="home-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About Us</h3>
              <p>Online Auction System provides a secure and transparent platform for buying and selling unique items through competitive bidding.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Info</h3>
              <ul>
                <li>Email: support@auction.com</li>
                <li>Phone: +1 234 567 8900</li>
                <li>Address: 123 Auction Street</li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
                <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Online Auction System. Developed by Dharanesh</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
