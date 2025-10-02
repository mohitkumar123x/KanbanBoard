const winston = require('winston');
const path = require('path');
 
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs to backend.log
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/backend.log')
    }),
    // Write errors to errors.log
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/errors.log'),
      level: 'error'
    }),
    // Also log to console in development
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
 
module.exports = logger;