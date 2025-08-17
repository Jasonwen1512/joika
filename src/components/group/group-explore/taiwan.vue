<script setup>
// 另一台電腦push測試
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

import North from "@/assets/img/group/group-explore/group-explore-taiwan/north.svg";
import West from "@/assets/img/group/group-explore/group-explore-taiwan/west.svg";
import East from "@/assets/img/group/group-explore/group-explore-taiwan/east.svg";
import South from "@/assets/img/group/group-explore/group-explore-taiwan/south.svg";
import BigTaiwan from "@/assets/img/group/group-explore/group-explore-taiwan/taiwan.svg";

// import { FakeActivity } from "@/assets/data/fake-activity";
import axios from "axios";

import PlaceholderImageBg from "@/components/placeholder-image-bg.vue";

// 環境變數
const VITE_API_BASE = import.meta.env.VITE_API_BASE;

import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  watchEffect,
  watch,
  computed,
  nextTick,
} from "vue";

const FakeActivity = ref([]);

const northData = ref([]);
const westData = ref([]);
const southData = ref([]);
const eastData = ref([]);

const fetchAndCategorize = async () => {
  try {
    // 串接 API
    const response = await axios.get(`${VITE_API_BASE}/activities/list.php`);

    FakeActivity.value = response.data;
    // console.log(FakeActivity.value);

    // 資料拿到後再分類
    FakeActivity.value.forEach((item) => {
      const targetRegion = getRegionByCity(item.LOCATION.slice(0, 3));
      const targetDate = formatDate(item.ACTIVITY_START_DATE);

      switch (targetRegion) {
        case "北部":
          northData.value.push({
            no: item.ACTIVITY_NO,
            title: item.ACTIVITY_NAME,
            image: item.ACTIVITY_IMG,
            date: targetDate,
          });
          break;
        case "西部":
          westData.value.push({
            no: item.ACTIVITY_NO,
            title: item.ACTIVITY_NAME,
            image: item.ACTIVITY_IMG,
            date: targetDate,
          });
          break;
        case "南部":
          southData.value.push({
            no: item.ACTIVITY_NO,
            title: item.ACTIVITY_NAME,
            image: item.ACTIVITY_IMG,
            date: targetDate,
          });
          break;
        case "東部":
          eastData.value.push({
            no: item.ACTIVITY_NO,
            title: item.ACTIVITY_NAME,
            image: item.ACTIVITY_IMG,
            date: targetDate,
          });
          break;
      }
    });
  } catch (error) {
    console.error("抓資料失敗:", error);
  }
};

onMounted(() => {
  fetchAndCategorize();
});

const isMobile = ref(true);
const isTablet = ref(false);

// console.log(FakeActivity);

// DOM：'.taiwan-content'
const taiwanContent = ref(null);
// 確認區塊被點擊狀態
const isSelected = ref(false);
// 確認使用者點擊過台灣
const clicked = ref(false);

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
  // 點選到重複的，關閉地區
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

const lastSelectedRegion = ref("未選擇");
// 監聽地區變化，記住最後一個選擇的值
watchEffect(() => {
  if (isNorth.value) lastSelectedRegion.value = "北部";
  else if (isWest.value) lastSelectedRegion.value = "西部";
  else if (isSouth.value) lastSelectedRegion.value = "南部";
  else if (isEast.value) lastSelectedRegion.value = "東部";
});

// 把變數對應到北部、西部、東部、南部
const currentRegion = computed(() => {
  if (isNorth.value) return "北部";
  if (isWest.value) return "西部";
  if (isSouth.value) return "南部";
  if (isEast.value) return "東部";
  return lastSelectedRegion.value;
});

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

  gsap.to(".region", {
    height: isSelected.value ? "auto" : 0,
    duration: 0.6,
    ease: "power2.out",
    delay: isSelected.value ? 0.3 : 0,
  });

  // gsap.to(".region-mask", {
  //   y: isSelected.value ? 0 : "-100%",
  //   duration: 0.6,
  //   ease: "power2.out",
  //   delay: isSelected.value ? 0.3 : 0,
  // });
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
const baseDesktopRatio = 0.6;

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

//   {
//     title: "花蓮七星潭之旅",
//     image: "https://picsum.photos/seed/e1/300/200",
//     date: "7/22",
//   },

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

function getRegionByCity(cityName) {
  // console.log(cityName);

  const regionMap = {
    北部: ["基隆市", "台北市", "新北市", "桃園市", "新竹縣", "新竹市"],
    東部: ["宜蘭縣", "花蓮縣", "台東縣"],
    西部: ["苗栗縣", "台中市", "彰化縣", "雲林縣", "南投縣"],
    南部: ["嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣"],
  };

  for (const region in regionMap) {
    if (regionMap[region].includes(cityName)) {
      return region;
    }
  }
  return "未知區域";
}
// console.log(FakeActivity);

// taiwan-title 文字動畫
gsap.registerPlugin(SplitText, ScrollTrigger);

let split;
let animation;

onMounted(() => {
  nextTick(() => {
    split = new SplitText(".taiwan-title", {
      type: "chars",
      includeWhiteSpaces: true,
    });

    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: ".taiwan-title",
        start: "top 80%", // 當 .taiwan-title 的 top 滑到視窗 80% 處
        toggleActions: "play none none none", // 滾到就播
      },
      // 動畫本身
      x: 150,
      opacity: 0,
      duration: 0.8,
      ease: "power4",
      stagger: 0.1,
    });
  });
});

// 剛入場，區域彈跳動畫
const dur = 0.3;
const gap = 0.4;
const tl = gsap.timeline({ repeat: -1, repeatDelay: gap });

onMounted(() => {
  tl.fromTo(
    '[data-region="north"]',
    { y: 0 },
    { y: -80, duration: dur, ease: "power1.out", yoyo: true, repeat: 1 }
  )
    .fromTo(
      '[data-region="west"]',
      { y: 0 },
      { y: -80, duration: dur, ease: "power1.out", yoyo: true, repeat: 1 }
    )
    .fromTo(
      '[data-region="south"]',
      { y: 0 },
      { y: -80, duration: dur, ease: "power1.out", yoyo: true, repeat: 1 }
    )
    .fromTo(
      '[data-region="east"]',
      { y: 0 },
      { y: -80, duration: dur, ease: "power1.out", yoyo: true, repeat: 1 }
    );
});

const handleClick = () => {
  if (clicked.value) return;
  clicked.value = true;

  // 先播放所有元素歸位
  gsap.to("[data-region]", {
    y: 0,
    ease: "power1.inOut",
    onComplete: () => {
      // 歸位後再停止 timeline
      if (tl) {
        tl.kill();
        console.log("動畫已停止，並歸位");
      }
    },
  });

  // 使用者第一次點台灣時，滾動視窗到region區塊
  const target = document.querySelector(".region");
  if (target) {
    setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth", // 平滑滾動
        block: "center", // 對齊到視窗中央
      });
    }, 400); // delay 0.7秒
  }
};
</script>

<template>
  <div class="taiwan">
    <h1 class="taiwan-title">JOIKA 揪遍全台灣！</h1>
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
        @click="handleClick"
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
      <div class="bg">
        <img src="@/assets/img/bg-decorate3.png" alt="" />
      </div>
    </div>
    <div class="region">
      <!-- 若要單純遮罩，則內容放這（決定在這） -->
      <h4 class="title">{{ currentRegion }}</h4>
      <!-- 北部區塊 -->
      <div v-show="northData.length && currentRegion === '北部'">
        <Swiper
          v-show="currentRegion === '北部'"
          :slides-per-view="isMobile ? 3.5 : isTablet ? 4.5 : 4.5"
          :space-between="isMobile ? 10 : isTablet ? 20 : 30"
          class="my-swiper"
        >
          <SwiperSlide v-for="(item, index) in northData" :key="index">
            <router-link :to="`/activity/${item.no}`"
              ><div class="item-card">
                <div class="item-image" v-if="item.image">
                  <img class="img" :src="item.image" :alt="item.title" />
                </div>
                <div class="item-image" v-else>
                  <PlaceholderImageBg class="img" />
                </div>
                <span class="item-date_and_title"
                  >{{ item.date }}&nbsp;{{ item.title }}</span
                >
              </div>
            </router-link>
          </SwiperSlide>
        </Swiper>
      </div>
      <div
        v-show="!northData.length && currentRegion === '北部'"
        class="no-data"
      >
        尚無活動資訊
      </div>
      <!-- 西部區塊 -->
      <div v-show="westData.length && currentRegion === '西部'">
        <Swiper
          v-show="currentRegion === '西部'"
          :slides-per-view="isMobile ? 3.5 : isTablet ? 4.5 : 4.5"
          :space-between="isMobile ? 10 : isTablet ? 20 : 30"
          class="my-swiper"
        >
          <SwiperSlide v-for="(item, index) in westData" :key="index">
            <router-link :to="`/activity/${item.no}`"
              ><div class="item-card">
                <div class="item-image" v-if="item.image">
                  <img class="img" :src="item.image" :alt="item.title" />
                </div>
                <div class="item-image" v-else>
                  <PlaceholderImageBg class="img" />
                </div>
                <span class="item-date_and_title"
                  >{{ item.date }}&nbsp;{{ item.title }}</span
                >
              </div>
            </router-link>
          </SwiperSlide>
        </Swiper>
      </div>
      <div
        v-show="!westData.length && currentRegion === '西部'"
        class="no-data"
      >
        尚無活動資訊
      </div>

      <!-- 東部區塊 -->
      <div v-show="eastData.length && currentRegion === '東部'">
        <Swiper
          v-show="currentRegion === '東部'"
          :slides-per-view="isMobile ? 3.5 : isTablet ? 4.5 : 4.5"
          :space-between="isMobile ? 10 : isTablet ? 20 : 30"
          class="my-swiper"
        >
          <SwiperSlide v-for="(item, index) in eastData" :key="index">
            <router-link :to="`/activity/${item.no}`"
              ><div class="item-card">
                <div class="item-image" v-if="item.image">
                  <img class="img" :src="item.image" :alt="item.title" />
                </div>
                <div class="item-image" v-else>
                  <PlaceholderImageBg class="img" />
                </div>
                <span class="item-date_and_title"
                  >{{ item.date }}&nbsp;{{ item.title }}</span
                >
              </div>
            </router-link>
          </SwiperSlide>
        </Swiper>
      </div>
      <div
        v-show="!eastData.length && currentRegion === '東部'"
        class="no-data"
      >
        尚無活動資訊
      </div>
      <!-- 南部區塊 -->
      <div v-show="southData.length && currentRegion === '南部'">
        <Swiper
          v-show="currentRegion === '南部'"
          :slides-per-view="isMobile ? 3.5 : isTablet ? 4.5 : 4.5"
          :space-between="isMobile ? 10 : isTablet ? 20 : 30"
          class="my-swiper"
        >
          <SwiperSlide v-for="(item, index) in southData" :key="index">
            <router-link :to="`/activity/${item.no}`"
              ><div class="item-card">
                <div class="item-image" v-if="item.image">
                  <img class="img" :src="item.image" :alt="item.title" />
                </div>
                <div class="item-image" v-else>
                  <PlaceholderImageBg class="img" />
                </div>
                <span class="item-date_and_title"
                  >{{ item.date }}&nbsp;{{ item.title }}</span
                >
              </div>
            </router-link>
          </SwiperSlide>
        </Swiper>
      </div>
      <div
        v-show="!southData.length && currentRegion === '南部'"
        class="no-data"
      >
        尚無活動資訊
      </div>

      <div class="region-mask">
        <!-- 若要有東西往下推的感覺，則內容放這 -->
        <!-- <div class="r"></div>
        <div class="g"></div> -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.taiwan {
  padding-top: 4vw;
}
.taiwan-title {
  font-weight: 400;
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
  .bg {
    position: absolute;
    display: none;
    bottom: -60%;
    right: 0;
    z-index: -1;
    @include desktop() {
      display: block;
    }
  }
  @include desktop() {
    padding: 7% 0;
  }
}
.taiwan-area-news {
  position: relative;
  left: -20%;
}
.taiwan-area {
  position: absolute;
  opacity: 0;
  // 設置0.3秒位移動畫，且不延遲（關閉地區時套用）
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateY(0);
  &.move {
    opacity: 1;
    // 設置0.3秒位移動畫，且延遲0.1秒（顯示地區時套用）
    transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
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
      filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4));
      transform: translate(-8px, 52px);
    }
    &.selected {
      filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4));
    }
  }

  // 西：向右陰影
  :deep([data-region="west"]) {
    &:hover {
      filter: drop-shadow(4px 0 4px rgba(0, 0, 0, 0.4));
      transform: translate(6px, 15px);
    }
    &.selected {
      filter: drop-shadow(4px 0 4px rgba(0, 0, 0, 0.4));
    }
  }

  // 東：向左陰影
  :deep([data-region="east"]) {
    &:hover {
      filter: drop-shadow(-4px 0 4px rgba(0, 0, 0, 0.4));
      transform: translate(-17px, 18px);
    }
    &.selected {
      filter: drop-shadow(-4px 0 4px rgba(0, 0, 0, 0.4));
    }
  }

  // 南：向上陰影
  :deep([data-region="south"]) {
    &:hover {
      filter: drop-shadow(4px 0px 4px rgba(0, 0, 0, 0.4));
      transform: translate(11px, -4px);
    }
    &.selected {
      filter: drop-shadow(4px 0px 4px rgba(0, 0, 0, 0.4));
    }
  }

  // &:has(.selected) {
  //   left: 20%;
  // }
}
.region {
  font-family: "MyFont", sans-serif;
  overflow: hidden;
  width: 90%;
  height: 0;
  margin: auto;
  margin-bottom: 50px;
  .title {
    @include flex-center();
    margin-bottom: 3.125vw;
    font-size: $font-size-h4;
    @include desktop() {
      font-size: $font-size-h1;
    }
  }
  .item-card {
    cursor: pointer;
  }
  .item-image {
    aspect-ratio: 15 / 19;
    margin-bottom: 7px;
    border: 1px solid #000;
    border-radius: $border-radius-mobile;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
      border-radius: $border-radius-mobile;
      @include tablet() {
        border-radius: $border-radius-desktop;
      }
    }
    @include tablet() {
      margin-bottom: 15px;
      border-radius: $border-radius-desktop;
    }
  }
  .item-date_and_title {
    width: 100%;
    display: block;
    font-size: $font-size-p;
    padding: 0 5px 0 5px;
    white-space: nowrap;
    color: #000;
    overflow: hidden; /* 超出隱藏 */
    text-overflow: ellipsis; /* 超出用 ... 代替 */
    @include desktop() {
      font-size: $font-size-h3;
    }
  }
  @include tablet() {
    margin-bottom: 100px;
  }
  @include desktop() {
    width: 62.5%;
  }
  // .region-mask {
  //   transform: translateY(-100%);
  // }
}
.no-data {
  @include flex-center();
  font-size: 18px;
  color: #afafaf;
  @include tablet() {
    font-size: 20px;
  }
  @include desktop() {
    font-size: 24px;
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
</style>
