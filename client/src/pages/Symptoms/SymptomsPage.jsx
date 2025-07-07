import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Calendar, 
  Clock, 
  AlertTriangle,
  ThermometerSun,
  Activity,
  Frown,
  Heart,
  ArrowLeft
} from 'lucide-react';

const SYMPTOM_CATEGORIES = [
  { id: 'physical', label: 'Physical', icon: Activity },
  { id: 'pain', label: 'Pain & Discomfort', icon: Frown },
  { id: 'temperature', label: 'Temperature', icon: ThermometerSun },
  { id: 'cardiac', label: 'Heart & Breathing', icon: Heart }
];

const SEVERITY_LEVELS = [
  { value: 1, label: 'Mild', color: 'bg-success-100 text-success-700' },
  { value: 2, label: 'Moderate', color: 'bg-warning-100 text-warning-700' },
  { value: 3, label: 'Severe', color: 'bg-danger-100 text-danger-700' }
];

export default function SymptomsPage() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState({
    name: '',
    category: '',
    severity: 1,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSymptom(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newSymptom.name || !newSymptom.category) return;

    const symptomToAdd = {
      ...newSymptom,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setSymptoms(prev => [symptomToAdd, ...prev]);
    
    // Reset form
    setNewSymptom({
      name: '',
      category: '',
      severity: 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: ''
    });
  };

  const getSeverityClass = (severity) => {
    const level = SEVERITY_LEVELS.find(level => level.value === parseInt(severity));
    return level ? level.color : '';
  };

  return (
    <>
      <Helmet>
        <title>Symptom Tracker - Health AI Agent</title>
        <meta name="description" content="Track and monitor your symptoms over time" />
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Symptom Tracker</h1>
            <p className="text-neutral-600 mt-2">
              Monitor your symptoms and track changes over time
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary btn-sm flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Log New Symptom Form */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <PlusCircle className="w-5 h-5 mr-2 text-primary-500" />
            Log New Symptom
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Symptom Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Symptom Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newSymptom.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter symptom name"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={newSymptom.category}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select category</option>
                  {SYMPTOM_CATEGORIES.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Severity
                </label>
                <select
                  name="severity"
                  value={newSymptom.severity}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {SEVERITY_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newSymptom.date}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={newSymptom.time}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={newSymptom.notes}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Add any additional details or observations..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Log Symptom
              </button>
            </div>
          </form>
        </div>

        {/* Symptoms History */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Symptoms History
          </h2>

          {symptoms.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No symptoms logged yet
            </div>
          ) : (
            <div className="space-y-4">
              {symptoms.map(symptom => (
                <div
                  key={symptom.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-900">
                        {symptom.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {SYMPTOM_CATEGORIES.find(c => c.id === symptom.category)?.label}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getSeverityClass(symptom.severity)}`}>
                      {SEVERITY_LEVELS.find(l => l.value === parseInt(symptom.severity))?.label}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm text-neutral-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {symptom.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {symptom.time}
                      </span>
                    </div>
                  </div>

                  {symptom.notes && (
                    <p className="mt-2 text-sm text-neutral-700 bg-neutral-50 p-2 rounded">
                      {symptom.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Notice */}
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-warning-500 mt-0.5" />
            <div className="text-sm text-warning-700">
              <strong>Important:</strong> If you experience severe or life-threatening symptoms, 
              please seek immediate medical attention or contact emergency services.
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 