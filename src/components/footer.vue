<script setup>
import Logo from "@/components/logo.vue";

import { ref, onMounted, onBeforeUnmount } from "vue";
const isMobile = ref(true);
const isTablet = ref(true);
const joikaWidth = ref(360);
const nowWidth = ref(0);
const joikaBgcList_basic = [
  ["#FEF2C3", "#FAE4D2", "#DEF2C5", "#FAEBC6", "#FEF2C3"],
  ["#E8F8E8", "#FFDBC8", "#D9EAE0", "#E3D7E0", "#FAE4D2"],
  ["#DEF2C5", "#FAEBC6", "#E8F8E8", "#FFDBC8", "#D9EAE0"],
  ["#E3D7E0", "#FEF2C3", "#FAE4D2", "#DEF2C5", "#FAEBC6"],
];
let joikaBgcList = ref([]);
const computedBottomJoikaAmount = () => {
  nowWidth.value = document.body.clientWidth;
  // 目前螢幕寬度，要產生幾個底部的joika
  const joikaAmount = Math.ceil(nowWidth.value / joikaWidth.value);
  joikaBgcList.value = [];
  const jbl = joikaBgcList_basic.length;
  for (let i = 0; i < joikaAmount + 2; i++) {
    joikaBgcList.value.push(joikaBgcList_basic[(i + jbl) % jbl]);
  }
  // console.log(joikaAmount);
  // console.log(joikaBgcList);
  // console.log(nowWidth.value);
};
const checkIsMobile = () => {
  // footer 則是寬度<=768的當手機（平板有特別樣式）
  isMobile.value = document.body.clientWidth <= 768;
  joikaWidth.value = 141;
};
const checkisTablet = () => {
  const width = document.body.clientWidth;
  isTablet.value = width > 768 && width < 1024;
  joikaWidth.value = 182;
};
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
onMounted(() => {
  checkisTablet();
  checkIsMobile();
  computedBottomJoikaAmount();
  window.addEventListener("resize", checkIsMobile);
  window.addEventListener("resize", checkisTablet);
  window.addEventListener("resize", computedBottomJoikaAmount);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIsMobile);
  window.removeEventListener("resize", checkisTablet);
  window.removeEventListener("resize", computedBottomJoikaAmount);
});
</script>

<template>
  <footer class="footer">
    <div class="footer-area">
      <div class="card" v-if="!isMobile && !isTablet">
        <img src="@/assets/img/icon/footer-card.svg?url" alt="" />
      </div>
      <div class="footer-icon">
        <div class="card" v-if="isMobile || isTablet">
          <img src="@/assets/img/icon/footer-card.svg?url" alt="" />
        </div>
        <div class="logo">
          <Logo
            :width="
              isMobile || (nowWidth >= 768 && nowWidth <= 1500)
                ? 209
                : isTablet
                ? 273
                : 334
            "
            :height="isMobile ? 94 : isTablet ? 123 : 154"
          />
          <div>揪一咖 就出發</div>
        </div>
      </div>
      <div class="company">
        <span>公司資訊</span>
        <div class="company-address">公司地址：桃園市中壢區中山東路5號</div>
        <div class="company-business">營業時間：09:00~17:00</div>
        <div class="company-telephone">聯絡電話：03-425-1108</div>
        <router-link to="/contact" class="company-information"
          >聯絡我們<img src="@/assets/img/icon/email.svg?url" alt=""
        /></router-link>
      </div>
      <div class="member-services">
        <span>會員服務</span>
        <div class="member-services-contents">
          <router-link to="">會員制度</router-link>
          <router-link to="">會員中心</router-link>
          <router-link to="">點數中心</router-link>
        </div>
      </div>
      <div class="norm">
        <span>平台規範</span>
        <div class="norm-contents">
          <router-link to="">活動發起規範</router-link>
          <router-link to="">活動參與規範</router-link>
          <router-link to="">平台服務條款</router-link>
          <router-link to="">隱私權政策</router-link>
        </div>
      </div>
      <div class="follow-me">
        <span>追蹤我們</span>
        <div class="icons">
          <a href="">
            <img src="@/assets/img/icon/facebook.svg?url" alt="" />
          </a>
          <a href="">
            <img src="@/assets/img/icon/line.svg?url" alt="" />
          </a>
          <a href="">
            <img src="@/assets/img/icon/instagram.svg?url" alt="" />
          </a>
        </div>
        <div class="top-button" @click="scrollToTop">
          <img src="@/assets/img/icon/footer-back-to-top.svg?url" alt="" />
          <span>TOP</span>
        </div>
      </div>
    </div>
    <div class="bottom-decoration">
      <div
        class="bottom-decoration-logo"
        v-for="(item, index) in joikaBgcList"
        :key="index"
      >
        <Logo
          :color1="item[0]"
          :color2="item[1]"
          :color3="item[2]"
          :color4="item[3]"
          :color5="item[4]"
          :width="isMobile ? 141 : isTablet ? 132 : 260"
          :height="isMobile ? 49 : isTablet ? 44 : 87"
        />
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer-area {
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 40px;
  position: relative;
  padding: 50px 30px 0 30px;
  margin-bottom: 0;
  justify-content: center;
  background-color: $footer-bgc;
  color: $footer-text-color;
  @include tablet() {
    flex-direction: row;
    justify-content: space-between;
    padding: 50px 114px 0 114px;
  }
  @include desktop() {
    justify-content: center;
    gap: 7%;
    padding: 200px 0 0 0;
  }
  @media screen and (width <= 1500px) and (width >= $device-d) {
    padding: 150px 0 0 0;
    gap: 3.5%;
  }
}
.card {
  position: absolute;
  width: 82px;
  right: 60px;
  transform: translate(80px, -80px);
  img {
    width: 100%;
  }
  @include tablet() {
    width: 144px;
    top: -40%;
    left: 70%;
  }
  @include desktop() {
    width: 207px;
    top: 0;
    right: 150px;
    left: unset;
  }
  @media screen and (width <= 1500px) and (width >= $device-d) {
    width: 170px;
  }
}
.footer-icon {
  position: relative;
  margin-bottom: 10px;
  .logo {
    @include flex-center();
    div {
      position: absolute;
      left: 55%;
      bottom: -15%;
      font-size: 15px;
      @include tablet() {
        left: 53%;
        font-size: 20px;
      }
      @include desktop() {
        width: 100%;
        left: 57%;
        bottom: 50px;
        font-size: 24px;
      }
      @media screen and (width <= 1500px) and (width >= $device-d) {
        bottom: 75px;
        font-size: 16px;
      }
    }
  }
  @include tablet() {
    width: 100%;
  }
  @include desktop() {
    width: auto;
  }
  @media screen and (width <= 1200px) and (width >= $device-d) {
    // width: 100%;
  }
}

.company,
.member-services,
.norm {
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  span {
    font-size: 24px;
  }
  & :not(span) {
    color: inherit;
    font-size: 16px;
    font-weight: 400;
    @include tablet() {
      flex-direction: column;
    }
  }
  @include desktop() {
    & :not(span) {
      font-size: 20px;
    }
  }
}

.company {
  gap: 15px;
  text-align: center;
  .company-information {
    position: relative;
  }
  img {
    position: relative;
    top: 2px;
    left: 7px;
  }
  @include tablet() {
    width: 100%;
    text-align: left;
    display: grid;
    grid-template-columns: repeat(2, 1fr); // 2欄
    grid-template-rows: repeat(3, auto); // 3列
    gap: 23px 87px;
    span {
      grid-column: span 2;
    }
  }
  @include desktop() {
    display: flex;
    width: auto;
    img {
      top: 0px;
    }
  }
}

.member-services-contents {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.norm-contents {
  display: grid;
  grid-template-columns: repeat(2, 150px);
  gap: 17px 0px;
  justify-content: center;
  @media screen and (max-width: 370px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include tablet() {
    display: flex;
  }
}
.follow-me {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 15px;
  span {
    font-size: 24px;
    font-weight: 600;
    @include flex-center();
  }
  .icons {
    display: flex;
    gap: 6px;
    @include flex-center();
    @include desktop() {
      gap: 7px;
    }
  }
  @include tablet() {
    position: relative;
  }
  @media screen and (width <= 1200px) and (width >= $device-d) {
    // margin-top: 20px;
    // gap: 40px;
  }
}

.top-button {
  position: absolute;
  bottom: 0;
  right: 30px;
  background-color: $color-highlight;
  width: 52px;
  height: 52px;
  border: 1px solid #4f8da8;
  border-radius: 50%;
  cursor: pointer;
  @include flex-center();
  flex-direction: column;
  gap: 2px;
  span {
    font-size: 14px;
  }
  @include tablet() {
    right: 34px;
  }
  @include desktop() {
    width: 60px;
    height: 60px;
    right: 31px;
  }
  @media screen and (width <= 1200px) and (width >= $device-d) {
    // top: -10px;
    // right: -100px;
  }
}

.bottom-decoration {
  padding-top: 30px;
  background-color: $footer-bgc;
  display: flex;
  gap: 5px;
  flex-wrap: nowrap;
  overflow-x: hidden; // 若設定auto，則此區塊可滑
  overflow-y: hidden;
  .bottom-decoration-logo {
    transform: skewX(-5deg) scaleY(0.8);
    svg {
      vertical-align: middle;
    }
  }
  &::-webkit-scrollbar {
    display: none;
  }
  @include desktop() {
    padding-top: 100px;
  }
  @media screen and (width <= 1500px) and (width >= $device-d) {
    padding-top: 20px;
  }
}
</style>
