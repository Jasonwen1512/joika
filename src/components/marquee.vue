<script setup>
import { computed } from "vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const rawTags = [
  {
    text: "#HIKING",
    colors: [
      "#4F8DA8",
      "#FB900C",
      "#4F8DA8",
      "#FB900C",
      "#4F8DA8",
      "#FB900C",
      "#4F8DA8",
    ],
  },
  {
    text: "#CAMPING",
    colors: [
      "#FB400C",
      "#FFE100",
      "#FB400C",
      "#FFE100",
      "#FB400C",
      "#FFE100",
      "#FB400C",
      "#FFE100",
    ],
  },
  {
    text: "#CHATTING",
    colors: [
      "#1FB92C",
      "#FADA7A",
      "#1FB92C",
      "#FADA7A",
      "#1FB92C",
      "#FADA7A",
      "#1FB92C",
      "#FADA7A",
      "#1FB92C",
    ],
  },
  {
    text: "#SKATEBOARDING",
    colors: [
      "#F315BB",
      "#81BFDA",
      "#F315BB",
      "#81BFDA",
      "#F315BB",
      "#81BFDA",
      "#F315BB",
      "#81BFDA",
      "#F315BB",
      "#81BFDA",
      "#F315BB",
      "#81BFDA",
      "#F315BB",
    ],
  },
  {
    text: "#PARTY",
    colors: ["#FFE100", "#4F8DA8", "#FFE100", "#4F8DA8", "#FFE100", "#4F8DA8"],
  },
  {
    text: "#MOVIE",
    colors: ["#1A00FF", "#0CCBFB", "#1A00FF", "#0CCBFB", "#1A00FF", "#0CCBFB"],
  },
];
const colorfulLetters = computed(() => {
  return rawTags
    .flatMap((tag, index) => {
      const letterSpans = tag.text.split("").map((ch, i) => ({
        ch,
        color: tag.colors[i % tag.colors.length],
      }));
      return index < rawTags.length - 1
        ? [...letterSpans, { ch: " ", color: "transparent" }]
        : letterSpans;
    })
    .filter((item) => item.ch !== "" || item.color === "transparent");
});

const marqueeContent = ref(null);

function updateMarquee() {
  const content = marqueeContent.value;
  const wrapperWidth = content.parentElement.offsetWidth;

  while (content.children.length > 1) {
    content.removeChild(content.lastChild);
  }

  while (content.scrollWidth < wrapperWidth * 2) {
    const clone = content.children[0].cloneNode(true);
    content.appendChild(clone);
  }
}

onMounted(() => {
  updateMarquee();
  window.addEventListener("resize", updateMarquee);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateMarquee);
});
</script>

<template>
  <div class="marquee-wrapper">
    <div class="marquee-content" ref="marqueeContent">
      <div class="marquee-item">
        <template v-for="(item, i) in colorfulLetters" :key="i">
          <span
            v-if="item.ch !== ' '"
            class="color-letter"
            :style="{ '--color': item.color }"
          >
            {{ item.ch }}
          </span>
          <span v-else class="tag-spacer"></span>
        </template>
      </div>
      <div class="marquee-item">
        <template v-for="(item, i) in colorfulLetters" :key="'clone-' + i">
          <span
            v-if="item.ch !== ' '"
            class="color-letter"
            :style="{ '--color': item.color }"
          >
            {{ item.ch }}
          </span>
          <span v-else class="tag-spacer"></span>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "Baloo 2";
  src: url("@/assets/fonts/Baloo2-Regular.woff2") format("woff2");
  font-weight: 400;
}

@font-face {
  font-family: "Baloo 2";
  src: url("@/assets/fonts/Baloo2-Bold.woff2") format("woff2");
  font-weight: 700;
}
.marquee-wrapper {
  margin-top: 50px;
  margin-bottom: 50px;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  background-color: transparent;
  box-sizing: border-box;
  position: relative;
  z-index: 3;
}
.marquee-content {
  display: inline-flex;
  animation: marquee 20s linear infinite;
  min-width: fit-content;
}

.marquee-item {
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  display: flex;
  margin-right: 2rem;
  align-items: center;
}

.color-letter {
  color: var(--color);
  font-weight: bold;
  font-size: 3rem;
  // margin-right: 0.15em;
  transform: skewX(-25deg);
  font-family: "Baloo 2";
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
.tag-spacer {
  display: inline-block;
  width: 2rem;
}
@media screen and (max-width: 767px) {
  .marquee-wrapper {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
