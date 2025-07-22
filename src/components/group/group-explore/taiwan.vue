<script setup></script>

<template>
  <div class="taiwan">
    <h1 class="title">JOIKA 揪遍全台灣</h1>
    <div class="content-taiwan">
      <img
        src="@/assets/img/group/group-explore/group-explore-taiwan/taiwan.svg?url"
        alt=""
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  @include flex-center();
  font-size: $font-size-h3;
  @include desktop() {
    font-size: $font-size-h1;
  }
}
</style>
