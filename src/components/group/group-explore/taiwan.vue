<script setup>
import North from "@/assets/img/group/group-explore/group-explore-taiwan/north-yellow.svg";
import West from "@/assets/img/group/group-explore/group-explore-taiwan/west-green.svg";
import East from "@/assets/img/group/group-explore/group-explore-taiwan/east-pink.svg";
import South from "@/assets/img/group/group-explore/group-explore-taiwan/south-blue.svg";

import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
const isMobile = ref(true);
const checkIsMobile = () => {
  isMobile.value = document.body.clientWidth <= 768;
};
onMounted(() => {
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIsMobile);
});

// 比例
const baseMobileRatio = 0.22;
const baseDesktopRatio = 0.7;

// 北西東南 初始寬高
const northOriginal = { width: 349, height: 245 };
const westOriginal = { width: 412, height: 438 };
const eastOriginal = { width: 371, height: 919 };
const southOriginal = { width: 317, height: 586 };

const taiwanAreaSize = reactive({
  north: {
    mobile: {
      width: northOriginal.width * baseMobileRatio,
      height: northOriginal.height * baseMobileRatio,
    },
    desktop: {
      width: northOriginal.width * baseDesktopRatio,
      height: northOriginal.height * baseDesktopRatio,
    },
  },
  west: {
    mobile: {
      width: westOriginal.width * baseMobileRatio,
      height: westOriginal.height * baseMobileRatio,
    },
    desktop: {
      width: westOriginal.width * baseDesktopRatio,
      height: westOriginal.height * baseDesktopRatio,
    },
  },
  east: {
    mobile: {
      width: eastOriginal.width * baseMobileRatio,
      height: eastOriginal.height * baseMobileRatio,
    },
    desktop: {
      width: eastOriginal.width * baseDesktopRatio,
      height: eastOriginal.height * baseDesktopRatio,
    },
  },
  south: {
    mobile: {
      width: southOriginal.width * baseMobileRatio,
      height: southOriginal.height * baseMobileRatio,
    },
    desktop: {
      width: southOriginal.width * baseDesktopRatio,
      height: southOriginal.height * baseDesktopRatio,
    },
  },
});
// 物件解構賦值
const { north, west, east, south } = taiwanAreaSize;
</script>

<template>
  <div class="taiwan">
    <h1 class="taiwan-title">JOIKA 揪遍全台灣</h1>
    <div class="taiwan-content">
      <!-- 北部 原尺寸：349*245 -->

      <North
        class="north taiwan-area"
        :width="isMobile ? north.mobile.width : north.desktop.width"
        :height="isMobile ? north.mobile.height : north.desktop.height"
      />

      <!-- 西部 原尺寸：412*438 -->

      <West
        class="west taiwan-area"
        :width="isMobile ? west.mobile.width : west.desktop.width"
        :height="isMobile ? west.mobile.height : west.desktop.height"
      />

      <!-- 東部 原尺寸：371*919 -->

      <East
        class="east taiwan-area"
        :width="isMobile ? east.mobile.width : east.desktop.width"
        :height="isMobile ? east.mobile.height : east.desktop.height"
      />

      <!-- 南部 原尺寸：317*586 -->

      <South
        class="south taiwan-area"
        :width="isMobile ? south.mobile.width : south.desktop.width"
        :height="isMobile ? south.mobile.height : south.desktop.height"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.taiwan-title {
  @include flex-center();
  font-size: $font-size-h3;
  @include desktop() {
    font-size: $font-size-h1;
  }
}
.taiwan-content {
  position: relative;
  padding-top: 26px;
  min-height: 300px;
  @include desktop() {
    padding-top: 150px;
    min-height: 900px;
  }
  .north {
    left: 40%;
    top: 60px;
  }
  .west {
    // display: none;
    left: 102px;
    top: 91.2px;
  }
  .east {
    display: none;
  }
  .south {
    display: none;
  }
}
.taiwan-area {
  position: absolute;
  // left: 50%;
  pointer-events: none;
  :deep(path) {
    pointer-events: auto;
    cursor: pointer;
  }
}
</style>
