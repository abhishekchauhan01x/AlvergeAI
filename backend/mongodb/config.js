/**
 * MongoDB configuration and connection utilities for the AI Chatbot backend.
 * Handles connection, health checks, graceful shutdown, and event logging.
 */
import mongoose from 'mongoose';
import 'dotenv/config';

// MongoDB Configuration
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alvergeai';

// Always force the database name to 'alvergeai'
if (!MONGODB_URI.includes('/alvergeai')) {
  if (MONGODB_URI.endsWith('/')) {
    MONGODB_URI += 'alvergeai';
  } else {
    MONGODB_URI += '/alvergeai';
  }
}

// MongoDB Connection Options
const mongoOptions = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000, // Timeout for socket operations
  bufferCommands: false, // Disable mongoose buffering
  autoIndex: true, // Build indexes
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

// Connection state tracking
let isConnected = false;
let connectionPromise = null;

// MongoDB Connection Function
export const connectToMongoDB = async () => {
  try {
    // If already connected, return existing connection
    if (isConnected && mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected');
      return mongoose.connection;
    }

    // If connection is in progress, wait for it
    if (connectionPromise) {
      console.log('⏳ MongoDB connection in progress, waiting...');
      return await connectionPromise;
    }

    console.log('🔌 Connecting to MongoDB:', MONGODB_URI);
    
    // Create connection promise
    connectionPromise = mongoose.connect(MONGODB_URI, mongoOptions);
    
    const connection = await connectionPromise;
    
    isConnected = true;
    console.log('✅ Successfully connected to MongoDB');
    console.log('📊 Database:', connection.connection.db.databaseName);
    console.log('🌐 Host:', connection.connection.host);
    console.log('🔢 Port:', connection.connection.port);
    
    // Reset connection promise
    connectionPromise = null;
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    isConnected = false;
    connectionPromise = null;
    throw error;
  }
};

// Disconnect from MongoDB
export const disconnectFromMongoDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      isConnected = false;
      console.log('🔌 Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
    throw error;
  }
};

// Get connection status
export const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    isConnected: mongoose.connection.readyState === 1,
    state: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState
  };
};

// Health check function
export const healthCheck = async () => {
  try {
    const status = getConnectionStatus();
    
    if (!status.isConnected) {
      return {
        status: 'error',
        message: 'MongoDB not connected',
        details: status
      };
    }
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    return {
      status: 'healthy',
      message: 'MongoDB connection is healthy',
      details: {
        ...status,
        collections: collections.length,
        database: db.databaseName
      }
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'MongoDB health check failed',
      error: error.message
    };
  }
};

// Graceful shutdown handler
export const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  try {
    await disconnectFromMongoDB();
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('🎉 MongoDB connected successfully');
  isConnected = true;
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
  isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
  isConnected = true;
});

// Handle process termination
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Export configuration
export const mongoConfig = {
  uri: MONGODB_URI,
  options: mongoOptions,
  isConnected: () => isConnected,
  getConnectionStatus,
  healthCheck,
  connect: connectToMongoDB,
  disconnect: disconnectFromMongoDB,
  gracefulShutdown
};

export default mongoConfig; 