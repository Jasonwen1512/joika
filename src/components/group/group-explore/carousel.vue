<script setup>
import { onMounted } from "vue";
import gsap from "gsap";

const imgList = Array.from({ length: 12 }, (_, i) => {
  return new URL(
    `/src/assets/img/group-explore-banner-img/img${i + 1}.jpg`,
    import.meta.url
  ).href;
});

// gsap區域
onMounted(() => {
  const cards = document.querySelectorAll(".scene .carousel .card");

  const total = cards.length;
  console.log(total);

  const angle = 360 / total;
  const radius = window.innerWidth >= 1024 ? 1800 : 1200;

  cards.forEach((card, i) => {
    const rotateY = angle * i;
    gsap.set(card, {
      transform: `rotateY(${rotateY}deg) translateZ(${radius}px)`,
      transformOrigin: "center center",
      xPercent: -50,
      yPercent: -50,
    });
  });

  gsap.to(".carousel", {
    rotateY: "+=360",
    duration: 60,
    repeat: -1,
    ease: "linear",
    transformOrigin: "50% 50%",
  });
});
// gsap區域
</script>

<template>
  <h1>大家都在揪，就差你一咖</h1>
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
      <!-- <img
        class="card"
        :style="{ '--i': index }"
        v-for="(img, index) in imgList"
        :key="index"
        :src="img"
        :alt="`img-${index + 1}`"
      /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.scene {
  perspective: 1000px;
  @include flex-center();
  overflow: hidden;
}

.carousel {
  position: relative;
  width: 600px;
  height: 650px; // 650px
  transform-style: preserve-3d;
  // will-change: transform;
}

.card {
  position: absolute;
  width: 600px;
  height: 800px; // 800px
  background: $tp;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  top: 40%;
  left: 50%;
  transform-style: preserve-3d;
  // will-change: transform;
  // transform: translate(-50%, -50%) rotateY(calc(var(--i) * 30deg))
  //   translateZ(1200px);
  @include desktop() {
    width: 800px;
    height: 1000px; // 1000px
    // transform: translate(-50%, -50%) rotateY(calc(var(--i) * 30deg))
    //   translateZ(1800px);
  }
  img {
    width: 600px;
    height: 800px;
    vertical-align: middle;
    object-fit: cover;
    @include desktop() {
      width: 800px;
      height: 1000px;
    }
  }
}

h1 {
  @include flex-center();
  font-size: $font-size-h1;
  margin-top: 100px;
  margin-bottom: 10px;
}
</style>
