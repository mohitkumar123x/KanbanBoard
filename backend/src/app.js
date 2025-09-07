
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const taskRoutes = require('./routes/tasks');

const logger = require('./config/logger');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const rateLimit = require('express-rate-limit');
// const Redis = require('ioredis');
// const redis = new Redis(process.env.REDIS_URL);


const app = express();

app.use(cors());
app.use(express.json());

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
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Kanban Board Backend API. Visit /api-docs for documentation.' });
});

app.use((err, req, res, next) => {
  logger.error(`Server error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
}));

// app.get('/boards/:boardId', async (req, res, next) => {
//   const cacheKey = `board:${req.params.boardId}:${req.user.tenantId}`;
//   const cached = await redis.get(cacheKey);
//   if (cached) return res.json(JSON.parse(cached));

//   // Proceed with DB query
//   const board = await Board.findOne({ _id: req.params.boardId, tenantId: req.user.tenantId });
//   await redis.setex(cacheKey, 3600, JSON.stringify(board)); // Cache for 1 hour
//   res.json(board);
// });

app.use('/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api', taskRoutes);

module.exports = app;
