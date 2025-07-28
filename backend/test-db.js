import { connectToMongoDB, disconnectFromMongoDB, healthCheck } from './mongodb/config.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';

// Test MongoDB connection
async function testConnection() {
  try {
    console.log('🧪 Starting MongoDB integration tests...');
    
    // Connect to MongoDB using the new configuration
    await connectToMongoDB();
    
    // Run health check
    const health = await healthCheck();
    console.log('🏥 Health check result:', health);
    
    // Test creating a conversation
    const testConversation = new Conversation({
      firebaseUserId: 'test-user-123',
      title: 'Test Conversation',
    });
    await testConversation.save();
    console.log('✅ Test conversation created:', testConversation._id);
    
    // Test creating messages
    const testUserMessage = new Message({
      conversationId: testConversation._id,
      sender: 'user',
      text: 'Hello, this is a test message',
    });
    await testUserMessage.save();
    console.log('✅ Test user message created:', testUserMessage._id);
    
    const testAiMessage = new Message({
      conversationId: testConversation._id,
      sender: 'ai',
      text: 'Hello! This is a test AI response.',
    });
    await testAiMessage.save();
    console.log('✅ Test AI message created:', testAiMessage._id);
    
    // Test fetching conversations
    const conversations = await Conversation.find({ firebaseUserId: 'test-user-123' });
    console.log('✅ Found conversations:', conversations.length);
    
    // Test fetching messages
    const messages = await Message.find({ conversationId: testConversation._id });
    console.log('✅ Found messages:', messages.length);
    
    // Clean up test data
    await Message.deleteMany({ conversationId: testConversation._id });
    await testConversation.deleteOne();
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 All MongoDB tests passed!');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
  } finally {
    await disconnectFromMongoDB();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testConnection(); 