<script setup>
import Logo from "@/components/logo.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
const isMobile = ref(true);
const joikaWidth = 144.71;
const joikaBgcList_basic = [
  ["#FEF2C3", "#FAE4D2", "#DEF2C5", "#FAEBC6", "#FEF2C3"],
  ["#E8F8E8", "#FFDBC8", "#D9EAE0", "#E3D7E0", "#FAE4D2"],
  ["#DEF2C5", "#FAEBC6", "#E8F8E8", "#FFDBC8", "#D9EAE0"],
  ["#E3D7E0", "#FEF2C3", "#FAE4D2", "#DEF2C5", "#FAEBC6"],
];
let joikaBgcList = ref([]);
const computedBottomJoikaAmount = () => {
  const clientWidth = document.body.clientWidth;
  // 目前螢幕寬度，要產生幾個底部的joika
  const joikaAmount = Math.ceil(clientWidth / joikaWidth);
  joikaBgcList.value = [];
  const jbl = joikaBgcList_basic.length;
  for (let i = 0; i < joikaAmount; i++) {
    joikaBgcList.value.push(joikaBgcList_basic[(i + jbl) % jbl]);
  }
  // console.log(joikaAmount);
  // console.log(joikaBgcList);
};
const checkIsMobile = () => {
  isMobile.value = document.body.clientWidth <= 1024;
};
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
onMounted(() => {
  checkIsMobile();
  computedBottomJoikaAmount();
  window.addEventListener("resize", checkIsMobile);
  window.addEventListener("resize", computedBottomJoikaAmount);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIsMobile);
  window.removeEventListener("resize", computedBottomJoikaAmount);
});
</script>

<template>
  <footer class="footer">
    <div class="footer-area">
      <div class="footer-icon">
        <div class="card">
          <img src="@/assets/img/icon/footer-card.svg" alt="" />
        </div>
        <div class="logo">
          <Logo :width="209" :height="94" />
          <div>揪一咖 就出發</div>
        </div>
      </div>
      <div class="company">
        <span>公司資訊</span>
        <div class="company-address">公司地址：桃園市中壢區中山東路5號</div>
        <div class="company-business">營業時間：09:00~17:00</div>
        <div class="company-telephone">聯絡電話：03-425-1108</div>
        <router-link to="" class="company-information"
          >聯絡我們<img src="@/assets/img/icon/email.svg" alt=""
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
            <img src="@/assets/img/icon/facebook.svg" alt="" />
          </a>
          <a href="">
            <img src="@/assets/img/icon/line.svg" alt="" />
          </a>
          <a href="">
            <img src="@/assets/img/icon/instagram.svg" alt="" />
          </a>
        </div>
      </div>
      <div class="top-button" @click="scrollToTop">
        <img src="@/assets/img/icon/footer-back-to-top.svg" alt="" />
        <span>TOP</span>
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
  @include desktop() {
    padding: 67px 60px;
    flex-direction: row;
    gap: 10vw;
  }
}
.card {
  position: absolute;
  width: 75px;
  left: 56%;
  transform: translate(80px, -80px);

  img {
    width: 100%;
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
    }
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
  @include desktop() {
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
  @include desktop() {
    margin-top: auto;
  }
}

.top-button {
  position: absolute;
  bottom: 0;
  right: 30px;
  background-color: $color-higtight;
  width: 52px;
  height: 52px;
  border: 1px solid #4f8da8;
  border-radius: 50%;
  @include flex-center();
  flex-direction: column;
  gap: 2px;
  span {
    font-size: 14px;
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
}
</style>
