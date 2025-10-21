const express = require('express');
const mongoose = require('mongoose');
const logger = require('./config/logger');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const rateLimit = require('express-rate-limit');

const app = express();

// Enable trust proxy FIRST
app.set('trust proxy', 1);

// CRITICAL: Apply CORS as the very first middleware (before anything else)
const allowedOrigins = [

  'https://kanbanboard-e4w6.onrender.com',
  
];

// Simplified CORS - allow all during preflight, then check on actual request
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("origin-->",origin)
  // Set CORS headers for all requests
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow requests with no origin (Postman, curl, server-to-server)
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Now apply express.json() and other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Rate limiting (after CORS to avoid blocking preflight)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  },
  skip: (req) => {
    // Skip OPTIONS requests and health checks from rate limiting
    return req.method === 'OPTIONS' || req.path === '/health' || req.path === '/';
  }
});
app.use(limiter);

// Logging middleware (after rate limiter)
app.use((req, res, next) => {
  const origin = req.get('Origin') || 'No Origin';
  logger.info(`${req.method} ${req.url} - Origin: ${origin} - IP: ${req.ip}`);
  next();
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kanban Board API',
      version: '1.0.0',
      description: 'API for Kanban board application with authentication'
    },
    servers: [
      { url: 'https://kanbanboard-e4w6.onrender.com/api', description: 'Production server' },
      // { url: 'http://localhost:5000/api', description: 'Local server' }
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
  apis: [__dirname + '/routes/*.js']
};

try {
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  const pathCount = Object.keys(swaggerDocs.paths || {}).length;
  console.log(`✓ Swagger initialized with ${pathCount} paths`);

  // ✅ Swagger UI with forced HTTPS API URL
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
        // Ensure Swagger "Try it out" calls your Render HTTPS URL
        url: 'https://kanbanboard-e4w6.onrender.com/api'
      }
    })
  );
} catch (error) {
  console.error('Swagger initialization failed:', error.message);
  // Continue without Swagger if it fails
}

// Health check endpoint (BEFORE routes, for Render health checks)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Kanban Board Backend API',
    docs: '/api-docs',
    health: '/health',
    status: 'running'
  });
});

// Load and mount routes with error handling
try {
  const authRoutes = require('./routes/auth');
  const boardRoutes = require('./routes/boards');
  const taskRoutes = require('./routes/tasks');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/boards', boardRoutes);
  app.use('/api/tasks', taskRoutes);
  
  console.log('✓ Routes loaded successfully');
} catch (error) {
  console.error('Failed to load routes:', error.message);
  logger.error('Route loading error:', error);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    url: req.url,
    method: req.method,
    origin: req.get('Origin')
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Generic error response
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;