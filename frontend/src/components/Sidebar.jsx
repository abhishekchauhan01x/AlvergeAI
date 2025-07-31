import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, Pencil } from 'lucide-react';
import { assets } from '../assets/assets';

const Sidebar = ({ open, onClose, onNewChat, conversations = [], onDeleteConversation, onRenameConversation, onSelectConversation, activeConversationId }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleRenameStart = (conv) => {
    setEditingId(conv._id);
    setEditValue(conv.title || '');
  };

  const handleRenameSubmit = (conv) => {
    if (editValue.trim() && editValue.trim() !== conv.title) {
      onRenameConversation && onRenameConversation(conv._id, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Ensure conversations is always an array
  const safeConversations = Array.isArray(conversations) ? conversations : [];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-50 lg:hidden cursor-pointer"
            onClick={onClose}
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: open ? 0 : -320 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed lg:relative lg:translate-x-0 w-80 bg-gray-900 text-white z-60 flex flex-col ${open ? 'pointer-events-auto' : 'pointer-events-none'} top-0 h-full`}
        style={{ left: 0 }}
        onClick={(e) => e.stopPropagation()}
      >


        {/* Mobile New Chat Button - Only visible on mobile */}
        <div className="lg:hidden p-4 border-b border-gray-700">
          <button className="flex items-center gap-3 w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" onClick={onNewChat} aria-label="Start a new chat">
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Desktop Header - Only visible on desktop */}
        <div className="hidden lg:block p-4 border-b border-gray-700">
          <button className="flex items-center gap-3 w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" onClick={onNewChat} aria-label="Start a new chat">
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 p-0 flex flex-col">
          <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Conversations</h3>
          <div className="space-y-2">
            {safeConversations.map((conv) => (
              <div
                key={conv._id}
                className={`group flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors ${activeConversationId === conv._id ? 'bg-gray-800 border-l-4 border-[#38BDF8]' : ''}`}
                onClick={() => {
                  console.log('Sidebar: Conversation clicked:', conv._id);
                  onSelectConversation && onSelectConversation(conv._id);
                }}
                title={conv.title || 'Untitled'}
                aria-label={`Open conversation: ${conv.title || 'Untitled'}`}
              >
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  {editingId === conv._id ? (
                    <input
                      className="text-sm font-medium truncate bg-gray-800 text-white rounded px-2 py-1 w-full outline-none border border-gray-600"
                      value={editValue}
                      autoFocus
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => handleRenameSubmit(conv)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRenameSubmit(conv);
                        if (e.key === 'Escape') handleRenameCancel();
                      }}
                    />
                  ) : (
                    <p className="text-sm font-medium truncate">{conv.title || 'Untitled'}</p>
                  )}
                  <p className="text-xs text-gray-400">{formatTimestamp(conv.updatedAt)}</p>
                </div>
                <button
                  className="lg:opacity-0 lg:group-hover:opacity-100 opacity-100 p-1 hover:bg-gray-700 rounded transition-all mr-1"
                  aria-label="Rename conversation"
                  onClick={e => { e.stopPropagation(); handleRenameStart(conv); }}
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/gwlusjdu.json"
                    trigger="hover"
                    style={{ width: "25px", height: "25px" }}
                    colors="primary:#ffffff"
                  >
                  </lord-icon>
                </button>
                <button
                  className="lg:opacity-0 lg:group-hover:opacity-100 opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                  aria-label="Delete conversation"
                    onClick={e => { e.stopPropagation(); onDeleteConversation && onDeleteConversation(conv._id); }}
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/skkahier.json"
                    trigger="hover"
                    style={{ width: "25px", height: "25px" }}
                    colors="primary:#ffffff"
                  >
                  </lord-icon>
                </button>
              </div>
            ))}
            </div>
          </div>
        </div>


      </motion.div>
    </>
  );
};

export default Sidebar;