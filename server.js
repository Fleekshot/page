// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
// Pull setupWSConnection from the y-websocket package root
const { setupWSConnection } = require('y-websocket');

const app = express();
const server = http.createServer(app);
// Use ws.Server rather than requiring an internal utils path
const wss = new WebSocket.Server({ server });

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Let y-websocket handle each WebSocket connection
wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 HTTP + WS listening on port ${PORT}`)
);
