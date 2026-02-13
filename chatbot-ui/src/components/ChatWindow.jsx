import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.role}`}>
          <div className="message-content">
            {msg.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="message assistant loading">
          <div className="message-content">
            <div className="thinking-container">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="thinking-text">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
