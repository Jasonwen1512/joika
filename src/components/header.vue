<script setup>
import { ref } from "vue";
const isSearchClick = ref(false);
const handleIsSearchClick = () => {
  isSearchClick.value = !isSearchClick.value;
};

const isMobile = ref(true);
window.onload = () => {
  isMobile.value = document.body.clientWidth <= 1024;
};
window.onresize = () => {
  isMobile.value = document.body.clientWidth <= 1024;
};
</script>

<template>
  <header>
    <div class="header">
      <a
        href=""
        class="header-img"
        :class="{ 'search-open': isSearchClick && isMobile }"
      >
        <img src="@/assets/img/icon/logo.svg" alt="" />
      </a>
      <div
        class="menu_and_nav"
        :class="{ 'search-open': isSearchClick && isMobile }"
      >
        <input type="checkbox" id="switch-hamburger" />
        <div class="menu">
          <a href="">揪團探索</a>
          <a href="">熱門文章</a>
          <a href="">聊天大廳</a>
          <a href="">幫助中心</a>
          <a href="">我要揪團！！</a>
        </div>
        <nav>
          <form action="">
            <button class="search" @click="handleIsSearchClick" type="button">
              <img src="@/assets/img/icon/search.svg" alt="" />
            </button>
          </form>

          <button class="avatar">
            <img src="@/assets/img/icon/avatar.svg" alt="" />
          </button>

          <label for="switch-hamburger" class="hamburger"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g stroke="#4F8DA8" stroke-width="2" stroke-linecap="round">
                <line class="line1" x1="4" y1="6" x2="20" y2="6" />
                <line class="line2" x1="4" y1="12" x2="20" y2="12" />
                <line class="line3" x1="4" y1="18" x2="20" y2="18" />
              </g>
            </svg>
          </label>
        </nav>
      </div>
    </div>
    <label class="overlay" for="switch-hamburger"></label>
  </header>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  height: $header-h-m;
  display: flex;
  justify-content: space-between;
  position: fixed;
  z-index: 5;
  background-color: $header-bgc;
  @include padding-lr($header-pd-tb, $header-pd-lr);
  @include desktop() {
    height: $header-h-d;
    @include padding-lr(0px, 20px);
  }
}
.header-img {
  display: flex;
  align-items: center;
  transition: 0.3s;
  img {
    width: 50%;
    vertical-align: middle;
  }
  &.search-open {
    transform: translateX(calc(-50% - 10px));
  }
  @include desktop() {
    img {
      width: 60%;
    }
  }
}

.menu_and_nav {
  @include flex-center();
  transition: 0.3s;
  &.search-open {
    transform: translateX(calc(60% + 15px));
  }
}
nav {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  .search,
  .avatar,
  .hamburger {
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
  top: m-menu-top();
  right: 0;
  transform: translateX(100%);
  transition: 0.3s;
  // border: 1px solid #000;
  background-color: $default-bgc;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  a {
    color: $header-text-color;
  }
  @include desktop() {
    position: relative;
    top: 0;
    transform: translateX(0);
    background-color: $tp;
    flex-direction: row;
    padding: 0;
    gap: 60px;
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
