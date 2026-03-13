<template>
  <div class="chat-stats">
    <h3 class="stats-title">聊天统计</h3>
    <div class="stats-content">
      <div class="stats-item">
        <span class="stats-label">总消息数：</span>
        <span class="stats-value">{{ totalMessages }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">用户消息数：</span>
        <span class="stats-value">{{ userMessagesCount }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">系统消息数：</span>
        <span class="stats-value">{{ systemMessagesCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useChatStore } from '../stores/chatStore'

const chatStore = useChatStore()

const totalMessages = computed(() => chatStore.messages.length)
const userMessagesCount = computed(() => chatStore.userMessages.length)
const systemMessagesCount = computed(() => {
  return chatStore.messages.filter(msg => msg.sender === 'system').length
})
</script>

<style scoped>
.dark .chat-stats {
  background-color:#1e293b;
  .stats-title {
    color: #eee;
  }
  .stats-label {
    font-size: 14px;
    color: #eee;
  }

}
.chat-stats {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.stats-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stats-label {
  font-size: 14px;
  color: #666;
}

.stats-value {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
}
</style>