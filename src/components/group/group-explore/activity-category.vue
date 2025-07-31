<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  title: String, // 卡片標題
  imageUrl: String, // 圖片 URL
  categoryNo: String, // 分類編號
});

const router = useRouter();

const goToCategory = () => {
  router.push({
    path: "/activities", // 活動列表頁
    query: { category: props.categoryNo }, // 帶分類參數
  });
};
</script>

<template>
  <div class="category-card" @click="goToCategory">
    <img :src="imageUrl" :alt="title" />
    <p>{{ title }}</p>
  </div>
</template>

<style scoped lang="scss">
.category-card {
  cursor: pointer;
  text-align: center;

  img {
    width: 100%;
    border-radius: 8px;
    transition: transform 0.2s ease-in-out;
  }

  &:hover img {
    transform: scale(1.05);
  }

  p {
    margin-top: 8px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
