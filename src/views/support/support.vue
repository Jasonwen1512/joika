<script setup>
import gsap from "gsap";
import { ref, reactive, nextTick, onMounted } from "vue";

const noviceTeaching = reactive([
  {
    title: "如何開團",
    content: `想揪人一起行動？只需三步
1. 點選上方【發起揪團】按鈕  
2. 填寫活動標題、時間地點、人數、預估金額、簡介等資訊  
3. 確認無誤後按下【送出】

小提醒：
請清楚填寫集合地點與時間，禁止張貼廣告或不實資訊。`,
  },
  {
    title: "如何跟團",
    content: `看到想參加的活動？只要這樣做：
1.點進活動頁面查看詳情
2.點選【我要跟團】按鈕
3.等待主揪確認即可加入成功！

小提醒
加入後請留意活動更新與集合資訊
若無法參加，記得提前取消
尊重主揪與其他參加者，打造良好風氣`,
  },
  {
    title: "如何發文",
    content: `想分享心得或活動經驗嗎？只要三步驟，輕鬆發文！

點選「我要發文」
在熱門文章頁右上方，點擊「我要發文」按鈕。

填寫內容，依序填入：
1. 標題：清楚表達主題
2. 分類：選擇文章類型
3. 內文：寫下你的故事或分享

確認後發佈 完成後點選「發佈」，文章就會顯示在熱門文章列表中。

小提醒
1. 文章請保持原創、避免抄襲或張貼不實資訊
2. 避免純粹廣告內容
3. 發佈後也可以隨時編輯或刪除文章`,
  },
]);

const FAQ = reactive([
  {
    title: "開團相關",
    content: `如何修改已開啟的活動？  
請至「會員中心 > 我的活動」，進入活動後點選【編輯】。

為什麼我的活動沒人參加？  
可能資訊不夠清楚、活動冷門、曝光不足等，可試著補齊資訊並多分享。

開團有限制嗎？  
每位會員都可開團，但須遵守社群規範，違規者可能被限制使用功能。`,
  },
  {
    title: "跟團相關",
    content: `如何取消參加的活動？  
進入「會員中心 > 我參加的活動」，點選該活動後選擇【取消參加】。

可以臨時取消嗎？  
請盡早通知主辦者，避免造成困擾。頻繁無故取消可能影響帳號信譽。

如何與主辦人聯繫？  
可在活動頁留言、發悄悄話，或透過主辦人個人頁私訊。`,
  },
  {
    title: "會員相關",
    content: `忘記密碼怎麼辦？  
請於登入頁點擊【忘記密碼】，系統會寄送重設連結至你的註冊信箱。

如何修改暱稱或大頭貼？  
前往「會員中心 > 個人資料」，即可編輯暱稱、頭像、簡介等資訊。

可以刪除帳號嗎？  
請聯繫客服中心，由專人協助後續流程，刪除後資料將無法復原。`,
  },
]);

const activeIndex = ref(null);
const toggle = (section, index) => {
  const key = section + index;
  activeIndex.value = activeIndex.value === key ? null : key;
  // console.log(activeIndex.value);
  nextTick(() => {
    // 打開
    if (document.querySelector(".item-title.active")) {
      gsap.to(".item-title.active + .item-content", {
        height: "auto",
        duration: 0.4,
        ease: "power2.out",
      });
    }

    // 關閉
    gsap.to(".item-title:not(.active) + .item-content", {
      height: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  });
};

onMounted(() => {
  const tl = gsap.timeline();
  tl.from(".fade-in-up", {
    y: 200,
    opacity: 0,
    duration: 0.5,
    stagger: 0.2, // 每個元素間隔 0.2 秒
    ease: "power2.out",
  });
  // tl.from(".novice-teaching", {
  //   y: 200,
  //   opacity: 0,
  //   duration: 0.5,
  //   ease: "power2.out",
  // });
  // tl.from(".FAQ", {
  //   y: 200,
  //   opacity: 0,
  //   duration: 0.5,
  //   ease: "power2.out",
  // });
});
</script>

<template>
  <!-- 這是幫助中心頁 -->
  <div class="support">
    <div class="support-bg"></div>
    <div class="head">
      <h3>Joika幫助中心</h3>
      <h4>新手教學 & FAQ</h4>
    </div>
    <section class="novice-teaching">
      <span class="title fade-in-up">新手教學</span>
      <div
        class="content fade-in-up"
        v-for="(item, index) in noviceTeaching"
        :key="`novice-${index}`"
      >
        <button
          class="item-title"
          :class="{ active: activeIndex === 'novice' + index }"
          @click="toggle('novice', index)"
        >
          {{ item.title
          }}<svg
            class="icon"
            viewBox="0 0 36 36"
            width="26"
            height="26"
            stroke="white"
            stroke-width="3"
          >
            <line class="line1" x1="8" y1="18" x2="28" y2="18" />
            <line class="line2" x1="18" y1="8" x2="18" y2="28" />
          </svg>
        </button>
        <div class="item-content">
          <div class="content-inner">{{ item.content }}</div>
        </div>
      </div>
    </section>

    <section class="FAQ">
      <span class="title fade-in-up">常見問題</span>
      <div
        class="content fade-in-up"
        v-for="(item, index) in FAQ"
        :key="`faq-${index}`"
      >
        <button
          class="item-title"
          :class="{ active: activeIndex === 'faq' + index }"
          @click="toggle('faq', index)"
        >
          {{ item.title }}
          <svg
            class="icon"
            viewBox="0 0 36 36"
            width="26"
            height="26"
            stroke="black"
            stroke-width="3"
          >
            <line class="line1" x1="8" y1="18" x2="28" y2="18" />
            <line class="line2" x1="18" y1="8" x2="18" y2="28" />
          </svg>
        </button>
        <div class="item-content">
          <div class="content-inner">{{ item.content }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.support {
  position: relative;
  overflow: hidden; // 如果需要裁切背景圖
  margin-bottom: 120px;

  .support-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1200px;
    background-image: url("@/assets/img/support/bg.svg");
    background-size: cover;
    background-position: center;
    z-index: -1;
    pointer-events: none;
  }

  .support-content {
    position: relative;
    z-index: 1;
  }
}
.head {
  position: relative;
  padding: 20px 0 30px 0;
  margin: auto;
  h3 {
    margin-left: 6%;
    color: $banner-title;
    @include desktop() {
      font-size: $font-size-h2;
      margin-left: 0;
    }
  }
  h4 {
    margin-top: 12px;
    margin-left: 10%;
    @include desktop() {
      font-size: $font-size-h3;
      margin-top: 50px;
      margin-left: 8.5%;
    }
  }
  @include desktop() {
    width: 62.5%;
    padding: 96px 0 100px 0;
  }
}

.novice-teaching,
.FAQ {
  width: 90%;
  margin: auto;
  font-family: "MyFont", sans-serif;
  font-weight: 400;
  line-height: 1.7;
  white-space: pre-wrap;
  display: grid;
  gap: 20px;
  @include desktop() {
    width: 52%;
  }
}
.title {
  @include flex-center();
  padding: 10px;
  font-size: $font-size-h3;
  border: 1px solid #000;
  border-radius: 3px;
  @include desktop() {
    border: 3px solid #000;
    border-radius: 6px;
  }
}
.item-title {
  position: relative;
  width: 100%;
  font-size: $font-size-h4;
  padding: 10px 0;
  border: 1px solid #000;
  border-radius: 3px;
  transition: border-radius 0.4s ease;
  cursor: pointer;
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    line {
      transform-origin: center center;
      transition: all 0.3s ease;
    }
  }
  &.active {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  &.active .line2 {
    transform: rotate(90deg);
  }
  &.active + .item-content .content-inner {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  @include desktop() {
    border: 3px solid #000;
    border-radius: 6px;
  }
}
.item-content {
  overflow: hidden;
  height: 0;
}
.content-inner {
  font-size: $font-size-h4;
  background-color: #fff;
  border: 1px solid #000;
  border-top: 0;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  padding: 10px 30px;
  transition: border-radius 0.4s ease;
  @include desktop() {
    border: 3px solid #000;
    border-top: 0;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
}

.novice-teaching {
  color: #fff;
  .title {
    background-color: #4f8da8;
  }
  .item-title {
    background-color: #81bfda;
  }
  .item-content {
    color: #000;
  }
}
.FAQ {
  color: #000;
  .title {
    background-color: #fada7a;
    margin-top: 80px;
  }
  .item-title {
    background-color: #f5f0cd;
  }
  .item-content {
    color: #000;
  }
}
</style>
