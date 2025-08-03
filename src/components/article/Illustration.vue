<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 1. 導入您的主要插圖
import articleimg from '@/assets/img/article/article-img.png?url';

// 2. 定義動畫所需的狀態 (已簡化)
const iconOptions = ['🎨', '⛰️', '🎬', '🍽️', '🎶', '✍️','⛺','🏖️','🔥','🌅'];
const lightbulbIcon = '💡';

// 當前在雲朵中顯示的圖示
const currentCloudIcon = ref(iconOptions[0]);
// [關鍵] 現在只用這一個狀態來控制所有點擊效果
const isIdeaActive = ref(false);

// 用於存放 setInterval 的 ID
let iconChangeInterval = null;

// 3. 核心動畫邏輯
function startIconCycling() {
  // 確保不會重複啟動計時器
  if (iconChangeInterval) clearInterval(iconChangeInterval);

  iconChangeInterval = setInterval(() => {
    const currentIndex = iconOptions.indexOf(currentCloudIcon.value);
    const nextIndex = (currentIndex + 1) % iconOptions.length;
    currentCloudIcon.value = iconOptions[nextIndex];
  }, 2000);
}

// 4. [已簡化] 點擊事件處理
function handleIllustrationClick() {
  // 直接切換「靈光一閃」的狀態
  isIdeaActive.value = !isIdeaActive.value;

  if (isIdeaActive.value) {
    // 如果是啟用狀態，就清除圖示輪播
    clearInterval(iconChangeInterval);
  } else {
    // 如果是關閉狀態，就重新開始輪播
    startIconCycling();
  }
}

// 5. 生命週期管理 (不變)
onMounted(() => {
  startIconCycling();
});

onBeforeUnmount(() => {
  if (iconChangeInterval) {
    clearInterval(iconChangeInterval);
  }
});
</script>

<template>
  <!-- 
    主容器，現在只綁定點擊事件
  -->
  <div class="illustration-container" @click="handleIllustrationClick">
    
    <!-- 您的主要插圖 -->
    <img class="main-illustration" :src="articleimg" alt="插圖">

    <!-- 雲朵中的圖示 -->
    <div v-if="isIdeaActive" :key="'idea'" class="cloud-icon">
      {{ lightbulbIcon }}
    </div>
    <div v-else :key="currentCloudIcon" class="cloud-icon">
      {{ currentCloudIcon }}
    </div>

    <!-- 
      [全新] 紅色線條的容器
      只有在 isIdeaActive 為 true 時才會顯示
    -->
    <div v-if="isIdeaActive" class="idea-lines-container">
      <div class="idea-line line-1"></div>
      <div class="idea-line line-2"></div>
      <div class="idea-line line-3"></div>
    </div>

  </div>
</template>

<style scoped>
/* 主容器 (不變) */
.illustration-container {
  position: absolute;
  bottom: -100px;
  z-index: -999;
  position: relative;
  width: 400px;
  height: 400px;
  cursor: pointer;
}

/* 您的主要插圖 (不變) */
.main-illustration {
  width: 100%;
  height: 100%;
}

/* 雲朵中的小圖示 (不變) */
.cloud-icon {
  position: absolute;
  top: 18%; 
  left: 30%;
  font-size: 45px;
  transform: translate(-50%, -50%);
  animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* [修改] 紅色線條的容器，微調了位置以適應旋轉 */
.idea-lines-container {
  position: absolute;
  top: 15%; /* 稍微向上移動一點 */
  left: 65%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
      transform: rotate(-45deg); 

}

/* [修改] 單條紅線的通用樣式，移除了 animation 屬性，改為在下方單獨定義 */
.idea-line {
  height: 12px;
  background-color: #ffe23d;
  border-radius: 6px;
  margin-bottom: 20px;
  transform-origin: left; /* 確保從左邊開始旋轉和縮放 */

}

/* [修改] 為每條線設定不同的寬度、旋轉角度和對應的動畫 */
.idea-line.line-1 {
  width: 60px;
  /* 向上旋轉 15 度 */
  transform: rotate(-15deg); 
  animation: draw-line-1 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.idea-line.line-2 {
  width: 100px;
  /* 稍微向下旋轉 5 度 */
  transform: rotate(5deg);
  animation: draw-line-2 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.1s forwards;
}

.idea-line.line-3 {
  width: 75px;
  /* 向下旋轉 20 度 */
  transform: rotate(20deg);
  animation: draw-line-3 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
}

/* 定義彈出動畫 (不變) */
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

/* [全新] 為三條線分別定義帶有旋轉的動畫 */
@keyframes draw-line-1 {
  from {
    /* 在保持旋轉角度的同時，將寬度從 0 放大到 1 */
    transform: rotate(-15deg) scaleX(0);
    opacity: 0;
  }
  to {
    transform: rotate(-15deg) scaleX(1);
    opacity: 1;
  }
}

@keyframes draw-line-2 {
  from {
    transform: rotate(5deg) scaleX(0);
    opacity: 0;
  }
  to {
    transform: rotate(5deg) scaleX(1);
    opacity: 1;
  }
}

@keyframes draw-line-3 {
  from {
    transform: rotate(20deg) scaleX(0);
    opacity: 0;
  }
  to {
    transform: rotate(20deg) scaleX(1);
    opacity: 1;
  }
}
</style>
