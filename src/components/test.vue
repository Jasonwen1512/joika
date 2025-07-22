<script setup>
import ActivityCard from "./ActivityCard.vue";
import { FakeActivity } from "@/assets/data/fake_activity";

const aloha = () => {
  alert("阿囉哈");
};
</script>

<template>
  <div class="test">
    <ActivityCard
      v-for="item in FakeActivity"
      :key="item.activity_id"
      :item="item"
    ></ActivityCard>
  </div>
</template>

<style lang="scss" scoped>
.test {
  width: 100%;
  display: grid;
  gap: 8px;
  padding: 10px;
  justify-items: center;
  grid-template-columns: repeat(4, 1fr);
  @include mobile() {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  @include tablet() {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @include desktop() {
    .test {
      max-width: 1200px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);

      justify-self: center;
    }
  }
}
</style>
