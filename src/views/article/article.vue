<script setup>
const activities = [
  { class: 'camping', label: '露營', color: '#FFB6C1' },
  { class: 'boardGames', label: '桌遊', color: '#ADD8E6' },
  { class: 'ball', label: '籃球', color: '#90EE90' },
  { class: 'movie', label: '電影', color: '#FFD700' },
  { class: 'dinnerGathering', label: '聚餐', color: '#FFA07A' }
]
</script>

<template>
  <!-- 熱門文章頁 -->
  <div>這是熱門文章頁</div>

  <div class="banner">
    <div class="imglist">
      <div
        v-for="(item, index) in activities"
        :key="index"
        :class="['activity', item.class]"
        :style="{ backgroundColor: item.color }"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.banner {
  width: 100%;
}

.imglist {
  display: flex;
  gap: 5vw;
}

.activity {
  flex: 1;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-weight: bold;
  border-radius: 10px;
  text-align: center;
}
</style>