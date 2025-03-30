/**
 * API服务
 * 处理API相关的业务逻辑
 */
class ApiService {
  /**
   * 获取测试数据
   * 实际应用中可能会从数据库或外部API获取数据
   * @returns {Object} 测试数据
   */
  async getTestData() {
    // 模拟异步操作
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: "这是来自后端的测试数据",
          from: "ApiService",
        });
      }, 100);
    });
  }

  /**
   * 处理接收到的数据
   * @param {Object} data - 客户端发送的数据
   * @returns {Object} 处理结果
   */
  async processData(data) {
    // 在这里可以进行数据处理、验证等操作
    return {
      received: data,
      processed: true,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new ApiService();
