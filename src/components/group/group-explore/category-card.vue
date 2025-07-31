<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  title: String, // 卡片標題
  imageUrl: String, // 圖片路徑
  categoryNo: String, // 分類編號
});

const router = useRouter();
const goToCategory = () => {
  router.push({
    path: "/activity",
    query: { category: props.categoryNo },
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
    width: 117px;
    height: 145px;
    border-radius: 6px;
    transition: transform 0.2s ease-in-out;
    border: 2px solid $black;

    @include tablet() {
      //768-1023
      width: 255px;
      height: 315px;
    }

    @include desktop() {
      //1024以上
    }
    @media screen and (min-width: 1023px) and (max-width: 1199px) {
      //1023-1199
    }
  }

  &:hover img {
    transform: scale(1.05);
  }

  p {
    margin-top: 8px;
    font-size: $font-size-p;
  }
}
</style>
