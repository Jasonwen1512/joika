<script setup>
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  <!-- Start ****** 這裡預留空間，測試下半部的動畫，暫時先這樣寫，後續再做修改 ****** Start -->
  <!-- ===文字漂浮區域=== -->
  <section class="floating-text-wrapper">
    <p class="floating-text" id="floating-text-1">朋友們都好難揪</p>
    <p class="floating-text" id="floating-text-2">一個人好無聊</p>
    <p class="floating-text" id="floating-text-3">好想出去走走</p>
    <p class="floating-text" id="floating-text-4">沒人一起露營</p>
    <p class="floating-text" id="floating-text-5">說走就走怎麼那麼難</p>
    <p class="floating-text" id="floating-text-6">永遠差一咖</p>
    <p class="floating-text" id="floating-text-7">如果有人剛好也想玩就好了</p>
    <h1 class="entrance-slogan">揪一咖 就出發</h1>
  </section>

  <!-- ===卡片滑動效果區域=== -->
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

  <!-- ===平台特色卡片區域=== -->
  <section class="feature-cards-wrapper">
    <h2 class="entrance-slogan">安心揪 放心玩</h2>
    <div class="feature-card">
      <img src="" alt="" class="feature-icon" />
      <h3 class="feature-title"></h3>
      <p class="feature-text"></p>
    </div>
    <div class="feature-card">
      <img src="" alt="" class="feature-icon" />
      <h3 class="feature-title"></h3>
      <p class="feature-text"></p>
    </div>
    <div class="feature-card">
      <img src="" alt="" class="feature-icon" />
      <h3 class="feature-title"></h3>
      <p class="feature-text"></p>
    </div>
  </section>
  <!-- End ****** 這裡預留空間，測試下半部的動畫，暫時先這樣寫，後續再做修改 ****** End -->

  <!-- ===社群回覆卡片區域=== -->
  <section class="community-cards-wrapper" ref="cardWrapperRef">
    <div class="community-cards-list">
      <h2 class="entrance-slogan">一咖都不能少的理由</h2>

      <!-- 從 communityCardInfo 引入資料 -->
      <div class="community-card" v-for="(card, index) in communityCardInfo" :key="card.id">
        <div class="content-wrapper">
          <img src="" alt="" class="profile-photo" />
          <h2 class="member-nickname">{{ card.nickname }}</h2>
          <h2 class="comment-title">{{ card.title }}</h2>
          <p class="comment-content">{{ card.content }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===骰子區域=== -->
  <section class="dice-wrapper">
    <h2 class="entrance-slogan">不知道揪什麼？</h2>
  </section>

  <!-- ===頁面跳轉緩衝區=== -->
  <section class="learn-more">
    <h2 class="entrance-slogan">
      還等什麼？裡面更好玩
      <svg id="point-down" width="60" height="64" viewBox="0 0 60 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1178_735)">
          <mask id="mask0_1178_735" style="mask-type: luminance" maskUnits="userSpaceOnUse" x="4" y="0" width="52" height="60">
            <path d="M5.9917 10.1665H37.1584V1.6665H5.9917V10.1665Z" fill="#555555" stroke="white" stroke-width="3" stroke-linejoin="round" />
            <path d="M37.1584 10.1665C46.395 20.2569 51.6943 26.1049 53.0562 27.7105C55.1004 30.1188 54.2419 32.8388 49.1249 32.8388C44.0079 32.8388 41.057 25.3518 37.1584 25.3518C37.1357 25.348 37.1343 34.9232 37.1541 54.0775C37.155 54.636 37.0459 55.1892 36.8329 55.7054C36.6199 56.2217 36.3073 56.6909 35.9128 57.0863C35.5184 57.4816 35.0499 57.7954 34.5341 58.0096C34.0184 58.2238 33.4654 58.3342 32.9069 58.3346H32.9027C32.3437 58.3346 31.7902 58.2245 31.2738 58.0105C30.7574 57.7966 30.2882 57.483 29.893 57.0876C29.4978 56.6923 29.1844 56.223 28.9706 55.7065C28.7568 55.19 28.6468 54.6365 28.647 54.0775V42.73C17.3515 41.0187 11.2107 40.0742 10.2247 39.8967C8.7457 39.6318 5.9917 38.2193 5.9917 34.1549V10.1665H37.1584Z" stroke="white" stroke-width="3" stroke-linejoin="round" />
          </mask>
          <g mask="url(#mask0_1178_735)">
            <path d="M-4 -4H64V64H-4V-4Z" fill="black" />
          </g>
        </g>
        <defs>
          <filter id="filter0_d_1178_735" x="0.491699" y="0.166504" width="59.0962" height="67.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1178_735" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1178_735" result="shape" />
          </filter>
        </defs>
      </svg>
    </h2>
  </section>
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

.floating-text-wrapper {
  #floating-text-1 {
    color: #1fb92c;
    font-size: 50px;
  }

  #floating-text-2 {
    color: $color-primary;
    font-size: 45px;
  }

  #floating-text-3 {
    color: #fb400c;
    font-size: 30px;
  }

  #floating-text-4 {
    color: #e038af;
    font-size: 50px;
  }

  #floating-text-5 {
    color: $white;
    font-size: 30px;
  }

  #floating-text-6 {
    color: $color-highlight;
    font-size: 50px;
  }

  #floating-text-7 {
    // color: #4f8da8;
    color: $blue;
    font-size: 60px;
  }

  .entrance-slogan {
    color: $blue;
    font-size: 48px;
    font-weight: normal;
    // font-weight: $font-weight-regular; // scss中尚未賦值
  }
}

.entrance-slogan {
  margin: auto;
  font-size: $font-size-h2;
  text-align: center;
  margin-bottom: 100px; //
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
          line-height: 1.6; // 待SCSS更新後移除
          // line-height: $line-height-base; // scss中尚未賦值
          font-weight: 700; // 待SCSS更新後移除
          // font-weight: $font-weight-bold; // scss中尚未賦值
        }
        .comment-title {
          line-height: 1.6; // 待SCSS更新後移除
          // line-height: $line-height-base; // scss中尚未賦值
        }
        .comment-content {
          line-height: 2; // 待SCSS更新後移除
          // line-height: $line-height-base; // scss中尚未賦值
          grid-column: 1 / span 2;
        }
      }
    }
  }
}

// === 頁面跳轉緩衝區 ===
.learn-more {
  #point-down {
    vertical-align: middle;
    height: $font-size-h2;
    aspect-ratio: 1/1;
  }
}
</style>
