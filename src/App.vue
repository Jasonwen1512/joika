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
  background-repeat: repeat; /* 預設就是 repeat，但寫出來比較明確 */
  background-size: auto; /* 預設值，保持原圖尺寸 */
  background-position: top left; /* 可省略，從左上角開始鋪 */
}
</style>
