const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory document content
let documentContent = '';

// Serve static files
app.use(express.static('public'));

io.on('connection', socket => {
  console.log('👤 user connected:', socket.id);

  // Send current document to newcomer
  socket.emit('init', documentContent);

  // When someone edits, update server and broadcast
  socket.on('edit', newContent => {
    documentContent = newContent;
    socket.broadcast.emit('update', newContent);
  });

  socket.on('disconnect', () => {
    console.log('🚪 user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});