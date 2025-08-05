<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import AtivityCard from "@/components/activity/activity-card.vue";
import { FakeActivity } from "@/assets/data/fake-activity";
import Marquee from "@/components/marquee.vue";
import Marquee2 from "@/components/marquee2.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
// === 1. 引入我們做好的輪播元件 ===
import Carousel from "@/components/carousel.vue";
const modules = [FreeMode, Pagination];

// === 2. 準備輪播元件需要的資料 (slideData) ===
const slideData = ref([
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/diving-with-fish.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/undersea-stroll.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/diving.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/happy-movie-day.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/ticket-booth.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/movie.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/basketball-girl.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/sunny-court.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/sports.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/mountain-buddies.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/morning-mountains.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/hiking-buddy.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/camping-moments.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/mountain-tent.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/camping.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/board-game-time.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/game-corner.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/board-game-champ.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/strolling-the-gallery.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/immersed-in-art.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/exhibition-visitor.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/dinner-with-friends.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/food-time-friends.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/jack.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/happy-art-class.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/creative-craft-corner.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/art-sharing-moment.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/romantic-wish.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/wishful-night.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/annie.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/night-showtime.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/starlight-night.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/lee.png",
      import.meta.url
    ).href,
  },
  {
    cardBase: new URL(
      "@/assets/img/index-img/carousel/ktv-night.jpg",
      import.meta.url
    ).href,
    bgPatch: new URL(
      "@/assets/img/index-img/carousel/ktv-room.jpg",
      import.meta.url
    ).href,
    charFloating: new URL(
      "@/assets/img/index-img/carousel/sam.png",
      import.meta.url
    ).href,
  },
]);
//推薦揪團分類輪播
const items = [
  {
    name: "水上活動",
    img: new URL("@/assets/img/index-img/diving.png", import.meta.url).href,
    color: "#4F8DA8",
    category: "CA007",
  },
  {
    name: "電影",
    img: new URL("@/assets/img/index-img/movie.png", import.meta.url).href,
    color: "#FFA68D",
    category: "CA009",
  },
  {
    name: "運動",
    img: new URL("@/assets/img/index-img/sports.png", import.meta.url).href,
    color: "#FADA7A",
    category: "CA003",
  },
  {
    name: "登山",
    img: new URL("@/assets/img/index-img/hiking3.png", import.meta.url).href,
    color: "#90DA81",
    category: "CA001",
  },
  {
    name: "露營",
    img: new URL("@/assets/img/index-img/camping3.png", import.meta.url).href,
    color: "#A281DA",
    category: "CA004",
  },
  {
    name: "桌遊",
    img: new URL("@/assets/img/index-img/board-games.png", import.meta.url)
      .href,
    color: "#F315BB",
    category: "CA002",
  },
  {
    name: "展覽",
    img: new URL("@/assets/img/index-img/exhibition.png", import.meta.url).href,
    color: "#FFFCE2",
    category: "CA006",
  },
  {
    name: "聚餐",
    img: new URL("@/assets/img/index-img/gathering.png", import.meta.url).href,
    color: "#FB900C",
    category: "CA008",
  },
  {
    name: "手作",
    img: new URL("@/assets/img/index-img/DIY.png", import.meta.url).href,
    color: "#81BFDA",
    category: "CA010",
  },
  {
    name: "文化體驗",
    img: new URL(
      "@/assets/img/index-img/cultural-experience.png",
      import.meta.url
    ).href,
    color: "#1FB92C",
    category: "CA011",
  },
  {
    name: "演出表演",
    img: new URL("@/assets/img/index-img/concert.png", import.meta.url).href,
    color: "#FFE100",
    category: "CA012",
  },
  {
    name: "唱歌",
    img: new URL("@/assets/img/index-img/ktv.png", import.meta.url).href,
    color: "#2AA9FF",
    category: "CA005",
  },
];

import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
// 註冊插件
gsap.registerPlugin(SplitText);

let split;
let animation;

// title文字動畫
onMounted(() => {
  // 初始化 SplitText
  split = new SplitText(".title", {
    type: "words,chars,lines",
  });

  // 執行動畫（你原本的 gsap.from 設定）
  animation = gsap.from(split.words, {
    y: -100,
    opacity: 0,
    rotation: "random(-80, 80)",
    duration: 0.8,
    ease: "back",
    stagger: 0.15,
    delay: 0.45,
  });
});
</script>

<template>
  <Carousel :slides="slideData" class="home-Carousel" />
  <h1 class="title">JOIKA 一起玩吧</h1>
  <Marquee2 />
  <!-- 限時揪團區塊 -->
  <img class="bg-img" src="/src/assets/img/bg-decorate1.png" alt="背景圖黃" />

  <div class="bg-section">
    <div class="index-section-start">
      <img
        class="cardJ1"
        src=" @/assets/img/index-img/first-section-img.png"
        alt="限時揪團標題圖"
      />
      <h2>限時揪團<br />差你一咖</h2>
      <img
        class="bg-img2"
        src="/src/assets/img/bg-decorate2.png"
        alt="背景圖藍"
      />
    </div>

    <div class="first-section">
      <div class="card-grid">
        <AtivityCard
          v-for="item in FakeActivity.slice(0, 8)"
          :key="item.activity_id"
          :item="item"
        />
      </div>
      <img
        class="bg-img3"
        src="/src/assets/img/bg-decorate3.png"
        alt="背景圖深黃"
      />
    </div>
  </div>

  <Marquee />

  <!-- 最新揪團卡片區塊 -->
  <div class="index-section-start">
    <img
      class="cardJ1"
      src=" @/assets/img/index-img/second-section-img.png"
      alt="最新揪團標題圖"
    />
    <h2>最新揪團<br />差你一咖</h2>
  </div>

  <div class="card-grid">
    <AtivityCard
      v-for="item in FakeActivity.slice(0, 8)"
      :key="item.activity_id"
      :item="item"
    />
  </div>

  <Marquee2 />

  <!-- 揪團推薦-分類框區塊 -->
  <div class="bg-section">
    <div class="index-section-start">
      <img
        class="cardJ1"
        src="@/assets/img/index-img/third-section-img.png"
        alt="最新揪團標題圖"
      />
      <h2>揪團推薦<br />差你一咖</h2>
    </div>
    <img
      class="bg-img4"
      src="/src/assets/img/bg-decorate4.png"
      alt="背景圖淺藍"
    />
    <Swiper
      :slides-per-view="1"
      :space-between="0"
      :free-mode="true"
      :pagination="{ clickable: true }"
      :breakpoints="{
        1024: { slidesPerView: 6 },
        768: { slidesPerView: 3 },
        320: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      }"
      :modules="modules"
      class="recommendations-swiper"
    >
      <SwiperSlide v-for="(item, index) in items" :key="index">
        <RouterLink :to="`/activity?category=${item.category}`">
          <div class="recommendations-card">
            <div
              class="recommendations-pic"
              :style="{ backgroundColor: item.color }"
            >
              <img :src="item.img" :alt="item.name" />
            </div>
            <h3>{{ item.name }}</h3>
          </div>
        </RouterLink>
      </SwiperSlide>
    </Swiper>
  </div>

  <Marquee />

  <!-- 品牌介紹區塊 -->

  <div class="bg-section">
    <div class="index-section-start">
      <img
        src="@/assets/img/index-img/fourth-section-img.png"
        alt="品牌介紹標題圖"
      />
      <h2>JOIKA<br />差你一咖</h2>
    </div>
    <img
      class="bg-img8"
      src="/src/assets/img/bg-decorate8-mb.png"
      alt="品牌介紹背景圖手機版"
    />
    <div class="bg-wrapper">
      <div class="introduction">
        <p>
          每個人都有過「想參加活動卻找不到人一起」的時候。
          一場登山、一趟潛水、一局桌遊，因為缺一咖而不了了之，原本期待的週末就這樣變成空白。我們也是這樣一路走來的年輕人，熱愛生活、熱愛活動，但總是被「人數不足」打敗。
          <br /><br />
          於是，我們決定打造一個平台——Joika
          揪一咖，讓這些「原本不該錯過的事」，不再因為缺人而流失。
          <br /><br />
          不論你是第一次嘗試某項活動、還是想認識志同道合的朋友，Joika
          都歡迎你來， 在這裡，你不用再尷尬開口問「有人要一起嗎？」
          <br /><br />
          ——因為我們都在找，願意一起行動的那一咖。
          <br /><br />
        </p>
        <div class="floating">
          <img src="/src/assets/img/index-img/float.png" alt="浮動圖" />
        </div>
      </div>
    </div>
    <img
      class="bg-img5"
      src="/src/assets/img/index-img/bg-decorate5.png"
      alt="背景圖噪點淺藍"
    />
    <img
      class="bg-img6"
      src="/src/assets/img/bg-decorate6.png"
      alt="背景圖深藍"
    />
  </div>
</template>

<style scoped lang="scss">
h1 {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 165px;
}
.index-section-start {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  .cardJ1 {
    width: 100px;
  }
  margin-top: 50px;
  margin-bottom: 50px;
  position: relative;
  z-index: 2;
}
.bg-img2 {
  width: 15%;
  position: absolute;
  // top: 5vh;
  left: 0;
  top: -200%;
  z-index: -1;
}
.home-Carousel {
  position: relative;
  height: 600px;
  z-index: 2;
  overflow: visible;
  margin-top: 40px;
}

.first-section {
  width: 100%;
  margin: auto;
  position: relative;
}

.bg-section {
  position: relative;
  width: 100%;
}

.bg-img {
  position: absolute;
  // top: 20vh;
  left: 0;
  width: 100%;
  height: 150%;
  z-index: 0;
}

.bg-img3 {
  position: absolute;
  // top: 35%;
  bottom: -17%;
  right: 0;
  width: 15%;
  z-index: 1;
}

.bg-img4 {
  position: absolute;
  top: 0;
  left: 0;
  width: 20%;
  height: 100%;
  z-index: 0;
}

.bg-img5 {
  position: absolute;
  width: 100%;
  top: -46%;
  height: 170%;
  z-index: -1;
}

.bg-img6 {
  position: absolute;
  top: -15%;
  right: 0;
  width: 20%;
  z-index: 0;
}

.bg-wrapper {
  position: relative;
  margin-bottom: 10.5vw;
}

.bg-img8 {
  display: none;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 100vw;
  height: 110%;
  z-index: 0;
}

.floating img {
  display: block;
  animation: floatXY 5s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  width: 300px;
  position: absolute;
  right: -250px;
  bottom: 0;
  z-index: 2;
}

@keyframes floatXY {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  25% {
    transform: translate(10px, -14px);
    opacity: 0.98;
  }
  50% {
    transform: translate(-10px, -20px);
    opacity: 1;
  }
  75% {
    transform: translate(10px, -12px);
    opacity: 0.99;
  }
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}

.card-grid {
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: center;
  align-items: center;
  margin: auto;
  position: relative;
  z-index: 2;
}
.recommendations-swiper {
  height: 320px;
  padding: 20px 0;
  .swiper-slide {
    width: 200px !important;
    display: flex;
    justify-content: center;
    @include tablet() {
      width: 30% !important;
    }
    @include desktop() {
      width: 18% !important;
    }
  }
  @include desktop() {
    height: 350px;
  }
}

.recommendations-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-bottom: 50px;
  h3 {
    color: black;
  }
}

.recommendations-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 183px;
  height: 183px;
  border: 1px solid black;
  border-radius: 50%;
  overflow: hidden;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.introduction {
  border: 2px solid #fff;
  padding: 20px;
  background-color: #addaee;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: auto;
  p {
    line-height: 3;
  }
  position: relative;
  z-index: 1;
}

@media screen and (max-width: 767px) {
  h1 {
    margin-top: 0px;
    font-size: $font-size-h2;
  }
  .index-section-start {
    margin-top: 10px;
    margin-bottom: 25px;
  }
  .card-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-items: center;
  }

  .card-grid > *:nth-child(n + 5) {
    display: none;
  }

  .bg-img {
    height: 200%;
  }

  .bg-img2 {
    top: -140%;
    width: 50%;
  }

  .bg-img3 {
    top: 28%;
    width: 50%;
  }

  .bg-img4 {
    top: 0;
    width: 50%;
    height: 70%;
  }

  .bg-img5 {
    display: none;
  }

  .bg-img6 {
    display: none;
  }

  .floating img {
    top: 750px;
    right: 0;
    width: 45%;
    z-index: 2;
  }

  .introduction {
    max-width: 400px;
    margin-bottom: 150px;
  }

  .bg-img8 {
    display: block;
    position: absolute;
    top: 0;
    z-index: 0;
  }
}

@media screen and (min-width: 1025px) and (max-width: 1440px) {
  .title {
    margin-top: 0px;
  }
}

@media screen and (min-width: 768px) and (max-width: 1024px) {
  .card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    align-items: center;
  }

  .bg-img {
    height: 100%;
  }

  .bg-img2 {
    width: 25%;
  }

  .bg-img3 {
    top: 50%;
    width: 25%;
  }

  .bg-img4 {
    top: 10%;
    width: 30%;
    height: 90%;
  }
  .introduction {
    margin-bottom: 200px;
    position: relative;
  }
  .bg-img5 {
    position: absolute;
    width: 100%;
    z-index: 0;
  }

  .bg-img6 {
    display: none;
  }

  .floating img {
    bottom: 0;
    right: 0;
    width: 30%;
  }
}
</style>
