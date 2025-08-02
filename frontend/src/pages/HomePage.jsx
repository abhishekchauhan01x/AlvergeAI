import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { assets } from '../assets/assets';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import Loader from '../ui/spinner';

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState('human1');
  const [focusedWord, setFocusedWord] = useState(0); // 0: Built, 1: on, 2: Advanced, 3: Technology
  const [wordPositions, setWordPositions] = useState({});
  const wordRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const forwardRef = useRef(true);
  const developerCardRef = useRef(null);
  const isDeveloperCardInView = useInView(developerCardRef, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const messages = [
    { text: 'Human:We produce food for Mice', status: 'human1', delay: 2000 },
    { text: 'Bot:We produce food for Hamsters', status: 'bot', delay: 2000 },
    { text: 'Human2:We produce food for Guinea Pigs', status: 'human2', delay: 2000 },
    { text: 'Bot:We produce food for Chinchillas', status: 'bot', delay: 2000 },
  ];

  const sequence = messages.flatMap(({ text, status, delay }) => [
    text,
    delay,
    () => setTypingStatus(status),
  ]);

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/chat');
    } else {
      navigate('/sign-in');
    }
  };

  // Animation effect for moving brackets between words
  useEffect(() => {
    const interval = setInterval(() => {
      setFocusedWord((prev) => {
        if (forwardRef.current) {
          // Forward cycle: 0->1->2->3
          if (prev === 3) {
            forwardRef.current = false; // Switch to backward
            return 2; // Go back to Advanced
          }
          return prev + 1;
        } else {
          // Backward cycle: 3->2->1->0
          if (prev === 0) {
            forwardRef.current = true; // Switch to forward
            return 1; // Go forward to "on"
          }
          return prev - 1;
        }
      });
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate word positions
  useEffect(() => {
    const calculatePositions = () => {
      const positions = {};
      wordRefs.forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const parentRect = ref.current.parentElement.getBoundingClientRect();
          positions[index] = {
            x: rect.left - parentRect.left,
            width: rect.width,
            height: rect.height,
            centerX: rect.left - parentRect.left + rect.width / 2,
            centerY: rect.top - parentRect.top + rect.height / 2
          };
        }
      });
      setWordPositions(positions);
    };

    // Calculate positions after transitions complete
    const timer = setTimeout(calculatePositions, 500);
    
    // Recalculate on resize
    window.addEventListener('resize', calculatePositions);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePositions);
    };
  }, [focusedWord]);

  return (
    <div className="flex flex-col relative">
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#181A20]/90 via-[#232946]/60 to-transparent pointer-events-none" />
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 pt-20 pb-16 relative z-10 min-h-screen">
        {/* Left Section: Text Content */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col items-center text-center justify-center gap-6 py-12 sm:py-16 lg:py-24 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="w-20 h-20 rounded-full shadow-lg mb-6 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <Loader />
          </motion.div>
          <motion.h1
            className="animated-gradient-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 min-h-[3.5rem]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            ALVERGE AI
          </motion.h1>
          <motion.h2
            className="animated-gradient-text text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 min-h-[2.5rem]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          >
            Alverge AI — intelligent conversations, redefined.
          </motion.h2>
          <motion.h3
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-md mx-auto text-[#A1A1AA] mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
          >
            Experience the future of chat, built for clarity and connection.
          </motion.h3>
          <motion.button
            onClick={handleGetStarted}
            className="group relative px-8 py-3 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-[#38BDF8]/20 to-[#14B8A6]/20 backdrop-blur-md border border-[#38BDF8]/30 hover:border-[#38BDF8]/60 hover:from-[#38BDF8]/30 hover:to-[#14B8A6]/30 shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 active:scale-95 cursor-pointer"
            aria-label="Navigate to dashboard"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
          >
            <span className="relative z-10 flex items-center gap-2">
            Get Started
              <lord-icon
                src="https://cdn.lordicon.com/yxwmgaav.json"
                trigger="hover"
                style={{ width: '20px', height: '20px' }}
                className="group-hover:translate-x-1 transition-transform duration-200"
              >
              </lord-icon>
            </span>
          </motion.button>
        </motion.div>
        {/* Right Section: Bot Image and Message */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-4 py-8 sm:py-12 lg:py-16 relative z-10">
          <div className="relative flex items-center justify-center glass w-full max-w-2xl aspect-[4/3] overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Background Images */}
            <div className="absolute inset-0 flex opacity-10">
              <img
                className="w-full h-full object-cover animate-bg"
                src={assets.bg || '/fallback-bg.png'}
                alt="background"
                loading="lazy"
                onError={(e) => (e.target.src = '/fallback-bg.png')}
              />
              <img
                className="w-full h-full object-cover animate-bg"
                src={assets.bg || '/fallback-bg.png'}
                alt="background"
                loading="lazy"
                onError={(e) => (e.target.src = '/fallback-bg.png')}
              />
            </div>
            {/* Bot Image */}
            <img
              className="w-3/4 sm:w-2/3 object-contain animate-bot relative z-10 drop-shadow-xl"
              src={assets.bot || '/fallback-bot.png'}
              alt="bot"
              loading="lazy"
              onError={(e) => (e.target.src = '/fallback-bot.png')}
            />
          </div>
          <div
            className="absolute right-4 lg:right-30 bottom-4 lg:bottom-5 w-auto max-w-xs sm:max-w-sm md:max-w-md flex items-center gap-2 p-1 sm:p-2 glass-inset z-20 shadow-lg backdrop-blur-md"
            aria-live="polite"
          >
            <img
              className={
                typingStatus === 'bot'
                  ? 'w-7 sm:w-8 md:w-10 object-cover rounded-full'
                  : 'w-5 sm:w-6 md:w-8 object-cover rounded-full'
              }
              src={
                typingStatus === 'human1'
                  ? assets.human1 || '/fallback-human1.png'
                  : typingStatus === 'human2'
                  ? assets.human2 || '/fallback-human2.png'
                  : assets.bot || '/fallback-bot.png'
              }
              alt="avatar"
              loading="lazy"
              onError={(e) => (e.target.src = '/fallback-avatar.png')}
            />
            <TypeAnimation
              sequence={sequence}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
              className="text-xs sm:text-sm md:text-base text-[#F4F4F9]"
            />
          </div>
        </div>
      </div>
      
      {/* Built on Advanced Technology Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 relative">
              <span 
                ref={wordRefs[0]}
                className={`inline-block mr-2 transition-all duration-700 ${focusedWord === 0 ? 'text-white font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl' : 'text-[#A1A1AA] blur-[1px] text-2xl sm:text-3xl md:text-4xl lg:text-5xl'}`}
              >
                Built
              </span>
              <span 
                ref={wordRefs[1]}
                className={`inline-block mr-2 transition-all duration-700 ${focusedWord === 1 ? 'text-white font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl' : 'text-[#A1A1AA] blur-[1px] text-2xl sm:text-3xl md:text-4xl lg:text-5xl'}`}
              >
                on
              </span>
              <span 
                ref={wordRefs[2]}
                className={`inline-block mr-2 transition-all duration-700 ${focusedWord === 2 ? 'text-white font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl' : 'text-[#A1A1AA] blur-[1px] text-2xl sm:text-3xl md:text-4xl lg:text-5xl'}`}
              >
                Advanced
              </span>
              <span 
                ref={wordRefs[3]}
                className={`inline-block transition-all duration-700 ${focusedWord === 3 ? 'text-white font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl' : 'text-[#A1A1AA] blur-[1px] text-2xl sm:text-3xl md:text-4xl lg:text-5xl'}`}
              >
                Technology
              </span>
              
              {/* Moving brackets that physically move between words */}
              <div
                className="absolute pointer-events-none transition-all duration-700 ease-out"
                style={{ 
                  top: 0,
                  left: wordPositions[focusedWord]?.x || 0,
                  width: wordPositions[focusedWord]?.width || 30,
                  height: wordPositions[focusedWord]?.height || 50
                }}
              >
                {/* Top left bracket */}
                <div className="absolute w-2 h-2 border-l-2 border-t-2 border-[#14B8A6]" style={{ left: '-6px', top: '-6px' }}></div>
                {/* Top right bracket */}
                <div className="absolute w-2 h-2 border-r-2 border-t-2 border-[#14B8A6]" style={{ right: '-6px', top: '-6px' }}></div>
                {/* Bottom left bracket */}
                <div className="absolute w-2 h-2 border-l-2 border-b-2 border-[#14B8A6]" style={{ left: '-6px', bottom: '-6px' }}></div>
                {/* Bottom right bracket */}
                <div className="absolute w-2 h-2 border-r-2 border-b-2 border-[#14B8A6]" style={{ right: '-6px', bottom: '-6px' }}></div>
              </div>
            </h2>
            <p className="text-lg sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto mt-6">
              Experience the power of cutting-edge AI technology designed for meaningful conversations
            </p>
          </div>

          {/* Main Content Box */}
          <div className="bg-gradient-to-br from-[#232946]/80 to-[#1A1B26]/80 backdrop-blur-xl border border-[#38BDF8]/20 rounded-3xl p-8 lg:p-12 shadow-2xl mb-12 relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#38BDF8]/5 via-transparent to-[#14B8A6]/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#38BDF8] to-[#14B8A6] rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              
              <p className="text-xl sm:text-2xl lg:text-3xl text-[#F4F4F9] text-center leading-relaxed font-medium">
              Powered by the cutting-edge{' '}
                <span className="bg-gradient-to-r from-[#38BDF8] to-[#14B8A6] bg-clip-text text-transparent font-bold">
                Groq LLM
              </span>{' '}
                model, Alverge AI delivers intelligent conversations with advanced prompting techniques.
            </p>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Rich Markdown Support Card */}
            <div className="group bg-gradient-to-br from-[#1A1B26]/60 to-[#232946]/40 backdrop-blur-md border border-[#38BDF8]/20 rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-[#38BDF8]/40 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F43F5E] to-[#F97316] rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#F43F5E]">
                  Rich Markdown
              </h3>
              </div>
              <p className="text-[#A1A1AA] text-base lg:text-lg leading-relaxed">
                Experience beautifully formatted responses with syntax highlighting, tables, and advanced formatting.
              </p>
            </div>

            {/* Interactive Experience Card */}
            <div className="group bg-gradient-to-br from-[#1A1B26]/60 to-[#232946]/40 backdrop-blur-md border border-[#38BDF8]/20 rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-[#38BDF8]/40 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#38BDF8] to-[#14B8A6] rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#38BDF8]">
                Interactive Experience
              </h3>
              </div>
              <p className="text-[#A1A1AA] text-base lg:text-lg leading-relaxed">
                Every conversation is enhanced with dynamic visual elements and responsive interactions.
              </p>
            </div>

            {/* Advanced AI Card */}
            <div className="group bg-gradient-to-br from-[#1A1B26]/60 to-[#232946]/40 backdrop-blur-md border border-[#38BDF8]/20 rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-[#38BDF8]/40 hover:scale-105 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#14B8A6] to-[#38BDF8] rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#14B8A6]">
                  Advanced AI
                </h3>
              </div>
              <p className="text-[#A1A1AA] text-base lg:text-lg leading-relaxed">
                Leveraging state-of-the-art language models for intelligent, context-aware conversations.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 text-lg font-bold text-white rounded-2xl bg-gradient-to-r from-[#38BDF8]/20 to-[#14B8A6]/20 backdrop-blur-md border border-[#38BDF8]/30 hover:border-[#38BDF8]/60 hover:from-[#38BDF8]/30 hover:to-[#14B8A6]/30 shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 active:scale-95 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Your AI Journey
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Meet the Creator
            </h2>
            <p className="text-lg sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto">
              The mind behind Alverge AI - bringing intelligent conversations to life
            </p>
          </div>

          {/* Developer Profile Card */}
          <div className="bg-gradient-to-br from-[#232946]/90 to-[#1A1B26]/90 backdrop-blur-xl border border-[#38BDF8]/30 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#38BDF8] to-[#14B8A6] rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#F43F5E] to-[#F97316] rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                {/* Profile Image Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#14B8A6] p-1 shadow-2xl">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={assets.devpic || '/fallback-devpic.jpg'}
                          alt="Abhishek Chauhan"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => (e.target.src = '/fallback-devpic.jpg')}
                        />
                      </div>
                    </div>
                    {/* Status Indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#14B8A6] to-[#38BDF8] rounded-full border-4 border-[#1A1B26] flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Developer Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-6">
                    <h3 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-[#38BDF8] to-[#14B8A6] bg-clip-text text-transparent">
                      Abhishek Chauhan
                    </h3>
                    <p className="text-lg text-[#A1A1AA] leading-relaxed">
                      Creator of Alverge AI.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a 
                      href="https://github.com/abhishekchauhan01x" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#38BDF8]/20 to-[#14B8A6]/20 backdrop-blur-md border border-[#38BDF8]/40 rounded-xl hover:border-[#38BDF8]/60 hover:from-[#38BDF8]/30 hover:to-[#14B8A6]/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 text-[#38BDF8] group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="text-white font-medium">GitHub Profile</span>
                    </a>
                    
                    <a 
                      href="#" 
                      className="group flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#F43F5E]/20 to-[#F97316]/20 backdrop-blur-md border border-[#F43F5E]/40 rounded-xl hover:border-[#F43F5E]/60 hover:from-[#F43F5E]/30 hover:to-[#F97316]/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 text-[#F43F5E] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <span className="text-white font-medium">View Project</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#38BDF8]/30 to-transparent my-8"></div>

              {/* Footer Section */}
              <div className="text-center">
                <p className="text-[#A1A1AA] mb-4 text-lg">
                  I welcome contributions and feedback from fellow developers.
                </p>
                <a 
                  href="https://github.com/abhishekchauhan01x/AlvergeAI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 text-[#38BDF8] hover:text-[#14B8A6] transition-colors duration-300 cursor-pointer"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium">Contribute Here</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Disclaimer */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[#71717A] italic">
            Responses are generated by AI and may contain errors. Please review critically and verify when needed.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;