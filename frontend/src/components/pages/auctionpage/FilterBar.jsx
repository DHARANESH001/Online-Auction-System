import React from 'react';
import './FilterBar.css';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  sortBy, 
  onSortChange,
  viewMode,
  onViewModeChange 
}) => {
  const categories = [
    'All',
    'Art',
    'Collectibles',
    'Electronics',
    'Fashion',
    'Jewelry',
    'Sports',
    'Vehicles',
    'Watches'
  ];

  const conditions = [
    'All',
    'New',
    'Like New',
    'Excellent',
    'Good',
    'Fair'
  ];

  const sortOptions = [
    { value: 'endingSoon', label: 'Ending Soon' },
    { value: 'recentlyAdded', label: 'Recently Added' },
    { value: 'priceLowToHigh', label: 'Price: Low to High' },
    { value: 'priceHighToLow', label: 'Price: High to Low' },
    { value: 'mostBids', label: 'Most Bids' }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <label>Category</label>
        <select 
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        >
          {categories.map(category => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Condition</label>
        <select
          value={filters.condition}
          onChange={(e) => onFilterChange({ ...filters, condition: e.target.value })}
        >
          {conditions.map(condition => (
            <option key={condition} value={condition.toLowerCase()}>
              {condition}
            </option>
          ))}
        </select>
      </div>



      <div className="filter-section">
        <label>Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section view-mode">
        <label>View</label>
        <div className="view-mode-buttons">
          <button
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>
            </svg>
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
