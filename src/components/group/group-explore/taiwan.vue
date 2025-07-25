<script setup>
import { gsap } from "gsap";

import North from "@/assets/img/group/group-explore/group-explore-taiwan/north.svg";
import West from "@/assets/img/group/group-explore/group-explore-taiwan/west.svg";
import East from "@/assets/img/group/group-explore/group-explore-taiwan/east.svg";
import South from "@/assets/img/group/group-explore/group-explore-taiwan/south.svg";
import BigTaiwan from "@/assets/img/group/group-explore/group-explore-taiwan/taiwan.svg";

import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  watchEffect,
  watch,
} from "vue";

const isMobile = ref(true);
const isTablet = ref(false);

// DOM：'.taiwan-content'
const taiwanContent = ref(null);
// 確認區塊被點擊狀態
const isSelected = ref(false);

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

// 確認目前點到的區域
const isNorth = ref(null);
const isWest = ref(null);
const isSouth = ref(null);
const isEast = ref(null);
const areaTemp = ref(null);
const selectArea = (area) => {
  switch (area) {
    case "north":
      isNorth.value = true;
      isWest.value = false;
      isSouth.value = false;
      isEast.value = false;
      break;
    case "west":
      isNorth.value = false;
      isWest.value = true;
      isSouth.value = false;
      isEast.value = false;
      break;
    case "south":
      isNorth.value = false;
      isWest.value = false;
      isSouth.value = true;
      isEast.value = false;
      break;
    case "east":
      isNorth.value = false;
      isWest.value = false;
      isSouth.value = false;
      isEast.value = true;
      break;
    default:
      isNorth.value = false;
      isWest.value = false;
      isSouth.value = false;
      isEast.value = false;
  }
  if (areaTemp.value === area) {
    isNorth.value = false;
    isWest.value = false;
    isSouth.value = false;
    isEast.value = false;
    areaTemp.value = null;
  } else {
    areaTemp.value = area;
  }
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

  svgEl.addEventListener("click", (e) => {
    const target = e.target;
    const regionElement = target.closest("[data-region]");
    if (regionElement) {
      const region = regionElement.getAttribute("data-region");
      selectArea(region);
    }
  });
});

watch(isSelected, (val) => {
  const el = taiwanContent.value;
  const moveX = el.offsetWidth * 0.2;

  gsap.to(".big-taiwan", {
    x: val ? moveX : 0,
    duration: 0.4,
    ease: "power1.out",
  });
});

watchEffect(() => {
  const svg = svgRef.value?.$el || svgRef.value;
  if (!svg) return;

  const allRegions = svg.querySelectorAll("[data-region]");

  if (!selectedRegion.value) {
    // 沒有選擇任何區域，移除所有標記
    allRegions.forEach((el) => {
      el.classList.remove("dimmed", "selected");
      isSelected.value = false;
    });
    return;
  }

  svg.querySelectorAll("[data-region]").forEach((el) => {
    const region = el.getAttribute("data-region");

    // 移除所有標記
    el.classList.remove("dimmed", "selected");
    isSelected.value = false;

    if (selectedRegion.value && selectedRegion.value !== region) {
      el.classList.add("dimmed");
      el.classList.remove("selected");
    } else {
      el.classList.remove("dimmed");
      el.classList.add("selected");
      isSelected.value = true;
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkDeviceType);
});

// 比例
const baseMobileRatio = 0.18;
const baseTabletRatio = 0.45;
const baseDesktopRatio = 0.65;

// 北西東南 初始寬高
const northOriginal = { width: 700, height: 447 };
const westOriginal = { width: 629, height: 439 };
const eastOriginal = { width: 516, height: 919 };
const southOriginal = { width: 627, height: 586 };

const bigTaiwanOrginal = { width: 609, height: 1138 };

const taiwanAreaSize = reactive({
  north: {
    mobile: {
      width: northOriginal.width * baseMobileRatio,
      height: northOriginal.height * baseMobileRatio,
    },
    tablet: {
      width: northOriginal.width * baseTabletRatio,
      height: northOriginal.height * baseTabletRatio,
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
    tablet: {
      width: westOriginal.width * baseTabletRatio,
      height: westOriginal.height * baseTabletRatio,
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
    tablet: {
      width: eastOriginal.width * baseTabletRatio,
      height: eastOriginal.height * baseTabletRatio,
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
    tablet: {
      width: southOriginal.width * baseTabletRatio,
      height: southOriginal.height * baseTabletRatio,
    },
    desktop: {
      width: southOriginal.width * baseDesktopRatio,
      height: southOriginal.height * baseDesktopRatio,
    },
  },
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
</script>

<template>
  <div class="taiwan">
    <h1 class="taiwan-title">JOIKA 揪遍全台灣</h1>
    <div class="taiwan-content" ref="taiwanContent">
      <div class="taiwan-area-news">
        <!-- 北部 原尺寸：349*245 -->
        <North
          class="north taiwan-area"
          :class="{ move: isNorth }"
          :width="
            isMobile
              ? north.mobile.width
              : isTablet
              ? north.tablet.width
              : north.desktop.width
          "
          :height="
            isMobile
              ? north.mobile.height
              : isTablet
              ? north.tablet.height
              : north.desktop.height
          "
        />

        <!-- 西部 原尺寸：412*438 -->
        <West
          class="west taiwan-area"
          :class="{ move: isWest }"
          :width="
            isMobile
              ? west.mobile.width
              : isTablet
              ? west.tablet.width
              : west.desktop.width
          "
          :height="
            isMobile
              ? west.mobile.height
              : isTablet
              ? west.tablet.height
              : west.desktop.height
          "
        />

        <!-- 東部 原尺寸：371*919 -->
        <East
          class="east taiwan-area"
          :class="{ move: isEast }"
          :width="
            isMobile
              ? east.mobile.width
              : isTablet
              ? east.tablet.width
              : east.desktop.width
          "
          :height="
            isMobile
              ? east.mobile.height
              : isTablet
              ? east.tablet.height
              : east.desktop.height
          "
        />

        <!-- 南部 原尺寸：317*586 -->
        <South
          class="south taiwan-area"
          :class="{ move: isSouth }"
          :width="
            isMobile
              ? south.mobile.width
              : isTablet
              ? south.tablet.width
              : south.desktop.width
          "
          :height="
            isMobile
              ? south.mobile.height
              : isTablet
              ? south.tablet.height
              : south.desktop.height
          "
        />
      </div>

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
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.taiwan {
  padding-top: 5vw;
}
.taiwan-title {
  @include flex-center();
  font-size: $font-size-h3;
  @include desktop() {
    font-size: $font-size-h1;
  }
}
.taiwan-content {
  position: relative;
  padding: 35px 0;
  background-image: url("@/assets/img/group/group-explore/group-explore-taiwan/bgc.svg");
  background-repeat: no-repeat;
  background-size: contain; /* 或 contain，根據你想要的填滿方式 */
  background-position: center center;

  @include flex-center();
  @include desktop() {
    padding: 7.8% 0;
  }
}
.taiwan-area-news {
  position: relative;
  left: -20%;
}
.taiwan-area {
  position: absolute;
  opacity: 0;
  // 設置0.3秒位移動畫，且延遲0.1秒
  transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
  transform: translateY(0);
  &.move {
    opacity: 1;
    transform: translateY(-50%);
  }
}
.big-taiwan {
  position: relative;
  pointer-events: none;
  overflow: visible;
  transition: transform 0.4s ease;
  transform: translateX(0);
  transition: none;
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
    opacity: 0.4;
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

  // &:has(.selected) {
  //   left: 20%;
  // }
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
</style>
