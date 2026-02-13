import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !text.trim()}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
