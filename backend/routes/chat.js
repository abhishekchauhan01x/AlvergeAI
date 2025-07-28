/**
 * Chat API routes for the AI Chatbot backend.
 * Handles conversation creation, message sending, fetching, and deletion.
 */
import express from 'express';
import firebaseAuth from '../middleware/firebaseAuth.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Groq from "groq-sdk";
import { 
  sanitizeInput, 
  validateChatMessage, 
  validateConversation, 
  validateConversationUpdate,
  handleValidationErrors,
  validateContentType,
  validateRequestSize,
  validateUserAgent
} from '../middleware/inputValidation.js';
import logger from '../utils/logger.js';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * POST /api/chat/
 * Create a new conversation for the authenticated user.
 */
router.post('/', 
  validateUserAgent,
  validateContentType,
  validateRequestSize,
  sanitizeInput,
  firebaseAuth, 
  validateConversation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title } = req.body;
      logger.info('Creating new conversation', { userId: req.user.uid, title });
      // Create and save conversation
      const conversation = new Conversation({
        firebaseUserId: req.user.uid,
        title: title || 'New Conversation',
      });
      const startTime = Date.now();
      await conversation.save();
      const duration = Date.now() - startTime;
      logger.logDatabaseOperation('create', 'conversations', duration, true);
      logger.info('Conversation created successfully', { 
        conversationId: conversation._id, 
        userId: req.user.uid 
      });
      res.status(201).json({ _id: conversation._id, sessionId: conversation.sessionId });
    } catch (err) {
      logger.logError(err, req);
      res.status(500).json({ 
        error: 'Server error',
        message: 'Failed to create conversation',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * GET /api/chat/
 * Get all conversations for the authenticated user.
 */
router.get('/', 
  validateUserAgent,
  firebaseAuth, 
  async (req, res) => {
    try {
      logger.info('Fetching conversations', { userId: req.user.uid });
      // Fetch conversations
      const startTime = Date.now();
      const conversations = await Conversation.find({ firebaseUserId: req.user.uid })
        .sort({ updatedAt: -1 });
      const duration = Date.now() - startTime;
      logger.logDatabaseOperation('find', 'conversations', duration, true);
      logger.info('Conversations fetched successfully', { 
        count: conversations.length, 
        userId: req.user.uid 
      });
      res.json(conversations);
    } catch (err) {
      logger.logError(err, req);
      res.status(500).json({ 
        error: 'Server error',
        message: 'Failed to fetch conversations',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * GET /api/chat/:id
 * Get all messages for a specific conversation.
 */
router.get('/:id', 
  validateUserAgent,
  firebaseAuth, 
  async (req, res) => {
    try {
      const { id } = req.params;
      logger.info('Fetching conversation messages', { 
        conversationId: id, 
        userId: req.user.uid 
      });
      // Fetch conversation and messages
      const startTime = Date.now();
      const conversation = await Conversation.findOne({
        _id: id,
        firebaseUserId: req.user.uid,
      });
      const duration = Date.now() - startTime;
      logger.logDatabaseOperation('findOne', 'conversations', duration, true);
      if (!conversation) {
        logger.warn('Conversation not found', { 
          conversationId: id, 
          userId: req.user.uid 
        });
        return res.status(404).json({ 
          error: 'Not found',
          message: 'Conversation not found',
          timestamp: new Date().toISOString()
        });
      }
      // Fetch messages for this conversation
      const messageStartTime = Date.now();
      const messages = await Message.find({ conversationId: conversation._id })
        .sort({ createdAt: 1 });
      const messageDuration = Date.now() - messageStartTime;
      logger.logDatabaseOperation('find', 'messages', messageDuration, true);
      logger.info('Messages fetched successfully', { 
        conversationId: id, 
        messageCount: messages.length 
      });
      res.json({ messages });
    } catch (err) {
      logger.logError(err, req);
      res.status(500).json({ 
        error: 'Server error',
        message: 'Failed to fetch messages',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * POST /api/chat/send
 * Send a new message and get an AI response.
 */
router.post(
  '/send',
  validateUserAgent,
  validateContentType,
  validateRequestSize,
  sanitizeInput,
  firebaseAuth,
  validateChatMessage,
  handleValidationErrors,
  async (req, res) => {
    const { conversationId, text } = req.body;
    const startTime = Date.now();
    try {
      logger.info('Processing chat message', { 
        userId: req.user.uid, 
        conversationId, 
        textLength: text.length 
      });
      let conversation;
      if (conversationId) {
        // Find existing conversation
        const convStartTime = Date.now();
        conversation = await Conversation.findOne({ 
          _id: conversationId, 
          firebaseUserId: req.user.uid 
        });
        const convDuration = Date.now() - convStartTime;
        logger.logDatabaseOperation('findOne', 'conversations', convDuration, true);
      } else {
        // Create new conversation
        conversation = new Conversation({ 
          firebaseUserId: req.user.uid, 
          title: text.substring(0, 30) 
        });
        const saveStartTime = Date.now();
        await conversation.save();
        const saveDuration = Date.now() - saveStartTime;
        logger.logDatabaseOperation('create', 'conversations', saveDuration, true);
      }
      if (!conversation) {
        logger.warn('Conversation not found for message', { 
          conversationId, 
          userId: req.user.uid 
        });
        return res.status(404).json({ 
          error: 'Not found',
          message: "Conversation not found",
          timestamp: new Date().toISOString()
        });
      }
      // Save user message
      const userMessage = new Message({ 
        conversationId: conversation._id, 
        sender: 'user', 
        text 
      });
      const userMsgStartTime = Date.now();
      await userMessage.save();
      const userMsgDuration = Date.now() - userMsgStartTime;
      logger.logDatabaseOperation('create', 'messages', userMsgDuration, true);
      // Get previous messages for context
      const historyStartTime = Date.now();
      const previousMessages = await Message.find({ conversationId: conversation._id })
        .sort({ createdAt: 1 });
      const historyDuration = Date.now() - historyStartTime;
      logger.logDatabaseOperation('find', 'messages', historyDuration, true);
      const chatHistory = previousMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      // Add system prompt with real-time date, time, and day
      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      chatHistory.unshift({
        role: 'system',
        content: `Today is ${dateString}, and the current time is ${timeString}. Please use this real-time information if needed.`
      });
      chatHistory.push({ role: 'user', content: text });
      // Call Groq AI
      let aiText = 'Sorry, I could not generate a response.';
      const aiStartTime = Date.now();
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama3-8b-8192',
          messages: chatHistory,
          max_tokens: 256,
        });
        aiText = completion.choices[0].message.content.trim();
        const aiDuration = Date.now() - aiStartTime;
        logger.logPerformance('AI response generation', aiDuration, { 
          model: 'llama3-8b-8192',
          tokens: completion.usage?.total_tokens || 0
        });
      } catch (aiError) {
        logger.error('AI service error', { 
          error: aiError.message, 
          userId: req.user.uid 
        });
      }
      // Save AI message
      const aiMessage = new Message({ 
        conversationId: conversation._id, 
        sender: 'ai', 
        text: aiText 
      });
      const aiMsgStartTime = Date.now();
      await aiMessage.save();
      const aiMsgDuration = Date.now() - aiMsgStartTime;
      logger.logDatabaseOperation('create', 'messages', aiMsgDuration, true);
      // Update conversation
      conversation.messages.push(userMessage._id, aiMessage._id);
      const updateStartTime = Date.now();
      await conversation.save();
      const updateDuration = Date.now() - updateStartTime;
      logger.logDatabaseOperation('update', 'conversations', updateDuration, true);
      const totalDuration = Date.now() - startTime;
      logger.logPerformance('Complete chat request', totalDuration, { 
        conversationId: conversation._id,
        userId: req.user.uid
      });
      logger.info('Chat message processed successfully', { 
        conversationId: conversation._id, 
        userId: req.user.uid 
      });
      res.status(201).json({
        userMessage: { ...userMessage.toObject(), sessionId: conversation.sessionId },
        aiMessage: { ...aiMessage.toObject(), sessionId: conversation.sessionId },
        conversation: { _id: conversation._id, sessionId: conversation.sessionId }
      });
    } catch (error) {
      logger.logError(error, req);
      res.status(500).json({ 
        error: 'Server error',
        message: 'Failed to process message',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * PATCH /api/chat/:id
 * Rename a conversation.
 */
router.patch('/:id', firebaseAuth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Invalid title' });
    }
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, firebaseUserId: req.user.uid },
      { title: title.trim() },
      { new: true }
    );
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/chat/:id
 * Delete a conversation and all its messages.
 */
router.delete('/:id', firebaseAuth, async (req, res) => {
  try {
    console.log('Deleting conversation:', req.params.id, 'for user:', req.user.uid);
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      firebaseUserId: req.user.uid,
    });
    if (!conversation) {
      console.log('Conversation not found');
      return res.status(404).json({ message: 'Conversation not found' });
    }
    // Delete all messages associated with this conversation
    const deletedMessages = await Message.deleteMany({ conversationId: conversation._id });
    console.log('Deleted messages:', deletedMessages.deletedCount);
    // Delete the conversation itself
    await conversation.deleteOne();
    console.log('Conversation deleted successfully');
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    console.error('Error deleting conversation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router; 