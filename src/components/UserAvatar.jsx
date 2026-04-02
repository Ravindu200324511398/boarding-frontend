import React from 'react';

const gradients = [
  'linear-gradient(135deg,#2563eb,#7c3aed)',
  'linear-gradient(135deg,#059669,#0891b2)',
  'linear-gradient(135deg,#d97706,#dc2626)',
  'linear-gradient(135deg,#7c3aed,#db2777)',
  'linear-gradient(135deg,#0891b2,#2563eb)',
  'linear-gradient(135deg,#16a34a,#2563eb)',
];

const IMAGE_BASE = 'http://localhost:5001/uploads/avatars/';

const UserAvatar = ({ name = '?', size = 40, profilePhoto = null }) => {
  const bg = gradients[(name.charCodeAt(0) || 0) % gradients.length];

  if (profilePhoto) {
    return (
      <img
        src={`${IMAGE_BASE}${profilePhoto}`}
        alt={name}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0,
          boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
          border: '2px solid #fff',
        }}
        onError={e => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#fff', fontWeight: 800,
      fontSize: size * 0.4, flexShrink: 0,
      boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
      userSelect: 'none',
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export default UserAvatar;
