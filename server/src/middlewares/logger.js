/**
 * 日志中间件
 * 记录请求和响应信息
 */
const logger = async (ctx, next) => {
  const start = Date.now();
  
  // 记录请求开始
  console.log(`--> ${ctx.method} ${ctx.url}`);
  
  await next();
  
  // 计算响应时间
  const ms = Date.now() - start;
  
  // 记录响应信息
  console.log(`<-- ${ctx.method} ${ctx.url} ${ctx.status} ${ms}ms`);
};

module.exports = logger; 