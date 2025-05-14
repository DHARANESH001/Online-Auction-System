import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminNavbar from '@/components/Navbar/AdminNavbar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import './Admin.css';

// Mock items data
let mockItems = [
  { id: 1, name: 'Vintage Watch', currentBid: 100, endTime: '2025-12-31' },
  { id: 2, name: 'Antique Vase', currentBid: 250, endTime: '2025-12-30' },
  { id: 3, name: 'Classic Painting', currentBid: 500, endTime: '2025-12-29' },
];

const Admin = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    startingBid: '',
    image: null,
    imagePreview: null,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'admin') {
      navigate('/login', { replace: true });
      return;
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setItems(mockItems);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!newItem.name || !newItem.startingBid) {
      setError('Please fill in all fields');
      return;
    }

    const startingBid = parseFloat(newItem.startingBid);
    if (isNaN(startingBid) || startingBid <= 0) {
      setError('Please enter a valid starting bid');
      return;
    }

    const itemId = Math.random().toString(36).substr(2, 9);
    const newItemWithId = {
      id: itemId,
      name: newItem.name,
      currentBid: parseFloat(newItem.startingBid),
      endTime: '2025-12-31', // Mock end time
      image: newItem.imagePreview, // Store the image preview URL
    };

    setItems([...items, newItemWithId]);
    setSuccessMessage('Item added successfully!');
    setNewItem({ name: '', startingBid: '', image: null, imagePreview: null });

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleDeleteItem = (itemId) => {
    // Update mock items
    mockItems = mockItems.filter((item) => item.id !== itemId);
    setItems(mockItems);

    setSuccessMessage('Item deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <AdminNavbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="admin-grid">
          <motion.div
            className="admin-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit} className="add-item-form">
              <div className="form-group">
                <label>Item Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Starting Bid:</label>
                <input
                  type="number"
                  name="startingBid"
                  value={newItem.startingBid}
                  onChange={handleInputChange}
                  placeholder="Enter starting bid"
                  required
                />
              </div>
              <div className="form-group">
                <label>Item Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {newItem.imagePreview && (
                  <div className="image-preview">
                    <img
                      src={newItem.imagePreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginTop: '8px',
                      }}
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="submit-button">
                Add Item
              </button>
            </form>
          </motion.div>

          <motion.div
            className="admin-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Manage Items</h2>
            {isLoading ? (
              <LoadingSpinner />
            ) : items.length === 0 ? (
              <div className="empty-state">
                <p>No items available</p>
              </div>
            ) : (
              <div className="items-grid">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="item-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.image && (
                      <div className="item-image">
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                      </div>
                    )}
                    <h3>{item.name}</h3>
                    <div className="item-details">
                      <p className="bid-amount">
                        Current Bid: <span>${item.currentBid}</span>
                      </p>
                      <p className="end-time">
                        End Time: <span>{item.endTime}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="delete-button"
                    >
                      Delete Item
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
