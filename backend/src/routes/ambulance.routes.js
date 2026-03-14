const express = require('express');
const router = express.Router();
const Ambulance = require('../models/ambulance.model');

// Register new ambulance
router.post('/register', async (req, res) => {
  try {
    const ambulance = new Ambulance(req.body);
    await ambulance.save();
    res.status(201).json({ success: true, ambulance });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get all ambulances
router.get('/', async (req, res) => {
  try {
    const ambulances = await Ambulance.find();
    res.json({ success: true, ambulances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update ambulance location
router.patch('/:ambulanceId/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const ambulance = await Ambulance.findOneAndUpdate(
      { ambulanceId: req.params.ambulanceId },
      { 
        currentLocation: { lat, lng, updatedAt: new Date() },
        status: 'on_call'
      },
      { new: true }
    );
    if (!ambulance) return res.status(404).json({ error: 'Ambulance not found' });
    res.json({ success: true, ambulance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;