const express = require('express');
const router = express.Router();

// Mock appointments data
const appointments = [];

// Get all appointments
router.get('/', (req, res) => {
  try {
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Create appointment
router.post('/', (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason } = req.body;
    
    // Validate required fields
    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({ error: 'Patient ID, doctor ID, date, and time are required' });
    }
    
    const appointment = {
      id: appointments.length + 1,
      patientId,
      doctorId,
      date,
      time,
      reason,
      status: 'scheduled',
      createdAt: new Date()
    };

    appointments.push(appointment);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

module.exports = router; 