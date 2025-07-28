/**
 * Conversation Mongoose model
 * Represents a chat session for a user, including title, sessionId, and message references.
 */
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

// Conversation schema definition
const conversationSchema = new mongoose.Schema({
  firebaseUserId: {
    type: String,
    required: true,
    index: true, // Add index for faster queries by user
  },
  title: {
    type: String,
    default: 'New Conversation',
  },
  sessionId: {
    type: String,
    unique: true,
    required: true,
    default: () => nanoid(16),
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
}, { timestamps: true, collection: 'conversations' });

export default mongoose.model('Conversation', conversationSchema); 