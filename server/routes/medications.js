const express = require('express');
const router = express.Router();

// Mock medications data
const medications = [];

// Get all medications
router.get('/', (req, res) => {
  try {
    res.json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

// Add medication
router.post('/', (req, res) => {
  try {
    const { name, dosage, frequency, patientId } = req.body;
    
    // Validate required fields
    if (!name || !dosage || !frequency) {
      return res.status(400).json({ error: 'Name, dosage, and frequency are required' });
    }
    
    const medication = {
      id: medications.length + 1,
      name,
      dosage,
      frequency,
      patientId,
      createdAt: new Date()
    };

    medications.push(medication);
    res.status(201).json(medication);
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ error: 'Failed to create medication' });
  }
});

module.exports = router; 