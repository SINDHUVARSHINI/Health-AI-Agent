import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Calendar,
  Clock, 
  MapPin,
  User,
  ArrowLeft,
  Trash2
} from 'lucide-react';

const APPOINTMENT_TYPES = [
  { value: 'checkup', label: 'Regular Check-up' },
  { value: 'treatment', label: 'Treatment Session' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'followup', label: 'Follow-up Visit' },
  { value: 'testing', label: 'Medical Tests' }
];

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    doctorName: '',
    location: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAppointment.type || !newAppointment.date || !newAppointment.time) return;

    const appointmentToAdd = {
      ...newAppointment,
      id: Date.now(),
      status: 'scheduled'
    };

    setAppointments(prev => [appointmentToAdd, ...prev]);
    setNewAppointment({
      type: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      doctorName: '',
      location: '',
      notes: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    }
  };

  const formatDateTime = (date, time) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${formattedDate} at ${time}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Appointments</h1>
          <p className="text-neutral-600 mt-2">
            Schedule and manage your medical appointments
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

      {/* Appointment Form */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
          <PlusCircle className="w-5 h-5 mr-2 text-primary-500" />
          Schedule New Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Appointment Type
              </label>
              <select
                name="type"
                value={newAppointment.type}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select type</option>
                {APPOINTMENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Doctor Name
              </label>
              <input
                type="text"
                name="doctorName"
                value={newAppointment.doctorName}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter doctor's name"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={newAppointment.date}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={newAppointment.time}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={newAppointment.location}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter clinic/hospital address"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={newAppointment.notes}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Any special instructions or notes..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Schedule Appointment
            </button>
          </div>
        </form>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Upcoming Appointments
        </h2>

        {appointments.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            No appointments scheduled
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(appointment => (
              <div
                key={appointment.id}
                className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-neutral-900">
                        {APPOINTMENT_TYPES.find(t => t.value === appointment.type)?.label}
                      </h3>
                      <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                        {appointment.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-neutral-600">
                      {formatDateTime(appointment.date, appointment.time)}
                    </p>

                    {appointment.doctorName && (
                      <p className="text-sm flex items-center text-neutral-600">
                        <User className="w-4 h-4 mr-1" />
                        Dr. {appointment.doctorName}
                      </p>
                    )}

                    {appointment.location && (
                      <p className="text-sm flex items-center text-neutral-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {appointment.location}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="text-danger-600 hover:bg-danger-50 p-1 rounded"
                    title="Cancel appointment"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {appointment.notes && (
                  <div className="mt-2 text-sm text-neutral-700 bg-neutral-50 p-2 rounded">
                    {appointment.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 