import React from 'react';
import './hamburger.css';

const Hamburger = ({ onToggle, isOpen = false, size = 'default' }) => {
  // Size variants
  const sizeClasses = {
    small: 'w-16 h-10',
    default: 'w-20 h-12', 
    large: 'w-24 h-14'
  };

  const strokeWidth = {
    small: 'stroke-[5px]',
    default: 'stroke-[6px]',
    large: 'stroke-[7px]'
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex justify-center items-center hamburger-container`}>
      {/* Hidden checkbox for state management */}
      <input 
        type="checkbox" 
        checked={isOpen}
        onChange={onToggle}
        className="absolute h-full w-full z-10 cursor-pointer opacity-0"
      />
      
      {/* SVG Container */}
      <svg 
        className={`fill-none stroke-[#38BDF8] ${strokeWidth[size]} stroke-linecap-round stroke-linejoin-round hover:stroke-[#14B8A6] transition-colors duration-200`}
        viewBox="0 0 100 56"
      >
        {/* First path - animated on toggle */}
        <path 
          d="M48.33,45.6H18a14.17,14.17,0,0,1,0-28.34H78.86a17.37,17.37,0,0,1,0,34.74H42.33l-21-21.26L47.75,4"
          style={{
            strokeDashoffset: isOpen ? 175 : 221,
            strokeDasharray: isOpen ? '0 295' : '46 249',
            opacity: isOpen ? 0 : 1,
            transition: isOpen 
              ? 'stroke-dashoffset 0.07s linear 0.07s, stroke-dasharray 0.07s linear 0.07s, opacity 0s linear 0.14s'
              : 'stroke-dashoffset 0.12s linear 0.2s, stroke-dasharray 0.12s linear 0.2s, opacity 0s linear 0.2s'
          }}
        />
        
        {/* Second path - reverse animation */}
        <path 
          d="M48.33,45.6H18a14.17,14.17,0,0,1,0-28.34H78.86a17.37,17.37,0,0,1,0,34.74H42.33l-21-21.26L47.75,4"
          className={isOpen ? 'animate-stroke-animation' : 'animate-stroke-animation-reverse'}
        />
      </svg>
    </div>
  );
};

export default Hamburger; 