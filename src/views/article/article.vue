<script setup>
import Button from "@/components/Button.vue";
const activities = [
  { class: "camping", label: "露營", color: "#FFB6C1" },
  { class: "boardGames", label: "桌遊", color: "#ADD8E6" },
  { class: "ball", label: "籃球", color: "#90EE90" },
  { class: "movie", label: "電影", color: "#FFD700" },
  { class: "dinnerGathering", label: "聚餐", color: "#FFA07A" },
];
import { ref } from "vue";

const categories = [
  "全部",
  "潛水",
  "球類",
  "登山",
  "露營",
  "電影",
  "桌遊",
  "其他",
];
const activeCategory = ref("全部");

function setActive(category) {
  activeCategory.value = category;
}
</script>

<template>
  <!-- 熱門文章頁 -->
  <div>這是熱門文章頁</div>

  <div class="banner">
    <div class="imglist">
      <div
        v-for="(item, index) in activities"
        :key="index"
        :class="['activity', item.class]"
        :style="{ backgroundColor: item.color }"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
  <main class="artic">
    <div class="title">
      <h2>文章列表</h2>
    </div>

    <section class="articleCategory">
      <div class="categoryList">
        <div
          v-for="(cat, index) in categories"
          :key="index"
          :class="['categoryLabel', { active: cat === activeCategory }]"
          @click="setActive(cat)"
        >
          {{ cat }}
        </div>
      </div>

      <Button :onClick="ula" theme="primary" size="md">我要發文</Button>
    </section>
    <hr/>
  </main>
</template>

<style scoped lang="scss">
.banner {
  width: 100%;
}

.imglist {
  display: flex;
  gap: 1vw;
  margin: 4vw 2vw;
  height: 30vh;
}

.activity {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-weight: bold;
  border-radius: 10px;
  text-align: center;
}

.categoryLabel {
  padding: 15px 25px;
  background-color: #81bfda;
  border: 1px black solid;
}

.active {
  background-color: #4f8da8;
  color: #fff;
}
.categoryList {
  display: flex;
  gap: 18px;
}
.title {
  margin-block: 3vh;
}

section.articleCategory {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  align-items: center;
}

main.artic {
  max-width: 1200px;
  align-content: center;
  margin: auto;
}
hr {
  margin-block: 5vh;
}
</style>
