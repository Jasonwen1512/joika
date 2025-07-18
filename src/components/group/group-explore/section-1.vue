<script setup>
import { onMounted } from "vue";

import gsap from "gsap";

const imgList = Array.from({ length: 12 }, (_, i) => {
  return new URL(
    `/src/assets/img/group-explore-banner-img/img${i + 1}.jpg`,
    import.meta.url
  ).href;
});
console.log(imgList);

// gsap區域
onMounted(() => {
  gsap.to(".carousel", {
    rotateY: 360,
    duration: 60,
    repeat: -1,
    ease: "linear",
    transformOrigin: "50% 50%",
  });
});
// gsap區域
</script>

<template>
  <div class="scene">
    <div class="carousel">
      <div
        class="card"
        v-for="(img, index) in imgList"
        :key="index"
        :style="`--i: ${index}`"
      >
        <img :src="img" :alt="`img-${index + 1}`" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scene {
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.carousel {
  position: relative;
  width: 600px;
  height: 600px;
  transform-style: preserve-3d;
}

.card {
  position: absolute;
  width: 600px;
  height: 800px;
  background: #61dafb;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  top: 50%;
  left: 50%;
  // will-change: transform;
  // contain: strict;
  transform: translate(-50%, -50%) rotateY(calc(var(--i) * 30deg))
    translateZ(1200px);
  @include desktop() {
    width: 800px;
    height: 1000px;
    transform: translate(-50%, -50%) rotateY(calc(var(--i) * 30deg))
      translateZ(1800px);
  }
  img {
    width: 600px;
    height: 800px;
    vertical-align: middle;
    @include desktop() {
      width: 800px;
      height: 1000px;
    }
  }
}
</style>
