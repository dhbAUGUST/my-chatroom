import { defineStore } from 'pinia'
import socketService from '../services/socketService'

export const useChatStore = defineStore('chat', {
  state: () => ({
    chatMode: 'public',
    messages: [
      {
        id: 1,
        content: '你好！欢迎来到私人聊天室',
        sender: 'system',
        senderName: '系统',
        timestamp: new Date().toISOString()
      }
    ],
    privateMessages: {},
    currentUser: {
      id: '',
      name: '用户'
    },
    currentPrivateChatUser: null,
    users: [],
    isOnline: false
  }),
  actions: {
    // 初始化 socket 连接
    initSocket() {
      const socket = socketService.connect()
      
      // 设置消息回调
      socketService.onMessage((message) => {
        this.messages.push(message)
      })
      
      // 设置历史消息回调
      socketService.onHistory((history) => {
        if (history.length > 0) {
          this.messages = [
            ...this.messages.filter(msg => msg.sender === 'system'),
            ...history
          ]
        }
      })
      
      // 设置用户加入回调
      socketService.onUserJoined((user) => {
        this.users.push(user)
        // 检查是否是当前用户，如果是，设置 currentUser.id
        if (user.name === this.currentUser.name) {
          this.currentUser.id = user.id
        }
        this.messages.push({
          id: Date.now(),
          content: `${user.name} 加入了聊天室`,
          sender: 'system',
          senderName: '系统',
          timestamp: new Date().toISOString()
        })
      })
      
      // 设置用户离开回调
      socketService.onUserLeft((user) => {
        this.users = this.users.filter(u => u.id !== user.id)
        this.messages.push({
          id: Date.now(),
          content: `${user.name} 离开了聊天室`,
          sender: 'system',
          senderName: '系统',
          timestamp: new Date().toISOString()
        })
      })
      
      // 设置用户列表回调
      socketService.onUsers((users) => {
        this.users = users
        // 检查并更新当前用户的 ID
        const currentUserInList = users.find(u => u.name === this.currentUser.name)
        if (currentUserInList) {
          this.currentUser.id = currentUserInList.id
        }
      })
      
      // 设置私人消息回调
      socketService.onPrivateMessage((message) => {
        const chatKey = [message.sender, message.receiver].sort().join('-')
        if (!this.privateMessages[chatKey]) {
          this.privateMessages[chatKey] = []
        }
        this.privateMessages[chatKey].push(message)
      })
      
      // 设置私人聊天历史回调
      socketService.onPrivateHistory((history) => {
        const chatKey = [this.currentUser.id, this.currentPrivateChatUser].sort().join('-')
        this.privateMessages[chatKey] = history
      })
      
      this.isOnline = true
    },
    
    // 加入聊天室
    joinChat(userName) {
      this.currentUser.name = userName || this.currentUser.name
      socketService.join({ name: this.currentUser.name })
    },
    
    // 发送消息
    sendMessage(content, messageType = 'text') {
      if (content.trim()) {
        socketService.sendMessage({ content, messageType })
      }
    },
    
    // 切换聊天模式
    setChatMode(mode) {
      this.chatMode = mode
    },
    
    // 开始私人聊天
    startPrivateChat(user) {
      this.currentPrivateChatUser = user.id
      this.chatMode = 'private'
      // 确保 currentUser.id 已经设置，然后获取私人聊天历史
      setTimeout(() => {
        socketService.getPrivateHistory(user.id)
      }, 100)
    },
    
    // 发送私人消息
    sendPrivateMessage(content, messageType = 'text') {
      if (content.trim() && this.currentPrivateChatUser) {
        socketService.sendPrivateMessage({
          to: this.currentPrivateChatUser,
          content,
          messageType
        })
      }
    },
    
    // 退出私人聊天
    exitPrivateChat() {
      this.currentPrivateChatUser = null
      this.chatMode = 'public'
    },
    
    // 设置在线状态
    setOnlineStatus(status) {
      this.isOnline = status
    },
    
    // 断开连接
    disconnect() {
      socketService.disconnect()
      this.isOnline = false
    }
  },
  getters: {
    userMessages: (state) => {
      return state.messages.filter(msg => msg.sender === state.currentUser.id)
    },
    otherMessages: (state) => {
      return state.messages.filter(msg => msg.sender !== state.currentUser.id)
    },
    onlineUserCount: (state) => {
      return state.users.length
    },
    currentMessages: (state) => {
      if (state.chatMode === 'private' && state.currentPrivateChatUser) {
        const chatKey = [state.currentUser.id, state.currentPrivateChatUser].sort().join('-')
        return state.privateMessages[chatKey] || []
      }
      return state.messages
    },
    currentPrivateChatUser: (state) => {
      if (state.chatMode === 'private' && state.currentPrivateChatUser) {
        return state.users.find(u => u.id === state.currentPrivateChatUser)
      }
      return null
    }
  }
})