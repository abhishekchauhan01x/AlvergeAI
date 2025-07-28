import fs from 'fs';
import path from 'path';

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Log colors for console output
const LOG_COLORS = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[35m', // Magenta
  RESET: '\x1b[0m'   // Reset
};

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getLogFileName(level) {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `${level.toLowerCase()}-${date}.log`);
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    return JSON.stringify(logEntry) + '\n';
  }

  writeToFile(level, message, meta = {}) {
    try {
      const logFile = this.getLogFileName(level);
      const logEntry = this.formatMessage(level, message, meta);
      
      fs.appendFileSync(logFile, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  log(level, message, meta = {}) {
    const color = LOG_COLORS[level] || LOG_COLORS.INFO;
    const reset = LOG_COLORS.RESET;
    
    // Console output
    console.log(`${color}[${level}]${reset} ${message}`);
    
    // File output
    this.writeToFile(level, message, meta);
  }

  error(message, meta = {}) {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }

  warn(message, meta = {}) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  info(message, meta = {}) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LOG_LEVELS.DEBUG, message, meta);
    }
  }

  // Request logging
  logRequest(req, res, next) {
    const start = Date.now();
    const logger = this; // Capture the logger instance
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        userId: req.user?.uid || 'anonymous'
      };

      if (res.statusCode >= 400) {
        logger.error(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, logData);
      } else {
        logger.info(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, logData);
      }
    });

    next();
  }

  // Error logging with stack trace
  logError(error, req = null) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    };

    if (req) {
      errorData.request = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        ip: req.ip || req.connection.remoteAddress,
        userId: req.user?.uid || 'anonymous'
      };
    }

    this.error('Application Error', errorData);
  }

  // Security event logging
  logSecurityEvent(event, details = {}) {
    const securityData = {
      event,
      timestamp: new Date().toISOString(),
      ...details
    };

    this.warn(`Security Event: ${event}`, securityData);
  }

  // Performance logging
  logPerformance(operation, duration, meta = {}) {
    const performanceData = {
      operation,
      duration: `${duration}ms`,
      ...meta
    };

    if (duration > 1000) {
      this.warn(`Slow operation: ${operation}`, performanceData);
    } else {
      this.debug(`Performance: ${operation}`, performanceData);
    }
  }

  // Database operation logging
  logDatabaseOperation(operation, collection, duration, success = true) {
    const dbData = {
      operation,
      collection,
      duration: `${duration}ms`,
      success
    };

    if (!success) {
      this.error(`Database operation failed: ${operation}`, dbData);
    } else if (duration > 500) {
      this.warn(`Slow database operation: ${operation}`, dbData);
    } else {
      this.debug(`Database operation: ${operation}`, dbData);
    }
  }

  // API usage logging
  logApiUsage(endpoint, userId, success = true) {
    const apiData = {
      endpoint,
      userId,
      success,
      timestamp: new Date().toISOString()
    };

    this.info(`API Usage: ${endpoint}`, apiData);
  }

  // Get log statistics
  getLogStats() {
    try {
      const stats = {
        totalFiles: 0,
        totalSize: 0,
        errorCount: 0,
        warnCount: 0,
        infoCount: 0
      };

      if (fs.existsSync(this.logDir)) {
        const files = fs.readdirSync(this.logDir);
        stats.totalFiles = files.length;

        files.forEach(file => {
          const filePath = path.join(this.logDir, file);
          const stats = fs.statSync(filePath);
          stats.totalSize += stats.size;

          // Count log entries by level
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n').filter(line => line.trim());
          
          lines.forEach(line => {
            try {
              const logEntry = JSON.parse(line);
              switch (logEntry.level) {
                case 'ERROR':
                  stats.errorCount++;
                  break;
                case 'WARN':
                  stats.warnCount++;
                  break;
                case 'INFO':
                  stats.infoCount++;
                  break;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          });
        });
      }

      return stats;
    } catch (error) {
      this.error('Failed to get log statistics', { error: error.message });
      return null;
    }
  }

  // Clean old log files (keep last 30 days)
  cleanOldLogs() {
    try {
      const files = fs.readdirSync(this.logDir);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < thirtyDaysAgo) {
          fs.unlinkSync(filePath);
          this.info(`Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      this.error('Failed to clean old logs', { error: error.message });
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Clean old logs on startup
logger.cleanOldLogs();

export default logger; 