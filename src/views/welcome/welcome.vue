<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
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

// logo 滑動擦除的文字
const erasedWords = ref([{ word: "如" }, { word: "果" }, { word: "有" }, { word: "人" }, { word: "剛" }, { word: "好" }, { word: "也" }, { word: "想" }, { word: "玩" }, { word: "就" }, { word: "好" }, { word: "了" }]);

// 滑動卡片圖片
const slidingCardImg = ref([
  {
    image: new URL("@/assets/img/welcome/sliding-cards/board games.jpg", import.meta.url).href,
    text: "桌遊",
  },
  {
    image: new URL("@/assets/img/welcome/sliding-cards/climbing_04.jpg", import.meta.url).href,
    text: "登山",
  },
  {
    image: new URL("@/assets/img/welcome/sliding-cards/divivg-picture2.jpg", import.meta.url).href,
    text: "浮潛",
  },
  {
    image: new URL("@/assets/img/welcome/sliding-cards/movie_03.jpg", import.meta.url).href,
    text: "電影",
  },
  {
    image: new URL("@/assets/img/welcome/sliding-cards/music-festival.jpg", import.meta.url).href,
    text: "演唱會",
  },
  {
    image: new URL("@/assets/img/welcome/sliding-cards/taipei-cafe.jpg", import.meta.url).href,
    text: "聚餐",
  },
]);

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
    photo: new URL("@/assets/img/welcome/community-cards/user-image1.jpg", import.meta.url).href,
    nickname: "Yoyo",
    title: "第一次夜衝合歡山！星星多到爆炸✨",
    content: "昨天晚上跟幾個大學同學衝上合歡山看星星，本來還擔心會不會太冷、太累，結果完全值得！！✨✨",
  },
  {
    photo: new URL("@/assets/img/welcome/community-cards/user-image2.jpg", import.meta.url).href,
    nickname: "杯子裡的雲",
    title: "陌生人也能變朋友！第一次桌遊揪團超出預期",
    content: "身為業務員，平常接觸超多人，但很多時候反而更想認識一些**「無壓力的新朋友」**。",
  },
  {
    photo: new URL("@/assets/img/welcome/community-cards/user-image3.jpg", import.meta.url).href,
    nickname: "pika揪",
    title: "陽明山七星山日出團大推👍",
    content: "第二次參加Kevin的登山團了！上次爬大屯山就覺得他很專業，這次七星山也沒讓人失望。",
  },
  {
    photo: new URL("@/assets/img/welcome/community-cards/user-image4.jpg", import.meta.url).href,
    nickname: "Jojo",
    title: "奇萊南華百岳初體驗心得",
    content: "人生第一座百岳GET！雖然兩天一夜的行程很累，但成就感滿滿。",
  },
  {
    photo: new URL("@/assets/img/welcome/community-cards/user-image5.jpg", import.meta.url).href,
    nickname: "Larry",
    title: "大型桌遊聯誼成功脫單！",
    content: "原本抱著認識朋友的心情參加，沒想到真的遇到心儀的對象！",
  },
]);

// 骰子轉動狀態
const isRolling = ref(false);

// 骰子投擲結果文字區域
const currentResultText = ref("？");
const resultTextClass = computed(() => {
  const textLength = currentResultText.value.length;
  return textLength <= 2 ? "result-text-two-words" : "result-text-four-words";
});

// 控制 "頁面跳轉緩衝區域" 顯示及倒數
const showLearnMore = ref(false);
const countdownText = ref("");
let countdownTimer = null;

gsap.registerPlugin(ScrollTrigger);

// 綁定 DOM 元素
const cardWrapperRef = ref(null);
const logo = ref(null);
const wordsGroup = ref(null);
let letterEls = [];

onMounted(() => {
  // 解除 overflow 限制，避免 positoin: sticky 失效
  document.documentElement.style.overflowX = "visible";
  document.body.style.overflowX = "visible";

  // === 文字漂浮區域 ===
  const floatingTexts = gsap.utils.toArray(".floating-text");

  // 初始化，隱藏所有文字
  floatingTexts.forEach((el) => {
    gsap.set(el, {
      opacity: 0,
      y: 30,
    });
  });

  // 記錄目前觸發的元素個數
  let triggerCount = 0;

  // floating-text-1 ~ floating-text-7 依序淡入效果
  ScrollTrigger.create({
    trigger: ".floating-text-wrapper",
    start: "0% top",
    end: "60% top",
    onUpdate: (self) => {
      const progress = self.progress;
      const shouldTriggerCount = Math.floor(progress * 7);

      while (triggerCount <= shouldTriggerCount && triggerCount < 7) {
        gsap.to(floatingTexts[triggerCount], {
          opacity: 1,
          y: 0,
          duration: 1,
        });
        triggerCount++;
      }
    },
  });

  letterEls = wordsGroup.value.querySelectorAll(".single-word");

  const fadedLetters = new Set(); // 儲存被擦除的字
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sliding-cards-wrapper",
      start: "top top",
      end: "300% bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const currentScroll = self.scroll(); // 目前 scroll 位置 (垂直)
        const logoBox = logo.value.getBoundingClientRect();

        letterEls.forEach((el, index) => {
          const letterBox = el.getBoundingClientRect();
          const isOverlap = logoBox.right > letterBox.left && logoBox.left < letterBox.right;

          if (isOverlap && !fadedLetters.has(index) && logoBox.right > letterBox.right) {
            gsap.to(el, { opacity: 0, duration: 0.3 });
            fadedLetters.add(index);
          }

          // 處理捲動速度過快，文字未被擦除的問題 (當 scroll 進度達 30% 時，直接將整句透明度設為 0)
          if (self.progress > 0.4) {
            gsap.to(el, { opacity: 0, duration: 0.3 });
          }

          if (self.progress < 0.4 && self.direction < 0) {
            console.log("scroll up");
          }
        });
      },
    },
  });

  tl.to(".floating-text-wrapper", { opacity: 0 }, 0);
  tl.fromTo("#joika-logo", { x: "-65vw" }, { x: "12vw" }, 0.4);
  tl.to("#joika-logo", { x: 0 }, 0.9);
  tl.fromTo("#main-slogan", { x: "8vw", opacity: 0 }, { x: 0, opacity: 1 });

  // === 卡片滑動效果區域 ===
  const slidingCardsScrollWrapper = document.querySelector(".sliding-cards-scroll-wrapper");
  const slidingCardsWrapper = document.querySelector(".sliding-cards-wrapper");

  if (slidingCardsScrollWrapper && slidingCardsWrapper) {
    gsap.delayedCall(0.1, () => {
      // 等待下一個 tick 確保 DOM 完全渲染
      const totalWidth = slidingCardsScrollWrapper.scrollWidth - slidingCardsWrapper.clientWidth;

      if (totalWidth > 0) {
        gsap.to(slidingCardsScrollWrapper, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: slidingCardsWrapper,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
    });
  }

  // === 社群回覆卡片區域 ===
  const communityCard = gsap.utils.toArray(".community-card");

  // 每張卡片給予 800px 的滾動距離，額外加上一點緩衝
  const scrollHeight = 800 * (communityCard.length + 1);
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
      y: window.innerHeight + 1200,
    });

    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: `top+=${i * 800} bottom`,
        end: `top+=${(i + 1) * 800} bottom`,
        scrub: true,
      },
      y: 0, // 所有卡片停在相同位置堆疊
    });
  });

  // === 骰子區域 ===
  const diceState = {
    // 全部活動分類
    activityCategories: {
      1: { category: "水上活動", image: new URL("@/assets/img/index-img/diving.png", import.meta.url).href, color: "#4F8DA8" },
      2: { category: "電影", image: new URL("@/assets/img/index-img/movie.png", import.meta.url).href, color: "#FFA68D" },
      3: { category: "運動", image: new URL("@/assets/img/index-img/sports.png", import.meta.url).href, color: "#FADA7A" },
      4: { category: "登山", image: new URL("@/assets/img/index-img/hiking3.png", import.meta.url).href, color: "#90DA81" },
      5: { category: "露營", image: new URL("@/assets/img/index-img/camping3.png", import.meta.url).href, color: "#A281DA" },
      6: { category: "桌遊", image: new URL("@/assets/img/index-img/board-games.png", import.meta.url).href, color: "#F315BB" },
      7: { category: "展覽", image: new URL("@/assets/img/index-img/exhibition.png", import.meta.url).href, color: "#FFFCE2" },
      8: { category: "聚餐", image: new URL("@/assets/img/index-img/gathering.png", import.meta.url).href, color: "#FB900C" },
      9: { category: "手作", image: new URL("@/assets/img/index-img/DIY.png", import.meta.url).href, color: "#81BFDA" },
      10: { category: "文化體驗", image: new URL("@/assets/img/index-img/cultural-experience.png", import.meta.url).href, color: "#1FB92C" },
      11: { category: "演出表演", image: new URL("@/assets/img/index-img/concert.png", import.meta.url).href, color: "#FFE100" },
      12: { category: "唱歌", image: new URL("@/assets/img/index-img/ktv.png", import.meta.url).href, color: "#2AA9FF" },
    },

    // 12 類中選 6 類，以 Array 記錄被選出的 key (1 ~ 12)
    selectedActivityKeys: new Array(),

    // 選取後的活動分類 (Object)
    selectedActivityCategories: new Object(),
  };

  // 當頁面捲動至 "社群回覆卡片區域" 時，隨機從活動分類中選 6 類渲染到骰子上
  ScrollTrigger.create({
    trigger: ".community-cards-wrapper",
    start: "top top",
    once: true,
    onEnter: () => {
      const categoryKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const diceFace = document.querySelectorAll(".dice-face");

      // Fisher-Yates 洗牌演算法
      function getRandomUniqueItems(array, count) {
        const copied = array.slice(); // 複製一個新的array，避免覆蓋原本的array
        for (let i = copied.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copied[i], copied[j]] = [copied[j], copied[i]]; // 交換
        }
        return copied.slice(0, count);
      }

      const selectedKeysArr = getRandomUniqueItems(categoryKeys, 6);

      for (let i = 0; i < selectedKeysArr.length; i++) {
        diceState.selectedActivityKeys = selectedKeysArr;
        diceState.selectedActivityCategories[selectedKeysArr[i]] = diceState.activityCategories[selectedKeysArr[i]];

        const img = document.createElement("img");
        img.className = "dice-face-img";
        img.src = diceState.activityCategories[selectedKeysArr[i]].image;
        img.style.width = "100%";

        // 清空並渲染圖片
        diceFace[i].innerHTML = "";
        diceFace[i].style.backgroundColor = diceState.activityCategories[selectedKeysArr[i]].color;
        diceFace[i].appendChild(img);
      }
    },
  });

  const dice = document.querySelector(".dice");

  // 對應點數要讓該面朝上，所需的 rotateX/Y（單位：度）
  const faceAngles = {
    1: [-10, -10],
    2: [-10, -100],
    3: [-100, -10],
    4: [80, -10],
    5: [-10, 80],
    6: [-10, 170],
  };

  let currentX = 0;
  let currentY = 0;

  // 骰子投擲結果顯示後，自動捲動至最下方，3秒後再跳轉至JOIKA首頁
  function triggerAutoScroll() {
    // 顯示 "頁面跳轉緩衝區域"
    showLearnMore.value = true;

    // 延遲一段時間後捲動
    setTimeout(() => {
      const learnMoreSection = document.querySelector(".learn-more");
      learnMoreSection.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      // 倒數 3 秒
      let countdown = 3;
      countdownText.value = `${countdown} 秒後進入首頁`;

      countdownTimer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          countdownText.value = `${countdown} 秒後進入首頁`;
        } else {
          countdownText.value = "Let's Go!!!";
          clearInterval(countdownTimer);
          window.location.href = "/cjd101/g2/front/home";
        }
      }, 1000);
    }, 1000);
  }

  function rollDice() {
    // 骰子開始轉動時，移除放大縮小動畫效果
    isRolling.value = true;

    // 如果正在倒數，則取消倒數
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      countdownText.value = "";
      showLearnMore.value = false;
    }

    const targetFace = Math.floor(Math.random() * 6) + 1;
    const [faceX, faceY] = faceAngles[targetFace];

    // 隨機加上旋轉圈數 (4 ~ 6 圈)
    const extraTurns = 4 + Math.floor(Math.random() * 3);
    const targetX = faceX + extraTurns * 360;
    const targetY = faceY + extraTurns * 360;

    const startX = currentX;
    const startY = currentY;
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    let frame = 0;
    const totalFrames = 300;

    function animate() {
      const t = frame / totalFrames;
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const currentAngleX = startX + deltaX * ease;
      const currentAngleY = startY + deltaY * ease;

      dice.style.transform = `rotateX(${currentAngleX}deg) rotateY(${currentAngleY}deg)`;

      // 中間動畫過程顯示亂數
      if (t < 0.8) {
        const randomArrayIndex = Math.floor(Math.random() * 6); // 隨機取 Array 索引值 (0 ~ 5)
        const randomActivityKey = diceState.selectedActivityKeys[randomArrayIndex]; // 取出 "selectedActivityKeys" 中的 key
        currentResultText.value = diceState.selectedActivityCategories[randomActivityKey].category; // 使用 key 取出物件中的活動類別
        frame++;
        requestAnimationFrame(animate);
      } else if (t >= 0.8 && t < 1) {
        // 最後 20% 顯示最終結果
        const activityKey = diceState.selectedActivityKeys[targetFace - 1];
        currentResultText.value = diceState.selectedActivityCategories[activityKey].category;
        frame++;
        requestAnimationFrame(animate);
      } else {
        // 最終設定與顯示
        const activityKey = diceState.selectedActivityKeys[targetFace - 1];
        currentX = faceX;
        currentY = faceY;
        dice.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        currentResultText.value = diceState.selectedActivityCategories[activityKey].category;
        triggerAutoScroll();
      }
    }

    animate();
  }

  dice.addEventListener("click", rollDice);
});

onUnmounted(() => {
  // 離開迎賓頁後，恢復 overflow 為 hidden
  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";

  // 清除倒數計時器
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  // 清除 ScrollTrigger
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<template>
  <!-- === 文字漂浮區域 === -->
  <section class="floating-text-wrapper">
    <div class="floating-text-scroll-wrapper">
      <h3 class="floating-text" id="floating-text-1">朋友們都好難揪</h3>
      <h3 class="floating-text" id="floating-text-2">一個人好無聊</h3>
      <h3 class="floating-text" id="floating-text-3">好想出去走走</h3>
      <h3 class="floating-text" id="floating-text-4">沒人一起露營</h3>
      <h3 class="floating-text" id="floating-text-5">說走就走怎麼那麼難</h3>
      <h3 class="floating-text" id="floating-text-6">永遠差一咖</h3>
      <img id="bg-skyblue1" :src="backgroundDecoration.bgSkyblue1" alt="背景色塊 skyblue" />
      <img id="bg-green" :src="backgroundDecoration.bgGreen" alt="背景色塊 green" />
    </div>
  </section>

  <!-- === 卡片滑動效果區域 === -->
  <section class="sliding-cards-wrapper">
    <div class="joika-logo-wrapper">
      <div class="joika-logo-scroll-wrapper">
        <div class="floating-title-container">
          <h3 class="floating-text words-group" id="floating-text-7" ref="wordsGroup">
            <span class="single-word" v-for="(wordsList, index) in erasedWords" :key="index">{{ wordsList.word }}</span>
          </h3>
        </div>
        <div class="main-slogan-group">
          <h1 id="main-slogan">揪一咖 就出發</h1>
          <img id="joika-logo" :src="logoSvg" alt="JOIKA brand logo" ref="logo" />
        </div>
      </div>
    </div>
    <div class="sliding-cards-scroll-wrapper">
      <div class="slogan-card sliding-card">
        <div class="sliding-slogan-group">
          <h2 class="sliding-slogan">每一種玩樂</h2>
          <h2 class="sliding-slogan">都值得被揪</h2>
          <img id="bg-yellow1" :src="backgroundDecoration.bgYellow1" alt="背景色塊 yellow" />
        </div>
      </div>
      <div class="activity-cards-list">
        <div class="activity-card sliding-card" v-for="(card, index) in slidingCardImg" :key="index">
          <img class="card-img" :src="card.image" :alt="`${card.text}`" />
        </div>
      </div>
    </div>
  </section>

  <!-- === 平台特色卡片區域 === -->
  <section class="feature-cards-wrapper">
    <h2 class="entrance-slogan">安心揪 放心玩</h2>
    <div class="community-cards-list">
      <div class="feature-card" v-for="(card, index) in featureCardInfo" :key="index">
        <img class="feature-icon" :src="card.image" :alt="card.title" />
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
      <div class="community-card" v-for="(card, index) in communityCardInfo" :key="index">
        <div class="content-wrapper">
          <div class="photo-wrapper">
            <img class="profile-photo" :src="card.photo" alt="會員頭像" />
          </div>
          <p class="member-nickname">{{ card.nickname }}</p>
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
    <div class="text-content-group">
      <h3 class="text-content">來揪點</h3>
      <h3 class="text-content">前往專區</h3>
      <h3 :class="resultTextClass" id="result-text">{{ currentResultText }}</h3>
    </div>

    <!-- 3D骰子 -->
    <div class="scene">
      <div class="dice" :class="{ rolling: isRolling }">
        <div class="dice-face point1"></div>
        <div class="dice-face point2"></div>
        <div class="dice-face point3"></div>
        <div class="dice-face point4"></div>
        <div class="dice-face point5"></div>
        <div class="dice-face point6"></div>
      </div>
    </div>
  </section>

  <!-- === 頁面跳轉緩衝區 === -->
  <section class="learn-more" v-show="showLearnMore">
    <h2 class="entrance-slogan">
      還等什麼？裡面更好玩
      <img id="point-down" :src="pointDown" alt="了解更多" />
    </h2>
    <p class="countdown-text">{{ countdownText }}</p>
  </section>
</template>

<style scoped lang="scss">
@use "@/style.scss" as *;

// === 通用設定 ===
.entrance-slogan {
  margin: auto;
  font-size: $font-size-h1;
  text-align: center;
  margin-bottom: 100px;
}

// === 文字漂浮區域 ===
.floating-text-wrapper {
  height: 197.5vh; // 容器捲動總長度 (300vh = 197.5vh) (100vh = 62.5vw with screen ratio 16:10)

  .floating-text-scroll-wrapper {
    height: 43.75vw; // 容器顯示長度 (70vh = 43.75vw) (100vh = 62.5vw with screen ratio 16:10)
    position: sticky;
    top: 0;
    left: 0;

    #floating-text-1 {
      color: #1fb92c;
      font-size: clamp(24px, 2.604vw, 50px);
      position: absolute;
      top: 6.25vw;
      right: 3.125vw;
    }
    #floating-text-2 {
      color: $color-primary;
      font-size: clamp(20px, 2.344vw, 45px);
      position: absolute;
      top: 11.458vw;
      left: 13.542vw;
    }
    #floating-text-3 {
      color: #fb400c;
      font-size: clamp(16px, 1.563vw, 30px);
      position: absolute;
      top: 13.802vw;
      right: 29.427vw;
    }
    #floating-text-4 {
      color: #e038af;
      font-size: clamp(16px, 2.604vw, 50px);
      position: absolute;
      top: 22.135vw;
      left: 35.156vw;
    }
    #floating-text-5 {
      color: $white;
      font-size: clamp(16px, 1.563vw, 30px);
      position: absolute;
      top: 26.042vw;
      left: 7.031vw;
    }
    #floating-text-6 {
      color: $color-highlight;
      font-size: clamp(24px, 2.604vw, 50px);
      position: absolute;
      top: 23.958vw;
      right: 4.427vw;
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
  }
}

// === 卡片滑動效果區域 ===
.sliding-cards-wrapper {
  overflow: hidden;

  .joika-logo-wrapper {
    .joika-logo-scroll-wrapper {
      position: sticky;

      .floating-title-container {
        #floating-text-7 {
          line-height: 2.4;
          color: $blue;
          font-size: clamp(24px, 3.125vw, 60px);
          text-align: center;

          .single-word {
            display: inline-block;
          }
        }
      }
      .main-slogan-group {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%); // 文字移回元素整體寬度的一半位置，達到水平置中效果
        @include flex-center;
        gap: clamp(12px, 2.604vw, 50px);

        #main-slogan {
          color: $blue;
          font-size: clamp(24px, 3.333vw, 64px);
          font-weight: normal;
        }
        #joika-logo {
          height: clamp(30px, 6.855vw, 132px);
        }
      }
    }
  }

  .sliding-cards-scroll-wrapper {
    padding: 5vw 0;
    height: 50vw;
    position: sticky;
    top: 0;

    .slogan-card {
      .sliding-slogan-group {
        position: relative;

        .sliding-slogan {
          font-size: clamp(32px, 3.125vw, 60px);
          position: absolute;
          left: 18.75vw;
        }
        .sliding-slogan:nth-child(1) {
          top: 10.312vw; // (5.104 + 3.125 + 2.083)vw
        }
        .sliding-slogan:nth-child(2) {
          top: 15.521vw; // (10.313 + 3.125 + 2.083)vw
        }
        #bg-yellow1 {
          width: 32.188vw;
          position: absolute;
          top: 5.208vw; // (3.125 + 2.083)vw
          left: 5vw;
          z-index: -1;
        }
      }
    }
    .activity-cards-list {
      position: absolute;
      left: 42vw;
      display: flex;
      gap: 100px;

      .activity-card {
        flex-shrink: 0;
        max-width: 600px;
        width: 31.25vw;
        aspect-ratio: 4 / 3;

        .card-img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
        }
      }
      .activity-card:nth-child(odd) {
        transform: translateY(2.083vw) rotate(-5deg);
      }
      .activity-card:nth-child(even) {
        transform: rotate(5deg);
      }
    }
  }
}

// === 平台特色卡片區域 ===
.feature-cards-wrapper {
  padding: 200px 0;
  position: relative;

  .community-cards-list {
    @include flex-center;
    flex-wrap: wrap;
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
        font-family: "Inter", sans-serif;
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
  display: flex;
  justify-content: center;

  .community-cards-list {
    position: sticky;
    top: 50px;
    width: 600px;
    height: 375px;
    margin-bottom: 300px; // 避免卡片疊在骰子區域上

    .community-card {
      position: absolute;
      width: 600px;
      height: 375px;
      font-size: $font-size-h2;
      background-color: $white;
      border: 3px solid $blue;
      border-radius: 60px;

      .content-wrapper {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 2fr 3fr 5fr;
        grid-template-columns: 3fr 7fr;
        padding: 50px;

        .photo-wrapper {
          grid-row: 1 / span 2;
          width: 105px;
          height: 105px;
          border-radius: 50%;
          overflow: hidden;

          .profile-photo {
            width: 100%;
          }
        }
        .member-nickname {
          font-size: 36px;
          font-family: "Inter", sans-serif;
          font-weight: 700;
        }
        .comment-title {
          font-size: 27px;
          font-family: "Inter", sans-serif;
        }
        .comment-content {
          grid-column: 1 / span 2;
          font-size: 27px;
          font-family: "Inter", sans-serif;
        }
      }
    }
  }
}

@include tablet() {
  .community-cards-wrapper {
    .community-cards-list {
      width: 720px;
      height: 450px;

      .community-card {
        width: 720px;
        height: 450px;
        font-size: $font-size-h2;
        background-color: $white;
        border: 4px solid $blue;
        border-radius: 45px;

        .content-wrapper {
          padding: 33.75px;

          .photo-wrapper {
            width: 140px;
            height: 140px;
          }

          .member-nickname {
            font-size: 42px;
          }
          .comment-title {
            font-size: 32px;
          }
          .comment-content {
            font-size: 32px;
          }
        }
      }
    }
  }
}

// === 骰子區域 ===
.dice-wrapper {
  height: 43.75vw; // 容器顯示長度 (70vh = 43.75vw) (100vh = 62.5vw with screen ratio 16:10)
  position: relative;

  #bg-skyblue2 {
    width: 44.635vw;
    position: absolute;
    top: 6.51vw;
    left: 15.625vw;
  }
  #bg-yellow2 {
    width: 7.708vw;
    position: absolute;
    top: 20.573vw;
    right: 15.521vw;
  }
  .text-content-group {
    .text-content {
      font-size: clamp(32px, 2.5vw, 48px);
      position: absolute;
    }
    .text-content:nth-child(1) {
      top: 21.875vw;
      right: 24.167vw;
    }
    .text-content:nth-child(2) {
      top: 26.823vw;
      right: 20.313vw;
    }
    .result-text-two-words {
      color: $blue;
      font-size: clamp(32px, 3.333vw, 64px);
      width: 6.666vw;
      text-align: center;
      position: absolute;
      top: 20.625vw;
      right: 16.042vw;
    }
    .result-text-four-words {
      color: $blue;
      font-size: clamp(32px, 3.333vw, 64px);
      width: 13.333vw;
      text-align: center;
      position: absolute;
      top: 20.625vw;
      right: 9.376vw;
    }
  }
  .scene {
    perspective-origin: center;
    position: absolute;
    top: 10vw;
    left: 30vw;

    .dice {
      margin: 5vw;
      width: 16vw;
      height: 16vw;
      position: relative;
      transform-style: preserve-3d;
      transform: rotateX(-15deg) rotateY(-15deg); // 稍微旋轉一點角度，讓骰子的側面可以被看見
      cursor: pointer;

      .dice-face {
        width: 16vw;
        height: 16vw;
        background-color: #fff;
        box-sizing: inset 0 0 30px #eee;
        position: absolute;
        top: 0;
        left: 0;
        text-align: center;
        line-height: 16vw;
        font-size: 40px;
        overflow: hidden;
      }
      .point1 {
        transform: rotateY(0deg) translateZ(8vw);
      }
      .point2 {
        transform: rotateY(90deg) translateZ(8vw);
      }
      .point3 {
        transform: rotateX(90deg) translateZ(8vw);
      }
      .point4 {
        transform: rotateX(-90deg) translateZ(8vw);
      }
      .point5 {
        transform: rotateY(-90deg) translateZ(8vw);
      }
      .point6 {
        transform: rotateY(180deg) translateZ(8vw);
      }
    }

    @keyframes dice-float {
      0%,
      100% {
        transform: rotateX(-15deg) rotateY(-15deg) translateY(0) scale3d(1, 1, 1);
      }
      50% {
        transform: rotateX(-15deg) rotateY(-15deg) translateY(-10px) scale3d(0.9, 0.9, 0.9);
      }
    }

    .dice {
      animation: dice-float 3s ease-in-out infinite;

      // 當骰子被點擊或轉動時，可以暫停動畫
      &.rolling {
        animation: none;
      }
    }
  }
}

// === 頁面跳轉緩衝區 ===
.learn-more {
  height: 18.75vw; // 容器顯示長度 (30vh = 18.75vw) (100vh = 62.5vw with screen ratio 16:10)

  #point-down {
    vertical-align: middle;
    height: $font-size-h1;
    aspect-ratio: 1 / 1;
  }
  .countdown-text {
    text-align: center;
    margin-top: 20px;
    font-size: clamp(32px, 2.5vw, 48px);
    color: $blue;
    font-weight: 700;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
}
</style>
