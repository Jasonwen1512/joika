<script setup>
import ActivityCard from "@/components/ActivityCard.vue";
import { FakeActivity } from "@/assets/data/fake_activity";
</script>

<template>
  <!-- 這是活動列表頁 -->
  <div>這是活動列表頁</div>
  <div>這是活動列表頁</div>
  <div>這是活動列表頁</div>
  <div>這是活動列表頁</div>
  <div>這是活動列表頁</div>
  <div>這是活動列表頁</div>
  <div>這是活動列表頁</div>
  <div>這是活動列表頁</div>
  <div>這是活動列表頁</div>
  <div>這是活動列表頁</div>

  <div class="activity-list">
    <ActivityCard
      v-for="item in FakeActivity"
      :key="item.activity_id"
      :item="item"
    ></ActivityCard>
  </div>
</template>

<style scoped lang="scss">
.activity-list {
  width: 100%;
  display: grid;
  gap: 20px;
  padding: 10px;
  justify-items: center;

  @include mobile() {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  @include tablet() {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @include desktop() {
    max-width: 1200px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    justify-self: center;
  }
}
</style>
