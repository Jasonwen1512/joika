<script setup>
    /* -----------------------------
    * Imports
    * ----------------------------- */
    import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
    import { useRouter } from "vue-router";
    import StarRating from "@/components/StarRating.vue";
    import Button from "@/components/Button.vue";
    import EditIcon from "@/assets/img/icon/edit.svg";
    import NotifyIcon from "@/assets/img/icon/notification.svg";
    import FullCalendar from "@/components/member/member-content/FullCalendar.vue";
    import MemberActivityCard from "@/components/member/member-activity-card.vue";
    import memberarticle from "@/components/member/member-post.vue";
    import membercomment from "@/components/member/member-comment.vue";
    import { logout } from "@/assets/data/authState";

    /* -----------------------------
    * Constants / Maps
    * ----------------------------- */
    const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
    const subtabToType = {
        "my-activity": "hosted",
        "my-follow-activity": "joined",
        "my-activity-collection": "favorite", // 尚未實作 → 不打 API
    };
    const eventColorMap = {
        登山: "#6DE1D2",
        水上活動: "#77BEF0",
        運動: "#FFD63A",
        露營: "#FF8C86",
        唱歌: "#FFA955",
        展覽: "#6DE1D2",
        聚餐: "#77BEF0",
        桌遊: "#FFD63A",
        電影: "#FF8C86",
        手作: "#FFA955",
        文化體驗: "#6DE1D2",
        演出表演: "#77BEF0",
        其他: "#969696",
    };
    const interestTags = ["水上活動", "露營", "登山"];

/* -----------------------------
 * State
 * ----------------------------- */
// 路由 / 會員
const router = useRouter();
const member = ref(null);
const pageLoading = ref(true);
const error = ref("");

// 活動列表
const activities = ref([]);         // 正規化後的活動陣列
const activitiesLoading = ref(false);
const activitiesError = ref("");
const limit = ref(100);
const offset = ref(0);
const currentSubTab = ref("my-activity");

// UI
const currentTab = ref("group");
const selectedStatus = ref("");
const isFilterVisible = ref(false);
const visibleCount = ref(2);

/* -----------------------------
 * Utilities / Helpers
 * ----------------------------- */
function GetEventColor(eventName) {
  return eventColorMap[eventName] || "#adb5bd";
}

function normalizeActivity(raw) {
  const img = raw?.ACTIVITY_IMG || "";

  // 支援：1) /upload 開頭的相對路徑 2) 只有檔名
    const activity_img = (() => {
        if (!img) return ""; // 可改成你的預設圖
        if (img.startsWith("/upload")) return `${API_BASE}${img}`;
        return `${API_BASE}/upload/activities-img/${encodeURIComponent(img)}`;
    })();

    return {
        activity_no: raw.ACTIVITY_NO,
        activity_name: raw.ACTIVITY_NAME,
        activity_description: raw.ACTIVITY_DESCRIPTION,
        activity_status: raw.ACTIVITY_STATUS,
        activity_day: raw.ACTIVITY_START_DATE,
        activity_img,
        role: raw.role || raw.ROLE || null,
    };
}

const avatarUrl = computed(() => {
  const avatar = member.value?.MEMBER_AVATAR;
  if (!avatar) return "";
  return `${API_BASE}/upload/member/${encodeURIComponent(avatar)}`;
});

/* -----------------------------
 * Core Actions
 * ----------------------------- */
async function loadMember() {
  pageLoading.value = true;
  error.value = "";
  try {
    const res = await fetch(`${API_BASE}/users/profile-get.php`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 401) {
      router.replace("/auth/login");
      return;
    }
    if (!res.ok) throw new Error("伺服器錯誤");
    const data = await res.json();
    member.value = data.data ?? data;
  } catch (err) {
    error.value = err.message || "載入會員資料失敗";
  } finally {
    pageLoading.value = false;
  }
}

async function loadActivities() {
  const type = subtabToType[currentSubTab.value];

  if (type === "favorite") {
    activities.value = [];
    activitiesError.value = "收藏功能尚未開放";
    return;
  }

  const qs = new URLSearchParams({
    type,
    limit: String(limit.value),
    offset: String(offset.value),
  });

  activitiesLoading.value = true;
  activitiesError.value = "";

  try {
    const res = await fetch(`${API_BASE}/users/activity-get.php?${qs.toString()}`, {
      credentials: "include",
    });
    if (res.status === 401) {
      router.replace("/auth/login");
      return;
    }
    if (!res.ok) throw new Error("活動清單載入失敗");

    const json = await res.json();
    const items = json?.data?.items ?? [];
    activities.value = items.map(normalizeActivity);
  } catch (e) {
    console.error(e);
    activitiesError.value = e.message || "無法取得活動清單";
    activities.value = [];
  } finally {
    activitiesLoading.value = false;
  }
}

const logoutLoading = ref(false);
async function handleLogout() {
  if (logoutLoading.value) return;
  logoutLoading.value = true;
  try {
    await logout();
    router.replace("/auth/login");
  } catch (e) {
    console.error(e);
    alert("登出失敗，稍後再試");
  } finally {
    logoutLoading.value = false;
  }
}

/* -----------------------------
 * Computed
 * ----------------------------- */
const filteredActivities = computed(() => {
  if (!selectedStatus.value) return activities.value;
  return activities.value.filter((a) => a.activity_status === selectedStatus.value);
});

const openActivities = computed(() => {
  return activities.value.filter((a) => a.activity_status === "開團中");
});

const visibleActivities = computed(() => {
  return openActivities.value.slice(0, visibleCount.value);
});

/* -----------------------------
 * Lifecycle / Watchers
 * ----------------------------- */
function handleResize() {
  visibleCount.value = window.innerWidth < 768 ? 1 : 2;
}

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
  loadMember();
  loadActivities();
});

watch(currentSubTab, () => {
  offset.value = 0; // 切換頁籤回第一頁
  loadActivities();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>


<template>
    <div class="member-content">
        <div v-if="pageLoading">載入中…</div>
        <div v-else-if="error">{{ error }}</div>
        <template v-else>
            <div class="member-header">
                <div class="member-details">
                    <div class="member-image">
                        <img
                            :src="avatarUrl"
                            :alt="member?.MEMBER_NICKNAME || 'avatar'"  
                        />
                    </div>
                    <div class="member-info">
                        <p class="user-name">{{ member?.MEMBER_NICKNAME }}</p>
                        <div class="rate">
                            <p>主揪評價:</p>
                            <StarRating
                                :score= "member.hostAvg"
                                :count= "member.HOST_COUNT_TOTAL"
                                color="yellow"
                                showScore
                                class="score"
                            />
                        </div>
                        <div class="rate">
                            <p>參團評價:</p>
                            <StarRating
                            :score="member.joinerAvg"
                            :count="member.JOINER_COUNT_TOTAL"
                            color="blue"
                            showScore
                            class="score"
                        />
                        </div>
                        <p v-if="member" class="user-demographics">
                            {{ member.MEMBER_CITY_NAME }} | {{ member.age }}歲 | {{ member.MEMBER_OCCUPATION_NAME }}
                        </p>
                        <div class="tags">
                            <div
                                v-for="(activity, index) in interestTags"
                                :key="index"
                                class="tag"
                                :style="{
                                    backgroundColor: GetEventColor(activity),
                                }"
                            >
                                {{ activity }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-group">
                    <RouterLink to="/member/member-notify">
                        <Button
                            :prefixIcon="NotifyIcon"
                            size="lg"
                            theme="primary"
                            >通知訊息</Button
                        ></RouterLink
                    >
                    <Button
                        :prefixIcon="EditIcon"
                        size="lg"
                        theme="info"
                        >編輯檔案</Button
                    >

                    <Button isOutline theme="secondary" size="lg" @click="handleLogout">
                        {{ logoutLoading ? '登出中…' : '登出' }}
                    </Button>
                </div>
            </div>

            <div class="member-body">
                <div class="tab-bar">
                    <button
                        :class="{ active: currentTab === 'group' }"
                        @click="currentTab = 'group'"
                    >
                        揪團
                    </button>
                    <button
                        :class="{ active: currentTab === 'calendar' }"
                        @click="currentTab = 'calendar'"
                    >
                        行事曆
                    </button>
                    <button
                        :class="{ active: currentTab === 'post' }"
                        @click="currentTab = 'post'"
                    >
                        貼文
                    </button>
                    <button
                        :class="{ active: currentTab === 'comment' }"
                        @click="currentTab = 'comment'"
                    >
                        評論
                    </button>
                </div>
                <div class="tab-content">
                    <div v-if="currentTab === 'group'">
                        <div class="member-activity-section">
                            <ul class="member-activity-btns">
                                <div class="activity-items">
                                <li>
                                    <button
                                        :class="{
                                            active: currentSubTab === 'my-activity',
                                        }"
                                        @click="currentSubTab = 'my-activity'"
                                    >
                                        我開的揪團
                                    </button>
                                </li>
                                <li>
                                    <button
                                        :class="{
                                            active:
                                                currentSubTab ===
                                                'my-follow-activity',
                                        }"
                                        @click="
                                            currentSubTab = 'my-follow-activity'
                                        "
                                    >
                                        參與的揪團
                                    </button>
                                </li>
                                <li>
                                    <button
                                        :class="{
                                            active:
                                                currentSubTab ===
                                                'my-activity-collection',
                                        }"
                                        @click="
                                            currentSubTab = 'my-activity-collection'
                                        "
                                    >
                                        我的收藏
                                    </button>
                                </li>
                            </div>
                            <div class="filter-item">
                                <li>                
                                    <button 
                                            class="select-btn"
                                            @click="isFilterVisible = !isFilterVisible">篩選</button>
                                </li>
                                <li v-if="isFilterVisible">
                                <select 
                                    id="status-filter" 
                                    v-model="selectedStatus" 
                                    style="padding: 10px; border: 1px solid black;"
                                >
                                    <option value="">全部狀態</option>
                                    <option value="開團中">開團中</option>
                                    <option value="審核中">審核中</option>
                                    <option value="已完成">已完成</option>
                                    <option value="已取消">已取消</option>
                                </select>
                                </li>
                                <li>
                                    <button 
                                    class="select-btn">排序</button>
                                </li>
                                </div>
                            </ul>
                            <div class="member-activity-card-section">
                                <div v-if="activitiesLoading">活動載入中…</div>
                                <div v-else-if="activitiesError">{{ activitiesError }}</div>
                                <div v-else-if="filteredActivities.length === 0">目前沒有符合條件的活動。</div>

                                <MemberActivityCard
                                    v-else
                                    v-for="activity in filteredActivities"
                                    :key="activity.activity_no"
                                    :item="activity"
                                />
                            </div>
                        </div>
                    </div>
                    <div v-else-if="currentTab === 'calendar'">
                        <div class="activity-card-groups">
                            <p class="section-title">下一個揪團</p>
                            <div class="activity-card-list">
                                <MemberActivityCard
                                    v-for="activity in visibleActivities"
                                    :key="activity.activity_no"
                                    :item="activity"
                                />
                                <div v-if="filteredActivities.length === 0">
            <p>目前沒有符合條件的活動。</p>
        </div>
                            </div>
                        </div>
                        <div class="calerdar">
                            <FullCalendar />
                        </div>
                    </div>
                    <div v-else-if="currentTab === 'post'">
                        <!-- //我發表的文章-->

                        <memberarticle></memberarticle>
                        <!-- 到這邊結束 -->
                    </div>
                    <div v-else-if="currentTab === 'comment'">
                        <!-- //我發表的留言-->
                        <!-- 這邊資料串接有問題 因為留言資料裡面沒有對應的文章ID 無法抓取 ，之後要做修正-->
                        <membercomment></membercomment>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.member-content {
    padding: 50px 0;
    background-image: linear-gradient(
            rgba(255, 255, 255, 0.9),
            rgba(255, 255, 255, 0.9)
        ),
        url("/src/assets/img/group/group-explore/group-explore-taiwan/bgc.svg");
    background-size: contain;
}
.member-header {
    border: 2px solid $black;
    border-radius: 3px;
    padding: 20px;
    margin-bottom: 25px;
    display: flex;
    flex-direction: column;

    .member-image {
        display: flex;
        justify-content: center;
        margin: 0;
    }

    img {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        margin-bottom: 10px;
    }

    .user-name {
        font-size: $font-size-h3;
        margin-bottom: 10px;
    }

    .score {
        margin-bottom: 10px;
    }

    .user-demographics {
        font-size: $font-size-h3;
        margin-bottom: 10px;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 10px;

        .tag {
            text-align: center;
            padding: 5px;
            color: $black;
            border: 1px solid $black;
            border-radius: 3px;
            width: 80px;
        }
    }

    .button-group {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-top: 10px;
    }
}

.tab-bar {
    display: flex;
    justify-content: center;
    gap: 10px;
    position: relative; /* 為了 z-index */
    z-index: 1; /* 確保頁籤在內容區塊之上 */
    margin-bottom: -2px; /* 向下移動 1px，蓋住下方邊框 */

    button {
        background-color: $color-secondary;
        border-radius: 3px 3px 0 0;
        border: 2px solid $black;
        padding: 10px;
        width: 80px;
        cursor: pointer;
        &.active {
            background-color: $blue;
            color: $white;
            border-bottom-color: $blue;
        }
    }
}

.tab-content {
    border: 2px solid $black;
    border-radius: 3px;
    padding: 15px;
}
//揪團卡片頁籤-start

.member-activity-btns {
    display: flex;
    gap: 20px;
    margin-left: 20px;
    margin-bottom: 20px;
    align-items: center;
flex-wrap: wrap;
    button {
        border: 1px solid black;
        border-radius: 3px;
        padding: 10px;
        cursor: pointer;
        background-color: #b1f0f7;
        color: black;
        transition: all 0.3s;

        &.active {
            background-color: #4f8da8;
            color: white;
        }

    }
    button.select-btn {
        border: 1px solid black;
        border-radius: 3px;
        padding: 9px;
        cursor: pointer;
        background-color: #F5F0CD;
        color: black;
        transition: all 0.3s;
         &:hover{
            background-color: #FFF39C;

         }
       &:active {
 
            background-color: #ADA572;
            color: white;
        }

    }
     @include desktop() {
        border-radius: 6px;
    }
  @include desktop() {
       gap:30px;
    }

}
.activity-items {
    display: flex
;
    gap: 30px;
}
//篩選

 .filter-item {
    display: flex;
    gap: 20px;

     @include desktop() {
        margin-left: auto;    }
     }
//揪團卡片頁籤-end

//行事曆
.activity-card-groups {
    .section-title {
        font-size: $font-size-h3;
    }
}

@media (min-width: 768px) {
    .member-header {
        width: 100%;
        max-width: 1200px;
        border-radius: 6px;
        margin: 0 auto 100px;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        padding: 50px;

        .member-details {
            display: flex;
            align-items: center;
            gap: 60px;
        }

        .button-group {
            flex-direction: column;
            gap: 15px;
            align-items: flex-end;
            background-color: $white;
        }
    }

    .tab-bar {
        justify-content: center;
        gap: 10px;

        button {
            border-radius: 6px 6px 0 0;
            padding: 10px 15px;
            width: 250px;
        }
    }

    .tab-content {
        width: 100%;
        max-width: 1200px;
        margin: auto;
        padding: 50px;
    }

    .activity-card-groups {
        display: flex;
        justify-content: space-around;
        align-items: center;
        text-align: center;
        .activity-card-list {
            display: flex;
        }
    }

    .article-img {
        display: flex;
        width: 100%;
        height: auto;
        overflow: hidden;
        max-width: 285px;
        max-height: 190px;
        flex-direction: column;
    }

    .article-item[data-v-4ead1c86] {
        gap: 20px;
        display: flex;
        justify-items: start;
        flex-direction: row;
        align-items: center;
    }

    .member-activity-card-section {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 40px;
    }

    .rate{
        display: flex;
        justify-content: center;
        gap: 10px;
    }
}
</style>
