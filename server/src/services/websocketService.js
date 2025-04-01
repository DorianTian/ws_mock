const WebSocket = require("ws");
const sseService = require("./sseService");

// 存储所有连接的客户端
const clients = new Map();

// 创建WebSocket服务器
function createWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const clientId = Date.now();
    clients.set(clientId, ws);

    console.log(`WebSocket 连接已建立: ID ${clientId}`);
    // 将连接事件推送到日志
    sseService.pushLog("info", `WebSocket客户端连接: ID ${clientId}`);

    // 处理客户端消息
    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        console.log(`收到来自客户端 ${clientId} 的消息:`, parsedMessage);

        // 处理消息 - 可根据实际业务需求扩展
        handleMessage(parsedMessage, clientId);
      } catch (error) {
        console.error("处理消息时出错:", error);
        // 记录解析错误到日志
        sseService.pushLog(
          "error",
          `解析客户端 ${clientId} 消息时出错: ${error.message}`
        );
      }
    });

    // 监听连接关闭
    ws.on("close", () => {
      console.log(`客户端 ${clientId} 断开连接`);
      clients.delete(clientId);
      // 将断开连接事件推送到日志
      sseService.pushLog("info", `WebSocket客户端断开连接: ID ${clientId}`);
    });

    // 监听错误
    ws.on("error", (error) => {
      console.error(`客户端 ${clientId} 连接错误:`, error);
      clients.delete(clientId);
      // 将错误事件推送到日志
      sseService.pushLog(
        "error",
        `WebSocket客户端连接错误: ID ${clientId}, 错误: ${error.message}`
      );
    });

    // 发送欢迎消息
    ws.send(
      JSON.stringify({
        type: "connection",
        message: "已连接到WebSocket服务器",
        clientId,
      })
    );
  });

  return wss;
}

// 处理接收到的消息
function handleMessage(message, clientId) {
  // 根据消息类型处理不同逻辑
  switch (message.type) {
    case "chat":
      // 广播聊天消息给所有客户端
      broadcastMessage({
        type: "chat",
        message: message.message,
        sender: clientId,
        timestamp: Date.now(),
      });

      // 记录聊天消息到日志
      sseService.pushLog(
        "info",
        `聊天消息 - 客户端 ${clientId}: ${message.message}`
      );
      break;

    case "test_connection":
      // 处理连接测试请求
      handleConnectionTest(clientId);
      // 记录测试请求到日志
      sseService.pushLog("info", `客户端 ${clientId} 请求测试连接`);
      break;

    // 可根据实际需求添加更多消息类型处理
    default:
      console.log(`未知消息类型: ${message.type}`);
      // 记录未知消息类型到日志
      sseService.pushLog(
        "warning",
        `客户端 ${clientId} 发送了未知类型消息: ${message.type}`
      );
  }
}

// 处理连接测试请求
function handleConnectionTest(clientId) {
  const client = clients.get(clientId);
  if (!client || client.readyState !== WebSocket.OPEN) {
    return;
  }

  console.log(`开始测试客户端 ${clientId} 的连接`);

  // 发送开始测试通知
  sendMessage(clientId, {
    type: "test_progress",
    message: "开始执行长时间操作...",
    progress: 0,
    timestamp: Date.now(),
  });

  // 调用模拟的长时间异步操作
  performRandomLongOperation(clientId)
    .then((result) => {
      // 发送操作成功消息
      sendMessage(clientId, {
        type: "test_complete",
        success: true,
        message: `长时间操作已完成: ${result.message}`,
        details: result,
        timestamp: Date.now(),
      });

      console.log(
        `客户端 ${clientId} 的长时间操作成功完成，耗时: ${result.totalTime}ms`
      );
      // 记录操作成功到日志
      sseService.pushLog(
        "success",
        `客户端 ${clientId} 的长时间操作成功完成，耗时: ${result.totalTime}ms`
      );
    })
    .catch((error) => {
      // 发送操作失败消息
      sendMessage(clientId, {
        type: "test_complete",
        success: false,
        message: `长时间操作失败: ${error.message}`,
        timestamp: Date.now(),
      });

      console.log(`客户端 ${clientId} 的长时间操作失败: ${error.message}`);
      // 记录操作失败到日志
      sseService.pushLog(
        "error",
        `客户端 ${clientId} 的长时间操作失败: ${error.message}`
      );
    });
}

/**
 * 执行一个模拟的随机长时间操作
 * @param {number} clientId - 客户端ID
 * @returns {Promise<Object>} - 操作结果
 */
async function performRandomLongOperation(clientId) {
  // 随机决定操作的总步骤数 (5-15)
  const totalSteps = Math.floor(Math.random() * 11) + 5;
  let currentStep = 0;

  // 操作类型 (随机选择一种操作类型)
  const operationTypes = [
    "数据库同步",
    "文件处理",
    "网络请求",
    "数据分析",
    "配置验证",
  ];
  const operationType =
    operationTypes[Math.floor(Math.random() * operationTypes.length)];

  // 操作开始时间
  const startTime = Date.now();

  // 返回一个Promise表示长时间操作
  return new Promise((resolve, reject) => {
    // 阶段性任务描述
    const phases = [
      "初始化中...",
      "连接资源...",
      "请求处理中...",
      "数据验证中...",
      "资源整合中...",
      "优化处理中...",
      "最终验证中...",
      "清理资源中...",
    ];

    // 各阶段遇到的随机问题
    const randomIssues = [
      "网络延迟增加",
      "资源竞争",
      "缓存失效",
      "队列阻塞",
      "连接池满载",
    ];

    // 随机决定操作是否会失败 (5%的概率)
    const willFail = Math.random() < 0.05;

    // 如果会失败，随机决定在哪一步失败
    const failAt = willFail
      ? Math.floor(Math.random() * (totalSteps - 1)) + 1
      : -1;

    // 随机失败原因
    const failReasons = [
      "连接超时",
      "资源不可用",
      "权限验证失败",
      "服务异常",
      "数据一致性错误",
    ];
    const failReason =
      failReasons[Math.floor(Math.random() * failReasons.length)];

    // 用于存储每步的执行时间
    const stepTimes = [];

    // 创建一个递归函数来模拟每个步骤
    const executeStep = () => {
      // 当前步骤
      currentStep++;

      // 随机决定这一步的执行时间 (500ms - 3000ms)
      const stepTime = Math.floor(Math.random() * 2500) + 500;
      stepTimes.push(stepTime);

      // 计算总进度百分比
      const progress = Math.round((currentStep / totalSteps) * 100);

      // 随机决定是否遇到问题 (30%的概率)
      const hasIssue = Math.random() < 0.3;
      const issue = hasIssue
        ? randomIssues[Math.floor(Math.random() * randomIssues.length)]
        : null;

      // 构建进度消息
      let progressMessage = `${operationType}: ${
        phases[currentStep % phases.length]
      } (${progress}%)`;
      if (hasIssue) {
        progressMessage += ` - 遇到问题: ${issue}, 正在处理...`;
      }

      // 发送进度更新
      sendMessage(clientId, {
        type: "test_progress",
        message: progressMessage,
        progress: progress,
        currentStep: currentStep,
        totalSteps: totalSteps,
        operationType: operationType,
        issue: issue,
        timestamp: Date.now(),
      });

      console.log(
        `客户端 ${clientId} 的操作进度: ${progress}%, 步骤 ${currentStep}/${totalSteps}, 耗时 ${stepTime}ms`
      );

      // 记录进度更新到SSE日志
      if (hasIssue) {
        sseService.pushLog(
          "warning",
          `客户端 ${clientId} 的操作进度: ${progress}%, 步骤 ${currentStep}/${totalSteps} - 遇到问题: ${issue}`
        );
      } else if (progress % 25 === 0 || currentStep === 1) {
        // 只在25%的倍数和第一步时记录日志，避免日志过多
        sseService.pushLog(
          "info",
          `客户端 ${clientId} 的操作进度: ${progress}%, 步骤 ${currentStep}/${totalSteps}`
        );
      }

      // 检查是否应该在这一步失败
      if (currentStep === failAt) {
        setTimeout(() => {
          reject(new Error(`${operationType}失败: ${failReason}`));
        }, stepTime);
        return;
      }

      // 检查是否完成所有步骤
      if (currentStep >= totalSteps) {
        setTimeout(() => {
          // 计算总耗时
          const totalTime = Date.now() - startTime;
          // 计算平均每步耗时
          const averageStepTime = Math.round(
            stepTimes.reduce((a, b) => a + b, 0) / stepTimes.length
          );

          resolve({
            message: `${operationType}完成`,
            totalTime: totalTime,
            totalSteps: totalSteps,
            averageStepTime: averageStepTime,
            stepTimes: stepTimes,
            operationType: operationType,
          });
        }, stepTime);
      } else {
        // 继续执行下一步
        setTimeout(executeStep, stepTime);
      }
    };

    // 开始执行第一步
    executeStep();
  });
}

// 向特定客户端发送消息
function sendMessage(clientId, message) {
  const client = clients.get(clientId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
    return true;
  }
  return false;
}

// 广播消息给所有客户端
function broadcastMessage(message) {
  clients.forEach((client, clientId) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// 获取所有在线客户端ID
function getConnectedClients() {
  return Array.from(clients.keys());
}

module.exports = {
  createWebSocketServer,
  sendMessage,
  broadcastMessage,
  getConnectedClients,
};
