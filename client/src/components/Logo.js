import React from 'react';
import logoImage from '../Assets/logo.png';

export default function Logo() {
  return (
      <figure className='flex items-center w-1/5 h-20 justify-center'>
        <img className="w-full h-auto" src={logoImage} alt="Logo" />
      </figure>
  );
}