<script setup>
defineProps({
  label: String,
  isActive: Boolean,
});
defineEmits(["click"]);
</script>

<template>
  <button
    class="category-tag"
    :class="{ active: isActive }"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<style scoped lang="scss">
.category-tag {
  display: inline-block;
  padding: 10px;
  border: 1px solid $black;
  background-color: $color-primary;
  transition: all 0.3s;
  cursor: pointer;

  &.active {
    background-color: $blue;
    color: $white;
  }
}
</style>
