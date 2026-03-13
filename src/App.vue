<template>
  <transition name="page-fade" mode="out-in">
    <div v-if="!isJoined" class="login-container">
      <ParticlesBackground />
      <div class="login-form">
        <h1 class="login-title">私人聊天室</h1>
        <div class="form-group">
          <el-input
            v-model="userName"
            placeholder="输入用户名"
            @keyup.enter="joinChat"
            :disabled="isJoining"
          />
        </div>
        <div class="form-group">
          <el-input
            v-model="password"
            type="password"
            placeholder="输入密码"
            @keyup.enter="joinChat"
            :disabled="isJoining"
          />
        </div>
        <el-button
          type="primary"
          @click="joinChat"
          :disabled="!userName.trim() || !password"
          :loading="isJoining"
          style="width: 100%; margin-top: 20px"
        >
          {{ isJoining ? '加入中...' : '加入聊天室' }}
        </el-button>
        <div v-if="loginError" class="login-error">
          {{ loginError }}
        </div>
      </div>
    </div>
    <div v-else class="chatroom">
      <ParticlesBackground />
      <header class="chatroom-header">
        <h1 class="chatroom-title">{{ chatMode === 'private' ? '私人聊天' : '公共聊天室' }}</h1>
        <div class="user-info">
          <span class="user-name">{{ currentUser.name }}</span>
          <div class="online-status" :class="{ online: isOnline }">
            <span class="status-indicator"></span>
            <span class="status-text">{{ isOnline ? '在线' : '离线' }}</span>
          </div>
          <div class="chat-controls">
            <el-button
              type="primary"
              :plain="!showUsers"
              @click="toggleUsers"
              title="显示/隐藏在线用户"
              circle
              ><el-icon><UserFilled /></el-icon
            ></el-button>
            <el-button
              type="primary"
              :plain="!showStats"
              @click="toggleStats"
              title="显示/隐藏聊天统计"
              circle
              ><el-icon><ChatLineSquare /></el-icon>
            </el-button>
            <el-button
              type="primary"
              @click="toggleTheme"
              circle
              :icon="isDarkMode ? Sunny : Moon"
            />
          </div>
        </div>
      </header>
      <main class="chatroom-main">
        <div class="chat-area">
          <transition name="chat-mode" mode="out-in">
            <PrivateChat v-if="chatMode === 'private'" />
            <div
              v-else
              key="public-chat"
              class="public-chat-container"
              style="display: flex; flex-direction: column; flex: 1"
            >
              <div class="chat-messages-container max-h-[calc(100vh-300px)]" style="flex: 1">
                <MessageList />
              </div>

              <div class="chat-input-container">
                <MessageInput />
              </div>
            </div>
          </transition>
        </div>
        <transition name="sidebar" mode="out-in">
          <div class="sidebar" v-if="chatMode === 'public' && (showUsers || showStats)">
            <div class="online-users" v-if="showUsers">
              <h3 class="users-title">在线用户 ({{ onlineUserCount }})</h3>
              <ul class="users-list">
                <li v-for="user in otherUsers" :key="user.id" class="user-item">
                  <el-avatar :size="36" :icon="UserFilled" type="primary">{{
                    user.name.charAt(0)
                  }}</el-avatar>
                  <span class="user-item-name">{{ user.name }}</span>
                  <el-button type="primary" size="small" @click="startPrivateChat(user)" plain>
                    私聊
                  </el-button>
                </li>
              </ul>
            </div>
            <transition name="stats-fade">
              <ChatStats v-if="showStats" />
            </transition>
          </div>
        </transition>
      </main>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from './stores/chatStore'
import MessageList from './components/MessageList.vue'
import MessageInput from './components/MessageInput.vue'
import PrivateChat from './components/PrivateChat.vue'
import ChatStats from './components/ChatStats.vue'
import ParticlesBackground from './components/ParticlesBackground.vue'
import { UserFilled, ChatLineSquare, Moon, Sunny } from '@element-plus/icons-vue'

const chatStore = useChatStore()
const userName = ref('123')
const password = ref('1123581321')
const isJoined = ref(false)
const isJoining = ref(false)
const loginError = ref('')
const showUsers = ref(true)
const showStats = ref(true)
const isDarkMode = ref(false)

const isOnline = computed(() => chatStore.isOnline)
const currentUser = computed(() => chatStore.currentUser)
const users = computed(() => chatStore.users)
const onlineUserCount = computed(() => chatStore.onlineUserCount)
const chatMode = computed(() => chatStore.chatMode)
const otherUsers = computed(() => users.value.filter((user) => user.id !== currentUser.value.id))

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value.toString())
}

onMounted(() => {
  // 检查本地存储中的主题设置
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'true'
  } else {
    // 检查用户的系统偏好
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 应用主题
  document.documentElement.classList.toggle('dark', isDarkMode.value)

  // 初始化 socket 连接
  chatStore.initSocket()
})

const joinChat = async () => {
  if (userName.value.trim() && password.value) {
    // 验证密码
    if (password.value !== '1123581321') {
      loginError.value = '密码错误，请重新输入！'
      return
    }

    isJoining.value = true
    loginError.value = ''
    try {
      await chatStore.joinChat(userName.value.trim())
      isJoined.value = true
    } finally {
      isJoining.value = false
    }
  }
}

const startPrivateChat = (user) => {
  chatStore.startPrivateChat(user)
}

const toggleUsers = () => {
  showUsers.value = !showUsers.value
}

const toggleStats = () => {
  showStats.value = !showStats.value
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.login-form {
  background-color: #ffffff50;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease;
}

.login-form:hover {
  transform: translateY(-5px);
}

.login-error {
  color: #f56c6c;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
  font-weight: 500;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  filter: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  margin-bottom: 36px;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 600;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.login-button:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.login-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.chatroom {
  max-width: 1200px;
  margin: 0 auto;
  height: 100vh;
  padding: 20px;
  background-color: #ffffff50;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.dark .chatroom {
  background-color: #1e293b88;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: #f8fafc;
}

.chatroom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dark {
  .chatroom-title,
  .user-name {
    color: #eee;
  }
}
.chatroom-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.online-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ef4444;
  position: relative;
}

.status-indicator::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background-color: rgba(239, 68, 68, 0.2);
  animation: pulse 2s infinite;
}

.online-status.online .status-indicator {
  background-color: #10b981;
}

.online-status.online .status-indicator::after {
  background-color: rgba(16, 185, 129, 0.2);
}

.status-text {
  color: #6b7280;
  font-size: 12px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* 页面切换动画 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.5s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 聊天模式切换动画 */
.chat-mode-enter-active,
.chat-mode-leave-active {
  transition: all 0.3s ease;
}

.chat-mode-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.chat-mode-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 侧边栏动画 */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease;
}

.sidebar-enter-from {
  opacity: 0;
  transform: translateX(20px);
  max-width: 0;
}

.sidebar-leave-to {
  opacity: 0;
  transform: translateX(20px);
  max-width: 0;
}

/* 聊天统计动画 */
.stats-fade-enter-active,
.stats-fade-leave-active {
  transition: all 0.3s ease;
}

.stats-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.stats-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.chatroom-main {
  display: flex;
  gap: 20px;
  flex: 1;
  overflow: hidden;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dark .sidebar {
  background-color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  color: #f8fafc;
}

.online-users {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.dark .online-users {
  background-color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.users-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.dark .users-title {
  color: #f8fafc;
}

.users-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.user-item:hover {
  background-color: #f9fafb;
  border-radius: 8px;
  padding-left: 12px;
  padding-right: 12px;
  margin-left: -12px;
  margin-right: -12px;
}

.user-item:last-child {
  border-bottom: none;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.user-item-name {
  font-size: 14px;
  color: #374151;
  flex: 1;
  font-weight: 500;
}

.dark .user-item-name {
  color: #f8fafc;
}

.private-chat-button {
  padding: 6px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 500;
  margin-left: 10px;
}

.private-chat-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.chat-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 12px 0;
}

.control-button {
  padding: 10px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.control-button:hover {
  background-color: #e5e7eb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.control-button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.control-button .icon {
  font-size: 20px;
}

.chat-input-container {
  margin-top: 12px;
}

.chat-messages-container {
  flex: 1;
  overflow: hidden;
  margin-bottom: 12px;
}

@media (max-width: 1024px) {
  .chatroom {
    max-width: 95vw;
    padding: 16px;
  }

  .sidebar {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .chatroom-main {
    flex-direction: column;
    gap: 16px;
  }

  .sidebar {
    width: 100%;
    order: -1;
    max-height: 200px;
  }

  .chat-area {
    flex: 1;
  }

  .chatroom-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .user-info {
    width: 100%;
    justify-content: space-between;
  }

  .login-form {
    padding: 32px;
    margin: 0 16px;
  }

  .message-item {
    max-width: 85%;
  }

  .chat-controls {
    gap: 8px;
  }

  .control-button {
    width: 40px;
    height: 40px;
  }

  .control-button .icon {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .chatroom {
    padding: 12px;
    border-radius: 8px;
  }

  .chatroom-title {
    font-size: 20px;
  }

  .message-list {
    padding: 16px;
  }

  .message-content {
    padding: 10px 14px !important;
  }

  .message-text {
    font-size: 14px;
  }

  .login-title {
    font-size: 24px;
  }

  .login-form {
    padding: 24px;
  }

  .form-input {
    padding: 12px 14px;
  }

  .login-button {
    padding: 12px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .private-chat-button {
    padding: 4px 12px;
    font-size: 11px;
  }
}
</style>
