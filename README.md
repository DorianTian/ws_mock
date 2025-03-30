# React + Vite + Koa 全栈应用

一个使用 Vite + React 前端和 Koa 后端的现代全栈 Web 应用，支持 WebSocket 实时通信。

## 项目结构

```text
/
├── client/          # Vite + React 前端
├── server/          # Koa 后端
└── README.md        # 项目说明
```

## 开始使用

### 后端配置

1. 进入服务器目录

   ```bash
   cd server
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 启动开发服务器

   ```bash
   npm run dev
   ```

   或启动生产服务器

   ```bash
   npm start
   ```

### 前端配置

1. 进入客户端目录

   ```bash
   cd client
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 启动开发服务器

   ```bash
   npm run dev
   ```

4. 构建生产版本

   ```bash
   npm run build
   ```

## 端口配置

- 前端默认运行在 <http://localhost:3000>
- 后端默认运行在 <http://localhost:3001>
- 前端开发模式下使用代理转发 API 请求，避免 CORS 问题
- WebSocket 服务运行在相同端口 (ws://localhost:3001)

## WebSocket 功能

本项目实现了完整的 WebSocket 通信功能，支持实时消息传递和长时间异步操作监控。

### 主要功能

1. **实时聊天**：用户可以发送即时消息，所有连接的客户端都能实时接收。

2. **长时间异步操作模拟**：
   - 提供了"测试连接"功能，模拟服务器上的长时间异步操作
   - 服务器会实时推送操作进度和状态更新
   - 操作过程中会模拟随机问题和处理状态
   - 完成后提供详细的统计信息

3. **连接状态管理**：
   - 显示当前连接状态（连接中、已连接、已断开、错误）
   - 每个客户端分配唯一ID
   - 支持主动断开和重新连接

### 使用方法

1. 访问前端应用，进入 WebSocket 演示页面
2. 输入 WebSocket 服务器地址（默认为 ws://localhost:3001）
3. 点击"连接"按钮建立 WebSocket 连接
4. 连接成功后可以发送消息或测试长时间操作
5. 点击"测试连接"按钮启动服务器长时间操作模拟
6. 实时观察操作进度和最终结果

### 服务端 API

#### WebSocket 消息类型

- `connection`：连接建立通知
- `chat`：聊天消息
- `notification`：系统通知
- `test_progress`：长时间操作进度更新
- `test_complete`：长时间操作完成结果

#### HTTP 端点

- `GET /api/websocket/clients`：获取当前连接的客户端列表
- `POST /api/websocket/send`：向指定客户端发送消息
- `POST /api/websocket/broadcast`：广播消息给所有客户端

## 技术栈

- **前端**：Vite, React.js, TypeScript
- **后端**：Node.js, Koa.js
- **通信**：RESTful API, WebSocket (ws)
- **数据流**：JSON 格式消息

## 高级特性

1. **多客户端支持**：服务器可同时处理多个WebSocket连接
2. **实时状态同步**：所有客户端状态实时同步
3. **有状态连接**：服务器保存每个客户端的连接信息
4. **错误处理**：完善的错误处理和恢复机制
5. **模拟真实场景**：长时间操作模拟包含随机延迟、问题处理等真实场景
