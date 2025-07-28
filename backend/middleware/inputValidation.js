/**
 * Input validation and sanitization middleware for Express routes.
 * Provides reusable validators for chat messages, conversations, and generic input.
 */
import { body, validationResult } from 'express-validator';

/**
 * Middleware to sanitize all string inputs in body, query, and params.
 * Removes HTML tags, scripts, and dangerous patterns.
 */
export const sanitizeInput = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove HTML tags and dangerous characters
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
          .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .trim();
      }
    });
  }

  // Sanitize URL parameters
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key]
          .replace(/[^a-zA-Z0-9-_]/g, '') // Only allow alphanumeric, hyphens, and underscores
          .trim();
      }
    });
  }

  next();
};

/**
 * Validation rules for chat message input.
 * Ensures text is a string, proper length, and free of dangerous content.
 */
export const validateChatMessage = [
  body('text')
    .isString()
    .withMessage('Message text must be a string')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
    .trim()
    .escape()
    .custom((value) => {
      // Check for potentially dangerous content
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(value)) {
          throw new Error('Message contains potentially dangerous content');
        }
      }
      
      return true;
    }),
  
  body('conversationId')
    .optional()
    .isMongoId()
    .withMessage('Invalid conversation ID format'),
];

/**
 * Validation rules for conversation creation input.
 * Ensures title is a string and proper length.
 */
export const validateConversation = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .trim()
    .escape(),
];

/**
 * Validation rules for conversation update input.
 * Ensures title is a string, proper length, and safe.
 */
export const validateConversationUpdate = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .trim()
    .escape()
    .custom((value) => {
      // Check for potentially dangerous content
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(value)) {
          throw new Error('Title contains potentially dangerous content');
        }
      }
      
      return true;
    }),
];

/**
 * Middleware to handle validation errors and return a formatted response.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Invalid input data',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      })),
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

/**
 * Middleware to validate Content-Type header for JSON requests.
 */
export const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Invalid content type',
        message: 'Content-Type must be application/json',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  next();
};

/**
 * Middleware to validate request size (max 10MB).
 */
export const validateRequestSize = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'], 10);
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength && contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request too large',
      message: 'Request body exceeds maximum size limit of 10MB',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

/**
 * Middleware to validate User-Agent header and block bots/crawlers.
 */
export const validateUserAgent = (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  
  if (!userAgent) {
    return res.status(400).json({
      error: 'Missing user agent',
      message: 'User-Agent header is required',
      timestamp: new Date().toISOString()
    });
  }
  
  // Block suspicious user agents
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Automated requests are not allowed',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  next();
}; 