const sseService = require('../services/sseService');

/**
 * 设置SSE连接
 * @param {Object} ctx - Koa上下文
 */
async function setupSSEConnection(ctx) {
  // Set up SSE connection with the raw request and response
  sseService.setupSSE(ctx.req, ctx.res);

  // Tell Koa not to handle this response
  ctx.respond = false;
}

/**
 * 推送日志消息
 * @param {Object} ctx - Koa上下文
 */
async function pushLogMessage(ctx) {
  const { type, message } = ctx.request.body;
  
  if (!type || !message) {
    ctx.status = 400;
    ctx.body = { success: false, message: '类型和消息内容是必需的' };
    return;
  }
  
  const clientCount = sseService.pushLog(type, message);
  
  ctx.body = {
    success: true,
    message: `日志已推送到 ${clientCount} 个客户端`,
    clientCount
  };
}

/**
 * 获取已连接的SSE客户端列表
 * @param {Object} ctx - Koa上下文
 */
async function getConnectedClients(ctx) {
  const clients = sseService.getConnectedClients();
  ctx.body = {
    success: true,
    count: clients.length,
    clients
  };
}

/**
 * 切换日志推送状态
 * @param {Object} ctx - Koa上下文
 */
async function toggleMessagePushing(ctx) {
  const { enabled } = ctx.request.body;
  
  const currentStatus = sseService.togglePushing(enabled);
  
  ctx.body = {
    success: true,
    message: currentStatus ? '日志推送已启用' : '日志推送已暂停',
    isPushingEnabled: currentStatus
  };
}

/**
 * 获取当前日志推送状态
 * @param {Object} ctx - Koa上下文
 */
async function getPushingStatus(ctx) {
  const isPushingEnabled = sseService.getPushingStatus();
  
  ctx.body = {
    success: true,
    isPushingEnabled
  };
}

/**
 * 终止SSE服务
 * @param {Object} ctx - Koa上下文
 */
async function terminateService(ctx) {
  const isAlreadyTerminated = sseService.getTerminationStatus();
  
  if (isAlreadyTerminated) {
    ctx.body = {
      success: false,
      message: 'SSE服务已经处于终止状态',
      terminationStatus: true
    };
    return;
  }
  
  const closedCount = sseService.terminateService();
  
  ctx.body = {
    success: true,
    message: `SSE服务已终止，关闭了 ${closedCount} 个连接`,
    terminationStatus: true,
    closedConnections: closedCount
  };
}

/**
 * 重启SSE服务
 * @param {Object} ctx - Koa上下文
 */
async function restartService(ctx) {
  const isTerminated = sseService.getTerminationStatus();
  
  if (!isTerminated) {
    ctx.body = {
      success: false,
      message: 'SSE服务未处于终止状态，无法重启',
      terminationStatus: false
    };
    return;
  }
  
  const restarted = sseService.restartService();
  
  if (restarted) {
    ctx.body = {
      success: true,
      message: 'SSE服务已重启，可以接受新连接',
      terminationStatus: false
    };
  } else {
    ctx.body = {
      success: false,
      message: '重启SSE服务失败',
      terminationStatus: true
    };
  }
}

/**
 * 获取当前终止状态
 * @param {Object} ctx - Koa上下文
 */
async function getTerminationStatus(ctx) {
  const isTerminated = sseService.getTerminationStatus();
  
  ctx.body = {
    success: true,
    isTerminated
  };
}

module.exports = {
  setupSSEConnection,
  pushLogMessage,
  getConnectedClients,
  toggleMessagePushing,
  getPushingStatus,
  terminateService,
  restartService,
  getTerminationStatus
}; 