import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Calendar, ArrowLeft, Trash2 } from 'lucide-react';

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'as_needed', label: 'As Needed' }
];

export default function MedicationsPage() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    instructions: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMedication.name || !newMedication.dosage) return;

    const medicationToAdd = {
      ...newMedication,
      id: Date.now()
    };

    setMedications(prev => [medicationToAdd, ...prev]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString().split('T')[0],
      instructions: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedications(prev => prev.filter(med => med.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Medications</h1>
          <p className="text-neutral-600 mt-2">
            Track your medications and schedules
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

      {/* Add Medication Form */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
          <PlusCircle className="w-5 h-5 mr-2 text-primary-500" />
          Add New Medication
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medication Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Medication Name
              </label>
              <input
                type="text"
                name="name"
                value={newMedication.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter medication name"
                required
              />
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Dosage
              </label>
              <input
                type="text"
                name="dosage"
                value={newMedication.dosage}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="e.g., 50mg"
                required
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Frequency
              </label>
              <select
                name="frequency"
                value={newMedication.frequency}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select frequency</option>
                {FREQUENCY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={newMedication.startDate}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={newMedication.instructions}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Special instructions for taking this medication..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Medication
            </button>
          </div>
        </form>
      </div>

      {/* Medications List */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Current Medications
        </h2>

        {medications.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            No medications added yet
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map(medication => (
              <div
                key={medication.id}
                className="border border-neutral-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      {medication.name}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {medication.dosage} - {FREQUENCY_OPTIONS.find(f => f.value === medication.frequency)?.label}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(medication.id)}
                    className="text-danger-600 hover:bg-danger-50 p-1 rounded"
                    title="Delete medication"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {medication.instructions && (
                  <p className="mt-2 text-sm text-neutral-700 bg-neutral-50 p-2 rounded">
                    {medication.instructions}
                  </p>
                )}

                <div className="mt-2 flex items-center text-sm text-neutral-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  Started: {medication.startDate}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 