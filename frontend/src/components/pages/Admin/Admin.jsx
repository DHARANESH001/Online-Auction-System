import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminNavbar from '@/components/Navbar/AdminNavbar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AddItem from './AddItem';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'admin') {
      navigate('/login', { replace: true });
      return;
    }

    fetchItems();
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setItems(data);
      } else {
        setError(data.message || 'Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Error fetching items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchItems(); // Refresh the items list
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Error deleting item');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            Manage Items
          </button>
          <button 
            className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add New Item
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === 'items' ? (
          <div className="items-list">
            <h2>Current Auction Items</h2>
            {items.length === 0 ? (
              <div className="empty-state">No items available</div>
            ) : (
              items.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="item-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img 
                    src={item.image || '/placeholder.png'} 
                    alt={item.title} 
                    className="item-image"
                  />
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>Current Price: ${item.currentPrice}</p>
                    <p>End Time: {new Date(item.endTime).toLocaleString()}</p>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="delete-button"
                    >
                      Delete Item
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <AddItem onItemAdded={fetchItems} />
        )}
      </div>
    </div>
  );
};

export default Admin;
