# Koa API 服务器

基于 Koa.js 构建的现代化 API 服务器

## 项目结构

```
/src
  /config       - 应用配置
  /controllers  - 控制器层，处理请求和响应
  /middlewares  - 中间件
  /models       - 数据模型（未来可连接数据库）
  /routes       - 路由定义
  /services     - 服务层，业务逻辑处理
  /utils        - 工具函数
  app.js        - 应用配置和中间件设置
  index.js      - 应用入口点
```

## 使用说明

### 开发环境

```bash
npm install
npm run dev
```

### 生产环境

```bash
npm install
npm start
```

## API文档

### 基础路由

- `GET /` - 服务器欢迎页面
- `GET /api/test` - 测试API，返回示例数据
- `POST /api/data` - 接收数据的示例API

## 特点

- 分层架构设计，关注点分离
- 中间件系统，易于扩展
- 统一的错误处理
- 标准化API响应格式
- 灵活的配置管理 