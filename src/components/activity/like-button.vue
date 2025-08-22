<script setup>
import HeartOutlineIcon from "@/assets/img/icon/heart_outline.svg";
import HeartFilled from "@/assets/img/icon/heart_filled.svg";

// === 開始：第一段新增程式碼 (引入工具與大腦) ===
// 作用：從 vue 中引入 computed 和 onMounted，它們是建立智能狀態和執行初始化任務的工具。
import { computed, onMounted } from 'vue';
// 作用：引入我們剛剛建立的 favorite store (收藏大腦)。
import { useFavoriteStore } from '@/stores/favorite-store';
// === 結束：第一段新增程式碼 (引入工具與大腦) ===

const props = defineProps({
  activityNo: {
    type: [Number, String],
    required: true,
  },
});
// === 結束：替換 Props 定義 ===

// === 開始：第二段新增程式碼 (新增智能邏輯) ===
// 作用：我們將按鈕的內部邏輯，與 Pinia store 進行深度綁定。
const favoriteStore = useFavoriteStore(); // 取得收藏大腦 (favoriteStore) 的使用權。

// isLiked 不再是一個普通的 ref，而是一個「計算屬性」。
// 它的值 (true/false) 永遠會自動地根據收藏大腦的記憶來決定，確保狀態永不同步。
const isLiked = computed(() => favoriteStore.isFavorited(props.activityNo));

// handleToggleLike 函式的職責變得極其簡單：
// 它只需要告訴收藏大腦「我被點了，我的活動 ID 是 xxx」，剩下的複雜工作全部交給大腦處理。
const handleToggleLike = () => {
  favoriteStore.toggleFavorite(props.activityNo);
};

// 作用：在按鈕元件第一次被顯示在畫面上時，命令收藏大腦去「恢復一次記憶」。
onMounted(() => {
  // 為了避免每個按鈕都重複請求，可以加上判斷，只在需要時初始化。
  if (favoriteStore.favoriteSet.size === 0) {
    favoriteStore.fetchFavorites();
  }
});
// === 結束：第二段新增程式碼 (新增智能邏輯) ===
</script>
<template>
  <!-- === 開始：替換 Template 綁定 === -->
  <!-- 作用：我們將按鈕的點擊事件和狀態顯示，都綁定到我們在 script 中定義好的新邏輯上。 -->
  <div class="button-wrapper">
    <button class="icon-button" :data-is-active="isLiked" @click="handleToggleLike">
      <component :is="isLiked ? HeartFilled : HeartOutlineIcon" class="icon" />
    </button>
  </div>
  <!-- === 結束：替換 Template 綁定 === -->
</template>

<style lang="scss" scoped>
.icon-button {
  color: $red;
  cursor: pointer;
  display: flex;
  &:hover {
    color: $pink;
    transition: all 0.3s ease-in-out;
  }

  .icon {
    width: 100%;
    height: 38px;
    fill: $red;
  }
}
.icon-button[data-is-active="true"] .icon {
  fill: red;
}
</style>
