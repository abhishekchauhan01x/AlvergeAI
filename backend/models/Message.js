/**
 * Message Mongoose model
 * Represents a single message in a conversation (user or AI).
 */
import mongoose from 'mongoose';

// Message schema definition
const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true, collection: 'messages' });

export default mongoose.model('Message', messageSchema); 