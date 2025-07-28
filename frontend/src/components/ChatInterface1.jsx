import { useState, useRef, useEffect } from "react";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import InputArea from './InputArea';

// --- ChatMessage Component ---
const ChatMessage = ({ message, isUser, timestamp, subtlePalette }) => {
  // Replace with your own cn utility or use classnames
  const cn = (...classes) => classes.filter(Boolean).join(" ");
  return (
    <div className={cn(
      "flex w-full mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] md:max-w-[70%] rounded-3xl px-6 py-5 shadow-md border transition-all duration-300 hover:shadow-xl",
        subtlePalette
          ? isUser
            ? "bg-[#2e3440] text-[#e5e9f0] border-[#3a3f4b]/30"
            : "bg-[#353b48] text-[#d8dee9] border-[#3a3f4b]/30"
          : isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-2xl border-[#38BDF8]/20"
            : "bg-chat-ai text-chat-ai-foreground rounded-bl-2xl border-[#6366f1]/20"
      )}>
        <p className="text-lg leading-relaxed whitespace-pre-wrap font-semibold tracking-wide" style={{ letterSpacing: '0.01em' }}>{message}</p>
        {timestamp && (
          <p className={cn(
            "text-xs mt-2 opacity-70 font-mono",
            subtlePalette
              ? "text-[#b0b6c3]"
              : isUser ? "text-chat-user-foreground" : "text-chat-ai-foreground"
          )}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
};

// --- ScrollArea Component ---
// Minimal version for demo; replace with your own or Radix UI if available
const ScrollArea = ({ children, className, ...props }) => {
  const ref = useRef(null);
  return (
    <div ref={ref} className={`overflow-y-auto ${className || ''}`} style={{ height: '100%', width: '100%' }} {...props}>
      {children}
    </div>
  );
};

// --- Main ChatInterface1 Component ---
const ChatInterface1 = () => {
  // Sidebar and conversation state (mocked)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([
    { _id: '1', title: 'Welcome Chat', updatedAt: new Date().toISOString() },
    { _id: '2', title: 'Demo Conversation', updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  ]);
  const [conversationId, setConversationId] = useState('1');

  // Chat message state (keep as before)
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);

  // Sidebar handlers (mock)
  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newConv = {
      _id: newId,
      title: `New Chat ${conversations.length + 1}`,
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setConversationId(newId);
    setMessages([]);
  };
  const handleDeleteConversation = (convId) => {
    setConversations((prev) => prev.filter((c) => c._id !== convId));
    if (conversationId === convId) {
      const remaining = conversations.filter((c) => c._id !== convId);
      if (remaining.length > 0) {
        setConversationId(remaining[0]._id);
        setMessages([]);
      } else {
        setConversationId(null);
        setMessages([]);
      }
    }
  };
  const handleRenameConversation = (convId, newTitle) => {
    setConversations((prev) =>
      prev.map((c) => (c._id === convId ? { ...c, title: newTitle } : c))
    );
  };
  const handleSelectConversation = (convId) => {
    setConversationId(convId);
    setMessages(
      convId === '1'
        ? [{ id: "1", text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false, timestamp: new Date() }]
        : []
    );
  };

  // Scroll logic (unchanged)
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Chat send logic (unchanged)
  const handleSendMessage = async (text) => {
    const userMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! This is a demo chat interface. In a real implementation, this would connect to an AI service to generate responses.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#23272f] via-[#2d3140] to-[#23272f] pt-16 font-inter">
              <Navbar hideOnMobile={true} />
      {/* Sidebar always on the left */}
      <div className="hidden lg:block fixed top-16 bottom-0 left-0 w-80 bg-gray-900 border-r border-gray-800 z-20">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          conversations={conversations}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          onSelectConversation={handleSelectConversation}
          activeConversationId={conversationId}
        />
      </div>
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed top-20 left-4 z-30 p-2 rounded-full bg-[#232946] text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Main chat area with left padding for sidebar */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 lg:pl-80 w-full relative bg-gradient-to-b from-[#23272f] via-[#2d3140] to-[#23272f]">
        <div className="w-full flex flex-col flex-1 rounded-3xl shadow-xl border border-[#3a3f4b]/40 bg-[#23272f] backdrop-blur-md" style={{ minHeight: '60vh', marginTop: '32px', marginBottom: '120px' }}>
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-6 bg-transparent rounded-3xl relative">
            <div className="space-y-6 font-sans text-[1.12rem] mb-24">
              {messages.map((message) => (
                <div className="transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
                  <ChatMessage
                    key={message.id}
                    message={message.text}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                    subtlePalette
                  />
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-chat-ai text-chat-ai-foreground rounded-3xl rounded-bl-xl px-4 py-3 shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Fade-out gradient overlay at the bottom of chat area */}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-24 z-10" style={{background: 'linear-gradient(to bottom, rgba(35,39,47,0) 0%, #23272f 100%)'}} />
          </ScrollArea>
          {/* Divider above input */}
          <div className="w-full h-[1.5px] bg-[#3a3f4b]/40 mb-0" />
          {/* Input fixed at the bottom with glassy effect */}
          <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center px-2 sm:px-6 lg:pl-80 pointer-events-none bg-[#23272f]/95 backdrop-blur-md" style={{ boxShadow: '0 4px 24px 0 rgba(60, 60, 80, 0.10)' }}>
            <div className="w-full max-w-3xl pointer-events-auto rounded-t-3xl">
              <InputArea onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface1;
