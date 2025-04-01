import { useState, useRef, useCallback, useEffect } from 'react';
import { LogMessage } from '../types/websocket.types';

interface UseSSEProps {
  addMessage: (text: string, sender: 'client' | 'server') => void;
}

export const useSSE = ({ addMessage }: UseSSEProps) => {
  const [sseUrl, setSseUrl] = useState('//localhost:3001/sse/logs');
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [showLogPopup, setShowLogPopup] = useState(false);
  const [sseConnected, setSseConnected] = useState(false);
  const [isPushingEnabled, setIsPushingEnabled] = useState(true);
  const [isTerminated, setIsTerminated] = useState(false);

  const sseRef = useRef<EventSource | null>(null);

  // 获取当前推送状态
  const fetchPushingStatus = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/sse/pushing-status');
      const data = await res.json();

      if (data.success) {
        setIsPushingEnabled(data.isPushingEnabled);
      }
    } catch (error) {
      console.error('获取推送状态失败:', error);
    }
  }, []);

  // 获取终止状态
  const fetchTerminationStatus = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/sse/termination-status');
      const data = await res.json();

      if (data.success) {
        setIsTerminated(data.isTerminated);
      }
    } catch (error) {
      console.error('获取终止状态失败:', error);
    }
  }, []);

  // Fetch termination status on mount
  useEffect(() => {
    fetchTerminationStatus();
  }, [fetchTerminationStatus]);

  // Connect to SSE for log events
  const connectToSSE = useCallback(async () => {
    // 检查服务是否已终止
    try {
      const statusRes = await fetch('http://localhost:3001/sse/termination-status');
      const statusData = await statusRes.json();

      if (statusData.success && statusData.isTerminated) {
        setIsTerminated(true);
        addMessage('SSE服务已终止，无法连接', 'server');
        return;
      }
    } catch (error) {
      console.error('获取终止状态失败:', error);
    }

    if (sseRef.current) {
      sseRef.current.close();
      setSseConnected(false);
    }

    try {
      const eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        console.log('SSE连接已打开');
        setSseConnected(true);
        setIsTerminated(false);
        // 连接后获取当前推送状态
        fetchPushingStatus();

        // 添加一条连接成功的日志
        const connectionLog: LogMessage = {
          type: 'info',
          message: 'SSE日志连接已成功建立',
          timestamp: new Date().toISOString(),
        };
        setLogs((prevLogs) => [...prevLogs, connectionLog]);
        // 强制显示日志弹窗
        setShowLogPopup(true);
      };

      eventSource.addEventListener('connection', (event) => {
        const data = JSON.parse(event.data);
        console.log('SSE连接已建立:', data);
        // 从连接事件中获取当前推送状态
        if (data.isPushingEnabled !== undefined) {
          setIsPushingEnabled(data.isPushingEnabled);
        }
        if (data.isTerminated !== undefined) {
          setIsTerminated(data.isTerminated);
        }
      });

      eventSource.addEventListener('log', (event) => {
        try {
          const logData = JSON.parse(event.data) as LogMessage;
          console.log('收到日志:', logData);

          // 添加新日志并显示弹窗
          setLogs((prevLogs) => {
            // 如果日志多于20条，则移除最早的日志
            const updatedLogs =
              prevLogs.length >= 20 ? [...prevLogs.slice(prevLogs.length - 19), logData] : [...prevLogs, logData];
            return updatedLogs;
          });

          // 强制显示日志弹窗
          setShowLogPopup(true);
        } catch (error) {
          console.error('解析日志失败:', error);
        }
      });

      eventSource.addEventListener('push_status', (event) => {
        try {
          const statusData = JSON.parse(event.data);
          console.log('推送状态变更:', statusData);

          // 更新推送状态
          setIsPushingEnabled(statusData.isPushingEnabled);

          // 添加状态变更通知
          addMessage(statusData.message, 'server');

          // 添加到日志
          const statusLog: LogMessage = {
            type: statusData.isPushingEnabled ? 'info' : 'warning',
            message: `推送状态已${statusData.isPushingEnabled ? '启用' : '暂停'}`,
            timestamp: new Date().toISOString(),
          };
          setLogs((prevLogs) => [...prevLogs, statusLog]);
          setShowLogPopup(true);
        } catch (error) {
          console.error('解析推送状态失败:', error);
        }
      });

      eventSource.addEventListener('service_terminated', (event) => {
        try {
          const terminationData = JSON.parse(event.data);
          console.log('服务终止:', terminationData);

          // 更新终止状态
          setIsTerminated(true);

          // 断开连接
          eventSource.close();
          setSseConnected(false);

          // 添加通知
          addMessage(terminationData.message || '日志服务已终止', 'server');

          // 添加到日志
          const terminationLog: LogMessage = {
            type: 'error',
            message: '日志服务已终止',
            timestamp: new Date().toISOString(),
          };
          setLogs((prevLogs) => [...prevLogs, terminationLog]);
          setShowLogPopup(true);
        } catch (error) {
          console.error('解析终止消息失败:', error);
        }
      });

      eventSource.onerror = (error) => {
        console.error('SSE连接错误:', error);
        setSseConnected(false);

        // 如果服务已终止，则标记为终止状态
        if (isTerminated) {
          eventSource.close();
        }

        // 添加到日志
        const errorLog: LogMessage = {
          type: 'error',
          message: 'SSE连接发生错误',
          timestamp: new Date().toISOString(),
        };
        setLogs((prevLogs) => [...prevLogs, errorLog]);
        setShowLogPopup(true);
      };

      sseRef.current = eventSource;
    } catch (error) {
      console.error('SSE连接失败:', error);
      setSseConnected(false);

      // 添加到日志
      const errorLog: LogMessage = {
        type: 'error',
        message: `SSE连接失败: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString(),
      };
      setLogs((prevLogs) => [...prevLogs, errorLog]);
      setShowLogPopup(true);
    }
  }, [sseUrl, isTerminated, addMessage, fetchPushingStatus]);

  // Disconnect from SSE
  const disconnectFromSSE = useCallback(() => {
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
      setSseConnected(false);
    }
  }, []);

  // 切换推送状态
  const togglePushing = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/sse/toggle-pushing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !isPushingEnabled }),
      });

      const data = await res.json();

      if (data.success) {
        setIsPushingEnabled(data.isPushingEnabled);
        addMessage(data.message, 'server');
      }
    } catch (error) {
      console.error('切换推送状态失败:', error);
    }
  }, [isPushingEnabled, addMessage]);

  // 终止SSE服务
  const terminateService = useCallback(async () => {
    // 确认是否真的要终止
    if (!window.confirm('确定要终止SSE服务吗？这将关闭所有连接，无法再接收日志，除非重启服务。')) {
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/sse/terminate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success) {
        setIsTerminated(true);
        // 如果仍然连接，则断开
        if (sseRef.current) {
          sseRef.current.close();
          sseRef.current = null;
          setSseConnected(false);
        }
        addMessage(data.message, 'server');
      } else {
        addMessage(data.message || 'SSE服务终止失败', 'server');
      }
    } catch (error) {
      console.error('终止服务失败:', error);
      addMessage('终止服务请求失败', 'server');
    }
  }, [addMessage]);

  // 重启SSE服务
  const restartService = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/sse/restart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success) {
        setIsTerminated(false);
        connectToSSE();
        addMessage(data.message, 'server');
      } else {
        addMessage(data.message || 'SSE服务重启失败', 'server');
      }
    } catch (error) {
      console.error('重启服务失败:', error);
      addMessage('重启服务请求失败', 'server');
    }
  }, [addMessage, connectToSSE]);

  // 添加一条自定义日志信息
  const handleInsertSSELog = useCallback(async () => {
    if (!sseConnected && !isTerminated) {
      // 如果未连接，但服务未终止，直接添加到本地日志
      const localLog: LogMessage = {
        type: 'info',
        message: '测试日志信息 (本地生成)',
        timestamp: new Date().toISOString(),
      };
      setLogs((prevLogs) => [...prevLogs, localLog]);
      setShowLogPopup(true);
      addMessage('已添加本地测试日志', 'server');
      return;
    }

    if (isTerminated) {
      addMessage('SSE服务已终止，无法添加日志', 'server');
      return;
    }

    console.log('sseRef.current', sseRef.current);
    if (sseRef.current) {
      try {
        const res = await fetch('http://localhost:3001/sse/push-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'info', message: '这是一条测试日志' }),
        });
        if (res.ok) {
          console.log('插入日志成功');
          addMessage('插入日志成功', 'server');
        } else {
          console.error('插入日志失败:', res.statusText);
          addMessage('插入日志失败', 'server');

          // 添加到本地日志
          const errorLog: LogMessage = {
            type: 'error',
            message: `插入日志失败: ${res.statusText}`,
            timestamp: new Date().toISOString(),
          };
          setLogs((prevLogs) => [...prevLogs, errorLog]);
          setShowLogPopup(true);
        }
      } catch (error) {
        console.error('插入日志失败:', error);

        // 添加到本地日志
        const errorLog: LogMessage = {
          type: 'error',
          message: `插入日志失败: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date().toISOString(),
        };
        setLogs((prevLogs) => [...prevLogs, errorLog]);
        setShowLogPopup(true);
      }
    } else {
      addMessage('SSE未连接', 'server');
    }
  }, [sseConnected, isTerminated, addMessage]);

  // 清理资源
  const cleanup = useCallback(() => {
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
  }, []);

  return {
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
    cleanup,
  };
};
