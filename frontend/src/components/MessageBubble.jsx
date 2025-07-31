import React from 'react';
import { User, Bot } from 'lucide-react';
import { assets } from '../assets/assets';
import AnimatedText from './AnimatedText';

const MessageBubble = ({ message, isNewMessage = false }) => {
  const isAI = message.sender === 'ai';
  return (
    <div className={`flex gap-4 ${isAI ? 'justify-start' : 'justify-end'} items-end mb-8`}>
      {isAI && (
        <div className="hidden sm:flex flex-shrink-0 w-8 h-8 rounded-full items-center justify-center shadow-md overflow-hidden">
          <img src={assets.ailogo} alt="AI" className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`max-w-2xl px-5 py-3 rounded-2xl shadow-lg border ${isAI ? 'glass-inset border-[#38BDF8]/30 text-[#F4F4F9]' : 'glass border-[#F43F5E]/30 text-[#F4F4F9]'} font-medium text-sm sm:text-base break-words ${!isAI ? 'mr-0 sm:mr-4' : 'ml-0 sm:ml-4'}`}> 
        <p>
          {isAI && isNewMessage ? (
            <AnimatedText text={message.text} speed={80} />
          ) : (
            <span className="leading-relaxed whitespace-pre-wrap">{message.text}</span>
          )}
        </p>
        <p className={`text-xs mt-2 ${isAI ? 'text-[#38BDF8]' : 'text-[#F43F5E]'}`}>
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;