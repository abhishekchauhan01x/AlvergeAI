import React, { useState } from 'react';
import { Send } from 'lucide-react';

const InputArea = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug log
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    setIsLoading(true);
    onSendMessage(message);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSendClick = (e) => {
    e.preventDefault();
    console.log('Send button clicked'); // Debug log
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  return (
    <div className="w-full min-h-[72px] h-[72px] flex flex-col justify-center">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end w-full h-full overflow-hidden">
        <div className="flex-1 relative h-full overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => console.log('Textarea focused')} // Debug log
            onBlur={() => console.log('Textarea blurred')} // Debug log
            placeholder="Type your message here..."
            aria-label="Message input"
            className="w-full h-full p-4 pr-16 pb-10 glass-inset border-none rounded-2xl resize-none text-lg text-[#F4F4F9] bg-transparent shadow-lg placeholder-[#E0E0E0] placeholder-opacity-90 no-scrollbar"
            rows={1}
            disabled={isLoading}
            style={{ 
              minHeight: '40px', 
              maxHeight: '72px',
              WebkitUserSelect: 'text',
              WebkitTouchCallout: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
          />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-3 text-[9px] text-[#71717A] pointer-events-none select-none">
            <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
            <span className="sm:hidden">Tap to send</span>
          </span>
          <button
            type="submit"
            onClick={handleSendClick}
            aria-label="Send message"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-3 bg-gradient-to-r from-[#14B8A6] to-[#38BDF8] text-white rounded-full shadow-lg hover:from-[#38BDF8] hover:to-[#14B8A6] hover:scale-110 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 border-none outline-none touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;