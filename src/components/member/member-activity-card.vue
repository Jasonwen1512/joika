<script setup>
import ActivityTag from "@/components/member/activity-status-tag.vue";
import { FakeActivity } from "@/assets/data/fake-activity";
import Button from "@/components/Button.vue";
const props = defineProps({
  item: Object,
  status: String,
});
</script>

<template>
  <div
    class="member-activity-card"
    v-for="activity in FakeActivity.slice(0, 4)"
    :key="activity.id"
  >
    <div class="img">
      <img :src="activity.activity_img" :alt="activity.activity_name" />
      <ActivityTag :activity_status="activity.activity_status" />
    </div>
    <h3 class="activity-name">{{ activity.activity_name }}</h3>
    <p class="activity-description">{{ activity.activity_description }}</p>
    <div class="button-group">
      <Button theme="info" size="sm">團員列表</Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.member-activity-card {
  width: 284px;
  height: 390px;
  justify-self: center;
  gap: 25px;
  margin: 20px;
}
.img {
  width: 264px;
  height: 200px;
  position: relative;
}
.img img {
  width: 100%;
  height: 100%;
}

.activity-name {
  max-width: 264px;
  font-size: $font-size-h4;
  padding: 14px 0 0px;
  line-height: 1.7;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: unset;
  letter-spacing: 0.5px;
}

.activity-description {
  color: $black;
  font-size: $font-size-p;
  padding: 10px 0 0;
  line-height: 1.7;
  max-width: 264px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.button-group {
  display: flex;
  justify-content: right;

  padding-top: 10px;
  max-width: 264px;
}
</style>
