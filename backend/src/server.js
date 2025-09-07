
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();
const socketIO = require('socket.io');



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);
//   socket.on('taskMoved', (data) => {
//     socket.broadcast.emit('taskMoved', data);
//   });
// });

// server.js
io.on('connection', (socket) => {
  socket.on('error', (err) => logger.error(`Socket error: ${err.message}`)); // Error logging
  socket.on('joinRoom', (tenantId) => {
    socket.join(tenantId);
    logger.info(`User joined room ${tenantId}`);
  });
  socket.on('taskUpdate', ({ boardId, task, tenantId }) => {
    io.to(tenantId).emit('taskUpdated', { boardId, task });
    logger.info(`Task updated broadcast for ${boardId}, tenant ${tenantId}`);
  });
});

// const server = http.createServer(app);
// const io = socketIO(server);

// io.on('connection', (socket) => {
//   socket.on('joinRoom', (tenantId) => socket.join(tenantId)); // Room per tenant
//   socket.on('taskUpdate', ({ boardId, task }) => io.to(tenantId).emit('taskUpdated', { boardId, task }));
// });

// server.listen(3000, () => logger.info('Server running on port 3000 with WebSocket'));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
