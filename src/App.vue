<script setup>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
</script>

<template>
  <div>
    <Header></Header>
    <main class="main">
      <router-view></router-view>
    </main>
    <Footer></Footer>
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
main {
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
</style>
