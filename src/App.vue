<script setup>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";

import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const hideLayout = computed(() => {
  return route.path === "/" || route.meta?.hideLayout === true;
});
</script>

<template>
  <div>
    <Header v-if="!hideLayout" />
    <main :class="['main', { 'with-header': !hideLayout }]">
      <router-view />
    </main>
    <Footer v-if="!hideLayout" />
  </div>
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
.with-header {
  padding-top: $header-h-m;
  @include desktop() {
    padding-top: $header-h-d;
  }
}
body {
  background-image: url("@/assets/img/bgc.jpg");
  background-repeat: repeat;
  background-size: auto;
  background-position: top left;
}
h1 {
  font-family: "MyFont", sans-serif;
  font-size: $font-size-h1;
  font-weight: 600;
}
h2 {
  font-family: "MyFont", sans-serif;
  font-size: $font-size-h2;
  font-weight: 400;
}
h3 {
  font-family: "MyFont", sans-serif;
  font-size: $font-size-h3;
  font-weight: 400;
}
h4 {
  font-family: "MyFont", sans-serif;
  font-size: $font-size-h4;
  font-weight: 400;
}

p{
  font-family: "MyFont", sans-serif;
  font-size: $font-size-p;
  font-weight: 400;
}
</style>
