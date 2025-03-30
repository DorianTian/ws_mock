const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const config = require('./config');
const registerMiddlewares = require('./middlewares');
const registerRoutes = require('./routes');

// 创建Koa应用实例
const app = new Koa();

// 使用body解析中间件
app.use(bodyParser());

// 注册全局中间件
registerMiddlewares(app);

// 注册路由
registerRoutes(app);

// 处理未找到的路由
app.use(async (ctx) => {
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      message: '接口不存在',
      path: ctx.path
    };
  }
});

// 错误事件监听
app.on('error', (err, ctx) => {
  console.error('服务器错误', err);
});

module.exports = app; 