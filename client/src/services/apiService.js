/**
 * API 服务
 * 封装与后端的API交互
 */
const apiService = {
  /**
   * 获取测试数据
   * @returns {Promise<Object>} API响应对象
   */
  async getTestData() {
    const response = await fetch('/api/test');
    
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '请求返回错误');
    }
    
    return result;
  },
  
  /**
   * 发送数据到服务器
   * @param {Object} data - 要发送的数据
   * @returns {Promise<Object>} API响应对象
   */
  async postData(data) {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '请求返回错误');
    }
    
    return result;
  }
};

export default apiService; 