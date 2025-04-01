import React, { useEffect, useRef } from 'react';
import { LogMessage } from '../types/websocket.types';

interface LogPopupProps {
  logs: LogMessage[];
  showLogPopup: boolean;
  setShowLogPopup: (show: boolean) => void;
  setLogs: (logs: LogMessage[]) => void;
}

export const LogPopup: React.FC<LogPopupProps> = ({ logs, showLogPopup, setShowLogPopup, setLogs }) => {
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  
  // 当logs更新或弹窗显示时，滚动到最新消息
  useEffect(() => {
    if (showLogPopup && logs.length > 0 && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, showLogPopup]);
  
  if (!showLogPopup) {
    return null;
  }
  
  // 即使没有日志也显示弹窗
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '600px',
        maxHeight: '400px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #ddd',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>服务器日志</span>
        <div>
          <button
            onClick={() => setLogs([])}
            style={{
              marginRight: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#555',
            }}
          >
            清空
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#555',
            }}
            onClick={() => setShowLogPopup(false)}
          >
            ×
          </button>
        </div>
      </div>
      <div
        ref={logContainerRef}
        style={{
          overflowY: 'auto',
          padding: '10px',
          maxHeight: '350px',
        }}
      >
        {logs.length === 0 ? (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#888',
            fontStyle: 'italic'
          }}>
            暂无日志信息
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                padding: '8px 10px',
                marginBottom: '8px',
                backgroundColor: log.type === 'error' ? '#ffecec' : log.type === 'warning' ? '#fff9e6' : '#f0f8ff',
                borderLeft: `3px solid ${
                  log.type === 'error' ? '#f44336' : log.type === 'warning' ? '#ffb800' : '#2196f3'
                }`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: log.type === 'error' ? '#f44336' : log.type === 'warning' ? '#ffb800' : '#2196f3',
                  }}
                >
                  {log.type.toUpperCase()}
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div style={{ marginTop: '4px' }}>{log.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 