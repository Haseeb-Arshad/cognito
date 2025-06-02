/**
 * Logger utility for consistent logging across the application
 */

// Log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Colors for console output
const colors = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m',  // Reset
};

// Get environment-based log level
const getMinLogLevel = (): LogLevel => {
  const env = process.env.NODE_ENV || 'development';
  const logLevel = process.env.LOG_LEVEL;
  
  if (logLevel) {
    return logLevel as LogLevel;
  }
  
  // Default log levels based on environment
  if (env === 'production') return 'info';
  if (env === 'test') return 'warn';
  return 'debug'; // Development default
};

// Should this level be logged?
const shouldLog = (level: LogLevel): boolean => {
  const minLevel = getMinLogLevel();
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  
  return levels.indexOf(level) >= levels.indexOf(minLevel);
};

// Format the log message
const formatMessage = (level: LogLevel, message: string, context?: any): string => {
  const timestamp = new Date().toISOString();
  let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (context) {
    try {
      formattedMessage += ` ${JSON.stringify(context)}`;
    } catch (e) {
      formattedMessage += ` [Unstringifiable context]`;
    }
  }
  
  return formattedMessage;
};

// Core logging function
const log = (level: LogLevel, message: string, context?: any) => {
  if (!shouldLog(level)) return;
  
  const formattedMessage = formatMessage(level, message, context);
  
  // Use appropriate console method
  switch (level) {
    case 'debug':
      console.debug(`${colors.debug}${formattedMessage}${colors.reset}`);
      break;
    case 'info':
      console.info(`${colors.info}${formattedMessage}${colors.reset}`);
      break;
    case 'warn':
      console.warn(`${colors.warn}${formattedMessage}${colors.reset}`);
      break;
    case 'error':
      console.error(`${colors.error}${formattedMessage}${colors.reset}`);
      break;
  }
};

// Public API
export const logger = {
  debug: (message: string, context?: any) => log('debug', message, context),
  info: (message: string, context?: any) => log('info', message, context),
  warn: (message: string, context?: any) => log('warn', message, context),
  error: (message: string, context?: any) => log('error', message, context),
};
