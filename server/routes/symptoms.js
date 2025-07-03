const express = require('express');
const router = express.Router();

// Mock symptoms data
const symptoms = [];

// Get all symptoms
router.get('/', (req, res) => {
  try {
    res.json(symptoms);
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    res.status(500).json({ error: 'Failed to fetch symptoms' });
  }
});

// Add symptom
router.post('/', (req, res) => {
  try {
    const { description, severity, patientId, duration } = req.body;
    
    // Validate required fields
    if (!description || !severity) {
      return res.status(400).json({ error: 'Description and severity are required' });
    }
    
    const symptom = {
      id: symptoms.length + 1,
      description,
      severity,
      patientId,
      duration,
      createdAt: new Date()
    };

    symptoms.push(symptom);
    res.status(201).json(symptom);
  } catch (error) {
    console.error('Error creating symptom:', error);
    res.status(500).json({ error: 'Failed to create symptom' });
  }
});

module.exports = router; 