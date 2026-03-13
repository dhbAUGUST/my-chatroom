<template>
  <div class="message-input">
    <div class="input-actions">
      <el-button
        type="primary"
        plain
        @click="triggerImageUpload"
        circle
        class="action-button"
        title="发送图片"
      >
        <el-icon><Picture /></el-icon>
      </el-button>
      <!-- 动图选择器 -->
    <el-popover placement="top" :width="300" trigger="click">
      <div class="gif-picker">
        <h4>选择动图</h4>
        <div class="gif-search">
          <el-input v-model="gifSearchQuery" placeholder="搜索动图..." @input="searchGifs" />
        </div>
        <div class="gif-list" v-if="gifs.length > 0">
          <img
            v-for="gif in gifs"
            :key="gif"
            :src="gif"
            class="gif-item"
            @click="selectGif(gif)"
          />
        </div>
        <div v-else class="gif-loading">加载中...</div>
      </div>
      <template #reference>
        <el-button
          type="primary"
          plain
          circle
          class="action-button"
          title="发送动图"
        >
          <el-icon><MagicStick /></el-icon>
        </el-button>
      </template>
    </el-popover>
      
      <!-- Emoji选择器 -->
    <el-popover  placement="top" :width="350" trigger="click">
      <div class="emoji-picker">
        <div class="emoji-categories">
          <button
            v-for="(category, index) in emojiCategories"
            :key="index"
            :class="['emoji-category-btn', { active: currentCategory === index }]"
            @click="currentCategory = index"
          >
            {{ category.icon }}
          </button>
        </div>
        <div class="emoji-list">
          <button
            v-for="emoji in currentEmojis"
            :key="emoji"
            class="emoji-item"
            @click="insertEmoji(emoji)"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
      <template #reference>
        <el-button
          type="primary"
          plain
          circle
          class="action-button"
          title="发送表情"
        >
          <el-icon><ChatDotRound /></el-icon>
        </el-button>
      </template>
    </el-popover>
    </div>
    <div class="flex items-center">
      <el-input
        v-model="messageContent"
        type="textarea"
        :rows="1"
        placeholder="输入消息..."
        @keyup.enter.exact="sendMessage"
        @keyup.enter.shift="$event.preventDefault()"
        resize="none"
        class="message-input-field"
      />
      <el-button
        type="primary"
        @click="sendMessage"
        :disabled="!messageContent.trim() && !selectedImage"
        class="send-button"
      >
        发送
      </el-button>
    </div>

    <!-- 图片上传 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleImageSelect"
    />

    

    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '../stores/chatStore'
import { Picture, MagicStick, ChatDotRound } from '@element-plus/icons-vue'

const chatStore = useChatStore()
const messageContent = ref('')
const fileInput = ref(null)
const selectedImage = ref(null)
const showGifPicker = ref(false)
const gifSearchQuery = ref('')
const gifs = ref([])
const showEmojiPicker = ref(false)
const currentCategory = ref(0)

const chatMode = computed(() => chatStore.chatMode)

const emojiCategories = [
  {
    name: 'smileys',
    icon: '😀',
    emojis: [
      '😀',
      '😃',
      '😄',
      '😁',
      '😅',
      '😂',
      '🤣',
      '😊',
      '😇',
      '🙂',
      '🙃',
      '😉',
      '😌',
      '😍',
      '🥰',
      '😘',
      '😗',
      '😙',
      '😚',
      '😋',
      '😛',
      '😜',
      '🤪',
      '😝',
      '🤑',
      '🤗',
      '🤭',
      '🤫',
      '🤔',
      '🤐',
      '🤨',
      '😐',
      '😑',
      '😶',
      '😏',
      '😒',
      '🙄',
      '😬',
      '🤥',
      '😔',
      '😪',
      '🤤',
      '😴',
      '😷',
      '🤒',
      '🤕',
      '🤢',
      '🤮',
      '🤧',
      '🥵',
      '🥶',
      '🥴',
      '😵',
      '🤯',
      '🤠',
      '🥳',
      '😎',
      '🤓',
      '🧐',
    ],
  },
  {
    name: 'people',
    icon: '👋',
    emojis: [
      '👋',
      '🤚',
      '🖐',
      '✋',
      '🖖',
      '👌',
      '🤌',
      '🤏',
      '✌',
      '🤞',
      '🤟',
      '🤘',
      '🤙',
      '👈',
      '👉',
      '👆',
      '🖕',
      '👇',
      '☝',
      '👍',
      '👎',
      '✊',
      '👊',
      '🤛',
      '🤜',
      '👏',
      '🙌',
      '👐',
      '🤲',
      '🤝',
      '🙏',
      '✍',
      '💪',
      '🦾',
      '🦿',
      '🦵',
      '🦶',
      '👂',
      '🦻',
      '👃',
      '🧠',
      '🦷',
      '🦴',
      '👀',
      '👁',
      '👅',
      '👄',
    ],
  },
  {
    name: 'animals',
    icon: '🐶',
    emojis: [
      '🐶',
      '🐱',
      '🐭',
      '🐹',
      '🐰',
      '🦊',
      '🐻',
      '🐼',
      '🐨',
      '🐯',
      '🦁',
      '🐮',
      '🐷',
      '🐽',
      '🐸',
      '🐵',
      '🙈',
      '🙉',
      '🙊',
      '🐒',
      '🐔',
      '🐧',
      '🐦',
      '🐤',
      '🐣',
      '🐥',
      '🦆',
      '🦅',
      '🦉',
      '🦇',
      '🐺',
      '🐗',
      '🐴',
      '🦄',
      '🐝',
      '🐛',
      '🦋',
      '🐌',
      '🐞',
      '🐜',
      '🦟',
      '🦗',
      '🕷',
      '🕸',
      '🦂',
      '🐢',
      '🐍',
      '🦎',
      '🦖',
      '🦕',
      '🐙',
      '🦑',
      '🦐',
      '🦞',
      '🦀',
      '🐡',
      '🐠',
      '🐟',
      '🐬',
      '🐳',
      '🐋',
      '🦈',
      '🐊',
      '🐅',
      '🐆',
      '🦓',
      '🦍',
      '🦧',
      '🐘',
      '🦛',
      '🦏',
      '🐪',
      '🐫',
      '🦒',
      '🦘',
      '🐃',
      '🐂',
      '🐄',
      '🐎',
      '🐖',
      '🐏',
      '🐑',
      '🦙',
      '🐐',
      '🦌',
      '🐕',
      '🐩',
      '🦮',
      '🐕‍🦺',
      '🐈',
      '🐈‍⬛',
      '🐓',
      '🦃',
      '🦚',
      '🦜',
      '🦢',
      '🦩',
    ],
  },
  {
    name: 'food',
    icon: '🍎',
    emojis: [
      '🍎',
      '🍐',
      '🍊',
      '🍋',
      '🍌',
      '🍉',
      '🍇',
      '🍓',
      '🫐',
      '🍈',
      '🍒',
      '🍑',
      '🥭',
      '🍍',
      '🥥',
      '🥝',
      '🍅',
      '🍆',
      '🥑',
      '🥦',
      '🥬',
      '🥒',
      '🌶',
      '🫑',
      '🌽',
      '🥕',
      '🫒',
      '🧄',
      '🧅',
      '🥔',
      '🍠',
      '🥐',
      '🥯',
      '🍞',
      '🥖',
      '🥨',
      '🧀',
      '🥚',
      '🍳',
      '🧈',
      '🥞',
      '🧇',
      '🥓',
      '🥩',
      '🍗',
      '🍖',
      '🦴',
      '🌭',
      '🍔',
      '🍟',
      '🍕',
      '🫓',
      '🥪',
      '🥙',
      '🧆',
      '🌮',
      '🌯',
      '🫔',
      '🥗',
      '🥘',
      '🫕',
      '🍝',
      '🍜',
      '🍲',
      '🍛',
      '🍣',
      '🍱',
      '🥟',
      '🦪',
      '🍤',
      '🍙',
      '🍚',
      '🍘',
      '🍥',
      '🥠',
      '🥮',
      '🍢',
      '🍡',
      '🍧',
      '🍨',
      '🍦',
      '🥧',
      '🧁',
      '🍰',
      '🎂',
      '🍮',
      '🍭',
      '🍬',
      '🍫',
      '🍿',
      '🍩',
      '🍪',
      '🌰',
      '🥜',
      '🍯',
      '🥛',
      '🍼',
      '☕',
      '🫖',
      '🍵',
      '🧃',
      '🥤',
      '🍶',
      '🍺',
      '🍻',
      '🥂',
      '🍷',
      '🥃',
      '🍸',
      '🍹',
      '🧉',
      '🍾',
    ],
  },
  {
    name: 'activities',
    icon: '⚽',
    emojis: [
      '⚽',
      '🏀',
      '🏈',
      '⚾',
      '🥎',
      '🎾',
      '🏐',
      '🏉',
      '🥏',
      '🎱',
      '🪀',
      '🏓',
      '🏸',
      '🏒',
      '🏑',
      '🥍',
      '🏏',
      '🥅',
      '⛳',
      '🪁',
      '🏹',
      '🎣',
      '🤿',
      '🥊',
      '🥋',
      '🎽',
      '🛹',
      '🛼',
      '🛷',
      '⛸',
      '🥌',
      '🎿',
      '⛷',
      '🏂',
      '🪂',
      '🏋',
      '🤼',
      '🤸',
      '⛹',
      '🤺',
      '🤾',
      '🏌',
      '🏇',
      '🧘',
      '🏄',
      '🏊',
      '🤽',
      '🚣',
      '🧗',
      '🚵',
      '🚴',
      '🚵',
      '🎽',
      '🎯',
      '🪀',
      '🎳',
      '🎮',
      '🎰',
      '🎲',
      '🧩',
      '🧸',
      '🪅',
      '♠',
      '♥',
      '♦',
      '♣',
      '♟',
      '🃏',
      '🀄',
      '🎴',
      '🎭',
      '🖼',
      '🎨',
      '🧵',
      '🪡',
      '🧶',
      '🪢',
    ],
  },
  {
    name: 'objects',
    icon: '⌚',
    emojis: [
      '⌚',
      '📱',
      '📲',
      '💻',
      '⌨',
      '🖥',
      '🖨',
      '🖱',
      '🖲',
      '🕹',
      '🗜',
      '💽',
      '💾',
      '💿',
      '📀',
      '📼',
      '📷',
      '📸',
      '📹',
      '🎥',
      '📽',
      '🎞',
      '📞',
      '☎',
      '📟',
      '📠',
      '📺',
      '📻',
      '🎙',
      '🎚',
      '🎛',
      '🧭',
      '⏱',
      '⏲',
      '⏰',
      '🕰',
      '⌛',
      '⏳',
      '📡',
      '🔋',
      '🔌',
      '💡',
      '🔦',
      '🕯',
      '🪔',
      '🧯',
      '🛢',
      '💸',
      '💵',
      '💴',
      '💶',
      '💷',
      '💰',
      '💳',
      '💎',
      '⚖',
      '🧰',
      '🔧',
      '🔨',
      '⚒',
      '🛠',
      '⛏',
      '🪓',
      '🔩',
      '⚙',
      '🪤',
      '🔫',
      '💣',
      '🧨',
      '🪓',
      '🔪',
      '🗡',
      '⚔',
      '🛡',
      '🚬',
      '⚰',
      '⚱',
      '🏺',
      '🔮',
      '📿',
      '🧿',
      '💈',
      '⚗',
      '🧪',
      '🧫',
      '🧬',
      '🔬',
      '🔭',
      '📡',
      '💉',
      '🩸',
      '💊',
      '🩹',
      '🩺',
      '🚪',
      '🛏',
      '🛋',
      '🪑',
      '🚽',
      '🚿',
      '🛁',
      '🪒',
      '🧴',
      '🧷',
      '🧹',
      '🧺',
      '🧻',
      '🧼',
      '🧽',
      '🧯',
      '🛒',
      '🎒',
      '👓',
      '🕶',
      '🥽',
      '🥼',
      '🦺',
      '👔',
      '👕',
      '👖',
      '🧣',
      '🧤',
      '🧥',
      '🧦',
      '👗',
      '👘',
      '🥻',
      '🩱',
      '🩲',
      '🩳',
      '👙',
      '👚',
      '👛',
      '👜',
      '👝',
      '🛍',
      '🎒',
      '👞',
      '👟',
      '🥾',
      '🥿',
      '👠',
      '👡',
      '🩰',
      '👢',
      '👑',
      '👒',
      '🎩',
      '🎓',
      '🧢',
      '🪖',
      '⛑',
      '📿',
      '💄',
      '💍',
      '💎',
      '🔔',
      '🔕',
      '📢',
      '📣',
      '📯',
      '🔈',
      '🔇',
      '🎉',
      '🎊',
      '🎈',
      '🎆',
      '🎇',
      '🧨',
      '✨',
      '🎐',
      '🎑',
      '🎀',
      '🎁',
      '🎗',
      '🎟',
      '🎫',
      '🎖',
      '🏆',
      '🏅',
      '🥇',
      '🥈',
      '🥉',
      '⚽',
      '🏀',
      '🏈',
      '⚾',
      '🥎',
      '🎾',
      '🏐',
      '🏉',
      '🥏',
      '🎱',
      '🪀',
      '🏓',
      '🏸',
      '🏒',
      '🏑',
      '🥍',
      '🏏',
      '🥅',
      '⛳',
      '🪁',
      '🏹',
      '🎣',
      '🤿',
      '🥊',
      '🥋',
      '🎽',
      '🛹',
      '🛼',
      '🛷',
      '⛸',
      '🥌',
      '🎿',
      '⛷',
      '🏂',
      '🪂',
      '🏋',
      '🤼',
      '🤸',
      '⛹',
      '🤺',
      '🤾',
      '🏌',
      '🏇',
      '🧘',
      '🏄',
      '🏊',
      '🤽',
      '🚣',
      '🧗',
      '🚵',
      '🚴',
      '🚵',
    ],
  },
  {
    name: 'symbols',
    icon: '❤️',
    emojis: [
      '❤️',
      '🧡',
      '💛',
      '💚',
      '💙',
      '💜',
      '🖤',
      '🤍',
      '🤎',
      '💔',
      '❣',
      '💕',
      '💞',
      '💓',
      '💗',
      '💖',
      '💘',
      '💝',
      '💟',
      '☮',
      '✝',
      '☪',
      '🕉',
      '☸',
      '✡',
      '🔯',
      '🕎',
      '☯',
      '☦',
      '🛐',
      '⛎',
      '♈',
      '♉',
      '♊',
      '♋',
      '♌',
      '♍',
      '♎',
      '♏',
      '♐',
      '♑',
      '♒',
      '♓',
      '🆔',
      '⚛',
      '🉑',
      '☢',
      '☣',
      '📴',
      '📳',
      '🈶',
      '🈚',
      '🈸',
      '🈺',
      '🈷',
      '✴',
      '🆚',
      '💮',
      '🉐',
      '㊙️',
      '㊗️',
      '🈴',
      '🈵',
      '🈹',
      '🈲',
      '🅰️',
      '🅱️',
      '🆎',
      '🆑',
      '🅾️',
      '🆘',
      '❌',
      '⭕',
      '🛑',
      '⛔',
      '📛',
      '🚫',
      '💯',
      '💢',
      '♨',
      '🚷',
      '🚯',
      '🚳',
      '🚱',
      '🔞',
      '📵',
      '🚭',
      '❗',
      '❕',
      '❓',
      '❔',
      '‼',
      '⁉',
      '🔅',
      '🔆',
      '〽',
      '⚠',
      '🚸',
      '🔱',
      '⚜',
      '🔰',
      '♻',
      '✅',
      '🈯',
      '💹',
      '❇',
      '✳',
      '❎',
      '🌐',
      '💠',
      'Ⓜ',
      '🌀',
      '💤',
      '🏧',
      '🚾',
      '♿',
      '🅿️',
      '🈳',
      '🈂',
      '🛂',
      '🛃',
      '🛄',
      '🉑',
      '㊗️',
      '㊙️',
      '🈴',
      '🈵',
      '🈹',
      '🈲',
      '🅰️',
      '🅱️',
      '🆎',
      '🆑',
      '🅾️',
      '🆘',
      '❌',
      '⭕',
      '🛑',
      '⛔',
      '📛',
      '🚫',
      '💯',
      '💢',
      '♨',
      '🚷',
      '🚯',
      '🚳',
      '🚱',
      '🔞',
      '📵',
      '🚭',
      '❗',
      '❕',
      '❓',
      '❔',
      '‼',
      '⁉',
      '🔅',
      '🔆',
      '〽',
      '⚠',
      '🚸',
      '🔱',
      '⚜',
      '🔰',
      '♻',
      '✅',
      '🈯',
      '💹',
      '❇',
      '✳',
      '❎',
      '🌐',
      '💠',
      'Ⓜ',
      '🌀',
      '💤',
      '🏧',
      '🚾',
      '♿',
      '🅿️',
      '🈳',
      '🈂',
      '🛂',
      '🛃',
      '🛄',
    ],
  },
]

const currentEmojis = computed(() => emojiCategories[currentCategory.value].emojis)

const triggerImageUpload = () => {
  fileInput.value.click()
}

const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target.result
      sendImageMessage(imageUrl)
    }
    reader.readAsDataURL(file)
  }
  event.target.value = ''
}

const searchGifs = async () => {
  if (gifSearchQuery.value.trim()) {
    try {
      const response = await fetch('https://nekos.best/api/v2/neko')
      const json = await response.json()
      gifs.value = [json.results[0].url]
    } catch (error) {
      console.error('搜索动图失败:', error)
      gifs.value = []
    }
  } else {
    gifs.value = []
  }
}

const selectGif = (gif) => {
  sendImageMessage(gif)
  showGifPicker.value = false
  gifSearchQuery.value = ''
  gifs.value = []
}

const sendImageMessage = (imageUrl) => {
  if (chatMode.value === 'private') {
    chatStore.sendPrivateMessage(imageUrl, 'image')
  } else {
    chatStore.sendMessage(imageUrl, 'image')
  }
}

const insertEmoji = (emoji) => {
  messageContent.value += emoji
  showEmojiPicker.value = false
}

const sendMessage = () => {
  if (messageContent.value.trim()) {
    if (chatMode.value === 'private') {
      chatStore.sendPrivateMessage(messageContent.value.trim())
    } else {
      chatStore.sendMessage(messageContent.value.trim())
    }
    messageContent.value = ''
  }
}
</script>

<style scoped>
.message-input {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.dark .message-input {
  background-color: #0f172a;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}

.input-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.action-button {
  width: 36px;
  height: 36px;
  padding: 0;
}

.message-input-field {
  flex: 1;
  min-height: 48px;
  max-height: 120px;
  overflow-y: auto;
}

.message-input-field :deep(.el-textarea__inner) {
  border-radius: 24px;
  font-size: 15px;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  resize: none;
  min-height: 48px;
  max-height: 120px;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.dark .message-input-field :deep(.el-textarea__inner) {
  background-color: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}

.message-input-field :deep(.el-textarea__inner:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark .message-input-field :deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.send-button {
  height: 48px;
  padding: 0 24px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
}

/* 自定义滚动条 */
.message-input-field :deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 6px;
}

.message-input-field :deep(.el-textarea__inner::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

.dark .message-input-field :deep(.el-textarea__inner::-webkit-scrollbar-track) {
  background: #1e293b;
}

.message-input-field :deep(.el-textarea__inner::-webkit-scrollbar-thumb) {
  background: #888;
  border-radius: 3px;
}

.dark .message-input-field :deep(.el-textarea__inner::-webkit-scrollbar-thumb) {
  background: #475569;
}

.message-input-field :deep(.el-textarea__inner::-webkit-scrollbar-thumb:hover) {
  background: #555;
}

.dark .message-input-field :deep(.el-textarea__inner::-webkit-scrollbar-thumb:hover) {
  background: #64748b;
}

/* 动图选择器样式 */
.gif-picker {
  padding: 12px;
}

.gif-picker h4 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
}

.gif-search {
  margin-bottom: 12px;
}

.gif-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.gif-item {
  width: 100%;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.gif-item:hover {
  transform: scale(1.05);
}

.gif-loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.dark .gif-loading {
  color: #94a3b8;
}

/* Emoji选择器样式 */
.emoji-picker {
  padding: 12px;
}

.emoji-categories {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
}

.dark .emoji-categories {
  border-bottom-color: #334155;
}

.emoji-category-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.emoji-category-btn:hover {
  background-color: #f1f5f9;
}

.dark .emoji-category-btn:hover {
  background-color: #334155;
}

.emoji-category-btn.active {
  background-color: #3b82f6;
  color: white;
}

.emoji-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-item {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-item:hover {
  background-color: #f1f5f9;
  transform: scale(1.1);
}

.dark .emoji-item:hover {
  background-color: #334155;
}

/* 自定义滚动条 */
.emoji-list::-webkit-scrollbar {
  width: 6px;
}

.emoji-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.dark .emoji-list::-webkit-scrollbar-track {
  background: #1e293b;
}

.emoji-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark .emoji-list::-webkit-scrollbar-thumb {
  background: #475569;
}

.emoji-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
