<script setup>
// JavaScript 的部分完全不需要更動，跟上一版一模一樣
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

// === Data ===
const slideData = ref([
  { cardBase: new URL('@/assets/img/index-img/carousel/diving-with-fish.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/undersea-stroll.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/diving.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/happy-movie-day.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/ticket-booth.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/movie.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/basketball-girl.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/sunny-court.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/sports.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/mountain-buddies.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/morning-mountains.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/hiking-buddy.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/camping-moments.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/mountain-tent.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/camping.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/board-game-time.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/game-corner.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/board-game-champ.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/strolling-the-gallery.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/immersed-in-art.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/exhibition-visitor.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/dinner-with-friends.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/food-time-friends.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/jack.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/happy-art-class.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/creative-craft-corner.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/art-sharing-moment.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/romantic-wish.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/wishful-night.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/annie.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/night-showtime.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/starlight-night.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/lee.png', import.meta.url).href },
  { cardBase: new URL('@/assets/img/index-img/carousel/ktv-night.jpg', import.meta.url).href, bgPatch: new URL('@/assets/img/index-img/carousel/ktv-room.jpg', import.meta.url).href, charFloating: new URL('@/assets/img/index-img/carousel/sam.png', import.meta.url).href },
]);

// === Animation Constants ===
const moveDuration = 0.8;
const pauseBeforeAnimation = 0.5;
const scaleUpDuration = 0.5;
const pauseDuringScale = 0.6;
const scaleDownDuration = 0.5;

// === Reactive Variables ===
const slidesToShow = ref(0);
const slideGap = ref(0);
const centerOffset = ref(0);
const isMobile = ref(false);
const itemWidth = ref(0);
const totalMoveWidth = ref(0);
const currentIndex = ref(0);
const wrapperX = ref(0);
let isAnimating = false;
let allItems = [];
let delayedLoop = null;

// === Template Refs ===
const swiperContainer = ref(null);
const wrapper = ref(null);

// === Logic ===
const setSizes = () => {
  if (!swiperContainer.value) return;

  isAnimating = true;
  const viewportWidth = swiperContainer.value.offsetWidth;
  const currentScreenWidth = document.documentElement.clientWidth;
  isMobile.value = currentScreenWidth < 768;

  if (isMobile.value) {
    slidesToShow.value = 1;
    slideGap.value = viewportWidth * 0.05;
    centerOffset.value = 0;
    itemWidth.value = viewportWidth * 0.75;
  } else {
    slidesToShow.value = 6;
    slideGap.value = 20;
    centerOffset.value = Math.floor(slidesToShow.value / 2) - 1;
    itemWidth.value = (viewportWidth - (slidesToShow.value - 1) * slideGap.value) / slidesToShow.value;
  }

  const originalSlides = wrapper.value.querySelectorAll('.swiper-slide:not(.clone)');
  const clones = wrapper.value.querySelectorAll('.clone');
  clones.forEach((c) => c.remove());

  const itemsToClone = Array.from(originalSlides).slice(0, slidesToShow.value * 2);
  itemsToClone.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.classList.add('clone');
    wrapper.value.appendChild(clone);
  });
  allItems = gsap.utils.toArray('.swiper-slide');

  totalMoveWidth.value = itemWidth.value + slideGap.value;

  allItems.forEach((item) => gsap.set(item, { width: itemWidth.value, marginRight: slideGap.value }));
  gsap.set(wrapper.value, { width: allItems.length * totalMoveWidth.value });

  if (isMobile.value) {
    wrapperX.value = (viewportWidth - itemWidth.value) / 2;
  } else {
    wrapperX.value = 0;
  }

  gsap.set(wrapper.value, { x: wrapperX.value });
  currentIndex.value = 0;
  isAnimating = false;
};

const playInfiniteLoop = () => {
  if (isAnimating) return;
  isAnimating = true;

  wrapperX.value -= totalMoveWidth.value;

  gsap.to(wrapper.value, {
    x: wrapperX.value,
    duration: moveDuration,
    ease: 'power3.inOut',
    onComplete: () => {
      currentIndex.value++;
      if (currentIndex.value >= slideData.value.length) {
        wrapperX.value += slideData.value.length * totalMoveWidth.value;
        gsap.set(wrapper.value, { x: wrapperX.value });
        currentIndex.value = 0;
      }

      const animationTargetIndex = currentIndex.value + centerOffset.value;
      const currentSlide = allItems[animationTargetIndex];

      if (!currentSlide) {
        isAnimating = false;
        playInfiniteLoop();
        return;
      }

      const cardWrapper = currentSlide.querySelector('.card-content-wrapper');
      const baseImage = currentSlide.querySelector('.card-base-image');
      const bgPatch = currentSlide.querySelector('.card-bg-patch');
      const floatingChar = currentSlide.querySelector('.card-char-floating');

      if (!cardWrapper || !baseImage || !bgPatch || !floatingChar) {
        isAnimating = false;
        playInfiniteLoop();
        return;
      }

      const effectTl = gsap.timeline({
        onComplete: () => {
          gsap.set([baseImage, bgPatch], { clearProps: 'opacity' });
          gsap.set(floatingChar, { clearProps: 'transform,opacity,scale' });
          isAnimating = false;
          playInfiniteLoop();
        },
      });

      effectTl
        .addLabel('start', pauseBeforeAnimation)
        .to(cardWrapper, { scale: 1.1, duration: scaleUpDuration, ease: 'back.out(1.4)' }, 'start')
        .to(baseImage, { opacity: 0, duration: scaleUpDuration * 0.8, ease: 'power1.inOut' }, 'start')
        .to(bgPatch, { opacity: 1, duration: scaleUpDuration * 0.8, ease: 'power1.inOut' }, 'start')
        .fromTo(floatingChar, { opacity: 0, y: 0, scale: 0.7 }, {
          opacity: 1, y: 210, scale: 1.2, duration: scaleUpDuration, ease: 'back.out(1.4)',
        }, 'start+=0.15');

      const charMoveBack = scaleUpDuration;
      const charPause = 0.1;
      const charFade = 0.2;

      effectTl
        .addLabel('end', `start+=${scaleUpDuration + pauseDuringScale}`)
        .to(cardWrapper, { scale: 1, duration: scaleDownDuration, ease: 'power2.inOut' }, 'end')
        .to(floatingChar, { y: 60, scale: 1, duration: charMoveBack, ease: 'power2.inOut' }, 'end')
        .to(floatingChar, { opacity: 0, duration: charFade, ease: 'power1.inOut' }, `end+=${charMoveBack + charPause}`)
        .to(bgPatch, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, `end+=${charMoveBack + charPause + charFade}`)
        .to(baseImage, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, `end+=${charMoveBack + charPause + charFade}`);
    },
  });
};

// === Lifecycle Hooks ===
onMounted(() => {
  setTimeout(() => {
    setSizes();
    window.addEventListener('resize', setSizes);
    delayedLoop = gsap.delayedCall(2, playInfiniteLoop);
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', setSizes);
  if (delayedLoop) {
    delayedLoop.kill();
  }
  if (wrapper.value) {
    gsap.killTweensOf(wrapper.value);
  }
});
</script>

<template>
  <div class="swiper" ref="swiperContainer">
    <div class="swiper-wrapper" ref="wrapper">
      <div class="swiper-slide" v-for="(slide, index) in slideData" :key="index">
        <div class="slide-inner-container">
          <div class="card-content-wrapper">
            <img class="card-image card-base-image" :src="slide.cardBase" alt="卡片基礎圖">
            <img class="card-image card-bg-patch" :src="slide.bgPatch" alt="背景補丁">
          </div>
          <img class="card-image card-char-floating" :src="slide.charFloating" alt="浮出人物">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// === SCSS Mixins (魔法咒語) ===
$breakpoint-tablet: 768px;

// 電腦版的咒語
@mixin desktop {
  @media (min-width: $breakpoint-tablet) {
    @content;
  }
}





// === Carousel Component Styles ===
.swiper {
  // 手機版的基礎樣式 (Mobile First)
  height: 55vh;
  margin: 40px auto;
  width: 100%;
  overflow: visible;

  // 念誦「電腦版」咒語
  @include desktop {
    // 這裡所有的樣式，都只會在電腦上生效
    height: 600px;
    margin: 50px auto;
  }
}

.swiper-wrapper {
  display: flex;
  position: relative;
  will-change: transform;
  justify-content: flex-start;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  position: relative;
}

// === Card Styles ===
.slide-inner-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-content-wrapper {
  width: 90%;
  height: 90%;
  border-radius: 12px;
  position: relative;
  transform-origin: center center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  will-change: transform, opacity;
}

.card-bg-patch,
.card-char-floating {
  opacity: 0;
}

.card-char-floating {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: auto;
  object-fit: contain;
  z-index: 10;
}
</style>