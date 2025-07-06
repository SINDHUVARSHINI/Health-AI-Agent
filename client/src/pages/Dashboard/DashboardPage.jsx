import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Heart, 
  Calendar, 
  Pill, 
  MessageCircle,
  ArrowRight,
  Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { usePatient } from '@contexts/PatientContext';
import { useNotifications } from '@contexts/NotificationContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isNewUser } = useAuth();
  const { patient, isLoading: patientLoading } = usePatient();
  const { notifications } = useNotifications();

  // Mock data - in real app, this would come from API
  const healthMetrics = {
    painLevel: 3,
    fatigueLevel: 5,
    mood: 'good',
    weight: 68.5,
    lastUpdated: '2024-01-15T10:30:00Z'
  };

  const upcomingAppointments = [
    {
      id: 1,
      type: 'Chemotherapy',
      date: '2024-01-20',
      time: '09:00',
      provider: 'Dr. Smith',
      location: 'Cancer Center'
    },
    {
      id: 2,
      type: 'Follow-up',
      date: '2024-01-25',
      time: '14:30',
      provider: 'Dr. Johnson',
      location: 'Oncology Clinic'
    }
  ];

  const recentSymptoms = [
    { id: 1, symptom: 'Fatigue', severity: 5, date: '2024-01-15' },
    { id: 2, symptom: 'Nausea', severity: 3, date: '2024-01-14' },
    { id: 3, symptom: 'Headache', severity: 2, date: '2024-01-13' }
  ];

  const quickActions = [
    {
      title: 'Chat with AI',
      description: 'Get personalized health guidance',
      icon: MessageCircle,
      href: '/chat',
      color: 'bg-primary-100 text-primary-700'
    },
    {
      title: 'Log Symptoms',
      description: 'Track how you\'re feeling',
      icon: Activity,
      href: '/symptoms',
      color: 'bg-health-100 text-health-700'
    },
    {
      title: 'Add Medication',
      description: 'Update your medication list',
      icon: Pill,
      href: '/medications',
      color: 'bg-warning-100 text-warning-700'
    },
    {
      title: 'Schedule Appointment',
      description: 'Book your next visit',
      icon: Calendar,
      href: '/appointments',
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  const getMoodColor = (mood) => {
    const colors = {
      excellent: 'text-health-600',
      good: 'text-primary-600',
      fair: 'text-warning-600',
      poor: 'text-danger-600',
      terrible: 'text-danger-700'
    };
    return colors[mood] || 'text-neutral-600';
  };

  const getSeverityColor = (severity) => {
    if (severity <= 3) return 'text-health-600';
    if (severity <= 6) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getSeverityLabel = (severity) => {
    if (severity <= 3) return 'Low';
    if (severity <= 6) return 'Moderate';
    return 'High';
  };

  if (patientLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Health AI Agent</title>
        <meta name="description" content="Your health dashboard with overview and quick actions" />
      </Helmet>

      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-health-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {isNewUser ? `Welcome to RAVUS AI, ${user?.name}!` : `Welcome back, ${user?.name}!`}
              </h1>
              <p className="text-primary-100">
                {patient?.cancerType ? 
                  `Managing your ${patient.cancerType} treatment journey` : 
                  isNewUser ?
                  'Let\'s start your health journey together' :
                  'Let\'s take care of your health together'
                }
              </p>
            </div>
            <div className="hidden sm:block">
              <Heart className="w-16 h-16 text-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="card p-6 hover:shadow-medium transition-all duration-200 group-hover:border-primary-300"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-neutral-600 mb-4">{action.description}</p>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-neutral-900">Health Overview</h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <div className="text-2xl font-bold text-neutral-900 mb-1">
                      {healthMetrics.painLevel}/10
                    </div>
                    <div className="text-sm text-neutral-600">Pain Level</div>
                    <div className={`text-xs mt-1 ${getSeverityColor(healthMetrics.painLevel)}`}>
                      {getSeverityLabel(healthMetrics.painLevel)}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <div className="text-2xl font-bold text-neutral-900 mb-1">
                      {healthMetrics.fatigueLevel}/10
                    </div>
                    <div className="text-sm text-neutral-600">Fatigue</div>
                    <div className={`text-xs mt-1 ${getSeverityColor(healthMetrics.fatigueLevel)}`}>
                      {getSeverityLabel(healthMetrics.fatigueLevel)}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <div className={`text-2xl font-bold mb-1 ${getMoodColor(healthMetrics.mood)}`}>
                      {healthMetrics.mood.charAt(0).toUpperCase() + healthMetrics.mood.slice(1)}
                    </div>
                    <div className="text-sm text-neutral-600">Mood</div>
                  </div>
                  
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <div className="text-2xl font-bold text-neutral-900 mb-1">
                      {healthMetrics.weight}kg
                    </div>
                    <div className="text-sm text-neutral-600">Weight</div>
                    <div className="text-xs text-health-600 mt-1">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      Stable
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-neutral-900">Upcoming Appointments</h2>
              </div>
              <div className="card-body">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-neutral-900">{appointment.type}</p>
                          <p className="text-xs text-neutral-600">
                            {appointment.date} at {appointment.time}
                          </p>
                          <p className="text-xs text-neutral-500">{appointment.provider}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 mb-4">No upcoming appointments</p>
                    <Link to="/appointments" className="btn btn-primary btn-sm">
                      Schedule Appointment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Recent Symptoms */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-neutral-900">Recent Symptoms</h2>
            </div>
            <div className="card-body">
              {recentSymptoms.length > 0 ? (
                <div className="space-y-3">
                  {recentSymptoms.map((symptom) => (
                    <div key={symptom.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-neutral-500" />
                        <span className="font-medium text-sm">{symptom.symptom}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
                          {symptom.severity}/10
                        </span>
                        <span className="text-xs text-neutral-500">{symptom.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">No recent symptoms logged</p>
                  <Link to="/symptoms" className="btn btn-primary btn-sm">
                    Log Symptoms
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-neutral-900">Recent Notifications</h2>
            </div>
            <div className="card-body">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-neutral-900">{notification.title}</p>
                        <p className="text-xs text-neutral-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">No recent notifications</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default DashboardPage; 