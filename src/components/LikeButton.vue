<script setup>
import HeartOutlineIcon from "@/assets/img/icon/heart_outline.svg";
import HeartFilled from "@/assets/img/icon/heart_filled.svg";
const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: false,
  },
  onClick: {
    type: Function,
  },
});
</script>
<template>
  <div class="button-wrapper">
    <button class="icon-button" :data-is-active="isActive" @click="onClick">
      <component :is="isActive ? HeartFilled : HeartOutlineIcon" class="icon" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.icon-button {
  color: $red;
  cursor: pointer;
  display: flex;
  &:hover {
    color: $pink;
  }

  .icon {
    width: 100%;
    height: 38px;
    fill: $red;
  }
}
.icon-button[data-is-active="true"] .icon {
  fill: red;
}
</style>
