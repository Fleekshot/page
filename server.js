const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve our public files
app.use(express.static(path.join(__dirname, 'public')));

// Let y-websocket handle upgrades
wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 HTTP + WS listening on port ${PORT}`)
);
