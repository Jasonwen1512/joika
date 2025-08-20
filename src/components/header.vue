<script setup>
import Logo from "@/components/logo.vue";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import { authState, fetchMe } from "@/assets/data/authState.js";

const route = useRoute();

const isMobile = ref(true);
const shStatus = ref(false);
// const isScrolled = ref(false);
// const headerZIndex = ref(0);

// const handleScroll = () => {
//   isScrolled.value = window.scrollY > 200;
//   headerZIndex.value = isScrolled.value ? 5 : 0;
// };

const loginStatus = ref(null);

onMounted(() => {
  fetchMe();
});

watch(
  () => authState.user,
  (newVal, oldVal) => {
    if (oldVal === null && newVal === undefined) {
      fetchMe();
      console.log("第一次初始化完成，但尚未登入");
    } else if (newVal) {
      loginStatus.value = newVal;
      console.log("使用者已登入:", loginStatus);
    } else {
      loginStatus.value = null;
      console.log("使用者登出或未登入");
    }
  },
  { immediate: true } // 立即觸發一次
);

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

// 滑鼠暫時覆蓋的頁面名稱
const hoverPage = ref(null);

// 計算目前頁面名稱（若 hoverPage 有值則優先）
const targetPage = computed(() => {
  if (hoverPage.value) return hoverPage.value;

  const path = route.path;

  if (path === "/home") return "home";
  if (path.startsWith("/article/")) return "article";
  if (path === "/chat") return "chat";
  // group-explore + activity + group-signup 都算成 group-explore
  if (
    path === "/group/group-explore" ||
    path.startsWith("/activity") ||
    path.startsWith("/group/group-signup")
  ) {
    return "group-explore";
  }
  if (path === "/support") return "support";
  if (path === "/group/create" || path.startsWith("/group/edit"))
    return "group-create";
  if (path === "/auth/login" || path === "/auth/signup") return "login";
  if (path === "/member/member-content") return "member-content";
  if (path === "/member/member-notify") return "member-notify";

  return null;
});

const onMouseEnter = (pageName) => {
  hoverPage.value = pageName;
};
const onMouseLeave = () => {
  hoverPage.value = null;
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});

const pageIndicator = new URL(
  "@/assets/img/page-indicator.svg",
  import.meta.url
).href;
</script>
<template>
  <header>
    <div class="header">
      <router-link
        to="/home"
        class="header-img"
        @click="shStatus = false"
        @mouseenter="onMouseEnter('home')"
        @mouseleave="onMouseLeave"
      >
        <Logo class="logo" />
        <!-- <img
          :src="pageIndicator"
          alt="page-indicator"
          class="page-indicator"
          v-show="targetPage === 'home'"
        /> -->
      </router-link>
      <div class="menu_and_nav">
        <input type="checkbox" id="switch-hamburger" v-model="shStatus" />
        <div class="menu">
          <router-link
            to="/article/article"
            @click="shStatus = false"
            @mouseenter="onMouseEnter('article')"
            @mouseleave="onMouseLeave"
            >熱門文章
            <img
              :src="pageIndicator"
              alt="page-indicator"
              class="page-indicator"
              v-show="targetPage === 'article'"
            />
          </router-link>
          <router-link
            to="/chat"
            @click="shStatus = false"
            @mouseenter="onMouseEnter('chat')"
            @mouseleave="onMouseLeave"
            >聊天大廳<img
              :src="pageIndicator"
              alt="page-indicator"
              class="page-indicator"
              v-show="targetPage === 'chat'"
          /></router-link>
          <router-link
            to="/group/group-explore"
            @click="shStatus = false"
            @mouseenter="onMouseEnter('group-explore')"
            @mouseleave="onMouseLeave"
            >揪團探索<img
              :src="pageIndicator"
              alt="page-indicator"
              class="page-indicator"
              v-show="targetPage === 'group-explore'"
          /></router-link>
          <router-link
            to="/support"
            @click="shStatus = false"
            @mouseenter="onMouseEnter('support')"
            @mouseleave="onMouseLeave"
            >幫助中心<img
              :src="pageIndicator"
              alt="page-indicator"
              class="page-indicator"
              v-show="targetPage === 'support'"
          /></router-link>
          <router-link
            :to="{ name: 'group-create', params: { mode: 'create' } }"
            @click="shStatus = false"
            @mouseenter="onMouseEnter('group-create')"
            @mouseleave="onMouseLeave"
            >我要揪團！！<img
              :src="pageIndicator"
              alt="page-indicator"
              class="page-indicator"
              v-show="targetPage === 'group-create'"
          /></router-link>
        </div>
        <nav>
          <router-link
            to="/auth/login"
            class="avatar"
            @click="shStatus = false"
            @mouseenter="onMouseEnter('login')"
            @mouseleave="onMouseLeave"
            v-if="!loginStatus"
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
            <img
              :src="pageIndicator"
              alt="page-indicator"
              class="page-indicator"
              v-show="targetPage === 'login'"
            />
          </router-link>
          <router-link
            to="/member/member-notify"
            class="notify"
            v-if="loginStatus"
            @click="shStatus = false"
            @mouseenter="onMouseEnter('member-notify')"
            @mouseleave="onMouseLeave"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              :width="isMobile ? 24 : 30"
              :height="isMobile ? 24 : 30"
              viewBox="0 0 26 33"
              fill="none"
            >
              <path
                d="M17.5005 27.0329C17.5005 28.2264 17.0264 29.371 16.1825 30.2149C15.3386 31.0588 14.194 31.5329 13.0005 31.5329C11.8071 31.5329 10.6625 31.0588 9.81855 30.2149C8.97464 29.371 8.50053 28.2264 8.50053 27.0329M14.082 6.03744L11.883 6.03294C6.86703 6.02094 2.51253 10.0964 2.47803 15.0329L2.47803 20.7179C2.47803 21.9029 2.32803 23.0594 1.68153 24.0449L1.25103 24.7019C0.595531 25.6979 1.30053 27.0329 2.47803 27.0329L23.523 27.0329C24.7005 27.0329 25.404 25.6979 24.75 24.7019L24.3195 24.0449C23.6745 23.0594 23.523 21.9014 23.523 20.7164L23.523 15.0344C23.463 10.0964 19.098 6.04944 14.082 6.03744Z"
                stroke="rgba(0, 0, 0, 0.9)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.001 1.53294C13.7966 1.53294 14.5597 1.84901 15.1223 2.41162C15.6849 2.97423 16.001 3.73729 16.001 4.53294L16.001 6.03294L10.001 6.03294L10.001 4.53294C10.001 3.73729 10.317 2.97423 10.8797 2.41162C11.4423 1.84901 12.2053 1.53294 13.001 1.53294Z"
                stroke="rgba(0, 0, 0, 0.9)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <img
              :src="pageIndicator"
              alt="page-indicator"
              class="page-indicator"
              v-show="targetPage === 'member-notify'"
          /></router-link>
          <router-link
            to="/member/member-content"
            class="isLogin"
            v-if="loginStatus"
            @click="shStatus = false"
            @mouseenter="onMouseEnter('member-content')"
            @mouseleave="onMouseLeave"
          >
            <div>
              <img :src="loginStatus.avatar" alt="avatar" />
            </div>
            <img
              :src="pageIndicator"
              alt="page-indicator"
              class="page-indicator"
              v-show="targetPage === 'member-content'"
            />
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
        <div
          class="header-bg"
          :class="{ isScroll: isScrolledDown, isLogin: loginStatus }"
        ></div>
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
  position: relative;
  .page-indicator {
    position: absolute;
    opacity: 0.9;
    z-index: -1;
    left: -10px;
  }
  .logo {
    width: 50%;
    vertical-align: middle;
  }
  @include desktop() {
    .logo {
      width: 80%;
    }
    .page-indicator {
      left: unset;
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
    z-index: -2;
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
      &.isLogin {
        width: calc(55px + 15px * 2 + 55px);
      }
      @include desktop() {
        width: calc(100% + 40px + 120px);
        &.isLogin {
          width: calc(100% + 40px + 120px);
        }
      }
    }
  }
}
nav {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  position: relative;
  align-items: center;
  .page-indicator {
    position: absolute;
    opacity: 0.9;
    z-index: -1;
  }
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
  .notify {
    width: 24px;
    height: 24px;
    cursor: pointer;
    .page-indicator {
      width: 50%;
    }
    @include flex-center();
    @include tablet() {
      width: 30px;
      height: 30px;
    }
  }
  .isLogin {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(0, 0, 0, 0.9);
    border-radius: 50%;
    cursor: pointer;
    .page-indicator {
      width: 50%;
    }
    @include flex-center();
    @include tablet() {
      width: 30px;
      height: 30px;
    }
  }
  @include desktop() {
    gap: 50px;
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
    position: relative;
    .page-indicator {
      position: absolute;
      opacity: 0.9;
      z-index: -1;
      left: 0;
      @include desktop() {
        left: unset;
      }
    }
  }
  @include desktop() {
    position: relative;
    top: 0;
    transform: translateX(0);
    background-color: $tp;
    flex-direction: row;
    padding: 0;
    gap: 0px;
    margin-right: 40px;
    border: none;
    a {
      @include flex-center();
      padding: 0 20px;
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
