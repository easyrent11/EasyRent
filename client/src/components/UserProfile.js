import React from 'react';

export default function UserProfile ({ imagePath }) {
  return (
    <figure className="w-16 h-16 rounded-full overflow-hidden">
      <img src={imagePath} alt="Profile" className="w-full h-full object-cover" />
    </figure>
  );
};


