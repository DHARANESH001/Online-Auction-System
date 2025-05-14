import React from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <div className="search-input">
        <svg 
          className="search-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for items..."
        />
      </div>
      <div className="search-suggestions">
        <div className="suggestion-label">Popular:</div>
        <div className="suggestion-tags">
          <button onClick={() => onChange('Vintage')}>Vintage</button>
          <button onClick={() => onChange('Rare')}>Rare</button>
          <button onClick={() => onChange('Limited Edition')}>Limited Edition</button>
          <button onClick={() => onChange('Antique')}>Antique</button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
