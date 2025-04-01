// SSE (Server-Sent Events) Service for real-time log pushing
const clients = new Map();

// 控制消息推送的开关
let isPushingEnabled = true;

// 服务终止状态
let isTerminated = false;

// Setup SSE connection
function setupSSE(req, res) {
  // 如果服务已终止，拒绝新连接
  if (isTerminated) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'SSE service has been terminated' }));
    return;
  }
  
  const clientId = Date.now();
  
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Send initial connection message
  sendEvent(res, 'connection', { 
    message: 'SSE connection established',
    clientId,
    isPushingEnabled,
    isTerminated
  });
  
  // Store client connection
  clients.set(clientId, res);
  console.log(`SSE connection established: ID ${clientId}`);
  
  // Handle client disconnect
  req.on('close', () => {
    clients.delete(clientId);
    console.log(`SSE client ${clientId} disconnected`);
  });
}

// Send event to a specific client
function sendEvent(client, event, data) {
  client.write(`event: ${event}\n`);
  client.write(`data: ${JSON.stringify(data)}\n\n`);
}

// Push log to all connected clients
function pushLog(logType, logMessage) {
  // 如果服务已终止或消息推送已关闭，则不推送
  if (isTerminated || !isPushingEnabled) {
    const reason = isTerminated ? 'service terminated' : 'pushing disabled';
    console.log(`Log push skipped (${reason}): ${logType} - ${logMessage}`);
    return 0;
  }
  
  const logData = {
    type: logType,
    message: logMessage,
    timestamp: new Date().toISOString()
  };
  
  clients.forEach((client) => {
    sendEvent(client, 'log', logData);
  });
  
  console.log(`Log pushed to ${clients.size} clients: ${logType} - ${logMessage}`);
  return clients.size; // Return number of clients that received the log
}

// Push log to a specific client
function pushLogToClient(clientId, logType, logMessage) {
  // 如果服务已终止或消息推送已关闭，则不推送
  if (isTerminated || !isPushingEnabled) {
    const reason = isTerminated ? 'service terminated' : 'pushing disabled';
    console.log(`Log push to client ${clientId} skipped (${reason}): ${logType} - ${logMessage}`);
    return false;
  }
  
  const client = clients.get(clientId);
  if (!client) return false;
  
  const logData = {
    type: logType,
    message: logMessage,
    timestamp: new Date().toISOString()
  };
  
  sendEvent(client, 'log', logData);
  console.log(`Log pushed to client ${clientId}: ${logType} - ${logMessage}`);
  return true;
}

// Get all connected clients
function getConnectedClients() {
  return Array.from(clients.keys());
}

// Toggle message pushing
function togglePushing(enabled) {
  // 如果服务已终止，则不允许切换状态
  if (isTerminated) {
    console.log('Cannot toggle pushing: service is terminated');
    return false;
  }
  
  if (enabled !== undefined) {
    isPushingEnabled = !!enabled;
  } else {
    isPushingEnabled = !isPushingEnabled;
  }
  
  // 通知所有客户端推送状态已改变
  const statusMessage = {
    type: 'status',
    isPushingEnabled,
    message: isPushingEnabled ? '日志推送已启用' : '日志推送已暂停',
    timestamp: new Date().toISOString()
  };
  
  clients.forEach((client) => {
    sendEvent(client, 'push_status', statusMessage);
  });
  
  console.log(`Message pushing ${isPushingEnabled ? 'enabled' : 'disabled'}`);
  return isPushingEnabled;
}

// Get current pushing status
function getPushingStatus() {
  return isPushingEnabled;
}

/**
 * 终止SSE服务
 * 关闭所有连接并清空客户端列表
 * @returns {number} 终止的连接数
 */
function terminateService() {
  if (isTerminated) {
    console.log('SSE service is already terminated');
    return 0;
  }
  
  // 标记服务为已终止
  isTerminated = true;
  
  // 向所有客户端发送终止通知
  const terminationMessage = {
    type: 'termination',
    message: '日志服务已终止，连接将被关闭',
    timestamp: new Date().toISOString()
  };
  
  clients.forEach((client, clientId) => {
    try {
      // 发送终止通知
      sendEvent(client, 'service_terminated', terminationMessage);
      
      // 尝试结束响应
      if (client.end && typeof client.end === 'function') {
        client.end();
      } else if (client.destroy && typeof client.destroy === 'function') {
        client.destroy();
      }
    } catch (error) {
      console.error(`Error terminating client ${clientId}:`, error);
    }
  });
  
  const clientCount = clients.size;
  
  // 清空客户端列表
  clients.clear();
  
  // 尝试停止日志推送服务
  try {
    const logPusher = require('../utils/testLogPusher');
    if (logPusher && typeof logPusher.stopLogPusher === 'function') {
      logPusher.stopLogPusher();
    }
  } catch (error) {
    console.error('Failed to stop log pusher:', error);
  }
  
  console.log(`SSE service terminated, ${clientCount} connections closed`);
  return clientCount;
}

/**
 * 重新启动SSE服务
 * 仅当服务已终止时可用
 * @returns {boolean} 是否成功重启
 */
function restartService() {
  if (!isTerminated) {
    console.log('Cannot restart: SSE service is not terminated');
    return false;
  }
  
  // 重置服务状态
  isTerminated = false;
  isPushingEnabled = true;
  
  // 尝试重启日志推送服务
  try {
    const logPusher = require('../utils/testLogPusher');
    if (logPusher && typeof logPusher.startLogPusher === 'function') {
      logPusher.startLogPusher();
    }
  } catch (error) {
    console.error('Failed to restart log pusher:', error);
  }
  
  console.log('SSE service restarted and ready to accept connections');
  return true;
}

/**
 * 获取服务终止状态
 * @returns {boolean} 服务是否已终止
 */
function getTerminationStatus() {
  return isTerminated;
}

module.exports = {
  setupSSE,
  pushLog,
  pushLogToClient,
  getConnectedClients,
  togglePushing,
  getPushingStatus,
  terminateService,
  restartService,
  getTerminationStatus
};
