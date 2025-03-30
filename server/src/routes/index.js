const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./apiRoutes');
const websocketRoutes = require('./websocketRoutes');

/**
 * 注册所有路由
 * @param {Object} app - Koa应用实例
 */
const registerRoutes = (app) => {
  app.use(homeRoutes.routes()).use(homeRoutes.allowedMethods());
  app.use(apiRoutes.routes()).use(apiRoutes.allowedMethods());
  app.use(websocketRoutes.routes()).use(websocketRoutes.allowedMethods());
  
  // 可以在这里添加更多路由
};

module.exports = registerRoutes; 