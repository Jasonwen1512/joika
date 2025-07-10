<script setup>
import BasicLayout from "./layout/basic-layout.vue";
</script>

<template>
  <BasicLayout>
    <main class="home"></main>
  </BasicLayout>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  list-style: none;
  text-decoration: none;
  box-sizing: border-box;
}
button,
input,
textarea,
select {
  font: inherit;
  border: none;
  outline: none;
  background: none;
  color: inherit;
}
.home {
  padding-top: $header-h-m;
  @include desktop() {
    padding-top: $header-h-d;
  }
}
</style>
