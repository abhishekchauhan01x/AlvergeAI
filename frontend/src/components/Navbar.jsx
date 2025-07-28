import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ hideOnMobile = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout, isSignedIn } = useAuth();

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Listen for external navbar menu toggle events
  useEffect(() => {
    const handleExternalToggle = (isOpen) => {
      setMenuOpen(isOpen);
    };

    if (window.navbarEventBus) {
      window.navbarEventBus.on('navbarMenuToggle', handleExternalToggle);
      
      // Emit current state
      window.navbarEventBus.emit('navbarMenuToggle', menuOpen);
    }

    return () => {
      if (window.navbarEventBus) {
        window.navbarEventBus.off('navbarMenuToggle', handleExternalToggle);
      }
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-70 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-r from-[#232946]/95 to-[#1A1B26]/95 backdrop-blur-xl border-b border-[#38BDF8]/20 shadow-lg' 
        : 'bg-transparent shadow-none'
    } ${hideOnMobile ? 'lg:flex hidden' : ''}`}>
      <div className="flex items-center gap-3">
        <img src={assets.ailogo} alt="Logo" className="w-10 h-10 rounded-full shadow-md" />
        <Link to="/" className="text-2xl font-extrabold text-[#38BDF8] tracking-tight hover:text-[#14B8A6] transition-colors duration-200">ALVERGE AI</Link>
      </div>
      <button
        className="sm:hidden p-2 rounded"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <svg className="w-7 h-7 text-[#F4F4F9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
        <div className="hidden sm:flex items-center space-x-6">
          <Link to="/" className="text-[#F4F4F9] text-lg font-medium hover:text-[#F43F5E] transition-colors duration-200">Home</Link>
          <Link to="/chat" className="text-[#F4F4F9] text-lg font-medium hover:text-[#F43F5E] transition-colors duration-200">Chat</Link>
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded-full font-medium border border-[#38BDF8] text-[#38BDF8] bg-transparent shadow-sm hover:shadow-lg hover:bg-[#38BDF8] hover:text-white transition-all duration-200 active:scale-95">
              User
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full font-medium border border-[#F43F5E] text-[#F43F5E] bg-transparent shadow-sm hover:shadow-lg hover:bg-[#F43F5E] hover:text-white transition-all duration-200 active:scale-95"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/sign-in">
            <button
              className="px-5 py-2 rounded-full font-bold border border-white text-white bg-transparent shadow-sm hover:shadow-lg hover:border-[#38BDF8] hover:text-[#38BDF8] transition-all duration-200 active:scale-95"
              type="button"
            >
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className={`fixed inset-0 z-80 ${hideOnMobile ? 'lg:hidden hidden' : 'sm:hidden'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Animated Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[#0F0F23] via-[#1A1B26] to-[#232946] opacity-95 backdrop-blur-2xl"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
            
            {/* Floating Menu Container */}
            <motion.div 
              className="relative z-10 flex flex-col min-h-screen"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                duration: 0.5 
              }}
            >
              {/* Header with Logo and Close */}
              <div className="flex items-center justify-between p-6 border-b border-[#38BDF8]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#14B8A6] p-0.5">
                    <div className="w-full h-full rounded-full bg-[#1A1B26] flex items-center justify-center">
                      <img src={assets.ailogo} alt="Logo" className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-[#38BDF8]">ALVERGE</span>
                    <span className="text-xl font-bold text-[#F4F4F9] ml-1">AI</span>
                  </div>
                </div>
                
                <button
                  className="p-2 rounded-xl bg-gradient-to-r from-[#F43F5E]/20 to-[#F97316]/20 backdrop-blur-md border border-[#F43F5E]/30 hover:border-[#F43F5E]/60 transition-all duration-300 hover:scale-110"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6 text-[#F43F5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 flex flex-col justify-center px-6 py-12">
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                >
                  {/* Navigation Links */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Link 
                      to="/" 
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#38BDF8]/10 to-[#14B8A6]/10 backdrop-blur-md border border-[#38BDF8]/20 hover:border-[#38BDF8]/40 hover:from-[#38BDF8]/20 hover:to-[#14B8A6]/20 transition-all duration-300 transform hover:scale-105"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#14B8A6] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-[#F4F4F9] group-hover:text-[#38BDF8] transition-colors duration-300">Home</div>
                        <div className="text-sm text-[#A1A1AA]">Back to homepage</div>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/chat" 
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#38BDF8]/10 to-[#14B8A6]/10 backdrop-blur-md border border-[#38BDF8]/20 hover:border-[#38BDF8]/40 hover:from-[#38BDF8]/20 hover:to-[#14B8A6]/20 transition-all duration-300 transform hover:scale-105"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#14B8A6] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-[#F4F4F9] group-hover:text-[#38BDF8] transition-colors duration-300">Chat</div>
                        <div className="text-sm text-[#A1A1AA]">Start a conversation</div>
                      </div>
                    </Link>
                  </motion.div>

                  {/* User Actions */}
                  <div className="pt-6 border-t border-[#38BDF8]/20">
                    {isSignedIn ? (
                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#F43F5E]/10 to-[#F97316]/10 backdrop-blur-md border border-[#F43F5E]/20 hover:border-[#F43F5E]/40 hover:from-[#F43F5E]/20 hover:to-[#F97316]/20 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F43F5E] to-[#F97316] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-[#F4F4F9] group-hover:text-[#F43F5E] transition-colors duration-300">Sign Out</div>
                          <div className="text-sm text-[#A1A1AA]">Logout from your account</div>
                        </div>
                      </button>
                    ) : (
                      <Link to="/sign-in" onClick={() => setMenuOpen(false)}>
                        <div className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 hover:from-white/20 hover:to-white/10 transition-all duration-300 transform hover:scale-105">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-[#1A1B26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#F4F4F9] group-hover:text-white transition-colors duration-300">Sign In</div>
                            <div className="text-sm text-[#A1A1AA]">Access your account</div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#38BDF8]/20 text-center">
                <p className="text-sm text-[#71717A]">
                  Experience the future of AI conversations
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
