import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '@/components/Navbar/UserNavbar';
import AuctionCard from './auctionpage/AuctionCard';
import FilterBar from './auctionpage/FilterBar';
import SearchBar from './auctionpage/SearchBar';
import { motion } from 'framer-motion';
import './AuctionPage.css';

// Mock data for testing
const mockAuctionItems = [
  {
    id: 1,
    name: 'Diamond Necklace',
    description: 'Beautiful diamond necklace with 24 carat gold chain',
    currentBid: 1500,
    startingBid: 1000,
    endTime: '2024-12-31T23:59:59',
    imageUrl: 'https://example.com/images/necklace.jpg',
    category: 'Jewelry',
    condition: 'New'
  },
  {
    id: 2,
    name: 'Vintage Watch',
    description: 'Rare vintage watch from 1950s',
    currentBid: 800,
    startingBid: 500,
    endTime: '2024-12-25T23:59:59',
    imageUrl: 'https://example.com/images/watch.jpg',
    category: 'Watches',
    condition: 'Used'
  },
  {
    id: 3,
    name: 'Antique Vase',
    description: 'Chinese porcelain vase from Ming Dynasty',
    currentBid: 5000,
    startingBid: 3000,
    endTime: '2024-12-28T23:59:59',
    imageUrl: 'https://example.com/images/vase.jpg',
    category: 'Antiques',
    condition: 'Used'
  }
];

const AuctionPage = () => {
  const navigate = useNavigate();
  const [items] = useState(mockAuctionItems);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    priceRange: [0, 1000000],
    sortBy: 'endTime'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filters.category === '' || item.category === filters.category;
    const matchesCondition = filters.condition === '' || item.condition === filters.condition;
    const matchesPrice = item.currentBid >= filters.priceRange[0] && 
                        item.currentBid <= filters.priceRange[1];

    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'priceAsc':
        return a.currentBid - b.currentBid;
      case 'priceDesc':
        return b.currentBid - a.currentBid;
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
      <motion.div
        className={`auction-grid ${viewMode}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <AuctionCard
              key={item.id}
              item={item}
              viewMode={viewMode}
            />
          ))
        ) : (
          <div className="no-results">
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuctionPage;


