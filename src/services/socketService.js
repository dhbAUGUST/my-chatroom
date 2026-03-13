import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.messageCallback = null;
    this.historyCallback = null;
    this.userJoinedCallback = null;
    this.userLeftCallback = null;
    this.usersCallback = null;
    this.privateMessageCallback = null;
    this.privateHistoryCallback = null;
  }

  // 连接到服务器
  connect() {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('Socket 连接成功');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket 连接断开');
    });

    this.socket.on('message', (message) => {
      if (this.messageCallback) {
        this.messageCallback(message);
      }
    });

    this.socket.on('history', (history) => {
      if (this.historyCallback) {
        this.historyCallback(history);
      }
    });

    this.socket.on('userJoined', (user) => {
      if (this.userJoinedCallback) {
        this.userJoinedCallback(user);
      }
    });

    this.socket.on('userLeft', (user) => {
      if (this.userLeftCallback) {
        this.userLeftCallback(user);
      }
    });

    this.socket.on('users', (users) => {
      if (this.usersCallback) {
        this.usersCallback(users);
      }
    });

    this.socket.on('privateMessage', (message) => {
      if (this.privateMessageCallback) {
        this.privateMessageCallback(message);
      }
    });

    this.socket.on('privateHistory', (history) => {
      if (this.privateHistoryCallback) {
        this.privateHistoryCallback(history);
      }
    });

    return this.socket;
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // 加入聊天室
  join(userData) {
    if (this.socket) {
      this.socket.emit('join', userData);
    }
  }

  // 发送消息
  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('message', messageData);
    }
  }

  // 发送私人消息
  sendPrivateMessage(messageData) {
    if (this.socket) {
      this.socket.emit('privateMessage', messageData);
    }
  }

  // 获取私人聊天历史
  getPrivateHistory(targetUserId) {
    if (this.socket) {
      this.socket.emit('getPrivateHistory', targetUserId);
    }
  }

  // 设置消息回调
  onMessage(callback) {
    this.messageCallback = callback;
  }

  // 设置历史消息回调
  onHistory(callback) {
    this.historyCallback = callback;
  }

  // 设置用户加入回调
  onUserJoined(callback) {
    this.userJoinedCallback = callback;
  }

  // 设置用户离开回调
  onUserLeft(callback) {
    this.userLeftCallback = callback;
  }

  // 设置用户列表回调
  onUsers(callback) {
    this.usersCallback = callback;
  }

  // 设置私人消息回调
  onPrivateMessage(callback) {
    this.privateMessageCallback = callback;
  }

  // 设置私人聊天历史回调
  onPrivateHistory(callback) {
    this.privateHistoryCallback = callback;
  }
}

// 导出单例实例
export default new SocketService();