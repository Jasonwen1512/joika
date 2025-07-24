<script setup>
import AtivityCard from '@/components/activity/activity-card.vue';
import { FakeActivity } from '@/assets/data/fake-activity';
import Marquee from '@/components/marquee.vue';
import Marquee2 from '@/components/marquee2.vue';
</script>

<template>
  <!-- 這是home頁 -->
  <Marquee2/>
  <div class="index-section-start">
    <img src=" @/assets/img/index-img/first-section-img.png" alt="限時揪團標題圖">
    <h2>限時揪團<br>差你一咖</h2>
  </div>
  <div class="first-section">
    <div class="card-grid">
      <AtivityCard v-for="item in FakeActivity.slice(0, 8)" :key="item.activity_id" :item="item"/>
    </div>
  </div>
  <Marquee/>
    <div class="index-section-start">
      <img src=" @/assets/img/index-img/second-section-img.png" alt="最新揪團標題圖">
      <h2>最新揪團<br>差你一咖</h2>
    </div>
  <div class="card-grid">
    <AtivityCard v-for="item in FakeActivity.slice(0, 8)" :key="item.activity_id" :item="item"/>
  </div>
  <Marquee2/>
  <div class="index-section-start">
      <img src="@/assets/img/index-img/third-section-img.png" alt="最新揪團標題圖">
      <h2>揪團推薦<br>差你一咖</h2>
    </div>
</template>

<style scoped lang="scss">
.first-section{
  margin: auto;
  background-image: url(src/assets/img/bg-decorate/bg-decorate1.png);
  background-size:cover;
}
.card-grid{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: auto;
}
.index-section-start {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  img{
    width: 80px;
  }
}
</style>
