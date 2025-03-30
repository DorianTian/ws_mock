/**
 * 错误处理中间件
 * 捕获并统一处理应用中的错误
 */
const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('服务器错误:', err);
    
    // 设置状态码（默认为500）
    ctx.status = err.status || 500;
    
    // 构建错误响应
    ctx.body = {
      success: false,
      message: err.message || '服务器内部错误',
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    };
    
    // 触发应用级错误事件
    ctx.app.emit('error', err, ctx);
  }
};

module.exports = errorHandler; 