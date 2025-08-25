import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import axios from 'axios';
import { authState } from '@/assets/data/authState.js';
import router from '@/router';

const VITE_API_BASE = import.meta.env.VITE_API_BASE;
let pollingTimer = null;

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
      console.error("輪詢獲取活動列表失敗", error);
    } finally {
      if (isLoading.value) {
        isLoading.value = false;
      }
    }
  }

  function addJoinedActivity(activityNo) {
    joinedActivities.value.add(String(activityNo));
  }

  function startPolling() {
    if (pollingTimer) clearInterval(pollingTimer);
    pollingTimer = setInterval(() => {
      fetchJoinedActivities();
    }, 5000);
  }

  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  }

  function reset() {
    joinedActivities.value = new Set();
    isLoading.value = false;
    stopPolling();
  }

  async function handleJoinProcess(activityNo) {
    // === 關鍵修正：只檢查最可靠的 authState.user 物件 ===
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

    if (isJoined(activityNo)) {
      alert("您已經參加此活動！");
      return;
    }
    
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
      startPolling();
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