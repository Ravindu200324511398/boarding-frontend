import React, { useState } from 'react';

// Display only stars (read mode)
export const StarDisplay = ({ rating, size = 16, showNumber = true }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.2rem' }}>
      {[...Array(full)].map((_, i) => (
        <span key={`f${i}`} style={{ color:'#f59e0b', fontSize:size }}>★</span>
      ))}
      {half && <span style={{ color:'#f59e0b', fontSize:size }}>★</span>}
      {[...Array(empty)].map((_, i) => (
        <span key={`e${i}`} style={{ color:'#e2e8f0', fontSize:size }}>★</span>
      ))}
      {showNumber && rating > 0 && (
        <span style={{ fontSize:size * 0.8, color:'#64748b', marginLeft:'0.2rem', fontWeight:600 }}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </span>
  );
};

// Interactive star picker (write mode)
const StarRating = ({ value, onChange, size = 28 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <span style={{ display:'inline-flex', gap:'0.2rem', cursor:'pointer' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: size,
            color: star <= (hovered || value) ? '#f59e0b' : '#e2e8f0',
            transition: 'color 0.15s, transform 0.15s',
            transform: star <= (hovered || value) ? 'scale(1.15)' : 'scale(1)',
            display: 'inline-block',
          }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </span>
  );
};

export default StarRating;
