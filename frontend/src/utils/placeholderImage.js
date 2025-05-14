// Function to create placeholder images with item name
export const createPlaceholderImage = (itemName) => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2c5282"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">
        ${itemName}
      </text>
    </svg>
  `)}`;
};
