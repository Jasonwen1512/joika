// 作用：引入 Pinia 的核心函數 defineStore，以及 Vue 的 ref 和 watch 用於建立響應式狀態和監聽。
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

// 作用：引入 axios 用於和後端 API 通信。
import axios from 'axios';
// 作用：引入我們現有的 authState，以便能隨時獲取當前登入的使用者資訊。
import { authState } from '@/assets/data/authState';
// 作用：引入 Vue Router 實例，以便在 store 中進行頁面跳轉。
import router from '@/router';

// 作用：從環境設定中，讀取我們後端 API 的根網址。
const VITE_API_BASE = import.meta.env.VITE_API_BASE;

// 作用：定義一個名為 'favorites' 的 store，這是我們收藏功能的「專屬大腦」。
export const useFavoriteStore = defineStore('favorites', () => {
  const favoriteSet = ref(new Set());

  async function fetchFavorites() {
    // 這個函式保持不變，它的邏輯是完美的。
    if (!authState.user) {
      favoriteSet.value = new Set();
      return;
    }
    const memberId = authState.user.id;

    try {
      console.log('Favorite Store: 正在從後端獲取收藏列表...'); // 增加日誌方便追蹤
      const res = await axios.get(`${VITE_API_BASE}/favorites/list.php?memberId=${memberId}`);

       // --- 請在這裡加上這一行，這是最重要的除錯步驟！ ---
    console.log('後端回傳的原始資料:', res.data); 
    // ----------------------------------------------------


      if (res.data.success && Array.isArray(res.data.data)) {
        const ids = res.data.data.map(fav => String(fav.ACTIVITY_NO));
        favoriteSet.value = new Set(ids);
        console.log('Favorite Store: 收藏列表同步成功！');
      }
    } catch (error) { // <--- 已修正此處的語法錯誤
      console.error('Favorite Store: 獲取收藏列表失敗', error);
    }
  }

  async function toggleFavorite(activityNo) {
    // 這個函式也保持不變。
    if (!authState.user) {
      const redirectPath = router.currentRoute.value.fullPath;
      router.push({
        name: 'login',
        query: {
          redirect: redirectPath
        }
      });
      return false;
    }
    
    const memberId = authState.user.id;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE}/favorites/toggle.php`, {
        memberId: memberId,
        activityNo: activityNo,
      });
      if (response.data.success) {
        if (favoriteSet.value.has(activityNo)) {
          favoriteSet.value.delete(activityNo);
        } else {
          favoriteSet.value.add(activityNo);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Favorite Store: 切換收藏狀態失敗', error);
      return false;
    }
  }

  function isFavorited(activityNo) {
    return favoriteSet.value.has(activityNo);
  }

  // === 開始：第二段修改 (加入自動監聽和初始化邏輯) ===
  // 這段程式碼讓 store 變得“有生命”
  // 它會在 store 第一次被使用時自動建立一個監聽器
  watch(() => authState.user, (newUser) => {
    if (newUser) {
      // 如果偵測到使用者存在 (剛登入 或 刷新頁面後從 localStorage 恢復了登入狀態)
      // 就自動執行 fetchFavorites 來同步收藏列表。
      fetchFavorites();
    } else {
      // 如果偵測到使用者變為 null (剛登出)
      // 就立即清空前端的收藏記憶，確保 UI 正確顯示。
      favoriteSet.value = new Set();
    }
  }, {
    // immediate: true 是解決「刷新頁面」問題的關鍵！
    // 它會讓這個 watch 在被建立時，立刻用當前的 authState.user 狀態執行一次。
    immediate: true
  });
  // === 結束：第二段修改 ===

  return {
    favoriteSet,
    fetchFavorites,
    toggleFavorite,
    isFavorited,
  };
});