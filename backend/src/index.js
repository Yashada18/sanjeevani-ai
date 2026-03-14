const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.json());
app.use(require('cors')());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ert-backend' });
});

// WebSocket - ambulance GPS
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('ambulance:location', (data) => {
    console.log('GPS received:', data);
    io.emit('ambulance:update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ERT backend running on port ${PORT}`);
});

module.exports = { app, io };