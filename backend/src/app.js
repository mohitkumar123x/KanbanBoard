const express = require('express');
const mongoose = require('mongoose');
const logger = require('./config/logger');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const rateLimit = require('express-rate-limit');

const app = express();

// Enable trust proxy for Render's reverse proxy
app.set('trust proxy', true);

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting with IPv6-safe key generation
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  keyGenerator: (req, res) => {
    return rateLimit.ipKeyGenerator(req); // Use helper for IPv6 normalization
  },
  // Optional: Skip localhost if needed (less relevant on Render)
  skip: (req) => req.ip === '127.0.0.1'
});
app.use(limiter);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Swagger configuration with debug
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kanban Board API',
      version: '1.0.0',
      description: 'API for Kanban board application with authentication'
    },
    servers: [
      { url: 'https://kanbanboard-e4w.onrender.com/api', description: 'Production server' },
      { url: 'http://localhost:5000/api', description: 'Local server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // Absolute path to ensure correct resolution
  apis: [__dirname + '/routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
console.log('Swagger paths:', JSON.stringify(swaggerDocs.paths, null, 2)); // Debug log
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Kanban Board Backend API. Visit /api-docs for documentation.' });
});

// Load routes AFTER Swagger initialization
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const taskRoutes = require('./routes/tasks');

// Mount routes with consistent prefixes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Server error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;