/**
 * Main Express application entry point for the AI Chatbot backend.
 * Sets up security, CORS, logging, API docs, routes, and error handling.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import firebaseAuth from '../middleware/firebaseAuth.js';
import chatRoutes from '../routes/chat.js';
import morgan from 'morgan';
import helmet from 'helmet';
import { connectToMongoDB, healthCheck } from '../mongodb/config.js';
import logger from '../utils/logger.js';
// Swagger/OpenAPI setup
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('../swagger.json');

// Initialize Express app
const app = express();

// --- Security Middleware ---
// Add HTTP headers for security best practices
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// --- CORS Configuration ---
// Restrict allowed origins for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://localhost:5174', // Added for Vite dev server
      // Add your production domains here
      process.env.FRONTEND_URL,
      process.env.ALLOWED_ORIGIN_1,
      process.env.ALLOWED_ORIGIN_2
    ].filter(Boolean); // Remove undefined values
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// --- Body Parsing Middleware ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Logging Middleware ---
// Custom request logging
app.use(logger.logRequest.bind(logger));
// HTTP error logging with Morgan
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400, // Only log errors
  stream: {
    write: (message) => {
      logger.info('HTTP Request', { message: message.trim() });
    }
  }
}));

// --- API Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Database Connection ---
connectToMongoDB()
  .then(() => {
    logger.info('MongoDB connection established');
    console.log('✅ MongoDB connection established');
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', { error: err.message });
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// --- Root Endpoint ---
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed', { ip: req.ip });
  res.json({
    message: 'AI Chatbot Backend is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// --- Health Check Endpoint ---
app.get('/api/health', async (req, res) => {
  try {
    const health = await healthCheck();
    logger.info('Health check performed', { status: 'healthy' });
    res.json({
      ...health,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// --- Example Protected Route (for Firebase Auth) ---
app.get('/api/protected', firebaseAuth, (req, res) => {
  logger.info('Protected route accessed', { userId: req.user.uid });
  res.json({ 
    message: 'You are authenticated with Firebase!', 
    userId: req.user.uid,
    timestamp: new Date().toISOString()
  });
});

// --- Main Chat API Routes ---
app.use('/api/chat', chatRoutes);

// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
  logger.logError(err, req);
  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    logger.logSecurityEvent('CORS violation', {
      origin: req.headers.origin,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed',
      timestamp: new Date().toISOString()
    });
  }
  // Default error response
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    timestamp: new Date().toISOString()
  });
});

// --- 404 Handler (Catch All Unmatched Routes) ---
app.use((req, res) => {
  logger.warn('404 Not Found', { 
    url: req.originalUrl, 
    method: req.method,
    ip: req.ip 
  });
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info('Server started', { 
    port: PORT, 
    environment: process.env.NODE_ENV || 'development' 
  });
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
}); 