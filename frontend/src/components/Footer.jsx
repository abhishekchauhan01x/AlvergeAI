import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => (
  <footer className="w-full px-2 sm:px-4 py-4 sm:py-6 text-center text-[#A1A1AA] text-xs sm:text-sm flex flex-col items-center justify-center gap-1" style={{ background: 'transparent'}}>
    <img
      className="w-7 mb-1"
      src={assets.ailogo || '/fallback-logo.png'}
      alt="logo"
      loading="lazy"
      onError={(e) => (e.target.src = '/fallback-logo.png')}
    />
    <div className="gap-2 flex text-[#A1A1AA] text-[10px] sm:text-xs mt-1 hover:text-[#FF61A6]">
      <NavLink to="/terms" aria-label="Terms of Service">
        Terms of Service
      </NavLink>
      <span>|</span>
      <NavLink to="/privacy" aria-label="Privacy Policy">
        Privacy Policy
      </NavLink>
    </div>
    <span className="w-full mt-1">&copy; {new Date().getFullYear()} ALVERGE AI. All rights reserved.</span>
  </footer>
);

export default Footer; 