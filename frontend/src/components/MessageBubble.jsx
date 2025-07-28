import React from 'react';
import { User, Bot } from 'lucide-react';
import { assets } from '../assets/assets';

const MessageBubble = ({ message }) => {
  const isAI = message.sender === 'ai';
  return (
    <div className={`flex gap-4 ${isAI ? 'justify-start' : 'justify-end'} items-end mb-8`}>
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md overflow-hidden">
          <img src={assets.ailogo} alt="AI" className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`max-w-2xl px-5 py-3 rounded-2xl shadow-lg border ${isAI ? 'glass-inset border-[#38BDF8]/30 text-[#F4F4F9]' : 'glass border-[#F43F5E]/30 text-[#F4F4F9]'} font-medium text-base break-words ${!isAI ? 'mr-4 sm:mr-0' : 'ml-4 sm:ml-0'}`}> 
        <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-2 ${isAI ? 'text-[#38BDF8]' : 'text-[#F43F5E]'}`}>
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;