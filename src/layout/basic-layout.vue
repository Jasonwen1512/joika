<script setup>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import TestButton from "@/components/test.vue";
</script>

<template>
  <Header></Header>
  <main>
    <slot> </slot>
  </main>
  <TestButton></TestButton>
  <Footer></Footer>
</template>

<style scoped lang="scss"></style>
