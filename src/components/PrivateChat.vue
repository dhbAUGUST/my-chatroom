<template>
  <div class="private-chat">
    <div class="private-chat-header">
      <h2 class="chat-title">与 {{ chatUser?.name }} 的私人聊天</h2>
      <el-button 
        type="info" 
        @click="exitPrivateChat"
        plain
      >
        退出私人聊天
      </el-button>
    </div>
    <div class="private-chat-messages" style="flex: 1; overflow: hidden;">
      <MessageList />
    </div>
    <div class="private-chat-input">
      <MessageInput />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useChatStore } from '../stores/chatStore'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'

const chatStore = useChatStore()

const chatUser = computed(() => chatStore.currentPrivateChatUser)

const sendPrivateMessage = (content) => {
  chatStore.sendPrivateMessage(content)
}

const exitPrivateChat = () => {
  chatStore.exitPrivateChat()
}
</script>

<style scoped>
.private-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.private-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e0e0e0;
}

.dark .private-chat-header {
  background-color: #0f172a;
  border-bottom: 1px solid #334155;
}

.chat-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.dark .chat-title {
  color: #f8fafc;
}

.exit-button {
  padding: 8px 16px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.exit-button:hover {
  background-color: #ff7875;
}

.private-chat-messages {
  flex: 1;
  overflow: hidden;
  margin: 10px 0;
}

.private-chat-input {
  margin-top: 10px;
}
</style>