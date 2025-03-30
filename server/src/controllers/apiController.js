const apiService = require("../services/apiService");
const ResponseFormatter = require("../utils/responseFormatter");

/**
 * API控制器
 * 处理API相关请求
 */
class ApiController {
  /**
   * 获取测试数据
   * @param {Object} ctx - Koa上下文
   */
  async getTestData(ctx) {
    try {
      // 调用服务层获取数据
      const result = await apiService.getTestData();

      ctx.body = ResponseFormatter.success(result);
    } catch (error) {
      ctx.status = 500;
      ctx.body = ResponseFormatter.error("获取数据失败", 500, error.message);
    }
  }

  /**
   * 模拟接收数据的POST请求
   * @param {Object} ctx - Koa上下文
   */
  async postData(ctx) {
    try {
      const data = ctx.request.body;

      // 调用服务层处理数据
      const processedData = await apiService.processData(data);

      ctx.body = ResponseFormatter.success(processedData, "数据处理成功");
    } catch (error) {
      ctx.status = 400;
      ctx.body = ResponseFormatter.error("数据处理失败", 400, error.message);
    }
  }

  /**
   * 获取WebSocket数据
   * @param {Object} ctx - Koa上下文
   */
  async getWebsocketData(ctx) {
    try {
      const result = await apiService.getWebsocketData();
      ctx.body = ResponseFormatter.success(result);
    } catch (error) {
      ctx.status = 500;
      ctx.body = ResponseFormatter.error("获取数据失败", 500, error.message);
    }
  }
}

module.exports = new ApiController();
