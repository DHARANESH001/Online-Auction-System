import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPlaceholderImage } from '@/utils/placeholderImage';
import './AuctionCard.css';

const AuctionCard = ({ item, viewMode }) => {
  const [bid, setBid] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!bid || isNaN(bid) || parseFloat(bid) <= item.currentPrice) {
      alert('Please enter a valid bid amount higher than the current price');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to place a bid');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/items/${item._id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(bid) })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place bid');
      }

      const updatedItem = await response.json();
      alert('Bid placed successfully!');
      // You might want to refresh the items list here
    } catch (error) {
      alert(error.message);
    }
  };

  const timeLeft = () => {
    const end = new Date(item.endTime);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return 'Auction ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  return (
    <motion.div
      className={`auction-card ${viewMode}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-image">
        <img
          src={item.imageUrl || createPlaceholderImage(item.title)}
          alt={item.title}
          className={`${imageLoaded ? 'loaded' : ''} ${imageError ? 'error' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        <div className="card-badges">
          <span className="category-badge">{item.category}</span>
          <span className="condition-badge">{item.condition}</span>
        </div>
        {isHovered && (
          <motion.div 
            className="quick-bid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleBidSubmit} className="quick-bid-form">
              <input
                type="number"
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                placeholder={`Min bid: $${(item.currentPrice + 1).toFixed(2)}`}
                min={item.currentPrice + 1}
                step="0.01"
                required
              />
              <button type="submit" className="quick-bid-btn">Place Bid</button>
            </form>
          </motion.div>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3>{item.title}</h3>
          <p className="description">{item.description}</p>
        </div>

        <div className="bid-info">
          <div className="current-bid">
            <span className="label">Current Price</span>
            <span className="amount">${item.currentPrice.toLocaleString()}</span>
          </div>
          <div className="time-left">
            <span className="label">Time Left</span>
            <span className="time">{timeLeft()}</span>
          </div>
        </div>

        <div className="auction-details">
          <div className="detail">
            <span className="label">Starting Price</span>
            <span>${item.startingPrice.toLocaleString()}</span>
          </div>
          <div className="detail">
            <span className="label">Category</span>
            <span>{item.category}</span>
          </div>
          <div className="detail">
            <span className="label">Condition</span>
            <span>{item.condition}</span>
          </div>
        </div>

        <form onSubmit={handleBidSubmit} className="bid-form">
          <div className="input-group">
            <div className="currency-symbol">$</div>
            <input
              type="number"
              value={bid}
              onChange={(e) => setBid(e.target.value)}
              min={item.currentBid + 1}
              step="1"
              placeholder={`Enter bid amount (min: ${(item.currentBid + 1).toLocaleString()})`}
            />
          </div>
          <button 
            type="submit" 
            className="bid-button"
            disabled={!bid || parseInt(bid) <= item.currentBid}
          >
            Place Bid
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AuctionCard;
