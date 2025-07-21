<script setup>
import ActivityCard from "./ActivityCard.vue";
import { FakeActivity } from "@/assets/data/fake_activity";
defineProps({
  item: Object,
});

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
}
</style>
