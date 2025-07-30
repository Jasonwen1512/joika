<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faImage } from "@fortawesome/free-solid-svg-icons";

library.add(faImage);
</script>

<template>
  <div class="placeholder-image">
    <font-awesome-icon :icon="['fas', 'image']" />
  </div>
</template>

<style scoped>
.placeholder-image {
  width: 100%;
  background-color: #e0e0e0; /* 淺灰背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888888; /* icon 顏色 */
  font-size: 48px;
}
</style>
