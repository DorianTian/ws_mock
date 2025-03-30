const Router = require('koa-router');
const homeController = require('../controllers/homeController');

const router = new Router();

// 首页路由
router.get('/', homeController.index);

module.exports = router; 