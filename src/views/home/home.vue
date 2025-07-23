<script setup>

</script>

<template>
  <!-- 這是home頁 -->

  <div class="index-section-start">
    <img src=" @/assets/img/index-img/first-section-img.png" alt="限時揪團標題圖">
    <h2>限時揪團<br>差你一咖</h2>
  </div>
    <div class="index-section-start">
      <img src=" @/assets/img/index-img/second-section-img.png" alt="最新揪團標題圖">
      <h2>最新揪團<br>差你一咖</h2>
    </div>
  
</template>

<style scoped lang="scss">
.first-section{
  margin: auto;
  background-image: url(src/assets/img/bg-decorate/bg-decorate1.png);
  background-size:100% auto;
}

.index-section-start {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  gap: 1rem;
  img{
    width: 80px;
  }
}
</style>
