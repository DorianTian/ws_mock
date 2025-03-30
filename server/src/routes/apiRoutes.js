const Router = require('koa-router');
const apiController = require('../controllers/apiController');

// 创建路由前缀为/api的路由器
const router = new Router({
  prefix: '/api'
});

// API路由
router.get("/test", apiController.getTestData);
router.post("/data", apiController.postData);

module.exports = router;
