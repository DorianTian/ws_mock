const config = {
  // 环境配置
  env: process.env.NODE_ENV || 'development',
  
  // 服务器配置
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost'
  },
  
  // 跨域配置
  cors: {
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
  },
  
  // 数据库配置 (未来可以添加)
  // database: {
  //   uri: process.env.DB_URI || 'mongodb://localhost:27017/myapp',
  // },
  
  // JWT配置 (未来可以添加)
  // jwt: {
  //   secret: process.env.JWT_SECRET || 'your-secret-key',
  //   expiresIn: '1d'
  // }
};

module.exports = config; 