<script setup>
import ActivityCard from "@/components/activity/activity-card.vue";
import { FakeActivity } from "@/assets/data/fake-activity";
</script>

<template>
  <div class="banner"></div>

  <div class="activity-list">
    <RouterLink
      v-for="item in FakeActivity"
      :key="item.activity_id"
      :to="`/activity/${item.activity_id}`"
      class="activity-link"
    >
      <ActivityCard :item="item"></ActivityCard>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.banner {
  max-width: 100%;
  background-position: center;
  border: 1px solid black;
  width: 100%;
  min-height: 414px;
  background-image: url(../../assets/img/activity/activity-banner.jpg);
  @include mobile() {
    min-height: 212px;
  }

  @include tablet() {
  }

  @include desktop() {
  }
}
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
