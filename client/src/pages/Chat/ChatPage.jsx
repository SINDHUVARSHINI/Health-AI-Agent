import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

import ChatMessage from '@components/Chat/ChatMessage';
import QuickActions from '@components/Chat/QuickActions';
import ChatInput from '@components/Chat/ChatInput';
import { useAuth } from '@contexts/AuthContext';
import { usePatient } from '@contexts/PatientContext';
import { useChat } from '@hooks/useChat';
import { useNotifications } from '@contexts/NotificationContext';

const ChatPage = () => {
  const { user } = useAuth();
  const { patient } = usePatient();
  const { addNotification } = useNotifications();
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const {
    messages,
    sendMessage,
    isLoading,
    error,
    clearMessages
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setIsTyping(true);
    
    try {
      const patientContext = patient ? {
        cancerType: patient.cancerType,
        treatmentStage: patient.treatmentStage,
        currentTreatments: patient.currentTreatments,
        symptoms: patient.recentSymptoms || []
      } : {};

      await sendMessage(message, patientContext);
    } catch (error) {
      console.error('Failed to send message:', error);
      addNotification('error', 'Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    const actionMessages = {
      'symptom-check': 'I\'m experiencing some symptoms and would like to understand what they might mean.',
      'medication-help': 'I have questions about my medications and their side effects.',
      'appointment-prep': 'I have an upcoming appointment and would like guidance on how to prepare.',
      'nutrition-advice': 'I need advice on nutrition and diet during my treatment.',
      'emotional-support': 'I\'m feeling overwhelmed and could use some emotional support.',
      'treatment-info': 'I\'d like to learn more about my treatment options and what to expect.',
      'emergency-help': 'I\'m experiencing severe symptoms and need immediate guidance.'
    };

    handleSendMessage(actionMessages[action]);
  };

  const welcomeMessage = {
    id: 'welcome',
    type: 'ai',
    content: `Hello ${user?.firstName || 'there'}! I'm your AI health assistant, here to support you throughout your cancer treatment journey. 

I can help you with:
• Understanding symptoms and when to seek medical attention
• Medication guidance and side effect management
• Treatment education and preparation
• Nutrition and lifestyle recommendations
• Emotional support and coping strategies
• Appointment preparation and follow-up care

Remember, I'm here to support you, but always consult with your healthcare team for medical decisions. How can I help you today?`,
    timestamp: new Date().toISOString(),
    isWelcome: true
  };

  const allMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <>
      <Helmet>
        <title>AI Health Assistant - Health AI Agent</title>
        <meta name="description" content="Chat with your AI health assistant for personalized cancer care support" />
      </Helmet>

      <div className="flex flex-col h-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Bot className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">AI Health Assistant</h1>
              <p className="text-sm text-neutral-600">
                {isTyping ? 'Typing...' : 'Always here to support you'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary btn-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={clearMessages}
              className="btn btn-secondary btn-sm"
              title="Clear conversation"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50">
          <AnimatePresence>
            {allMessages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-soft"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-neutral-600">AI is thinking...</span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 p-4 bg-danger-50 border border-danger-200 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5 text-danger-500" />
              <span className="text-sm text-danger-700">{error}</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 0 && (
          <div className="p-6 bg-white border-t border-neutral-200">
            <QuickActions onAction={handleQuickAction} />
          </div>
        )}

        {/* Chat Input */}
        <div className="p-6 bg-white border-t border-neutral-200 rounded-b-xl">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading || isTyping}
            placeholder="Ask me anything about your health, symptoms, medications, or treatment..."
          />
        </div>

        {/* Safety Notice */}
        <div className="p-4 bg-warning-50 border-t border-warning-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-warning-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-warning-700">
              <strong>Important:</strong> This AI assistant provides general health information and support. 
              It is not a substitute for professional medical advice. Always consult with your healthcare 
              provider for medical decisions and emergency situations.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage; 