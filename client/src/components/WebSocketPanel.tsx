import React from 'react';
import { styles } from '../styles/websocket.styles';
import { TestResult } from '../types/websocket.types';

interface WebSocketPanelProps {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  connectionStatus: 'connecting' | 'open' | 'closed' | 'error';
  clientId: number | null;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  connectToServer: () => void;
  disconnectFromServer: () => void;
  sendChatMessage: () => void;
  testConnection: () => void;
  testLoading: boolean;
  testStatus: string;
}

export const WebSocketPanel: React.FC<WebSocketPanelProps> = ({
  serverUrl,
  setServerUrl,
  connectionStatus,
  clientId,
  inputMessage,
  setInputMessage,
  connectToServer,
  disconnectFromServer,
  sendChatMessage,
  testConnection,
  testLoading,
  testStatus
}) => {
  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ marginTop: 0, marginBottom: '10px' }}>WebSocket 控制</h3>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>WebSocket 服务器</label>
        <input
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          placeholder="WebSocket服务器URL"
          style={styles.input}
        />
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px', 
        marginTop: '15px'
      }}>
        <button
          onClick={connectToServer}
          disabled={connectionStatus === 'connecting' || connectionStatus === 'open'}
          style={{
            ...styles.button,
            ...(connectionStatus === 'connecting' || connectionStatus === 'open' ? styles.buttonDisabled : {})
          }}
        >
          连接 WebSocket
        </button>

        <button
          onClick={disconnectFromServer}
          disabled={connectionStatus === 'closed' || connectionStatus === 'error'}
          style={{
            ...styles.button,
            ...(connectionStatus === 'closed' || connectionStatus === 'error' ? styles.buttonDisabled : {})
          }}
        >
          断开 WebSocket
        </button>
        
        <button
          onClick={testConnection}
          disabled={testLoading || connectionStatus !== 'open'}
          style={{
            ...styles.button,
            ...(testLoading || connectionStatus !== 'open' ? styles.buttonDisabled : {})
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
          marginTop: '10px'
        }}
      >
        WebSocket 状态:{' '}
        {connectionStatus === 'connecting'
          ? '连接中'
          : connectionStatus === 'open'
          ? '已连接'
          : connectionStatus === 'closed'
          ? '已断开'
          : '错误'}
        {clientId !== null && connectionStatus === 'open' && ` (ID: ${clientId})`}
      </div>
      
      {connectionStatus === 'open' && (
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>发送消息</label>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="输入消息..."
              disabled={connectionStatus !== 'open'}
              style={{ ...styles.input, marginBottom: 0, flex: 1 }}
            />
            <button
              onClick={sendChatMessage}
              disabled={connectionStatus !== 'open' || inputMessage.trim() === ''}
              style={{
                ...styles.button,
                ...(connectionStatus !== 'open' || inputMessage.trim() === '' ? styles.buttonDisabled : {}),
                marginLeft: '10px'
              }}
            >
              发送
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const TestResultPopup: React.FC<TestResult & { show: boolean }> = ({ show, success, message }) => {
  if (!show) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: success ? '#43aa8b' : '#f94144',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}; 