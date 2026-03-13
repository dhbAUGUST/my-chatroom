<template>
  <div ref="messageListRef" class="message-list overflow-auto h-full">
    <div 
      v-for="message in messages" 
      :key="message.id"
      :class="[
        'message-item',
        message.sender === 'system' ? 'system-message' : '',
        message.sender === currentUser.id ? 'user-message' : 'other-message'
      ]"
    >
      <div v-if="message.sender !== 'system' && message.sender !== currentUser.id" class="message-sender text-gray-500">
        {{ message.senderName }}
      </div>
      <div class="message-content">
        <!-- 文本消息 -->
        <div v-if="message.messageType !== 'image'" class="message-text">{{ message.content }}</div>
        <!-- 图片和动图消息 -->
        <div v-else class="message-image">
          <img 
            :src="message.content" 
            :alt="'图片消息'"
            class="message-image-content"
          />
        </div>
        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { useChatStore } from '../stores/chatStore'

const chatStore = useChatStore()
const messages = computed(() => chatStore.currentMessages)
const currentUser = computed(() => chatStore.currentUser)
const messageListRef = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}
onMounted(() => {
  scrollToBottom()
})

watch(messages, () => {
  scrollToBottom()
}, { deep: true, immedite: true })

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #f8fafc50;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dark .message-list {
  background-color: #0f172a66;
}

.message-item {
  max-width: 80%;
  display: flex;
  flex-direction: column;
  animation: messageSlide 0.3s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes messageSlide {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.system-message {
  align-self: center;
  margin: 0 auto;
  text-align: center;
  max-width: 60%;
}

.system-message .message-content {
  background-color: #e2e8f0;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .system-message .message-content {
  background-color: #334155;
  color: #cbd5e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.user-message {
  align-self: flex-end;
  margin-left: auto;
}

.user-message .message-content {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  position: relative;
}


.other-message {
  align-self: flex-start;
}

.other-message .message-content {
  background-color: white;
  color: #1e293b;
  padding: 12px 16px;
  border-radius: 4px 18px 18px 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
}

.dark .other-message .message-content {
  background-color: #334155;
  color: #f8fafc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}


.message-sender {
  font-size: 12px;
  margin-bottom: 6px;
  margin-left: 12px;
  font-weight: 500;
  color: #64748b;
}

.dark .message-sender {
  color: #94a3b8;
}

.message-text {
  font-size: 15px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 6px;
  text-align: right;
  font-weight: 500;
}

.system-message .message-time {
  display: none;
}

/* 滚动条样式 */
.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.dark .message-list::-webkit-scrollbar-track {
  background: #1e293b;
}

.message-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark .message-list::-webkit-scrollbar-thumb {
  background: #475569;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .message-list::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

/* 图片消息样式 */
.message-image {
  display: inline-block;
  max-width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.message-image-content {
  max-width: 300px;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.message-image-content:hover {
  transform: scale(1.02);
}

/* 系统消息不显示图片样式 */
.system-message .message-image {
  display: none;
}
</style>