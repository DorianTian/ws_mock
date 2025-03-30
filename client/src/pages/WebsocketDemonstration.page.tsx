import { useState, useEffect, useRef } from 'react';

import { styles } from '../styles/websocket.styles';

interface Message {
  id: number;
  text: string;
  sender: 'client' | 'server';
  timestamp: string;
}

// 服务器消息接口
interface ServerMessage {
  type: string;
  message: string;
  clientId?: number;
  sender?: number;
  timestamp?: number;
  fromServer?: boolean;
  success?: boolean; // 添加success属性用于测试结果
}

const WebsocketDemonstration = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'open' | 'closed' | 'error'>('closed');
  const [serverUrl, setServerUrl] = useState('ws://localhost:3001');
  const [clientId, setClientId] = useState<number | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testStatus, setTestStatus] = useState('');
  const [showTestResult, setShowTestResult] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: false,
    message: '',
  });

  const wsRef = useRef<WebSocket | null>(null);
  const messageIdRef = useRef(0);

  // Connect to WebSocket server
  const connectToServer = () => {
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
  };

  // Disconnect from WebSocket server
  const disconnectFromServer = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // Add a message to the messages list
  const addMessage = (text: string, sender: 'client' | 'server') => {
    const newMessage: Message = {
      id: messageIdRef.current++,
      text,
      sender,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  // Send a message to the server
  const sendChatMessage = () => {
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
  };

  // Test WebSocket connection
  const testConnection = () => {
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
  };

  // Clean up WebSocket connection on component unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div style={styles.websocketDemo}>
      <h1 style={styles.title}>WebSocket 演示</h1>

      {/* 测试结果弹窗 */}
      {showTestResult.show && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: showTestResult.success ? '#43aa8b' : '#f94144',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          {showTestResult.message}
        </div>
      )}

      <div style={styles.connectionControls}>
        <input
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          placeholder="WebSocket服务器URL"
          style={styles.input}
        />

        <div style={styles.buttons}>
          <button
            onClick={connectToServer}
            disabled={connectionStatus === 'connecting' || connectionStatus === 'open'}
            style={{
              ...styles.button,
              ...(connectionStatus === 'connecting' || connectionStatus === 'open' ? styles.buttonDisabled : {}),
            }}
          >
            连接
          </button>

          <button
            onClick={disconnectFromServer}
            disabled={connectionStatus === 'closed' || connectionStatus === 'error'}
            style={{
              ...styles.button,
              ...(connectionStatus === 'closed' || connectionStatus === 'error' ? styles.buttonDisabled : {}),
            }}
          >
            断开
          </button>
          <button
            onClick={testConnection}
            disabled={testLoading || connectionStatus !== 'open'}
            style={{
              ...styles.button,
              ...(testLoading || connectionStatus !== 'open' ? styles.buttonDisabled : {}),
            }}
          >
            {testLoading ? `${testStatus || '测试中...'}` : '测试连接'}
          </button>
        </div>

        <div
          style={{
            ...styles.statusIndicator,
            ...(connectionStatus === 'connecting' ? styles.statusConnecting : {}),
            ...(connectionStatus === 'open' ? styles.statusOpen : {}),
            ...(connectionStatus === 'closed' ? styles.statusClosed : {}),
            ...(connectionStatus === 'error' ? styles.statusError : {}),
          }}
        >
          状态:{' '}
          {connectionStatus === 'connecting'
            ? '连接中'
            : connectionStatus === 'open'
            ? '已连接'
            : connectionStatus === 'closed'
            ? '已断开'
            : '错误'}
          {clientId !== null && connectionStatus === 'open' && ` (ID: ${clientId})`}
        </div>
      </div>

      <div style={styles.messagesContainer}>
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

        <div style={styles.messageInput}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
            placeholder="输入消息..."
            disabled={connectionStatus !== 'open'}
            style={styles.messageInputField}
          />

          <button
            onClick={sendChatMessage}
            disabled={connectionStatus !== 'open' || inputMessage.trim() === ''}
            style={{
              ...styles.button,
              ...(connectionStatus !== 'open' || inputMessage.trim() === '' ? styles.buttonDisabled : {}),
            }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsocketDemonstration;
