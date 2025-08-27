import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import axios from 'axios';
import { authState } from '@/assets/data/authState.js';
import router from '@/router';

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

export const useParticipationStore = defineStore('participation', () => {
  const joinedActivities = ref(new Set());
  const isLoading = ref(true);

  const isJoined = (activityNo) => {
    if (isLoading.value) return false;
    return joinedActivities.value.has(String(activityNo));
  };

  async function fetchJoinedActivities() {
    if (!authState.user?.id) {
      isLoading.value = false;
      return;
    }
    try {
      const res = await axios.get(
        `${VITE_API_BASE}/activities/get-user-participations.php`,
        { params: { memberId: authState.user.id } }
      );
      if (Array.isArray(res.data)) {
        const ids = res.data.map(id => String(id));
        joinedActivities.value = new Set(ids);
      }
    } catch (error) {
      console.error("獲取活動列表失敗", error);
    } finally {
      if (isLoading.value) {
        isLoading.value = false;
      }
    }
  }

  function addJoinedActivity(activityNo) {
    joinedActivities.value.add(String(activityNo));
  }

  function reset() {
    joinedActivities.value = new Set();
    isLoading.value = false;
  }

  async function handleJoinProcess(activityNo) {
    // 步驟 1: 呼叫後端 API，進行精細的前置狀態檢查
    try {
      const res = await axios.get(
        `${VITE_API_BASE}/activities/get-user-participations.php`,
        {
          params: {
            action: 'check_prerequisites',
            memberId: authState.user?.id || 0,
            activityNo: activityNo,
          },
        }
      );

      console.log(res.data.status)
      switch (res.data.status) {
        case 'activity_pending':
          alert("該活動審核中，目前無法報名");
          return;
        case 'activity_cancelled':
          alert("主揪已取消活動，無法報名");
          return;
        // case 'joiner_pending':
        //   alert("你已經報名此活動，等待審核通過中");
        //   return;
        case 'can_proceed':
          break; 
        default:
          alert("發生未知狀態，請稍後再試。");
          return;
      }

    } catch (error) {
      console.error("檢查活動狀態失敗:", error);
      alert("檢查時發生錯誤，請稍後再試。");
      return;
    }

    // 步驟 2: 如果通過了所有前置檢查，才開始處理登入與跳轉
    if (!authState.user?.id) {
      const redirectPath = router.currentRoute.value.path;
      router.push({ 
        name: 'login',
        query: { 
          redirect: redirectPath,
          action: 'join',
          activityNo: activityNo
        } 
      });
      return;
    }
    
    // 步驟 3: (已登入) 跳轉到報名頁
    router.push(`/group/group-signup/${activityNo}`);
  }

  function executePostLoginAction() {
    const query = router.currentRoute.value.query;
    if (query.action === 'join' && query.activityNo) {
      handleJoinProcess(query.activityNo);
      const newQuery = { ...query };
      delete newQuery.action;
      delete newQuery.activityNo;
      router.replace({ query: newQuery });
    }
  }

  watch(() => authState.user, (newUser) => {
    if (newUser) {
      fetchJoinedActivities().then(() => {
        executePostLoginAction();
      });
    } else {
      reset();
    }
  }, { immediate: true });

  return {
    isLoading,
    isJoined,
    addJoinedActivity,
    handleJoinProcess,
  };
});