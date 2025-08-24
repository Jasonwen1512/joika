<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
axios.defaults.withCredentials = true
const API = import.meta.env.VITE_API_BASE

const activeTab = ref('system')
const systemNotifications = ref([])
const generalNotifications = ref([])

async function fetchNotifications() {
  // 系統通知
  const sys = await axios.get(`${API}/notifications/list.php`, {
    params: { type: 'system', status: 'all', limit: 50, offset: 0 }
  })
  systemNotifications.value = (sys.data?.data || []).map(n => ({
    id: Number(n.notification_no),
    title: n.title,
    content: n.content ?? '',
    status: n.status,                 // '未讀' | '已讀'
    type: n.type,                     // '系統通知'
    created_at: n.created_at,
    expanded: false
  }))

  // 互動通知
  const gen = await axios.get(`${API}/notifications/list.php`, {
    params: { type: 'interact', status: 'all', limit: 50, offset: 0 }
  })
  generalNotifications.value = (gen.data?.data || []).map(n => ({
  id: Number(n.notification_no),
  title: n.title,
  content: n.content ?? '',
  status: n.status,
  type: n.type,
  created_at: n.created_at
  }))
}

onMounted(fetchNotifications)

// 標記已讀（支援多筆）
async function markRead(ids = []) {
  if (!ids.length) return
  try {
    await axios.post(`${API}/notifications/mark-read.php`, { ids })
  } catch (e) {
    console.error('mark-read failed', e)
  }
}

// 展開/收合 + 首次展開即標已讀
function toggleAccordion(list, item) {
  list.forEach(n => {
    if (n.id === item.id) {
      const willExpand = !n.expanded
      n.expanded = willExpand
      if (willExpand && n.status === '未讀') {
        n.status = '已讀'         // 立即回饋
        markRead([n.id])          // 後端同步
      }
    } else {
      n.expanded = false
    }
  })
}
</script>

<template>
  <div class="notify-tabs">
    <ul class="tab-header">
      <li>
    <button :class="{ active: activeTab === 'system' }" @click="activeTab = 'system'">
      系統通知
      <span v-if="systemNotifications.some(n=>n.status==='未讀')" class="badge">
        {{ systemNotifications.filter(n=>n.status==='未讀').length }}
      </span>
    </button>
  </li>
  <li>
    <button :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
      一般通知
      <span v-if="generalNotifications.some(n=>n.status==='未讀')" class="badge">
        {{ generalNotifications.filter(n=>n.status==='未讀').length }}
      </span>
    </button>
  </li>
    </ul>
    
    <div class="notify-body">
    <!-- 系統通知內容 -->
    <div v-show="activeTab === 'system'" class="tab-content">
      <div 
        v-for="item in systemNotifications" 
        :key="item.id" 
        class="notify-item"
      >
        <div class="notify-title system" @click="toggleAccordion(systemNotifications, item)">
          <div class="title-wrap">
            <span v-if="item.status === '未讀'" class="unread-dot"></span>
            <span :class="{'unread-text': item.status === '未讀'}">{{ item.title }}</span>
      </div>
          <span class="icon-wrapper" :class="{ rotated: item.expanded }">
            <svg
            class="icon"
            viewBox="0 0 36 36"
            width="26"
            height="26"
            stroke="black"
            stroke-width="3"
          >
            <line class="line1" x1="8" y1="18" x2="28" y2="18" />
            <line class="line2" x1="18" y1="8" x2="18" y2="28" />
          </svg>
          </span>
        </div>
        <transition name="accordion">
          <div v-if="item.expanded" class="notify-detail">
            <p v-for="line in item.content.split('\n')" :key="line">{{ line }}</p>
          </div>
        </transition>
      </div>
    </div>

      <!-- 一般通知內容 -->
      <div v-show="activeTab === 'general'" class="tab-content">
        <div 
          v-for="item in generalNotifications" 
          :key="item.id" 
          class="notify-item"
        >
          <h4 class="notify-title">
            <span class="title-wrap">
              <span v-if="item.status === '未讀'" class="unread-dot"></span>
              <span :class="{'unread-text': item.status === '未讀'}">{{ item.title }}</span>
            </span>
          </h4>
          <p class="notify-detail">{{ item.content }}</p>
        </div>
      </div>


    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/mixin" as *; 
@import "@/assets/scss/_color.scss";
.notify-tabs{
  width: 100%;
  padding: 20px;
  margin: auto;
}
.notify-body{
  border: 2px solid black;
  border-radius: 3px;
  min-height: 200px;
  line-height: 1.5;
  background-color: #fff;
}
.tab-header{
  display: flex;
  padding: 0;
  margin: 0;
  gap: 10px;

  li button{
    flex: 1;
    border: 2px solid #000;
    border-bottom: 0;
    padding: 8px;
    cursor: pointer;
    background: #C7E5F1;
    border-radius: 3px;
  }
}

.tab-header button.active {
  background: $header-text-color;
  color: #fff;
}
.tab-content:nth-of-type(2) .notify-title {
  margin: 8px;
}
.tab-content:nth-of-type(2) .notify-item:not(:last-child) {
  border-bottom: 2px solid #000;
}
.notify-title.system {
  background-color:$color-primary; 
  border-bottom:1px solid #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.icon-wrapper svg{
  vertical-align: middle;
}
.icon-wrapper .line2 {
  transition: transform 0.5s ease;
  transform-origin: center;
}
.icon-wrapper.rotated .line2 {
  transform: scaleY(0);
}

.notify-detail{
  padding: 8px 12px 8px 8px;
  border-bottom: 1px solid #ccc;
}
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.5s ease; 
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0; 
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px; 
  opacity: 1;
}

//捲軸
.tab-content {
  max-height: 300px;
  overflow-y: overlay;
  scrollbar-width:thin;
  scrollbar-color: $color-secondary #E0F3F8;
}
.tab-content::-webkit-scrollbar {
  width: 8px;
}
.tab-content::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.4);
  border-radius: 8px;
}
.tab-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #81BFDA, #4F8DA8);
  border-radius: 8px;
}
//已讀未讀
.title-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff5a5a;
  display: inline-block;
}
.unread-text {
  font-weight: 700;
}
.badge { 
  margin-left:6px; 
  padding:0 6px; 
  border-radius:10px; 
  font-size:12px; 
  background:#ff5a5a; 
  color:#fff; 
}


//桌機版
@include desktop{
  .notify-tabs{
    width: 70%;
  }
}
</style>
