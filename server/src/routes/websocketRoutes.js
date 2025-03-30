const Router = require('koa-router');
const websocketController = require('../controllers/websocketController');

const router = new Router({
  prefix: '/api/websocket'
});

// 获取所有连接的客户端列表
router.get('/clients', websocketController.getClients);

// 向指定客户端发送消息
router.post('/send', websocketController.sendMessageToClient);

// 广播消息给所有客户端
router.post('/broadcast', websocketController.broadcastMessageToAll);

module.exports = router; 