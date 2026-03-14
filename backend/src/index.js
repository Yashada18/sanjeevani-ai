const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ambulanceRoutes = require('./routes/ambulance.routes');
const emergencyRoutes = require('./routes/emergency.routes');
const { initFirebase } = require('./services/notification.service');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(require('cors')());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ert-backend' });
});
app.use('/api/ambulance', ambulanceRoutes);
app.use('/api/emergency', emergencyRoutes);

// WebSocket - live GPS tracking
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('ambulance:location', (data) => {
    console.log('GPS update:', data);
    io.emit('ambulance:update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    initFirebase();
  })
  .catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ERT backend running on port ${PORT}`);
});

module.exports = { app, io };