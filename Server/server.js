const http = require("http");
const app = require("./app");
const dotenv = require("dotenv");
const socketIo = require('socket.io');

dotenv.config();

const PORT = process.env.PORT || 5000;
const LINK = `http://localhost:${PORT}/`;
const server = http.createServer(app);


const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],        // Allowed methods
    credentials: true                // Allow credentials (cookies, etc.)
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('message', (message) => {
    io.to(message.conversationId).emit('message', message);
    console.log(`User ${socket.id} sent message in conversation ${message.conversationId}: ${message.content}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} link ${LINK}`);
});
