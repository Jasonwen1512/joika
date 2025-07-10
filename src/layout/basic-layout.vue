<script setup>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
</script>

<template>
  <Header></Header>
  <main>
    <slot></slot>
  </main>
  <Footer></Footer>
</template>

<style scoped lang="scss"></style>
