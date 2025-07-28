<script setup>
import Carousel from "@/components/group/group-explore/carousel.vue";
import Taiwan from "@/components/group/group-explore/taiwan.vue";
import Recommend from "@/components/group/group-explore/recommend.vue";
</script>

<template>
  <Carousel />
  <Taiwan class="taiwan" />
  <Recommend />
</template>

<style scoped lang="scss">
h1 {
  @include flex-center();
  font-size: $font-size-h1;
  margin-top: 100px;
  margin-bottom: 10px;
}
</style>
