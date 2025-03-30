const {
  getConnectedClients,
  sendMessage,
  broadcastMessage,
} = require("../services/websocketService");

// 获取所有连接的客户端列表
async function getClients(ctx) {
  setTimeout(() => {
    try {
      const clients = getConnectedClients();
      ctx.body = {
        success: true,
        data: {
          total: clients.length,
          clients,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "获取客户端列表失败",
        error: error.message,
      };
    }
  }, Math.random() * 1000);
}

// 向指定客户端发送消息
async function sendMessageToClient(ctx) {
  console.log("sendMessageToClient", ctx.request.body);
  const { clientId, message, type = "notification" } = ctx.request.body;

  if (!clientId || !message) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: "缺少必要参数: clientId 和 message",
    };
    return;
  }

  try {
    const result = sendMessage(parseInt(clientId), {
      type,
      message,
      timestamp: Date.now(),
      fromServer: true,
    });

    if (result) {
      ctx.body = {
        success: true,
        message: "消息发送成功",
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: "客户端不存在或已断开连接",
      };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "发送消息失败",
      error: error.message,
    };
  }
}

// 广播消息给所有客户端
async function broadcastMessageToAll(ctx) {
  const { message, type = "notification" } = ctx.request.body;

  if (!message) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: "缺少必要参数: message",
    };
    return;
  }

  try {
    broadcastMessage({
      type,
      message,
      timestamp: Date.now(),
      fromServer: true,
    });

    ctx.body = {
      success: true,
      message: "广播消息发送成功",
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "广播消息失败",
      error: error.message,
    };
  }
}

module.exports = {
  getClients,
  sendMessageToClient,
  broadcastMessageToAll,
};
