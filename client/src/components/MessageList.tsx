import React from 'react';
import { Message } from '../types/websocket.types';
import { styles } from '../styles/websocket.styles';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div style={styles.messagesList}>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            width: '100%',
            overflow: 'hidden',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              ...styles.message,
              ...(message.sender === 'client' ? styles.messageClient : {}),
              ...(message.sender === 'server' ? styles.messageServer : {}),
            }}
          >
            <span style={styles.messageSender}>{message.sender === 'client' ? '你' : '服务器'}</span>
            <span style={styles.messageText}>{message.text}</span>
            <span style={styles.messageTime}>{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}; 