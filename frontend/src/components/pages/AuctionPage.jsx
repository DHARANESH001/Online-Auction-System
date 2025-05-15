import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '@/components/Navbar/UserNavbar';
import AuctionCard from './auctionpage/AuctionCard';
import FilterBar from './auctionpage/FilterBar';
import SearchBar from './auctionpage/SearchBar';
import { motion } from 'framer-motion';
import './AuctionPage.css';

const AuctionPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    priceRange: [0, 1000000],
    sortBy: 'endTime'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filters.category === '' || item.category === filters.category;
    const matchesCondition = filters.condition === '' || item.condition === filters.condition;
    const matchesPrice = item.currentPrice >= filters.priceRange[0] && 
                        item.currentPrice <= filters.priceRange[1];

    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'priceAsc':
        return a.currentPrice - b.currentPrice;
      case 'priceDesc':
        return b.currentPrice - a.currentPrice;
      case 'endTime':
        return new Date(a.endTime) - new Date(b.endTime);
      default:
        return 0;
    }
  });



  return (
    <div className="auction-page">
      <UserNavbar />
      <div className="auction-controls">
        <SearchBar
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onViewModeChange={setViewMode}
        />
      </div>
      {loading ? (
        <div className="loading">Loading items...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="no-items">No items found</div>
      ) : (
        <motion.div
          className={`auction-grid ${viewMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredItems.map(item => (
            <AuctionCard
              key={item._id}
              item={{
                ...item,
                imageUrl: item.image ? `http://localhost:5000${item.image}` : null
              }}
              viewMode={viewMode}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AuctionPage;


