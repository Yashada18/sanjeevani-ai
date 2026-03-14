const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  ambulanceId: { type: String, required: true },
  patientName: { type: String },
  emergencyType: { 
    type: String, 
    enum: ['accident', 'heart_attack', 'stroke', 'other'],
    required: true 
  },
  origin: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  destination: {
    hospitalId: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  eta: { type: Number },
  route: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Emergency', emergencySchema);