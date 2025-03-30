const http = require('http');
const app = require('./app');
const config = require('./config');
const { createWebSocketServer } = require('./services/websocketService');

const PORT = config.server.port;
const HOST = config.server.host;

// 创建HTTP服务器
const server = http.createServer(app.callback());

// 创建WebSocket服务器
const wss = createWebSocketServer(server);

// 启动服务器
server.listen(PORT, () => {
  console.log(`
===============================================
  服务器运行在 http://${HOST}:${PORT}
  WebSocket 服务已启动
  环境: ${config.env}
  时间: ${new Date().toLocaleString()}
===============================================
  `);
}); 