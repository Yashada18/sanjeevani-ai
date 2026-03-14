const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  fcmToken: { type: String },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date, default: Date.now }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);