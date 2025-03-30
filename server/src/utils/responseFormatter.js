/**
 * 响应格式化工具
 * 统一API响应格式
 */
class ResponseFormatter {
  /**
   * 成功响应
   * @param {Object} data - 响应数据
   * @param {string} message - 响应消息
   * @returns {Object} 格式化的响应对象
   */
  static success(data = null, message = '操作成功') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * 错误响应
   * @param {string} message - 错误消息
   * @param {number} status - HTTP状态码
   * @param {Object} error - 错误详情
   * @returns {Object} 格式化的错误响应对象
   */
  static error(message = '操作失败', status = 400, error = null) {
    return {
      success: false,
      message,
      status,
      error,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ResponseFormatter; 