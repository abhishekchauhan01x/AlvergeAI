import React, { useState, useEffect } from 'react';

const AnimatedText = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text || isComplete) return;

    const words = text.split(' ');
    
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => {
          const newText = words.slice(0, currentIndex + 1).join(' ');
          return newText;
        });
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [text, currentIndex, speed, isComplete, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return (
    <span className="leading-relaxed whitespace-pre-wrap">
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default AnimatedText; 