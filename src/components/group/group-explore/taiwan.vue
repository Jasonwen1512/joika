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

import BigTaiwan from "@/assets/img/group/group-explore/group-explore-taiwan/taiwan.svg";

import { ref, reactive, onMounted, onBeforeUnmount, watchEffect } from "vue";
const isMobile = ref(true);
const isTablet = ref(false);
const checkDeviceType = () => {
  isMobile.value = document.body.clientWidth < 768;
  isTablet.value =
    document.body.clientWidth >= 768 && document.body.clientWidth <= 1023;
};
const svgRef = ref(null);
const selectedRegion = ref(null);

const toggleRegion = (region) => {
  selectedRegion.value = selectedRegion.value === region ? null : region;
};

onMounted(() => {
  checkDeviceType();
  window.addEventListener("resize", checkDeviceType);

  const svgEl = svgRef.value.$el || svgRef.value;

  svgEl.querySelectorAll("[data-region]").forEach((g) => {
    g.addEventListener("mouseenter", () => {
      g.parentNode.appendChild(g); // 提到最上層
    });
  });

  svgEl.querySelectorAll("[data-region]").forEach((el) => {
    el.addEventListener("click", () => {
      const region = el.getAttribute("data-region");
      toggleRegion(region);
    });
  });
});

watchEffect(() => {
  const svg = svgRef.value?.$el || svgRef.value;
  if (!svg) return;

  const allRegions = svg.querySelectorAll("[data-region]");

  if (!selectedRegion.value) {
    // ✅ 沒有選擇任何區域，移除所有標記
    allRegions.forEach((el) => {
      el.classList.remove("dimmed", "selected");
    });
    return;
  }

  svg.querySelectorAll("[data-region]").forEach((el) => {
    const region = el.getAttribute("data-region");

    // 移除所有標記
    el.classList.remove("dimmed", "selected");

    if (selectedRegion.value && selectedRegion.value !== region) {
      el.classList.add("dimmed");
      el.classList.remove("selected");
    } else {
      el.classList.remove("dimmed");
      el.classList.add("selected");
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkDeviceType);
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
});

// 比例
const baseMobileRatio = 0.22;
<<<<<<< HEAD
const baseDesktopRatio = 0.7;
=======
const baseTabletRatio = 0.45;
const baseDesktopRatio = 0.6;
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59

// 北西東南 初始寬高
const northOriginal = { width: 349, height: 245 };
const westOriginal = { width: 412, height: 438 };
const eastOriginal = { width: 371, height: 919 };
const southOriginal = { width: 317, height: 586 };

<<<<<<< HEAD
=======
const bigTaiwanOrginal = { width: 609, height: 1138 };

>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
const taiwanAreaSize = reactive({
  north: {
    mobile: {
      width: northOriginal.width * baseMobileRatio,
      height: northOriginal.height * baseMobileRatio,
    },
<<<<<<< HEAD
=======
    tablet: {
      width: northOriginal.width * baseTabletRatio,
      height: northOriginal.height * baseTabletRatio,
    },
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
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
<<<<<<< HEAD
=======
    tablet: {
      width: westOriginal.width * baseTabletRatio,
      height: westOriginal.height * baseTabletRatio,
    },
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
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
<<<<<<< HEAD
=======
    tablet: {
      width: eastOriginal.width * baseTabletRatio,
      height: eastOriginal.height * baseTabletRatio,
    },
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
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
<<<<<<< HEAD
=======
    tablet: {
      width: southOriginal.width * baseTabletRatio,
      height: southOriginal.height * baseTabletRatio,
    },
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
    desktop: {
      width: southOriginal.width * baseDesktopRatio,
      height: southOriginal.height * baseDesktopRatio,
    },
  },
<<<<<<< HEAD
});
// 物件解構賦值
const { north, west, east, south } = taiwanAreaSize;
=======
  bigTaiwan: {
    mobile: {
      width: bigTaiwanOrginal.width * baseMobileRatio,
      height: bigTaiwanOrginal.height * baseMobileRatio,
    },
    tablet: {
      width: bigTaiwanOrginal.width * baseTabletRatio,
      height: bigTaiwanOrginal.height * baseTabletRatio,
    },
    desktop: {
      width: bigTaiwanOrginal.width * baseDesktopRatio,
      height: bigTaiwanOrginal.height * baseDesktopRatio,
    },
  },
});
// 物件解構賦值
const { north, west, east, south, bigTaiwan } = taiwanAreaSize;
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
</script>

<template>
  <div class="taiwan">
    <h1 class="taiwan-title">JOIKA 揪遍全台灣</h1>
    <div class="taiwan-content">
      <!-- 北部 原尺寸：349*245 -->

<<<<<<< HEAD
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
=======
      <!-- <North
        class="north taiwan-area"
        :width="isMobile ? north.mobile.width : north.desktop.width"
        :height="isMobile ? north.mobile.height : north.desktop.height"
      /> -->

      <!-- 西部 原尺寸：412*438 -->

      <!-- <West
        class="west taiwan-area"
        :width="isMobile ? west.mobile.width : west.desktop.width"
        :height="isMobile ? west.mobile.height : west.desktop.height"
      /> -->

      <!-- 東部 原尺寸：371*919 -->

      <!-- <East
        class="east taiwan-area"
        :width="isMobile ? east.mobile.width : east.desktop.width"
        :height="isMobile ? east.mobile.height : east.desktop.height"
      /> -->

      <!-- 南部 原尺寸：317*586 -->

      <!-- <South
        class="south taiwan-area"
        :width="isMobile ? south.mobile.width : south.desktop.width"
        :height="isMobile ? south.mobile.height : south.desktop.height"
      /> -->
      <BigTaiwan
        ref="svgRef"
        class="big-taiwan"
        :width="
          isMobile
            ? bigTaiwan.mobile.width
            : isTablet
            ? bigTaiwan.tablet.width
            : bigTaiwan.desktop.width
        "
        :height="
          isMobile
            ? bigTaiwan.mobile.height
            : isTablet
            ? bigTaiwan.tablet.height
            : bigTaiwan.desktop.height
        "
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
<<<<<<< HEAD
=======
.taiwan {
  padding-top: 100px;
}
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
.taiwan-title {
  @include flex-center();
  font-size: $font-size-h3;
  @include desktop() {
    font-size: $font-size-h1;
  }
}
.taiwan-content {
  position: relative;
<<<<<<< HEAD
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
=======
  padding-top: 35px;

  @include flex-center();
  @include desktop() {
    padding-top: 150px;
  }
}
.big-taiwan {
  pointer-events: none;
  overflow: visible;
  :deep([data-region]) {
    pointer-events: auto;
    cursor: pointer;
    transition: filter 0.1s ease, opacity 0.1s ease;
    transform-origin: center center;
    &:hover {
      scale: 1.1;
    }
  }
  :deep(.dimmed) {
    opacity: 0.25;
    filter: none !important;
    transform: none !important;
    scale: none !important;
  }

  // 北：向下陰影
  :deep([data-region="north"]) {
    &:hover {
      transform: translate(-8px, 52px);
      filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4));
    }
  }

  // 西：向右陰影
  :deep([data-region="west"]) {
    &:hover {
      filter: drop-shadow(4px 0 4px rgba(0, 0, 0, 0.4));
      transform: translate(6px, 15px);
    }
  }

  // 東：向左陰影
  :deep([data-region="east"]) {
    &:hover {
      filter: drop-shadow(-4px 0 4px rgba(0, 0, 0, 0.4));
      transform: translate(-17px, 18px);
    }
  }

  // 南：向上陰影
  :deep([data-region="south"]) {
    &:hover {
      filter: drop-shadow(4px 0px 4px rgba(0, 0, 0, 0.4));
      transform: translate(11px, -4px);
    }
  }
}
// .taiwan-area {
//   position: absolute;
//   // left: 50%;
//   pointer-events: none;
//   :deep(path) {
//     pointer-events: auto;
//     cursor: pointer;
//   }
// }
>>>>>>> 7e8ab1a29ece990bae2447fd9782c09bf229fe59
</style>
