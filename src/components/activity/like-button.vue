<script setup>
import HeartOutlineIcon from "@/assets/img/icon/heart_outline.svg";
import HeartFilled from "@/assets/img/icon/heart_filled.svg";
const props = defineProps({
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
  padding-right: 2px;
  padding-bottom:2px;
  &:hover {
    color: $pink;
    transition: all 0.3s ease-in-out;
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
