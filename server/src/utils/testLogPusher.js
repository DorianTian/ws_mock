/**
 * 测试日志推送工具
 * 在服务器启动时自动运行，定期推送测试日志
 */

const sseService = require('../services/sseService');

// 系统事件类型
const logTypes = ['info', 'warning', 'error', 'success', 'debug'];

// 预定义的系统日志消息
const logMessages = {
  info: [
    '系统启动完成',
    '用户登录成功',
    '数据同步完成',
    '配置更新成功',
    '服务健康检查通过',
    '数据库连接正常',
    '缓存清理完成',
    '文件上传成功',
    '邮件发送成功',
    '计划任务执行完成'
  ],
  warning: [
    '服务响应时间过长',
    '硬盘空间不足',
    '内存使用率过高',
    '数据库连接池接近饱和',
    '缓存命中率下降',
    '任务队列积压',
    '配置使用了默认值',
    'API调用频率接近限制',
    '服务器负载过高',
    '数据备份接近过期'
  ],
  error: [
    '数据库查询失败',
    '服务器连接超时',
    '认证失败',
    '权限不足',
    '文件未找到',
    '数据解析错误',
    '资源不可用',
    '依赖服务异常',
    '并发事务冲突',
    '配置验证失败'
  ],
  success: [
    '部署成功',
    '测试全部通过',
    '备份完成',
    '恢复完成',
    '优化完成',
    '安全扫描通过',
    '服务扩容成功',
    '数据迁移完成',
    '版本更新成功',
    '故障恢复完成'
  ],
  debug: [
    '会话状态更新',
    '缓存键过期',
    '资源释放',
    '连接池状态变更',
    '线程池调整',
    '调试模式启用',
    '跟踪信息记录',
    '性能指标采集',
    '垃圾回收触发',
    '配置重载'
  ]
};

// 日志推送定时器引用
let logPushTimer = null;

/**
 * 获取随机日志类型
 * @returns {string} 日志类型
 */
function getRandomLogType() {
  return logTypes[Math.floor(Math.random() * logTypes.length)];
}

/**
 * 获取随机日志消息
 * @param {string} type 日志类型
 * @returns {string} 日志消息
 */
function getRandomLogMessage(type) {
  const messages = logMessages[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * 生成随机时间间隔 (3-15秒)
 * @returns {number} 毫秒数
 */
function getRandomInterval() {
  return (Math.floor(Math.random() * 12) + 3) * 1000;
}

/**
 * 推送随机日志
 */
function pushRandomLog() {
  // 清除当前timer
  if (logPushTimer) {
    clearTimeout(logPushTimer);
    logPushTimer = null;
  }
  
  // 检查服务是否终止
  if (sseService.getTerminationStatus()) {
    console.log('日志推送服务已终止，不再推送日志');
    return;
  }
  
  // 即使当前推送被禁用，也要安排下一次推送，只是不发送日志
  // 这样当推送重新启用时可以立即开始工作
  const nextInterval = getRandomInterval();

  // 检查推送是否启用
  if (!sseService.getPushingStatus()) {
    console.log('自动日志推送已暂停，等待下一次检查');
    logPushTimer = setTimeout(pushRandomLog, nextInterval);
    return;
  }

  const type = getRandomLogType();
  const message = getRandomLogMessage(type);
  const timestamp = new Date().toISOString();
  
  // 添加一些随机详细信息使日志看起来更真实
  const details = {
    source: ['system', 'app', 'database', 'network', 'security'][Math.floor(Math.random() * 5)],
    module: ['auth', 'data', 'api', 'ui', 'scheduler'][Math.floor(Math.random() * 5)],
    id: Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  };
  
  const fullMessage = `[${details.source}:${details.module}:${details.id}] ${message}`;
  
  // 如果有连接的客户端，推送日志
  const clientCount = sseService.pushLog(type, fullMessage);
  
  if (clientCount > 0) {
    console.log(`推送了类型为 ${type} 的日志消息到 ${clientCount} 个客户端`);
  }
  
  // 安排下一次日志推送
  logPushTimer = setTimeout(pushRandomLog, nextInterval);
}

/**
 * 开始日志推送服务
 */
function startLogPusher() {
  console.log('启动测试日志推送服务');
  // 延迟5秒后开始第一次推送，让服务器有时间完全启动
  logPushTimer = setTimeout(pushRandomLog, 5000);
}

/**
 * 停止日志推送服务
 */
function stopLogPusher() {
  if (logPushTimer) {
    clearTimeout(logPushTimer);
    logPushTimer = null;
    console.log('测试日志推送服务已停止');
  }
}

module.exports = {
  startLogPusher,
  stopLogPusher
}; 