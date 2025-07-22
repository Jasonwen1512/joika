<script setup>
import North from "@/assets/img/group/group-explore/group-explore-taiwan/north-yellow.svg";
import West from "@/assets/img/group/group-explore/group-explore-taiwan/west-green.svg";
import East from "@/assets/img/group/group-explore/group-explore-taiwan/east-pink.svg";
import South from "@/assets/img/group/group-explore/group-explore-taiwan/south-blue.svg";
</script>

<template>
  <div class="taiwan">
    <h1 class="taiwan-title">JOIKA 揪遍全台灣</h1>
    <div class="taiwan-content">
      <!-- 北部 -->
      <div class="north">
        <North />
      </div>
      <!-- 西部 -->
      <div class="west">
        <West />
      </div>
      <!-- 東部 -->
      <div class="east">
        <East />
      </div>
      <!-- 南部 -->
      <div class="south">
        <South />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.taiwan-title {
  @include flex-center();
  font-size: $font-size-h3;
  @include desktop() {
    font-size: $font-size-h1;
  }
}

.taiwan-content {
  @include flex-center();
}
</style>
