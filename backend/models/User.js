/**
 * User Mongoose model
 * Represents a registered user with Firebase authentication.
 */
import mongoose from 'mongoose';

// User schema definition
const userSchema = new mongoose.Schema({
  firebaseUserId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'users' });

export default mongoose.model('User', userSchema); 