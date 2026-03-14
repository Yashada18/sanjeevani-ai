const express = require('express');
const router = express.Router();
const Emergency = require('../models/emergency.model');
const { calculateRoute } = require('../services/route.service');
const { alertHospital } = require('../services/hospital.service');

// Start new emergency
router.post('/start', async (req, res) => {
  try {
    const { ambulanceId, emergencyType, origin, destination, patientName } = req.body;

    // Calculate route
    const route = await calculateRoute(origin, destination);

    // Save emergency to DB
    const emergency = new Emergency({
      ambulanceId,
      emergencyType,
      patientName,
      origin,
      destination,
      eta: route.eta_seconds,
      route,
      status: 'active'
    });
    await emergency.save();

    // Alert hospital
    await alertHospital(destination.hospitalId, {
      eta: route.eta_seconds,
      emergencyType,
      origin
    });

    res.status(201).json({ success: true, emergency, route });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get active emergencies
router.get('/active', async (req, res) => {
  try {
    const emergencies = await Emergency.find({ status: 'active' });
    res.json({ success: true, emergencies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Complete emergency
router.patch('/:id/complete', async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    res.json({ success: true, emergency });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;