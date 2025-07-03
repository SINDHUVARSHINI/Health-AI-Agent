const express = require('express');
const router = express.Router();

// Mock patient data (replace with database in production)
const patients = [];

// Get all patients
router.get('/', (req, res) => {
  try {
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get patient by ID
router.get('/:id', (req, res) => {
  try {
    const patient = patients.find(p => p.id === parseInt(req.params.id));
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient by ID:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Create new patient
router.post('/', (req, res) => {
  try {
    const { name, email, age, gender, medicalHistory } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const patient = {
      id: patients.length + 1,
      name,
      email,
      age,
      gender,
      medicalHistory: medicalHistory || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    patients.push(patient);
    res.status(201).json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// Update patient
router.put('/:id', (req, res) => {
  try {
    const patientIndex = patients.findIndex(p => p.id === parseInt(req.params.id));
    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const { name, email, age, gender, medicalHistory } = req.body;
    
    patients[patientIndex] = {
      ...patients[patientIndex],
      name: name || patients[patientIndex].name,
      email: email || patients[patientIndex].email,
      age: age || patients[patientIndex].age,
      gender: gender || patients[patientIndex].gender,
      medicalHistory: medicalHistory || patients[patientIndex].medicalHistory,
      updatedAt: new Date()
    };

    res.json(patients[patientIndex]);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// Delete patient
router.delete('/:id', (req, res) => {
  try {
    const patientIndex = patients.findIndex(p => p.id === parseInt(req.params.id));
    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    patients.splice(patientIndex, 1);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

module.exports = router; 