const cors = require('./cors');
const errorHandler = require('./errorHandler');
const logger = require('./logger');

/**
 * 注册全局中间件
 * @param {Object} app - Koa应用实例
 */
const registerMiddlewares = (app) => {
  // 错误处理中间件应该放在最前面
  app.use(errorHandler);
  
  // 日志中间件
  app.use(logger);
  
  // CORS中间件
  app.use(cors);
};

module.exports = registerMiddlewares; 