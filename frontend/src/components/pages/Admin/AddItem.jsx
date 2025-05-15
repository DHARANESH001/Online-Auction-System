import React, { useState, useEffect } from 'react';
import './AddItem.css';

const AddItem = ({ onItemAdded }) => {
  // Check authentication and role on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      setError('Please log in to continue');
      return;
    }
    
    if (userRole !== 'admin') {
      setError('Only admin users can add items');
      return;
    }
  }, []);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    durationHours: '',
    category: '',
    condition: 'New',
    image: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Check if all required fields are filled
      const requiredFields = ['title', 'description', 'startingPrice', 'durationHours', 'category'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate numeric fields
      if (isNaN(parseFloat(formData.startingPrice)) || parseFloat(formData.startingPrice) <= 0) {
        setError('Starting price must be a positive number');
        return;
      }

      if (isNaN(parseFloat(formData.durationHours)) || parseFloat(formData.durationHours) <= 0 || parseFloat(formData.durationHours) > 168) {
        setError('Duration must be between 1 and 168 hours');
        return;
      }

      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (!token) {
        setError('Not authorized. Please log in again.');
        return;
      }

      if (userRole !== 'admin') {
        setError('Only admin users can add items');
        return;
      }

      // Create FormData object with proper type conversion
      const data = new FormData();
      
      // Convert and validate numeric fields
      const startingPrice = parseFloat(formData.startingPrice);
      const durationHours = parseFloat(formData.durationHours);
      
      // Add all fields to FormData
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('startingPrice', startingPrice);
      data.append('durationHours', durationHours);
      data.append('category', formData.category);
      data.append('condition', formData.condition || 'New');
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      // Log the form data for debugging
      const formDataObj = {};
      for (let [key, value] of data.entries()) {
        formDataObj[key] = value;
      }
      console.log('Form data being sent:', formDataObj);
      console.log('Using token:', token);
      console.log('User role:', userRole);

      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.status === 401 || response.status === 403) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setError('Your session has expired. Please log in again.');
        return;
      }

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok) {
        setSuccess('Item added successfully!');
        setFormData({
          title: '',
          description: '',
          startingPrice: '',
          durationHours: '',
          category: '',
          condition: 'New',
          image: null
        });
        if (onItemAdded) onItemAdded(); // Refresh the items list
      } else {
        const errorMessage = result.message || result.error || 'Failed to add item';
        setError(`Error: ${errorMessage}`);
        if (result.details) {
          console.error('Validation errors:', result.details);
        }
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Network error or server is not responding. Please try again.');
    }
  };

  return (
    <div className="add-item-page">
      <div className="add-item-container">
        <h2>Add New Auction Item</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="add-item-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startingPrice">Starting Price ($)</label>
            <input
              type="number"
              id="startingPrice"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="durationHours">Auction Duration (Hours)</label>
            <input
              type="number"
              id="durationHours"
              name="durationHours"
              value={formData.durationHours}
              onChange={handleChange}
              min="1"
              max="168"
              required
              placeholder="Enter duration in hours (1-168)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Watches">Watches</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Antiques">Antiques</option>
              <option value="Art">Art</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Refurbished">Refurbished</option>
              <option value="Antique">Antique</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Item Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <button type="submit" className="add-item-button">Add Item</button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
