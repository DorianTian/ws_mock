import React from 'react';
import { styles } from '../styles/websocket.styles';

interface SSEPanelProps {
  sseUrl: string;
  setSseUrl: (url: string) => void;
  sseConnected: boolean;
  isPushingEnabled: boolean;
  isTerminated: boolean;
  connectToSSE: () => void;
  disconnectFromSSE: () => void;
  togglePushing: () => void;
  terminateService: () => void;
  restartService: () => void;
  handleInsertSSELog: () => void;
  setShowLogPopup: (show: boolean) => void;
  showLogPopup: boolean;
}

export const SSEPanel: React.FC<SSEPanelProps> = ({
  sseUrl,
  setSseUrl,
  sseConnected,
  isPushingEnabled,
  isTerminated,
  connectToSSE,
  disconnectFromSSE,
  togglePushing,
  terminateService,
  restartService,
  handleInsertSSELog,
  setShowLogPopup,
  showLogPopup
}) => {
  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ marginTop: 0, marginBottom: '10px' }}>SSE 日志控制</h3>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>SSE 日志服务器</label>
        <input
          type="text"
          value={sseUrl}
          onChange={(e) => setSseUrl(e.target.value)}
          placeholder="SSE服务器URL"
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
          onClick={connectToSSE}
          disabled={sseConnected || isTerminated}
          style={{
            ...styles.button,
            ...(sseConnected || isTerminated ? styles.buttonDisabled : {})
          }}
        >
          连接日志
        </button>
        
        <button
          onClick={disconnectFromSSE}
          disabled={!sseConnected}
          style={{
            ...styles.button,
            ...(!sseConnected ? styles.buttonDisabled : {})
          }}
        >
          断开日志
        </button>
        
        <button
          style={{
            ...styles.button,
            ...(isTerminated ? styles.buttonDisabled : {})
          }}
          onClick={handleInsertSSELog}
          disabled={isTerminated}
        >
          插入一条日志
        </button>
        
        <button 
          onClick={() => setShowLogPopup(!showLogPopup)} 
          style={styles.button}
        >
          {showLogPopup ? '隐藏日志' : '显示日志'}
        </button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px', 
        marginTop: '10px'
      }}>
        <button
          onClick={togglePushing}
          disabled={!sseConnected || isTerminated}
          style={{
            ...styles.button,
            ...(!sseConnected || isTerminated ? styles.buttonDisabled : {}),
            backgroundColor: isPushingEnabled ? '#f94144' : '#43aa8b'
          }}
        >
          {isPushingEnabled ? '暂停推送' : '恢复推送'}
        </button>
        
        <button
          onClick={terminateService}
          disabled={isTerminated}
          style={{
            ...styles.button,
            ...(isTerminated ? styles.buttonDisabled : {}),
            backgroundColor: '#bc2020'
          }}
        >
          终止服务
        </button>
        
        <button
          onClick={restartService}
          disabled={!isTerminated}
          style={{
            ...styles.button,
            ...(!isTerminated ? styles.buttonDisabled : {}),
            backgroundColor: '#32a852'
          }}
        >
          重启服务
        </button>
      </div>
      
      <div
        style={{
          ...styles.statusIndicator,
          marginTop: '10px',
          ...(isTerminated ? { backgroundColor: '#bc2020' } : {})
        }}
      >
        SSE 日志: {sseConnected ? '已连接' : '未连接'}
        {sseConnected && ` | 推送状态: ${isPushingEnabled ? '已启用' : '已暂停'}`}
        {isTerminated && ' | SSE 服务: 已终止'}
      </div>
    </div>
  );
}; 