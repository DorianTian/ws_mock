const config = require('../config');

/**
 * CORS 中间件
 * 处理跨域资源共享
 */
const corsMiddleware = async (ctx, next) => {
  const { origin, allowMethods, allowHeaders } = config.cors;
  
  ctx.set('Access-Control-Allow-Origin', origin);
  ctx.set('Access-Control-Allow-Methods', allowMethods.join(', '));
  ctx.set('Access-Control-Allow-Headers', allowHeaders.join(', '));

  // 预检请求直接返回
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }

  await next();
};

module.exports = corsMiddleware; 