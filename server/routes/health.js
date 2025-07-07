const express = require('express');
const router = express.Router();

// Get health metrics
router.get('/metrics', (req, res) => {
  try {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ error: 'Failed to fetch health metrics' });
  }
});

// Health check endpoint
router.get('/check', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = router; 