# MongoDB Integration

This directory contains the MongoDB configuration and integration for the AI Chatbot backend.

## 📁 File Structure

```
backend/mongodb/
├── config.js          # Main MongoDB configuration and connection management
└── README.md          # This documentation file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/chatbot

# Alternative: MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot

# Groq API Key (for AI responses)
GROQ_API_KEY=your_groq_api_key_here

# Server Port
PORT=3000
```

### Connection Options

The MongoDB configuration includes optimized connection options:

- **Connection Pool**: Maximum 10 connections
- **Timeouts**: 5s server selection, 45s socket operations
- **Buffering**: Disabled for better performance
- **Auto-indexing**: Enabled for optimal query performance
- **IPv4**: Preferred over IPv6 for better compatibility

## 🚀 Usage

### Basic Connection

```javascript
import { connectToMongoDB, disconnectFromMongoDB } from '../mongodb/config.js';

// Connect to MongoDB
await connectToMongoDB();

// Disconnect when done
await disconnectFromMongoDB();
```

### Health Check

```javascript
import { healthCheck } from '../mongodb/config.js';

// Check database health
const health = await healthCheck();
console.log(health);
// Output: { status: 'healthy', message: 'MongoDB connection is healthy', details: {...} }
```

### Connection Status

```javascript
import { getConnectionStatus } from '../mongodb/config.js';

// Get current connection status
const status = getConnectionStatus();
console.log(status);
// Output: { isConnected: true, state: 'connected', readyState: 1 }
```

## 📊 Database Schema

### Conversations Collection

```javascript
{
  _id: ObjectId,
  firebaseUserId: String,    // Firebase user ID (indexed)
  title: String,             // Conversation title
  sessionId: String,         // Unique session identifier
  messages: [ObjectId],      // Array of message IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection

```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,  // Reference to conversation (indexed)
  sender: String,            // 'user' or 'ai'
  text: String,              // Message content
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 API Endpoints

### Chat Management

- `POST /api/chat/` - Create new conversation
- `GET /api/chat/` - Get all conversations for user
- `GET /api/chat/:id` - Get messages for specific conversation
- `POST /api/chat/send` - Send message and get AI response
- `DELETE /api/chat/:id` - Delete conversation and all messages
- `PATCH /api/chat/:id` - Rename conversation

### Health & Status

- `GET /api/health` - Database health check
- `GET /` - Server status

## 🧪 Testing

### Run Database Tests

```bash
cd backend
node test-db.js
```

### Test Health Endpoint

```bash
curl http://localhost:3000/api/health
```

## 🔍 Monitoring

### Connection Events

The configuration automatically logs:

- ✅ Connection established
- ❌ Connection errors
- 🔌 Disconnection events
- 🔄 Reconnection events

### Health Monitoring

The health check endpoint provides:

- Connection status
- Database information
- Collection count
- Error details (if any)

## 🛡️ Security Features

- **User Isolation**: Each user only sees their own conversations
- **Firebase Authentication**: Secure user verification
- **Input Validation**: All inputs are validated and sanitized
- **Error Handling**: Comprehensive error handling and logging

## 🚨 Error Handling

### Common Issues

1. **Connection Failed**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity

2. **Authentication Failed**
   - Verify Firebase configuration
   - Check user authentication status

3. **Database Operations Failed**
   - Check MongoDB logs
   - Verify database permissions
   - Check disk space

### Debug Mode

Enable detailed logging by setting:

```javascript
// In your application
process.env.DEBUG = 'mongodb:*';
```

## 📈 Performance Optimization

### Indexes

The following indexes are automatically created:

- `firebaseUserId` on conversations collection
- `conversationId` on messages collection
- `createdAt` timestamps for efficient sorting

### Connection Pooling

- Maximum 10 concurrent connections
- Automatic connection recycling
- Idle connection cleanup

### Query Optimization

- Lean queries for read operations
- Selective field projection
- Efficient pagination support

## 🔧 Maintenance

### Backup

```bash
# Backup conversations
mongodump --db chatbot --collection conversations

# Backup messages
mongodump --db chatbot --collection messages
```

### Cleanup

```bash
# Remove old conversations (older than 30 days)
db.conversations.deleteMany({
  updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
})
```

## 📝 Logs

All MongoDB operations are logged with:

- Operation type (create, read, update, delete)
- User ID for security tracking
- Timestamp for debugging
- Success/failure status
- Error details (if applicable)

## 🎯 Best Practices

1. **Always use connection pooling**
2. **Handle disconnections gracefully**
3. **Validate all inputs**
4. **Use indexes for frequent queries**
5. **Monitor connection health**
6. **Implement proper error handling**
7. **Regular database backups**
8. **Clean up old data periodically** 