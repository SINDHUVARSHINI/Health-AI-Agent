const Joi = require('joi');
const { logger } = require('../utils/logger');

// Validation schemas
const schemas = {
  // User registration
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    role: Joi.string().valid('patient', 'caregiver', 'healthcare_provider').required(),
    dateOfBirth: Joi.date().max('now').optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional()
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Patient profile
  patientProfile: Joi.object({
    cancerType: Joi.string().required(),
    diagnosisDate: Joi.date().max('now').required(),
    treatmentStage: Joi.string().valid('diagnosis', 'treatment', 'recovery', 'surveillance', 'palliative').required(),
    currentTreatments: Joi.array().items(Joi.string()).optional(),
    emergencyContact: Joi.object({
      name: Joi.string().required(),
      relationship: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email().optional()
    }).optional()
  }),

  // Symptom tracking
  symptoms: Joi.object({
    symptoms: Joi.array().items(Joi.string()).min(1).required(),
    severity: Joi.number().min(1).max(10).optional(),
    duration: Joi.string().optional(),
    notes: Joi.string().max(1000).optional()
  }),

  // Medication
  medication: Joi.object({
    name: Joi.string().required(),
    dosage: Joi.string().required(),
    frequency: Joi.string().required(),
    startDate: Joi.date().max('now').required(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional(),
    prescribedBy: Joi.string().optional(),
    notes: Joi.string().max(1000).optional()
  }),

  // Appointment
  appointment: Joi.object({
    type: Joi.string().required(),
    date: Joi.date().min('now').required(),
    time: Joi.string().pattern(/^([01]?\d|2[0-3]):[0-5]\d$/).required(),
    provider: Joi.string().required(),
    location: Joi.string().required(),
    notes: Joi.string().max(1000).optional(),
    reminderTime: Joi.number().min(1).max(1440).optional() // minutes before appointment
  }),

  // AI chat
  aiChat: Joi.object({
    message: Joi.string().min(1).max(2000).required(),
    patientContext: Joi.object({
      cancerType: Joi.string().optional(),
      treatmentStage: Joi.string().optional(),
      currentTreatments: Joi.array().items(Joi.string()).optional(),
      symptoms: Joi.array().items(Joi.string()).optional()
    }).optional()
  }),

  // Health metrics
  healthMetrics: Joi.object({
    weight: Joi.number().min(20).max(500).optional(),
    bloodPressure: Joi.object({
      systolic: Joi.number().min(70).max(200).required(),
      diastolic: Joi.number().min(40).max(130).required()
    }).optional(),
    temperature: Joi.number().min(95).max(105).optional(),
    heartRate: Joi.number().min(40).max(200).optional(),
    oxygenSaturation: Joi.number().min(70).max(100).optional(),
    painLevel: Joi.number().min(0).max(10).optional(),
    fatigueLevel: Joi.number().min(0).max(10).optional(),
    mood: Joi.string().valid('excellent', 'good', 'fair', 'poor', 'terrible').optional()
  }),

  // Notification preferences
  notificationPreferences: Joi.object({
    email: Joi.boolean().default(true),
    sms: Joi.boolean().default(false),
    push: Joi.boolean().default(true),
    appointmentReminders: Joi.boolean().default(true),
    medicationReminders: Joi.boolean().default(true),
    symptomCheckIns: Joi.boolean().default(true),
    emergencyAlerts: Joi.boolean().default(true)
  })
};

const validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      logger.error(`Validation schema '${schemaName}' not found`);
      return res.status(500).json({ error: 'Validation schema not found' });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn(`Validation failed for ${schemaName}:`, errorDetails);
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errorDetails
      });
    }

    // Replace request body with validated data
    req.body = value;
    next();
  };
};

// Generic validation middleware
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation failed:', errorDetails);
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errorDetails
      });
    }

    req.body = value;
    next();
  };
};

// Validate query parameters
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Query validation failed:', errorDetails);
      
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: errorDetails
      });
    }

    req.query = value;
    next();
  };
};

module.exports = {
  validateRequest,
  validateBody,
  validateQuery,
  schemas
}; 