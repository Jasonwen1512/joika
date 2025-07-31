<script setup>
import { computed } from "vue";
const props = defineProps({
  activity_status: {
    type: String,
    required: true,
  },
});

const statusColors = {
  已取消: "cancel",
  開團中: "open",
  已成團: "success",
  審核中: "pending",
  已完成: "done",
};

const statusClass = computed(() => {
  return statusColors[props.activity_status] || "default";
});
</script>

<template>
  <span class="status-tag" :class="statusClass">
    {{ activity_status }}
  </span>
</template>

<style lang="scss" scoped>
.status-tag {
  font-size: $font-size-h3;
  text-align: center;
  align-content: center;
  width: 133px;
  height: 50px;
  position: absolute;
  top: 20px;
  left: -10px;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 3px;
  border: 1px solid $black;

  @include tablet() {
    //768-1023
    border-radius: 6px;
  }

  @include desktop() {
    //1024以上
    border-radius: 6px;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    border-radius: 6px;
  }

  &.cancel {
    background-color: $gray-disabled;
  }
  &.open {
    background-color: $color-secondary;
  }
  &.success {
    background-color: $color-highlight;
  }
  &.pending {
    background-color: $color-primary;
  }
  &.done {
    background-color: $lighter-yellow;
  }
  &.default {
    background-color: #bdbdbd; // 預設
  }
}
</style>
