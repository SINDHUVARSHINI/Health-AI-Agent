import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, placeholder = "Type your message..." }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording functionality can be implemented here
  };

  const handleFileUpload = () => {
    // File upload functionality can be implemented here
    console.log('File upload clicked');
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <div className="flex items-end space-x-2 p-3 bg-white border border-neutral-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all duration-200">
          {/* Textarea */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="w-full resize-none border-0 bg-transparent text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-0 text-sm leading-5 min-h-[20px] max-h-[120px]"
              rows={1}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            {/* File Upload */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFileUpload}
              className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </motion.button>

            {/* Voice Recording */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isRecording 
                  ? 'text-danger-600 bg-danger-100 hover:bg-danger-200' 
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
              }`}
              title={isRecording ? 'Stop recording' : 'Start voice recording'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>

            {/* Send Button */}
            <motion.button
              type="submit"
              disabled={!message.trim() || isLoading}
              whileHover={{ scale: message.trim() && !isLoading ? 1.05 : 1 }}
              whileTap={{ scale: message.trim() && !isLoading ? 0.95 : 1 }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                message.trim() && !isLoading
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-10 left-0 right-0 flex items-center justify-center"
          >
            <div className="bg-danger-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>Recording...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Character Count */}
      {message.length > 0 && (
        <div className="flex justify-between items-center text-xs text-neutral-500">
          <span>
            {message.length} character{message.length !== 1 ? 's' : ''}
          </span>
          <span>
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      )}
    </form>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default ChatInput; 