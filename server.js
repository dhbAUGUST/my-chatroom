import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 存储所有连接的用户
const users = [];

// 存储聊天消息历史
const messages = [];

// 存储私人聊天消息
const privateMessages = {};

// 处理 socket 连接
io.on('connection', (socket) => {
  console.log('新用户连接:', socket.id);

  // 处理用户加入
  socket.on('join', (userData) => {
    const user = {
      id: socket.id,
      name: userData.name || `用户${socket.id.slice(-4)}`,
      ...userData
    };
    users.push(user);
    console.log(`${user.name} 加入了聊天室`);

    // 向新用户发送历史消息
    socket.emit('history', messages);

    // 向所有用户广播新用户加入
    io.emit('userJoined', user);

    // 向所有用户广播在线用户列表
    io.emit('users', users);
  });

  // 处理接收消息
  socket.on('message', (messageData) => {
    const message = {
      id: Date.now(),
      content: messageData.content,
      sender: socket.id,
      senderName: users.find(u => u.id === socket.id)?.name || '未知用户',
      timestamp: new Date().toISOString(),
      ...messageData
    };
    messages.push(message);
    console.log(`${message.senderName}: ${message.content}`);

    // 向所有用户广播消息
    io.emit('message', message);
  });

  // 处理私人消息
  socket.on('privateMessage', (messageData) => {
    const { to, content } = messageData;
    const sender = users.find(u => u.id === socket.id);
    const receiver = users.find(u => u.id === to);

    if (sender && receiver) {
      const message = {
        id: Date.now(),
        content,
        sender: socket.id,
        senderName: sender.name,
        receiver: to,
        receiverName: receiver.name,
        timestamp: new Date().toISOString(),
        ...messageData
      };

      // 存储私人消息
      const chatKey = [socket.id, to].sort().join('-');
      if (!privateMessages[chatKey]) {
        privateMessages[chatKey] = [];
      }
      privateMessages[chatKey].push(message);

      console.log(`私人消息 ${sender.name} -> ${receiver.name}: ${content}`);

      // 向发送者和接收者发送私人消息
      socket.emit('privateMessage', message);
      io.to(to).emit('privateMessage', message);
    }
  });

  // 处理获取私人聊天历史
  socket.on('getPrivateHistory', (targetUserId) => {
    const chatKey = [socket.id, targetUserId].sort().join('-');
    const history = privateMessages[chatKey] || [];
    socket.emit('privateHistory', history);
  });

  // 处理用户断开连接
  socket.on('disconnect', () => {
    const userIndex = users.findIndex(u => u.id === socket.id);
    if (userIndex !== -1) {
      const disconnectedUser = users[userIndex];
      users.splice(userIndex, 1);
      console.log(`${disconnectedUser.name} 离开了聊天室`);

      // 向所有用户广播用户离开
      io.emit('userLeft', disconnectedUser);

      // 向所有用户广播更新后的在线用户列表
      io.emit('users', users);
    }
  });
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 处理所有其他路由，返回 index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});