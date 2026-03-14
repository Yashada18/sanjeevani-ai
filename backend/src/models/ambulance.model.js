const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  ambulanceId: { type: String, required: true, unique: true },
  driverName: { type: String, required: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'on_call', 'returning'], 
    default: 'available' 
  },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });

module.exports = mongoose.model('Ambulance', ambulanceSchema);