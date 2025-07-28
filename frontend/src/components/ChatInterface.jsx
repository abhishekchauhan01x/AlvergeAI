import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import Sidebar from './Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

// API base URL
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

// Global event bus for navbar communication
if (!window.navbarEventBus) {
  window.navbarEventBus = {
    listeners: {},
    on: function(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    },
    emit: function(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(callback => callback(data));
      }
    },
    off: function(event, callback) {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
    }
  };
}

const eventBus = window.navbarEventBus;

// Mobile Navbar Component
const MobileNavbar = ({ onSidebarToggle, onNavbarToggle }) => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="lg:hidden fixed top-0 left-0 right-0 z-90 bg-[#1A1B26] border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Hamburger - Sidebar Toggle */}
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg bg-[#232946] text-white hover:bg-[#1A1B26] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Center Logo and Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={handleLogoClick}
        >
          <img src={assets.ailogo} alt="ALVERGE AI Logo" className="w-8 h-8" />
          <div className="flex items-center">
            <span className="text-[#38BDF8] font-bold text-lg">ALVERGE</span>
            <span className="text-[#F4F4F9] font-bold text-lg ml-2">AI</span>
          </div>
        </div>

        {/* Right Hamburger - Navbar Menu Toggle */}
        <button
          onClick={onNavbarToggle}
          className="p-2 rounded-lg bg-[#232946] text-white hover:bg-[#1A1B26] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
          aria-label="Toggle navbar menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

const ChatInterface = () => {
  const { isSignedIn, getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiTyping, setAiTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarMenuOpen, setNavbarMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      if (!isSignedIn) {
        setConversations([]);
        return [];
      }
      const token = await getToken();
      if (!token) {
        setConversations([]);
        return [];
      }
      const response = await fetch(`${API_BASE}/chat/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
      setConversations(data);
      return data;
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
      return [];
    }
    return [];
  };

  // Fetch messages for a conversation
  const fetchMessages = async (convId) => {
    try {
      if (!isSignedIn || !convId) {
        setMessages([]);
        return;
      }
      const token = await getToken();
      if (!token) {
        setMessages([]);
        return;
      }
      const response = await fetch(`${API_BASE}/chat/${convId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched messages:', data);
        setMessages(data.messages || []);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      if (err.status === 404) {
        setError('Conversation not found. Starting a new chat...');
        setConversationId(null);
        localStorage.removeItem('lastConversationId');
        setMessages([]);
      } else {
        setMessages([]);
      }
    }
  };

  // On mount, fetch conversations and select the most recent or last active
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchConversations();
        let convId = localStorage.getItem('lastConversationId');
        if (convId && Array.isArray(data)) {
          const conversationExists = data.some(conv => conv._id === convId);
          if (!conversationExists) {
            localStorage.removeItem('lastConversationId');
            convId = null;
          }
        }
        if (!convId && Array.isArray(data) && data.length > 0) {
          convId = data[0]._id;
        }
        if (convId) {
          console.log('Loading conversation:', convId);
          setConversationId(convId);
          await fetchMessages(convId);
        }
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError('Failed to load conversation.');
        localStorage.removeItem('lastConversationId');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isSignedIn]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Listen for navbar menu state changes
  useEffect(() => {
    const handleNavbarMenuChange = (isOpen) => {
      setNavbarMenuOpen(isOpen);
    };

    eventBus.on('navbarMenuToggle', handleNavbarMenuChange);

    return () => {
      eventBus.off('navbarMenuToggle', handleNavbarMenuChange);
    };
  }, []);

  // Refetch messages when conversationId changes
  useEffect(() => {
    if (conversationId && isSignedIn) {
      console.log('Conversation ID changed, fetching messages:', conversationId);
      fetchMessages(conversationId);
    }
  }, [conversationId, isSignedIn]);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle navbar menu toggle
  const handleNavbarToggle = () => {
    setNavbarMenuOpen(!navbarMenuOpen);
    eventBus.emit('navbarMenuToggle', !navbarMenuOpen);
  };

  // Create a new conversation and select it
  const handleNewChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const createRes = await fetch(`${API_BASE}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await createRes.json();
      const newConvId = data._id;
      await fetchConversations();
      setConversationId(newConvId);
      setMessages([]);
    } catch (err) {
      setError('Failed to create new chat.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (convId) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await fetch(`${API_BASE}/chat/${convId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchConversations();
      if (conversationId === convId) {
        setConversationId(null);
        setMessages([]);
      }
      toast.success('Chat deleted');
    } catch (err) {
      setError('Failed to delete conversation.');
    } finally {
      setLoading(false);
    }
  };

  // Rename a conversation
  const handleRenameConversation = async (convId, newTitle) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await fetch(`${API_BASE}/chat/${convId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
      await fetchConversations();
    } catch (err) {
      setError('Failed to rename conversation.');
    } finally {
      setLoading(false);
    }
  };

  // Select a conversation
  const handleSelectConversation = async (convId) => {
    console.log('Selecting conversation:', convId);
    setConversationId(convId);
    localStorage.setItem('lastConversationId', convId);
    setLoading(true);
    setError(null);
    await fetchMessages(convId);
    setLoading(false);
    
    // Close mobile sidebar after selecting a conversation
    setSidebarOpen(false);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || aiTyping) return;

    setAiTyping(true);
    setError(null);
    const token = await getToken();
    const body = conversationId ? { text, conversationId } : { text };
    const userRes = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await userRes.json();
    if (userRes.ok && data.userMessage) {
      if (!conversationId && data.conversation && data.conversation._id) {
        setConversationId(data.conversation._id);
        localStorage.setItem('lastConversationId', data.conversation._id);
      }
      setMessages((prev) => [...prev, data.userMessage]);
      
      if (data.aiMessage) {
        setMessages((prev) => [...prev, data.aiMessage]);
        await fetchConversations();
      }
      setAiTyping(false);
    } else {
      setError('Failed to send message.');
      setAiTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#111113] overflow-hidden">
      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <MobileNavbar 
          onSidebarToggle={handleSidebarToggle}
          onNavbarToggle={handleNavbarToggle}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full w-80 bg-gray-900 border-r border-gray-800 fixed top-16 left-0 z-20">
        <Sidebar
          open={true}
          onClose={() => {}}
          onNewChat={handleNewChat}
          conversations={conversations}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          onSelectConversation={handleSelectConversation}
          activeConversationId={conversationId}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed inset-0 z-40" style={{ pointerEvents: sidebarOpen ? 'auto' : 'none' }}>
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

      {/* Main chat area */}
      <div className="flex-1 flex flex-col w-full min-h-0 lg:pl-80" style={{ paddingTop: '64px' }}>
        {/* Messages scroll area */}
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="w-full max-w-4xl mx-auto flex justify-center">
            <div className="w-full max-w-2xl">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-[#A1A1AA] gap-2">
                  <div className="w-8 h-8 border-4 border-[#38BDF8] border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-lg font-semibold">Loading messages...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-red-400 gap-2">
                  <span className="text-3xl">⚠️</span>
                  <p className="text-lg font-semibold">{error}</p>
                  <button onClick={() => setError(null)} className="mt-2 px-4 py-2 bg-[#38BDF8] text-white rounded-full">Retry</button>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-[#A1A1AA] gap-2">
                  <span className="text-3xl">💬</span>
                  <p className="text-lg font-semibold">No messages yet</p>
                  <p className="text-sm">Start the conversation below!</p>
                </div>
              ) : (
                <>
                  {Array.isArray(messages) && messages.map((msg) => (
                    <MessageBubble key={msg._id || msg.id} message={msg} />
                  ))}
                  {aiTyping && (
                    <div className="flex gap-4 justify-start items-end animate-pulse">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#38BDF8] to-[#14B8A6] rounded-full flex items-center justify-center shadow-md" />
                      <div className="max-w-2xl px-5 py-3 rounded-2xl shadow-lg border glass-inset border-[#38BDF8]/30 text-[#38BDF8] font-medium text-base break-words">
                        <span className="text-sm">AI is typing...</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 px-4 sm:px-6 pb-4 pt-2 relative z-10 overflow-hidden">
          <div className="w-full max-w-4xl mx-auto flex justify-center overflow-hidden">
            <div className="w-full max-w-2xl overflow-hidden">
              <InputArea onSendMessage={handleSendMessage} />
      </div>
          </div>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default ChatInterface;
