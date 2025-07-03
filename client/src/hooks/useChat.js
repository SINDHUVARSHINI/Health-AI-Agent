import { useState, useCallback } from 'react';
import { aiService } from '@services/aiService';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const sendMessage = useCallback(async (message, patientContext = {}) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.sendMessage(message, patientContext);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message || 'Failed to get response from AI');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...message
    }]);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    addMessage,
    isLoading,
    error,
    setError
  };
}; 