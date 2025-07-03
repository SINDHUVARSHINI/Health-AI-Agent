import api from './api';

class PatientService {
  async getPatientProfile() {
    try {
      const response = await api.get('/patients/profile');
      return response.data.patient;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get patient profile');
    }
  }

  async updatePatientProfile(patientData) {
    try {
      const response = await api.put('/patients/profile', patientData);
      return response.data.patient;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update patient profile');
    }
  }

  async getSymptoms(limit = 10) {
    try {
      const response = await api.get(`/symptoms?limit=${limit}`);
      return response.data.symptoms;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get symptoms');
    }
  }

  async addSymptom(symptomData) {
    try {
      const response = await api.post('/symptoms', symptomData);
      return response.data.symptom;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add symptom');
    }
  }

  async getMedications() {
    try {
      const response = await api.get('/medications');
      return response.data.medications;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get medications');
    }
  }

  async addMedication(medicationData) {
    try {
      const response = await api.post('/medications', medicationData);
      return response.data.medication;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add medication');
    }
  }

  async updateMedication(id, medicationData) {
    try {
      const response = await api.put(`/medications/${id}`, medicationData);
      return response.data.medication;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update medication');
    }
  }

  async deleteMedication(id) {
    try {
      await api.delete(`/medications/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete medication');
    }
  }

  async getAppointments() {
    try {
      const response = await api.get('/appointments');
      return response.data.appointments;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get appointments');
    }
  }

  async addAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data.appointment;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add appointment');
    }
  }

  async updateAppointment(id, appointmentData) {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return response.data.appointment;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update appointment');
    }
  }

  async deleteAppointment(id) {
    try {
      await api.delete(`/appointments/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete appointment');
    }
  }

  async getHealthMetrics(limit = 30) {
    try {
      const response = await api.get(`/health/metrics?limit=${limit}`);
      return response.data.metrics;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get health metrics');
    }
  }

  async addHealthMetric(metricData) {
    try {
      const response = await api.post('/health/metrics', metricData);
      return response.data.metric;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add health metric');
    }
  }

  async getNotifications() {
    try {
      const response = await api.get('/notifications');
      return response.data.notifications;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get notifications');
    }
  }

  async markNotificationAsRead(id) {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data.notification;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to mark notification as read');
    }
  }

  async updateNotificationPreferences(preferences) {
    try {
      const response = await api.put('/notifications/preferences', preferences);
      return response.data.preferences;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update notification preferences');
    }
  }
}

export const patientService = new PatientService(); 