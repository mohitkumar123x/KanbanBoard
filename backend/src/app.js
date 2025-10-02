// const express = require('express');
// const mongoose = require('mongoose');
// const logger = require('./config/logger');
// const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
// const rateLimit = require('express-rate-limit');

// const app = express();

// // Enable trust proxy for Render's reverse proxy
// app.set('trust proxy', true);

// // Middleware
// app.use(cors());
// const corsOptions = {
//   origin: (origin, callback) => {
//     // Allow requests with no origin (like curl or Postman)
//     if (!origin) return callback(null, true);

//     // In Render, your API and Swagger UI share the same domain
//     // Allow the requesting origin dynamically
//     callback(null, true);
//   },
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// // Rate limiting with IPv6-safe key generation
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   keyGenerator: (req, res) => {
//     return rateLimit.ipKeyGenerator(req); // Use helper for IPv6 normalization
//   },
//   // Optional: Skip localhost if needed (less relevant on Render)
//   skip: (req) => req.ip === '127.0.0.1'
// });
// app.use(limiter);

// // Logging middleware
// app.use((req, res, next) => {
//   logger.info(`${req.method} ${req.url}`);
//   next();
// });

// // Swagger configuration with debug
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Kanban Board API',
//       version: '1.0.0',
//       description: 'API for Kanban board application with authentication'
//     },
//     servers: [
//       { url: 'https://kanbanboard-e4w.onrender.com/api', description: 'Production server' },
//       { url: 'http://localhost:5000/api', description: 'Local server' }
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT'
//         }
//       }
//     }
//   },
//   // Absolute path to ensure correct resolution
//   apis: [__dirname + '/routes/*.js']
// };

// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// console.log('Swagger paths:', JSON.stringify(swaggerDocs.paths, null, 2)); // Debug log
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// // Root route
// app.get('/', (req, res) => {
//   res.json({ message: 'Kanban Board Backend API. Visit /api-docs for documentation.' });
// });

// // Load routes AFTER Swagger initialization
// const authRoutes = require('./routes/auth');
// const boardRoutes = require('./routes/boards');
// const taskRoutes = require('./routes/tasks');

// // Mount routes with consistent prefixes
// app.use('/api/auth', authRoutes);
// app.use('/api/boards', boardRoutes);
// app.use('/api/tasks', taskRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   logger.error(`Server error: ${err.message}`);
//   res.status(500).json({ error: 'Internal server error' });
// });

// module.exports = app;

// app.js


// app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit');

dotenv.config();
connectDB();

const app = express();

// Trust Render's reverse proxy so req.ip and headers are correct
app.set('trust proxy', true);

// Body parser
app.use(express.json());

// CORS (dynamic - allows curl/postman/no-origin + any browser origin)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow no-origin (curl/postman)
    return callback(null, true); // allow all origins dynamically (adjust if you want whitelist)
  },
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting (IPv6-safe key generator fallback)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  keyGenerator: (req) => {
    try {
      // use helper if available in this version of express-rate-limit
      return rateLimit && typeof rateLimit.ipKeyGenerator === 'function'
        ? rateLimit.ipKeyGenerator(req)
        : req.ip;
    } catch (e) {
      return req.ip;
    }
  },
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1'
});
app.use(limiter);

// Simple request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Swagger configuration (use BASE_URL env in Render, fallback to localhost)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kanban Board API',
      version: '1.0.0',
      description: 'API for Kanban board application with authentication'
    },
    servers: [
      { url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}` }
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

const swaggerDocs = swaggerJsdoc(swaggerOptions);
console.log('Swagger paths:', JSON.stringify(swaggerDocs.paths || {}, null, 2));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root / health check
app.get('/', (req, res) => res.json({ message: 'Kanban Board Backend API. Visit /api-docs for docs.' }));

// Load and mount routes (after swagger setup)
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Server error: ${err && err.message ? err.message : err}`);
  res.status(err && err.status ? err.status : 500).json({ error: 'Internal server error' });
});

module.exports = app;
