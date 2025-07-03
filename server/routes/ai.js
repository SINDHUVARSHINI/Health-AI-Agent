const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Chat with AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, patientContext = {} } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`AI chat request: ${message.substring(0, 100)}...`);

    const response = await aiService.generateResponse(message, patientContext);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: 'Unable to process chat request' });
  }
});

// Analyze symptoms
router.post('/symptoms/analyze', async (req, res) => {
  try {
    const { symptoms, patientContext = {} } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms array is required' });
    }

    console.log(`Symptom analysis request for symptoms: ${symptoms.join(', ')}`);

    const analysis = await aiService.analyzeSymptoms(symptoms, patientContext);

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in symptom analysis:', error);
    res.status(500).json({ error: 'Unable to analyze symptoms' });
  }
});

// Get treatment education
router.post('/education/treatment', async (req, res) => {
  try {
    const { cancerType, treatmentType } = req.body;

    if (!cancerType || !treatmentType) {
      return res.status(400).json({ error: 'Cancer type and treatment type are required' });
    }

    console.log(`Treatment education request for ${cancerType} - ${treatmentType}`);

    const education = await aiService.generateTreatmentEducation(cancerType, treatmentType);

    res.json({
      success: true,
      education,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating treatment education:', error);
    res.status(500).json({ error: 'Unable to generate treatment education' });
  }
});

// Get nutrition guidance
router.post('/nutrition/guidance', async (req, res) => {
  try {
    const { cancerType, treatmentType, symptoms } = req.body;

    if (!cancerType || !treatmentType) {
      return res.status(400).json({ error: 'Cancer type and treatment type are required' });
    }

    console.log(`Nutrition guidance request for ${cancerType} - ${treatmentType}`);

    const guidance = await aiService.generateNutritionGuidance(cancerType, treatmentType, symptoms || []);

    res.json({
      success: true,
      guidance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating nutrition guidance:', error);
    res.status(500).json({ error: 'Unable to generate nutrition guidance' });
  }
});

// Get mental health support
router.post('/mental-health/support', async (req, res) => {
  try {
    const { patientContext, currentMood } = req.body;

    console.log(`Mental health support request with mood: ${currentMood}`);

    const support = await aiService.generateMentalHealthSupport(patientContext || {}, currentMood);

    res.json({
      success: true,
      support,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating mental health support:', error);
    res.status(500).json({ error: 'Unable to generate mental health support' });
  }
});

// Get appointment preparation guidance
router.post('/appointments/preparation', async (req, res) => {
  try {
    const { appointmentType, cancerType, treatmentStage } = req.body;

    if (!appointmentType || !cancerType) {
      return res.status(400).json({ error: 'Appointment type and cancer type are required' });
    }

    console.log(`Appointment preparation request for ${appointmentType}`);

    const preparation = await aiService.generateAppointmentPreparation(appointmentType, cancerType, treatmentStage);

    res.json({
      success: true,
      preparation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating appointment preparation:', error);
    res.status(500).json({ error: 'Unable to generate appointment preparation' });
  }
});

// Get medication guidance
router.post('/medications/guidance', async (req, res) => {
  try {
    const { medicationName, cancerType, otherMedications } = req.body;

    if (!medicationName || !cancerType) {
      return res.status(400).json({ error: 'Medication name and cancer type are required' });
    }

    console.log(`Medication guidance request for ${medicationName}`);

    const guidance = await aiService.generateMedicationGuidance(medicationName, cancerType, otherMedications || []);

    res.json({
      success: true,
      guidance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating medication guidance:', error);
    res.status(500).json({ error: 'Unable to generate medication guidance' });
  }
});

// Get personalized health insights
router.post('/insights/personalized', async (req, res) => {
  try {
    const { patientContext, healthMetrics, recentSymptoms } = req.body;

    console.log(`Personalized insights request`);

    const insights = await aiService.generateResponse(
      `Please provide personalized health insights and recommendations for this cancer patient. 
       Health metrics: ${JSON.stringify(healthMetrics || {})}. 
       Recent symptoms: ${recentSymptoms?.join(', ') || 'none reported'}. 
       Focus on actionable advice and monitoring suggestions.`,
      patientContext
    );

    res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating personalized insights:', error);
    res.status(500).json({ error: 'Unable to generate personalized insights' });
  }
});

// Emergency symptom assessment
router.post('/emergency/assessment', async (req, res) => {
  try {
    const { symptoms, patientContext } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms array is required' });
    }

    console.log(`Emergency assessment request for symptoms: ${symptoms.join(', ')}`);

    const analysis = await aiService.analyzeSymptoms(symptoms, patientContext);
    
    // Add emergency-specific recommendations
    const emergencyRecommendations = analysis.recommendations;
    if (analysis.severity === 'severe') {
      emergencyRecommendations.unshift('URGENT: Consider calling 911 or going to the emergency room immediately');
    }

    res.json({
      success: true,
      analysis: {
        ...analysis,
        recommendations: emergencyRecommendations,
        isEmergency: analysis.severity === 'severe'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in emergency assessment:', error);
    res.status(500).json({ error: 'Unable to perform emergency assessment' });
  }
});

module.exports = router; 