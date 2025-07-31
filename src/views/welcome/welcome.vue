<script setup>
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoSvg from "@/assets/img/welcome/logo.svg?url";
import pointDown from "@/assets/img/welcome/point-down.svg?url"; // 使用?url強制將svg轉換為url字串

// 背景色塊
const backgroundDecoration = ref({
  featureBackground: new URL("@/assets/img/welcome/feature-background.svg", import.meta.url).href,
  bgSkyblue1: new URL("@/assets/img/welcome/bg-decorate-skyblue1.svg", import.meta.url).href,
  bgSkyblue2: new URL("@/assets/img/welcome/bg-decorate-skyblue2.svg", import.meta.url).href,
  bgGreen: new URL("@/assets/img/welcome/bg-decorate-green.svg", import.meta.url).href,
  bgYellow1: new URL("@/assets/img/welcome/bg-decorate-yellow1.svg", import.meta.url).href,
  bgYellow2: new URL("@/assets/img/welcome/bg-decorate-yellow2.svg", import.meta.url).href,
});

// 平台特色卡片資料
const featureCardInfo = ref([
  {
    image: new URL("@/assets/img/welcome/membership-icon.svg", import.meta.url).href,
    title: "嚴選會員機制",
    subtitle: "會員資料實名認證",
  },
  {
    image: new URL("@/assets/img/welcome/review-icon.svg", import.meta.url).href,
    title: "活動內容審核",
    subtitle: "官方審核每一場揪團",
  },
  {
    image: new URL("@/assets/img/welcome/first-choice-icon.svg", import.meta.url).href,
    title: "揪團平台首選",
    subtitle: "輕鬆找到志同道合的夥伴",
  },
]);

// 社群回覆卡片資料
const communityCardInfo = ref([
  {
    photo: "",
    nickname: "Yoyo",
    title: "第一次夜衝合歡山！星星多到爆炸✨",
    content: "昨天晚上跟幾個大學同學衝上合歡山看星星，本來還擔心會不會太冷、太累，結果完全值得！！✨✨",
    id: 1,
  },
  {
    photo: "",
    nickname: "杯子裡的雲",
    title: "陌生人也能變朋友！第一次桌遊揪團超出預期",
    content: "身為業務員，平常接觸超多人，但很多時候反而更想認識一些**「無壓力的新朋友」**。",
    id: 2,
  },
  {
    photo: "",
    nickname: "pika揪",
    title: "陽明山七星山日出團大推👍",
    content: "第二次參加Kevin的登山團了！上次爬大屯山就覺得他很專業，這次七星山也沒讓人失望。",
    id: 3,
  },
  {
    photo: "",
    nickname: "Jojo",
    title: "奇萊南華百岳初體驗心得",
    content: "人生第一座百岳GET！雖然兩天一夜的行程很累，但成就感滿滿。",
    id: 4,
  },
  {
    photo: "",
    nickname: "Larry",
    title: "大型桌遊聯誼成功脫單！",
    content: "原本抱著認識朋友的心情參加，沒想到真的遇到心儀的對象！",
    id: 5,
  },
]);

gsap.registerPlugin(ScrollTrigger);

const cardWrapperRef = ref(null);

onMounted(() => {
  const communityCard = gsap.utils.toArray(".community-card");

  // 每張卡片給予 600px 的滾動距離，額外加上一點緩衝
  const scrollHeight = 600 * (communityCard.length + 1);
  if (cardWrapperRef.value) {
    cardWrapperRef.value.style.height = `${scrollHeight}px`;
  }

  const baseAngle = -2;
  communityCard.forEach((card, i) => {
    const angle = 4 + i * baseAngle; // 卡片依序逆時針旋轉2度，第一張卡片的角度為4度
    card.style.transform = `rotate(${angle}deg)`;
    card.style.zIndex = i + 1;

    // 初始狀態：卡片在畫面下方
    gsap.set(card, {
      y: window.innerHeight + 600 * (communityCard.length - i),
    });

    gsap.to(card, {
      scrollTrigger: {
        trigger: cardWrapperRef.value,
        start: `top+=${i * 600} center`,
        end: `top+=${(i + 1) * 600} center`,
        scrub: true,
        markers: true, // 測試用標記
      },
      y: 0, // 所有卡片停在相同位置堆疊
    });
  });

  // 迎賓頁面捲動至最下方，跳轉至JOIKA首頁
  // ScrollTrigger.create({
  //   trigger: ".learn-more", // 目標區塊
  //   start: "top 80%",
  //   once: true,
  //   onEnter: () => {
  //     setTimeout(() => {
  //       window.location.href = "/home"; // 主頁
  //     }, 1000); // 1秒後跳轉
  //   },
  // });
});
</script>

<template>
  <div class="welcome-page-wrapper">
    <!-- === 文字漂浮區域 === -->
    <section class="floating-text-wrapper">
      <h3 class="floating-text" id="floating-text-1">朋友們都好難揪</h3>
      <h3 class="floating-text" id="floating-text-2">一個人好無聊</h3>
      <h3 class="floating-text" id="floating-text-3">好想出去走走</h3>
      <h3 class="floating-text" id="floating-text-4">沒人一起露營</h3>
      <h3 class="floating-text" id="floating-text-5">說走就走怎麼那麼難</h3>
      <h3 class="floating-text" id="floating-text-6">永遠差一咖</h3>
      <h3 class="floating-text" id="floating-text-7">如果有人剛好也想玩就好了</h3>
      <h1 class="entrance-slogan">揪一咖 就出發</h1>
      <img id="bg-skyblue1" :src="backgroundDecoration.bgSkyblue1" alt="背景色塊 skyblue" />
      <img id="bg-green" :src="backgroundDecoration.bgGreen" alt="背景色塊 green" />
      <img id="bg-yellow1" :src="backgroundDecoration.bgYellow1" alt="背景色塊 yellow" />
    </section>

    <!-- === 卡片滑動效果區域 === -->
    <section class="sliding-cards-wrapper">
      <div class="sliding-slogan-group">
        <!-- font-size: 60px -->
        <p class="sliding-slogan">每一種玩樂</p>
        <p class="sliding-slogan">都值得被揪</p>
      </div>
      <div class="activity-card">卡片1</div>
      <div class="activity-card">卡片2</div>
      <div class="activity-card">卡片3</div>
      <div class="activity-card">卡片4</div>
      <div class="activity-card">卡片5</div>
    </section>

    <!-- === 平台特色卡片區域 === -->
    <section class="feature-cards-wrapper">
      <h2 class="entrance-slogan">安心揪 放心玩</h2>
      <div class="community-cards-list">
        <div class="feature-card" v-for="(card, index) in featureCardInfo" :key="index">
          <img class="feature-icon" :src="card.image" alt="" />
          <h2 class="feature-title">{{ card.title }}</h2>
          <p class="feature-text">{{ card.subtitle }}</p>
        </div>
      </div>
      <div>
        <img class="feature-bg" :src="backgroundDecoration.featureBackground" alt="背景圖" />
      </div>
    </section>

    <!-- === 社群回覆卡片區域 === -->
    <section class="community-cards-wrapper" ref="cardWrapperRef">
      <div class="community-cards-list">
        <h2 class="entrance-slogan">一咖都不能少的理由</h2>

        <!-- 從 communityCardInfo 引入資料 -->
        <div class="community-card" v-for="(card, index) in communityCardInfo" :key="card.id">
          <div class="content-wrapper">
            <img class="profile-photo" src="" alt="" />
            <h2 class="member-nickname">{{ card.nickname }}</h2>
            <h2 class="comment-title">{{ card.title }}</h2>
            <p class="comment-content">{{ card.content }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- === 骰子區域 === -->
    <section class="dice-wrapper">
      <h2 class="entrance-slogan">不知道揪什麼？</h2>
      <img id="bg-skyblue2" :src="backgroundDecoration.bgSkyblue2" alt="背景色塊 skyblue" />
      <img id="bg-yellow2" :src="backgroundDecoration.bgYellow2" alt="背景色塊 yellow" />
    </section>

    <!-- === 頁面跳轉緩衝區 === -->
    <section class="learn-more">
      <h2 class="entrance-slogan">
        還等什麼？裡面更好玩
        <img id="point-down" :src="pointDown" alt="" />
      </h2>
    </section>
  </div>
</template>

<style scoped lang="scss">
// === 區塊名稱 ===
// Start ****** 暫時這樣寫，預留空間測試下半部的動畫 ******
.floating-text-wrapper,
.sliding-cards-wrapper,
.feature-cards-wrapper,
.dice-wrapper,
.learn-more {
  height: 100vh;
  border: 1px solid red;
}
// End ****** 暫時這樣寫，預留空間測試下半部的動畫 ******

// === 通用設定 ===
.entrance-slogan {
  margin: auto;
  font-size: $font-size-h1;
  text-align: center;
  margin-bottom: 100px;
}

// === 文字漂浮區域 ===
.floating-text-wrapper {
  position: relative;
  line-height: 1; // line-height設定為1，方便設定絕對定位

  #floating-text-1 {
    color: #1fb92c;
    font-size: clamp(12px, 2.604vw, 50px);
    position: absolute;
    top: 7.24vw;
    right: 3.125vw;
  }
  #floating-text-2 {
    color: $color-primary;
    font-size: clamp(10px, 2.344vw, 45px);
    position: absolute;
    top: 12.135vw;
    left: 13.75vw;
  }
  #floating-text-3 {
    color: #fb400c;
    font-size: clamp(6px, 1.563vw, 30px);
    position: absolute;
    top: 14.479vw;
    right: 30vw;
  }
  #floating-text-4 {
    color: #e038af;
    font-size: clamp(12px, 2.604vw, 50px);
    position: absolute;
    top: 23.021vw;
    left: 30vw;
  }
  #floating-text-5 {
    color: $white;
    font-size: clamp(6px, 1.563vw, 30px);
    position: absolute;
    top: 25.938vw;
    left: 7.031vw;
  }
  #floating-text-6 {
    color: $color-highlight;
    font-size: clamp(14px, 2.604vw, 50px);
    position: absolute;
    top: 24.896vw;
    right: 4.427vw;
  }
  #floating-text-7 {
    color: $blue;
    font-size: clamp(12px, 3.125vw, 60px);
    line-height: 1.7; // 無須絕對定位，line-height改回1.7
    margin: 43.75vw auto;
    text-align: center;
  }
  .entrance-slogan {
    color: $blue;
    font-size: clamp(14px, 3.333vw, 64px);
    font-weight: normal;
    position: absolute;
    top: 63.021vw;
    left: 50%;
    transform: translateX(-50%); // 文字移回元素整體寬度的一半位置，達到水平置中效果
  }
  #bg-skyblue1 {
    width: 29.323vw;
    position: absolute;
    top: 0;
    right: 0;
    z-index: -1;
  }
  #bg-green {
    width: 23.177vw;
    position: absolute;
    top: 18.75vw;
    left: 0;
    z-index: -1;
  }
  #bg-yellow1 {
    width: 32.188vw;
    position: absolute;
    top: 84vw;
    left: 5vw;
    z-index: -1;
  }
}

// === 卡片滑動效果區域 ===

// === 平台特色卡片區域 ===
.feature-cards-wrapper {
  min-width: 1200px;
  padding-top: 210px;
  position: relative;

  .community-cards-list {
    @include flex-center;
    // flex-wrap: wrap;
    gap: 20px;

    .feature-card {
      width: 385px;
      height: 350px;
      background-color: $white;
      border: 2px solid $black;
      text-align: center;

      .feature-icon {
        margin: 50px auto;
      }
      .feature-text {
        margin-top: 30px;
      }
    }
  }
  .feature-bg {
    width: 100%;
    min-height: 898px;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
}

// === 社群回覆卡片 ===
.community-cards-wrapper {
  position: relative;
  display: flex;
  justify-content: center;

  .community-cards-list {
    position: sticky;
    top: 50px;
    width: 800px;
    height: 500px;
    margin-bottom: 300px; // 避免卡片疊在骰子區域上

    .community-card {
      position: absolute;
      width: 800px;
      height: 500px;
      font-size: $font-size-h2;
      background-color: $white;
      border: 4px solid $blue;
      border-radius: 60px;

      .content-wrapper {
        display: grid;
        gap: 20px 50px;
        // grid-template-rows: 1fr 1fr 2fr;
        grid-template-columns: 1fr 4fr;
        padding: 50px;

        .profile-photo {
          grid-row: 1 / span 2;
          width: 140px;
          height: 140px;
          background-color: pink; //測試用，之後換成圖片
          border-radius: 50%;
        }
        .member-nickname {
          line-height: 1.7;
          font-weight: 700;
        }
        .comment-title {
          line-height: 1.7;
        }
        .comment-content {
          line-height: 2;
          grid-column: 1 / span 2;
        }
      }
    }
  }
}

// === 骰子區域 ===
// === 頁面跳轉緩衝區 ===
.learn-more {
  #point-down {
    vertical-align: middle;
    height: $font-size-h1;
    aspect-ratio: 1 / 1;
  }
}
</style>
