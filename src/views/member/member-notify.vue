<script setup>
import { ref } from 'vue'
// 當前頁籤
const activeTab = ref('system')

// 系統通知資料
const systemNotifications = ref([
  {
    id: 1,
    title: '7/4 新手友善 陽明山登山團 報名成功通知',
    content: '此為系統通知，無需做回覆\n您在剛剛成功參與了 7/4 新手友善 陽明山登山團\n針對活動如有任何疑問可在活動頁面留言',
    expanded: true,
  }
])

// 一般通知資料
const generalNotifications = ref([
  {
    id: 2,
    title: '你的文章有新留言',
    content:'12/31 合歡山跨年看日出',
    expanded: false
  },
  {
    id: 3,
    title: '有人回覆你的留言',
    content:'這次的爬山活動真的很不錯，天氣也很剛好.....',
    expanded: false
  }
])

// 展開/收合
function toggleAccordion(list, item) {
  list.forEach(n => {
    n.expanded = (n.id === item.id) ? !n.expanded : false
  })
}
</script>

<template>
  <div class="notify-tabs">
    <ul class="tab-header">
      <li><button :class="{ active: activeTab === 'system' }"
        @click="activeTab = 'system'">系統通知</button></li>
      <li><button :class="{ active: activeTab === 'general' }"
        @click="activeTab = 'general'">一般通知</button></li>
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
          {{ item.title }}
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
          <h4 class="notify-title">{{ item.title }}</h4>
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
  transition: transform 0.3s ease;
  transform-origin: center;
}
.icon-wrapper.rotated .line2 {
  transform: scaleY(0);
}

.notify-detail{
  padding: 8px;
}
@include desktop{
  .notify-tabs{
    width: 70%;
  }
}
</style>
