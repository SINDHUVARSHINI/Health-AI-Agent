import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Bot, User, Heart, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';

const ChatMessage = ({ message }) => {
  const [feedback, setFeedback] = useState(null);

  const isAI = message.type === 'ai';
  const isUser = message.type === 'user';
  const isWelcome = message.isWelcome;

  const getMessageIcon = () => {
    if (isAI) {
      if (isWelcome) return <Heart className="w-5 h-5 text-primary-600" />;
      return <Bot className="w-5 h-5 text-primary-600" />;
    }
    return <User className="w-5 h-5 text-neutral-600" />;
  };

  const getMessageStyle = () => {
    if (isAI) {
      return 'bg-white border border-neutral-200 shadow-soft';
    }
    return 'bg-primary-600 text-white';
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch {
      return '';
    }
  };

  const formatResponse = (text) => {
    // Remove the ```html and ``` markers
    const cleanHtml = text.replace(/```html|```/g, '');
    
    // Sanitize the HTML content
    const sanitizedHtml = DOMPurify.sanitize(cleanHtml, {
      ALLOWED_TAGS: ['h3', 'h4', 'p', 'ul', 'li', 'div', 'span', 'br', 'details', 'summary', 'emoji'],
      ALLOWED_ATTR: ['class']
    });

    return sanitizedHtml;
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    // Here you can add logic to send feedback to your backend
  };

  const renderContent = () => {
    if (isWelcome) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-600">Welcome to your health journey!</span>
          </div>
          <div className="prose prose-sm max-w-none">
            {message.content.split('\n').map((line, idx) => (
              <p key={message.id ? `${message.id}-line-${idx}` : idx} className={line.startsWith('•') ? 'ml-4' : ''}>
                {line}
              </p>
            ))}
          </div>
        </div>
      );
    }

    // Check for emergency keywords in AI messages
    if (isAI && message.content.toLowerCase().includes('emergency')) {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-danger-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Emergency Notice</span>
          </div>
          <div className="prose prose-sm max-w-none">
            {message.content}
          </div>
        </div>
      );
    }

    // Regular message content
    return (
      <div 
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: formatResponse(message.content) }}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAI ? 'bg-primary-100' : 'bg-neutral-200'
        }`}>
          {getMessageIcon()}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-2xl px-4 py-3 ${getMessageStyle()}`}>
            {renderContent()}
          </div>
          
          {/* Timestamp */}
          <span className={`text-xs text-neutral-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </span>

          {/* Feedback Buttons — only show for AI messages that aren't welcome messages */}
          {isAI && !message.isWelcome && (
            <div className="feedback flex space-x-2 mt-1">
              <button 
                className={`feedback-button text-sm ${feedback === 'like' ? 'text-green-600 font-bold' : 'text-neutral-500'}`}
                onClick={() => handleFeedback('like')}
                aria-label="Like response"
              >
                👍
              </button>
              <button 
                className={`feedback-button text-sm ${feedback === 'dislike' ? 'text-red-600 font-bold' : 'text-neutral-500'}`}
                onClick={() => handleFeedback('dislike')}
                aria-label="Dislike response"
              >
                👎
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOf(['ai', 'user']).isRequired,
    isWelcome: PropTypes.bool,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatMessage; 