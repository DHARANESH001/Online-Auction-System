import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserNavbar from '@/components/Navbar/UserNavbar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bids, setBids] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [activeTab, setActiveTab] = useState('profile');

  const getMockProfile = () => {
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    return {
      name: userEmail === 'admin@example.com' ? 'Admin User' : 'Regular User',
      email: userEmail,
      phone: '+1 234 567 8900',
      address: '123 Auction Street, City, Country',
      joinedDate: '2025-01-01'
    };
  };

  // Mock bids data
  const mockBids = [
    { id: 1, itemName: 'Vintage Watch', bidAmount: 150, date: '2025-05-07', status: 'active' },
    { id: 2, itemName: 'Antique Vase', bidAmount: 300, date: '2025-05-06', status: 'outbid' },
    { id: 3, itemName: 'Classic Painting', bidAmount: 600, date: '2025-05-05', status: 'won' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockProfile = getMockProfile();
      setProfile(mockProfile);
      setBids(mockBids);
      setIsLoading(false);
      setEditForm({
        name: mockProfile.name,
        email: mockProfile.email,
        phone: mockProfile.phone || '',
        address: mockProfile.address || ''
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <UserNavbar />
        <div className="profile-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <UserNavbar />
      <motion.div
        className="profile-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="tab-navigation">
              <button
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FaUser /> Profile
              </button>
              <button
                className={`tab-button ${activeTab === 'bids' ? 'active' : ''}`}
                onClick={() => setActiveTab('bids')}
              >
                <FaHistory /> Bid History
              </button>
            </div>

            {activeTab === 'profile' ? (
              <motion.div
                className="profile-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Profile Information</h2>
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="edit-form">
                    <div className="form-group">
                      <label><FaUser /> Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label><FaEnvelope /> Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label><FaPhone /> Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label><FaMapMarkerAlt /> Address</label>
                      <textarea
                        name="address"
                        value={editForm.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="edit-buttons">
                      <button type="submit" className="save-button">Save Changes</button>
                      <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info">
                    <p><FaUser /> <strong>Name:</strong> {profile.name}</p>
                    <p><FaEnvelope /> <strong>Email:</strong> {profile.email}</p>
                    <p><FaPhone /> <strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
                    <p><FaMapMarkerAlt /> <strong>Address:</strong> {profile.address || 'Not provided'}</p>
                    <p><strong>Member since:</strong> {new Date(profile.joinedDate).toLocaleDateString()}</p>
                    <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="bidding-history-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Bidding History</h2>
                {bids.length > 0 ? (
                  <div className="bid-list">
                    {bids.map(bid => (
                      <div key={bid.id} className={`bid-item ${bid.status}`}>
                        <h3>{bid.itemName}</h3>
                        <p><strong>Bid Amount:</strong> ${bid.bidAmount}</p>
                        <p><strong>Date:</strong> {new Date(bid.date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> <span className="status-badge">{bid.status}</span></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No bidding history available.</p>
                )}
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
