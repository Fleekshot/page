const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory document content
let documentContent = '';

// Apply an operation to the document string
function applyOp(doc, { index, removed, inserted }) {
  return doc.slice(0, index)
       + inserted
       + doc.slice(index + removed);
}

// Serve static files
app.use(express.static('public'));

io.on('connection', socket => {
  console.log('👤 user connected:', socket.id);

  // Send full doc to newcomers
  socket.emit('init', documentContent);

  // Handle granular edit ops
  socket.on('operation', op => {
    // update server state
    documentContent = applyOp(documentContent, op);
    // broadcast the same op to everyone else
    socket.broadcast.emit('operation', op);
  });

  socket.on('disconnect', () => {
    console.log('🚪 user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server listening on port ${PORT}`)
);
