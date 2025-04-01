import { useState, useEffect } from 'react';
import { styles } from '../styles/websocket.styles';

// 自定义 hooks
import { useWebSocket } from '../hooks/useWebSocket';
import { useSSE } from '../hooks/useSSE';
import { useMessageHandling } from '../utils/messageUtils';

// 导入组件
import { MessageList } from '../components/MessageList';
import { LogPopup } from '../components/LogPopup';
import { WebSocketPanel, TestResultPopup } from '../components/WebSocketPanel';
import { SSEPanel } from '../components/SSEPanel';
import { TestResult } from '../types/websocket.types';

const WebsocketDemonstration = () => {
  // 状态管理
  const [testLoading, setTestLoading] = useState(false);
  const [testStatus, setTestStatus] = useState('');
  const [showTestResult, setShowTestResult] = useState<TestResult>({
    show: false,
    success: false,
    message: '',
  });

  // 使用自定义hooks
  const { messages, addMessage } = useMessageHandling();

  const {
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
    cleanup: cleanupWebSocket,
  } = useWebSocket({
    addMessage,
    setTestStatus,
    setTestLoading,
    setShowTestResult,
  });

  const {
    sseUrl,
    setSseUrl,
    logs,
    setLogs,
    showLogPopup,
    setShowLogPopup,
    sseConnected,
    isPushingEnabled,
    isTerminated,
    connectToSSE,
    disconnectFromSSE,
    togglePushing,
    terminateService,
    restartService,
    handleInsertSSELog,
    cleanup: cleanupSSE,
  } = useSSE({ addMessage });

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      cleanupWebSocket();
      cleanupSSE();
    };
  }, [cleanupWebSocket, cleanupSSE]);

  return (
    <div style={styles.websocketDemo}>
      <h1 style={styles.title}>WebSocket 演示</h1>

      {/* 测试结果弹窗 */}
      <TestResultPopup show={showTestResult.show} success={showTestResult.success} message={showTestResult.message} />

      {/* 日志弹窗 */}
      <LogPopup logs={logs} showLogPopup={showLogPopup} setShowLogPopup={setShowLogPopup} setLogs={setLogs} />

      <div style={styles.panelsContainer}>
        {/* 左侧面板：WebSocket */}
        <div style={styles.panel}>
          <WebSocketPanel
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
            connectionStatus={connectionStatus}
            clientId={clientId}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            connectToServer={connectToServer}
            disconnectFromServer={disconnectFromServer}
            sendChatMessage={sendChatMessage}
            testConnection={testConnection}
            testLoading={testLoading}
            testStatus={testStatus}
          />
        </div>

        {/* 右侧面板：SSE */}
        <div style={styles.panel}>
          <SSEPanel
            sseUrl={sseUrl}
            setSseUrl={setSseUrl}
            sseConnected={sseConnected}
            isPushingEnabled={isPushingEnabled}
            isTerminated={isTerminated}
            connectToSSE={connectToSSE}
            disconnectFromSSE={disconnectFromSSE}
            togglePushing={togglePushing}
            terminateService={terminateService}
            restartService={restartService}
            handleInsertSSELog={handleInsertSSELog}
            setShowLogPopup={setShowLogPopup}
            showLogPopup={showLogPopup}
          />
        </div>
      </div>

      {/* 消息列表区域 */}
      <div style={styles.messagesContainer}>
        <MessageList messages={messages} />
      </div>
    </div>
  );
};

export default WebsocketDemonstration;
