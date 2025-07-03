import api from './api';

class AIService {
  async sendMessage(message, patientContext = {}) {
    try {
      const response = await api.post('/ai/chat', {
        message,
        patientContext
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to send message');
    }
  }

  async analyzeSymptoms(symptoms, patientContext = {}) {
    try {
      const response = await api.post('/ai/symptoms/analyze', {
        symptoms,
        patientContext
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to analyze symptoms');
    }
  }

  async getTreatmentEducation(cancerType, treatmentType) {
    try {
      const response = await api.post('/ai/education/treatment', {
        cancerType,
        treatmentType
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get treatment education');
    }
  }

  async getNutritionGuidance(cancerType, treatmentType, symptoms = []) {
    try {
      const response = await api.post('/ai/nutrition/guidance', {
        cancerType,
        treatmentType,
        symptoms
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get nutrition guidance');
    }
  }

  async getMentalHealthSupport(patientContext, currentMood = 'neutral') {
    try {
      const response = await api.post('/ai/mental-health/support', {
        patientContext,
        currentMood
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get mental health support');
    }
  }

  async getAppointmentPreparation(appointmentType, cancerType, treatmentStage) {
    try {
      const response = await api.post('/ai/appointments/preparation', {
        appointmentType,
        cancerType,
        treatmentStage
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get appointment preparation');
    }
  }

  async getMedicationGuidance(medicationName, cancerType, otherMedications = []) {
    try {
      const response = await api.post('/ai/medications/guidance', {
        medicationName,
        cancerType,
        otherMedications
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get medication guidance');
    }
  }

  async getPersonalizedInsights(patientContext, healthMetrics, recentSymptoms) {
    try {
      const response = await api.post('/ai/insights/personalized', {
        patientContext,
        healthMetrics,
        recentSymptoms
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get personalized insights');
    }
  }

  async emergencyAssessment(symptoms, patientContext = {}) {
    try {
      const response = await api.post('/ai/emergency/assessment', {
        symptoms,
        patientContext
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to perform emergency assessment');
    }
  }
}

export const aiService = new AIService(); 