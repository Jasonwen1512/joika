<script setup></script>

<template>
  <!-- 這是幫助中心頁 -->
  <div class="support">
    <div class="head">
      <h3>Joika幫助中心</h3>
      <h4>新手教學 & FAQ</h4>
    </div>
  </div>
</template>

<style scoped lang="scss">
.support {
  @include desktop() {
    @include flex-center();
  }
}
.head {
  position: relative;
  padding: 20px 0 54px 0;
  border-bottom: 3px dotted #a8a8a8;

  flex-direction: column;
  h3 {
    margin-left: 6%;
    color: $banner-title;
    @include desktop() {
      font-size: $font-size-h2;
      margin-left: 0;
    }
  }
  h4 {
    margin-top: 12px;
    margin-left: 10%;
    @include desktop() {
      font-size: $font-size-h3;
      margin-top: 50px;
      margin-left: 8.5%;
    }
  }
  @include desktop() {
    width: 62.5%;
    padding: 96px 0 54px 0;
  }
}
</style>
