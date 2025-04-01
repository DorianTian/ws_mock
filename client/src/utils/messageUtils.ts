import { useState, useCallback, useRef } from 'react';
import { Message } from '../types/websocket.types';

export function useMessageHandling() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageIdRef = useRef(0);

  // Add a message to the messages list
  const addMessage = useCallback((text: string, sender: 'client' | 'server') => {
    const newMessage: Message = {
      id: messageIdRef.current++,
      text,
      sender,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    clearMessages
  };
} 