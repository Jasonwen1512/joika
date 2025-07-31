<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 1. 導入您的主要插圖
//    請務必將路徑替換成您專案中正確的圖片路徑
import articleimg from '@/assets/img/article/article-img.png?url'; // <--- 請修改此路徑

// 2. 定義動畫所需的狀態
//    這裡我們先用 emoji 當作素材庫，這也是您提到的方法之一
const iconOptions = ['🎨', '⛰️', '🎬', '🍽️', '🎶', '✍️','⛺','🏖️','🔥','🌅'];
const lightbulbIcon = '💡';

// 當前在雲朵中顯示的圖示
const currentCloudIcon = ref(iconOptions[0]);
// 是否被點擊，觸發了燈泡模式
const isIdeaActive = ref(false);

// 用於存放 setInterval 的 ID，方便之後清除
let iconChangeInterval = null;

// 3. 核心動畫邏輯
function startIconCycling() {
  // 設定一個計時器，每 2 秒執行一次
  iconChangeInterval = setInterval(() => {
    // 如果已經點擊顯示燈泡了，就停止更換
    if (isIdeaActive.value) {
      clearInterval(iconChangeInterval);
      return;
    }

    // 計算下一個要顯示的圖示
    const currentIndex = iconOptions.indexOf(currentCloudIcon.value);
    const nextIndex = (currentIndex + 1) % iconOptions.length; // 使用 % 實現循環
    currentCloudIcon.value = iconOptions[nextIndex];

  }, 2000); // 2000 毫秒 = 2 秒
}

// 4. 點擊事件處理
function handleIllustrationClick() {
  isIdeaActive.value = true;
}

// 5. 生命週期管理
onMounted(() => {
  // 當元件被掛載到畫面上時，啟動圖示循環動畫
  startIconCycling();
});

onBeforeUnmount(() => {
  // 當元件要被銷毀時，務必清除計時器，避免記憶體洩漏
  if (iconChangeInterval) {
    clearInterval(iconChangeInterval);
  }
});
</script>

<template>
  <!-- 
    主容器，設定為 relative 定位，
    這樣內部的 absolute 元素就會相對於它來定位。
    我們也在這裡加上點擊事件。
  -->
  <div class="illustration-container" @click="handleIllustrationClick">
    
    <!-- 您的主要插圖 -->
    <img class="main-illustration" :src="articleimg" alt="插圖">

    <!-- 
      雲朵中的小圖示。
      它會根據 isIdeaActive 的狀態，顯示燈泡或循環的圖示。
      key 的作用是讓 Vue 在切換時能重新觸發 CSS 動畫。
    -->
    <div v-if="isIdeaActive" :key="'idea'" class="cloud-icon">
      {{ lightbulbIcon }}
    </div>
    <div v-else :key="currentCloudIcon" class="cloud-icon">
      {{ currentCloudIcon }}
    </div>

  </div>
</template>

<style scoped>
/* 主容器 */
.illustration-container {
  position: absolute; /* 這是您原本的設定 */
  bottom: -100px;   /* 這是您原本的設定 */
  z-index: -999;    /* 這是您原本的設定 */

  /* [新增] 讓容器本身也變成 relative，才能定位裡面的小圖示 */
  position: relative;
  width: 400px; /* 請給定一個寬高，讓內部定位有依據 */
  height: 400px;
  cursor: pointer; /* 讓滑鼠變成手形，提示可以點擊 */
}

/* 您的主要插圖 */
.main-illustration {
  width: 100%;
  height: 100%;
}

/* 雲朵中的小圖示 */
.cloud-icon {
  position: absolute;

  /* 
    [關鍵] 定位！
    這兩個值(top, left)需要您根據插圖的實際樣貌來微調，
    目標是讓圖示剛好出現在對話雲朵的中間。
  */
  top: 18%; 
  left: 32%;

  font-size: 45px; /* Emoji 的大小 */
  
  /* 使用 transform 讓圖示的中心點對準 top/left 的位置 */
  transform: translate(-50%, -50%);

  /* 加入一個可愛的彈出動畫 */
  animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 定義彈出動畫 */
@keyframes pop-in {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
</style>