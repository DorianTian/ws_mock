const ResponseFormatter = require('../utils/responseFormatter');

/**
 * 首页控制器
 * 处理首页相关的请求
 */
class HomeController {
  /**
   * 处理首页请求
   * @param {Object} ctx - Koa上下文
   */
  async index(ctx) {
    const data = {
      version: '1.0.0',
      apiDocs: '/api/docs',
      description: 'Koa 后端 API 服务'
    };
    
    ctx.body = ResponseFormatter.success(data, 'Koa 服务器运行成功!');
  }
}

module.exports = new HomeController(); 