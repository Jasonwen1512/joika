<script setup>
import Logo from "@/components/logo.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const isMobile = ref(true);
const shStatus = ref(false);
// const isScrolled = ref(false);
// const headerZIndex = ref(0);

// const handleScroll = () => {
//   isScrolled.value = window.scrollY > 200;
//   headerZIndex.value = isScrolled.value ? 5 : 0;
// };

const checkIsMobile = () => {
  // header 寬度<=1024的一律當作手機（平板沿用手機版）
  isMobile.value = document.body.clientWidth < 1024;
};

onMounted(() => {
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
  // window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIsMobile);
  // window.removeEventListener("scroll", handleScroll);
});

const isScrolledDown = ref(false);

const onScroll = () => {
  // 滾動超過1px表示往下滑了
  isScrolledDown.value = window.scrollY > 1;
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>
<template>
  <header>
    <div class="header">
      <router-link to="/home" class="header-img" @click="shStatus = false">
        <Logo class="logo" />
      </router-link>
      <div class="menu_and_nav">
        <input type="checkbox" id="switch-hamburger" v-model="shStatus" />
        <div class="menu">
          <router-link to="/article/article" @click="shStatus = false"
            >熱門文章</router-link
          >
          <router-link to="/chat" @click="shStatus = false"
            >聊天大廳</router-link
          >
          <router-link to="/group/group-explore" @click="shStatus = false"
            >揪團探索</router-link
          >
          <router-link to="/support" @click="shStatus = false"
            >幫助中心</router-link
          >
          <router-link to="/group/group-create" @click="shStatus = false"
            >我要揪團！！</router-link
          >
        </div>
        <nav>
          <router-link
            to="/auth/login"
            class="avatar"
            @click="shStatus = false"
          >
            <svg
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              :width="isMobile ? '21' : '30'"
              :height="isMobile ? '21' : '30'"
            >
              <path
                d="M10.5 8.38889C10.9852 8.38889 11.4656 8.29333 11.9138 8.10767C12.362 7.922 12.7693 7.64987 13.1124 7.30681C13.4554 6.96375 13.7276 6.55648 13.9132 6.10825C14.0989 5.66002 14.1944 5.17961 14.1944 4.69444C14.1944 4.20928 14.0989 3.72887 13.9132 3.28064C13.7276 2.83241 13.4554 2.42514 13.1124 2.08208C12.7693 1.73902 12.362 1.46689 11.9138 1.28122C11.4656 1.09556 10.9852 1 10.5 1C9.52017 1 8.58048 1.38924 7.88763 2.08208C7.19479 2.77492 6.80556 3.71462 6.80556 4.69444C6.80556 5.67427 7.19479 6.61397 7.88763 7.30681C8.58048 7.99965 9.52017 8.38889 10.5 8.38889ZM1 19.3667V20H20V19.3667C20 17.0022 20 15.82 19.5398 14.9164C19.135 14.122 18.4891 13.4761 17.6947 13.0713C16.7911 12.6111 15.6089 12.6111 13.2444 12.6111H7.75556C5.39111 12.6111 4.20889 12.6111 3.30533 13.0713C2.51091 13.4761 1.86501 14.122 1.46022 14.9164C1 15.82 1 17.0022 1 19.3667Z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :stroke="isMobile ? '#000' : 'rgba(0, 0, 0, 0.9)'"
              />
            </svg>
          </router-link>

          <label for="switch-hamburger" class="hamburger"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g stroke="#000" stroke-width="2" stroke-linecap="round">
                <line class="line1" x1="4" y1="6" x2="20" y2="6" />
                <line class="line2" x1="4" y1="12" x2="20" y2="12" />
                <line class="line3" x1="4" y1="18" x2="20" y2="18" />
              </g>
            </svg>
          </label>
        </nav>
        <div class="header-bg" :class="{ isScroll: isScrolledDown }"></div>
      </div>
    </div>
    <label class="overlay" for="switch-hamburger"></label>
  </header>
</template>

<style scoped lang="scss">
.header {
  font-family: "Inter", sans-serif;
  width: 100%;
  height: $header-h-m;
  display: flex;
  justify-content: space-between;
  position: fixed;
  z-index: 5;
  // 新bgc：f5f0cd
  background-color: $tp;
  padding: $header-pd-tb $header-pd-lr;
  transform-style: preserve-3d; // 加上這行才不會閃爍，重要
  // &::after {
  //   content: "";
  //   background-color: #f5f0cd;
  //   height: 40px;
  //   position: absolute;
  // }
  @include desktop() {
    height: $header-h-d;
    padding: 0 4% 0 2.6%;
  }
}
.header-img {
  display: flex;
  align-items: center;
  transition: 0.3s;
  .logo {
    width: 50%;
    vertical-align: middle;
  }
  @include desktop() {
    .logo {
      width: 80%;
    }
  }
}

.menu_and_nav {
  @include flex-center();
  transition: 0.3s;
  position: relative;
  .header-bg {
    width: 0;
    height: 40px;
    background-color: #f5f0cd;
    position: absolute;
    z-index: -1;
    right: -17px;
    border-radius: 9999px 0 0 9999px;
    border: 2px solid rgba(0, 0, 0, 0.6);
    border-right: 0;
    transition: 0.3s;
    @include desktop() {
      $height: 60px;
      height: 60px;
      transition: 0.5s;
      right: calc(-2.6vw - 40px);
      // border: 2px solid rgba(0, 0, 0, 0.6);
    }
    &.isScroll {
      width: calc(55px + 15px * 2 + 15px);
      @include desktop() {
        width: calc(100% + 40px + 120px);
      }
    }
  }
}
nav {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  .avatar,
  .hamburger {
    cursor: pointer;
    @include flex-center();
  }
  .hamburger {
    line {
      transition: 0.3s;
    }
  }
  img {
    width: 100%;
    vertical-align: middle;
  }
  @include desktop() {
    gap: 20px;
    .hamburger {
      display: none;
    }
  }
}
.menu {
  position: fixed;
  top: 45px;
  right: 0;
  transform: translateX(100%);
  transition: 0.3s;
  // border: 1px solid #000;
  background-color: #fff;
  border: 1px solid $color-neutral;
  text-align: start;
  display: flex;
  flex-direction: column;
  padding: 18px 8px 18px 15px;
  gap: 25px;
  font-size: 20px;
  border: 2px solid rgba(0, 0, 0, 0.9);
  border-top: 0;
  border-right: 0;
  border-radius: 0 0 0 25px;
  a {
    color: rgba(0, 0, 0, 0.9);
  }
  @include desktop() {
    position: relative;
    top: 0;
    transform: translateX(0);
    background-color: $tp;
    flex-direction: row;
    padding: 0;
    gap: 40px;
    margin-right: 40px;
    border: none;
    a {
      @include flex-center();
    }
  }
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 3;
  opacity: 0;
  background-color: $tp;
  transition: opacity 0.3s;
  pointer-events: none;
  border: none;
  outline: none;
  @include desktop() {
    display: none;
  }
}
#switch-hamburger {
  display: none;
  &:checked ~ .menu {
    transform: translateX(0);
  }
  &:checked ~ .header-bg {
    width: 165px;
    @include desktop() {
      width: calc(100% + 40px + 120px);
    }
  }
  &:checked ~ nav .hamburger {
    .line1 {
      transform: rotate(45deg) translate(6px, -7px);
      // transform-origin: 50% 50%;
    }
    .line2 {
      transform-origin: center center;
      transform: scaleX(0);
    }
    .line3 {
      transform: rotate(-45deg) translate(-11px, 0px);
    }
  }
}
header:has(#switch-hamburger:checked) .overlay {
  opacity: 1;
  pointer-events: auto;
}
</style>
<style lang="scss">
html:has(#switch-hamburger:checked) {
  overflow: hidden;
  @include desktop() {
    overflow: auto;
  }
}
</style>
