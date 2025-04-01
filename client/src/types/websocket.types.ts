export interface Message {
  id: number;
  text: string;
  sender: 'client' | 'server';
  timestamp: string;
}

// 服务器消息接口
export interface ServerMessage {
  type: string;
  message: string;
  clientId?: number;
  sender?: number;
  timestamp?: number | string;
  fromServer?: boolean;
  success?: boolean; // 添加success属性用于测试结果
}

// SSE日志接口
export interface LogMessage {
  type: string;
  message: string;
  timestamp: string;
}

// 测试结果接口
export interface TestResult {
  show: boolean;
  success: boolean;
  message: string;
} 