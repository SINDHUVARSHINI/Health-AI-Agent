import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Pill, 
  Calendar, 
  Apple, 
  Heart, 
  BookOpen, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'symptom-check',
      title: 'Symptom Check',
      description: 'Understand your symptoms',
      icon: Activity,
      color: 'bg-health-100 text-health-700 border-health-200 hover:bg-health-200',
      delay: 0
    },
    {
      id: 'medication-help',
      title: 'Medication Help',
      description: 'Learn about your medications',
      icon: Pill,
      color: 'bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-200',
      delay: 0.1
    },
    {
      id: 'appointment-prep',
      title: 'Appointment Prep',
      description: 'Prepare for your visit',
      icon: Calendar,
      color: 'bg-warning-100 text-warning-700 border-warning-200 hover:bg-warning-200',
      delay: 0.2
    },
    {
      id: 'nutrition-advice',
      title: 'Nutrition Advice',
      description: 'Diet and nutrition guidance',
      icon: Apple,
      color: 'bg-health-100 text-health-700 border-health-200 hover:bg-health-200',
      delay: 0.3
    },
    {
      id: 'emotional-support',
      title: 'Emotional Support',
      description: 'Mental health and coping',
      icon: Heart,
      color: 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
      delay: 0.4
    },
    {
      id: 'treatment-info',
      title: 'Treatment Info',
      description: 'Learn about treatments',
      icon: BookOpen,
      color: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
      delay: 0.5
    },
    {
      id: 'emergency-help',
      title: 'Emergency Help',
      description: 'Urgent symptom assessment',
      icon: AlertTriangle,
      color: 'bg-danger-100 text-danger-700 border-danger-200 hover:bg-danger-200',
      delay: 0.6
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-neutral-900">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: action.delay,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction(action.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${action.color} text-left group`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm group-hover:underline">
                    {action.title}
                  </h4>
                  <p className="text-xs opacity-80 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      <div className="text-center pt-2">
        <p className="text-xs text-neutral-500">
          Or type your question below for personalized assistance
        </p>
      </div>
    </div>
  );
};

QuickActions.propTypes = {
  onAction: PropTypes.func.isRequired,
};

export default QuickActions; 