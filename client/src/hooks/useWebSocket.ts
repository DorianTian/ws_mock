import { useState, useRef, useCallback } from 'react';
import { ServerMessage, Message, TestResult } from '../types/websocket.types';

interface UseWebSocketProps {
  addMessage: (text: string, sender: 'client' | 'server') => void;
  setTestStatus: (status: string) => void;
  setTestLoading: (loading: boolean) => void;
  setShowTestResult: React.Dispatch<React.SetStateAction<TestResult>>;
}

export const useWebSocket = ({ addMessage, setTestStatus, setTestLoading, setShowTestResult }: UseWebSocketProps) => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'open' | 'closed' | 'error'>('closed');
  const [serverUrl, setServerUrl] = useState('ws://localhost:3001');
  const [clientId, setClientId] = useState<number | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  
  // Connect to WebSocket server
  const connectToServer = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    try {
      setConnectionStatus('connecting');
      const ws = new WebSocket(serverUrl);

      ws.onopen = () => {
        setConnectionStatus('open');
        addMessage('已连接到服务器', 'server');
      };

      ws.onmessage = (event) => {
        try {
          const serverMessage = JSON.parse(event.data) as ServerMessage;
          console.log('serverMessage', serverMessage);

          // 处理不同类型的消息
          switch (serverMessage.type) {
            case 'connection':
              if (serverMessage.clientId) {
                setClientId(serverMessage.clientId);
                addMessage(`已建立连接，您的ID: ${serverMessage.clientId}`, 'server');
              }
              break;

            case 'chat':
              const sender = serverMessage.sender === clientId ? '你' : `用户 ${serverMessage.sender}`;
              addMessage(`${sender}: ${serverMessage.message}`, 'server');
              break;

            case 'notification':
              addMessage(`通知: ${serverMessage.message}`, 'server');
              break;

            case 'test_progress':
              // 处理测试进度更新
              setTestStatus(serverMessage.message || '测试中...');
              break;

            case 'test_complete':
              // 测试完成
              setTestLoading(false);
              setTestStatus('');
              const success = serverMessage.success === true;

              // 显示测试结果
              setShowTestResult({
                show: true,
                success: success,
                message: serverMessage.message || (success ? '测试成功' : '测试失败'),
              });

              // 3秒后关闭提示
              setTimeout(() => {
                setShowTestResult((prev) => ({ ...prev, show: false }));
              }, 3000);

              addMessage(serverMessage.message || (success ? '服务器连接测试成功' : '服务器连接测试失败'), 'server');
              break;

            default:
              addMessage(serverMessage.message || JSON.stringify(serverMessage), 'server');
          }
        } catch (error) {
          console.error('解析消息失败:', error);
          addMessage(`收到非JSON格式消息: ${event.data}`, 'server');
        }
      };

      ws.onclose = () => {
        setConnectionStatus('closed');
        setClientId(null);
        addMessage('已断开与服务器的连接', 'server');
      };

      ws.onerror = (error) => {
        setConnectionStatus('error');
        addMessage('连接错误', 'server');
        console.error('WebSocket错误:', error);
      };

      wsRef.current = ws;
    } catch (error) {
      setConnectionStatus('error');
      console.error('连接失败:', error);
    }
  }, [serverUrl, clientId, addMessage, setTestStatus, setTestLoading, setShowTestResult]);

  // Disconnect from WebSocket server
  const disconnectFromServer = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Send a message to the server
  const sendChatMessage = useCallback(() => {
    if (inputMessage.trim() === '' || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // 发送JSON格式的消息
    const messageObject = {
      type: 'chat',
      message: inputMessage,
    };

    wsRef.current.send(JSON.stringify(messageObject));
    addMessage(inputMessage, 'client');
    setInputMessage('');
  }, [inputMessage, addMessage]);

  // Test WebSocket connection
  const testConnection = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setShowTestResult({
        show: true,
        success: false,
        message: '请先连接到WebSocket服务器',
      });

      setTimeout(() => {
        setShowTestResult((prev) => ({ ...prev, show: false }));
      }, 3000);

      return;
    }

    setTestLoading(true);
    setTestStatus('正在测试连接...');

    // 发送测试请求到服务器
    wsRef.current.send(
      JSON.stringify({
        type: 'test_connection',
        clientId,
      }),
    );
  }, [clientId, setShowTestResult, setTestLoading, setTestStatus]);

  // Cleanup WebSocket on unmount
  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  return {
    connectionStatus,
    serverUrl,
    setServerUrl,
    clientId,
    inputMessage,
    setInputMessage,
    connectToServer,
    disconnectFromServer,
    sendChatMessage,
    testConnection,
    cleanup,
    wsRef
  };
}; 