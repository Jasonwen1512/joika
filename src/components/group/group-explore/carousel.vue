<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const updateCardPositions = () => {
  const cards = document.querySelectorAll(".scene .content .card");

  const total = cards.length;

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
};

const imgList = Array.from({ length: 12 }, (_, i) => {
  return new URL(
    `/src/assets/img/group/group-explore/group-explore-banner-img/img${
      i + 1
    }.jpg`,
    import.meta.url
  ).href;
});

let rotateTween = ref(null);

const hoverIn = (e) => {
  rotateTween.value?.pause();
  gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3, ease: "power2.out" });
};
const hoverOut = (e) => {
  rotateTween.value?.play();
  gsap.to(e.currentTarget, { scale: 1.0, duration: 0.3, ease: "power2.in" });
};

onMounted(() => {
  gsap.set(".title", {
    y: 250,
    opacity: 0,
  });
  gsap.to(".title", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    duration: 1.2,
    ease: "power2.out",
  });
  // gsap.fromTo(
  //   ".scene",
  //   { perspective: 500 },
  //   {
  //     perspective: 800,
  //     duration: 2,
  //     ease: "power3.out",
  //   }
  // );

  // gsap區域
  updateCardPositions();
  // 從y=300的位置位移上來
  gsap.fromTo(
    ".scene",
    { y: 300 },
    {
      y: 0,
      duration: 1.2,

      ease: "power3.out",
    }
  );

  rotateTween.value = gsap.to(".content", {
    rotateY: "-=360",
    duration: 8, // 初始旋轉速度
    repeat: -1,
    ease: "linear",
    transformOrigin: "50% 50%",
  });
  setTimeout(() => {
    gsap.to(rotateTween.value, {
      timeScale: 0.26, // 最後的旋轉速度
      duration: 1.2, // 幾秒後會從「初始旋轉速度」轉到「最後的旋轉速度」
      ease: "power2.out",
    });
  }, 500);

  // rotateTween.value = gsap.to(".carousel", {
  //   rotateY: "-=360",
  //   duration: 40,
  //   repeat: -1,
  //   ease: "linear",
  //   transformOrigin: "50% 50%",
  // });
});
// gsap區域
</script>

<template>
  <p class="carousel-bar">揪團探索</p>
  <h1 class="title">大家都在揪，就差你一咖</h1>
  <div class="scene">
    <div class="content">
      <div
        class="card"
        v-for="(img, index) in imgList"
        :key="index"
        :style="`--i: ${index}`"
        @mouseenter="hoverIn"
        @mouseleave="hoverOut"
      >
        <!-- 先暫時都回到首頁，之後再改 -->
        <router-link to="/home">
          <img :src="img" :alt="`img-${index + 1}`" />
        </router-link>
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
.carousel-bar {
  font-size: $font-size-p;
  font-weight: 600;
  padding: 30px 0 0 5%;
  @include desktop() {
    display: none;
  }
}

.title {
  @include flex-center();
  font-size: $font-size-h3;
  margin-top: 18px;
  // margin-bottom: 10px;
  @include desktop() {
    font-size: $font-size-h1;
    margin-top: 7.5vw;
  }
}

.scene {
  perspective: 400px;
  @include flex-center();
  overflow: hidden;
  @include desktop() {
    perspective: 1200px;
  }
}

.content {
  position: relative;
  width: 600px;
  height: 300px;
  transform-style: preserve-3d;
  @include tablet() {
    height: 400px;
  }

  @include desktop() {
    height: 800px;
  }
}

.card {
  position: absolute;
  width: 600px;
  height: 800px; // 800px
  background: $tp;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  cursor: pointer;
  @include desktop() {
    width: 800px;
    height: 1000px; // 1000px
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
</style>
