<script setup>
// ✅ 匯入要用到的全部東西
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Button from "@/components/Button.vue";
import StarRating from "@/components/StarRating.vue";

// 路由 / Router
const router = useRouter();
const route = useRoute();

// ✅ 支援 params 或 query 帶活動編號
// 例：/front/member/member-list/ACT00001  或  ?activity_no=ACT00001
const activityId = computed(() =>
    String(route.params.id || route.query.activity_no || route.query.id || "")
);

// 後端 API base
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

// UI 狀態
const activeTab = ref("list"); // 'list' | 'applying'
const loading = ref(false);
const error = ref("");

// 資料
const memberList = ref([]);   // 已參加（approved）
const pendingList = ref([]);  // 申請中（pending）
const pendingLoaded = ref(false);
const canReview = ref(false);


// 後端 → 前端卡片映射
function mapRowToCard(row) {
    const avatar = `${API_BASE}/upload/member/${row.MEMBER_AVATAR}`;
    return {
        role: row.role,
        userid: String(row.member_id),
        name: row.MEMBER_NICKNAME ,
        image: avatar,
        rating: Number(row.rating ?? 0),
        reviews: Number(row.reviews ?? 0),
        location: row.MEMBER_CITY_NAME || "—",
        age: row.AGE ?? "—",
        occupation: row.MEMBER_OCCUPATION_NAME || "—",
    };
}

// 查權限：只有主揪可審核
async function checkPermission() {
    if (!activityId.value) { canReview.value = false; return; }
    try {
        const u = new URL(`${API_BASE}/users/activity-permission.php`);
        u.searchParams.set("activity_no", activityId.value);
        const res = await fetch(u.toString(), { credentials: "include" });
        const data = await res.json();
        canReview.value = data?.code === "0000" && !!data?.is_host;
    } catch {
        canReview.value = false;
    }
}

// 抓資料（已參加／申請中）
async function fetchMembers(status /* 'approved' | 'pending' */) {
  if (!activityId.value) {
    error.value = "缺少活動編號，無法載入團員列表";
    if (status === "approved") memberList.value = [];
    else pendingList.value = [];
    return;
  }
  const u = new URL(`${API_BASE}/users/joind-member.php`);
  u.searchParams.set("activity_no", activityId.value);
  u.searchParams.set("status", status);
  try {
    const res = await fetch(u.toString(), {
      method: "GET",
      credentials: "include", // ✅ 帶上 PHPSESSID
    });
    const data = await res.json();
    if (!res.ok || data.code !== "0000") {
      throw new Error(data?.msg || `HTTP ${res.status}`);
    }
    const rows = Array.isArray(data.data) ? data.data : [];
    const cards = rows.map(mapRowToCard);
    if (status === "approved") {
      memberList.value = cards;
    } else {
      pendingList.value = cards;
      pendingLoaded.value = true;
    }
  } catch (e) {
    console.error(e);
    error.value = e.message || "載入失敗";
    if (status === "approved") memberList.value = [];
    else pendingList.value = [];
  }
}

// 首次載入：先抓「已參加」
onMounted(async () => {
  loading.value = true;
  error.value = "";
  await checkPermission();
  await fetchMembers("approved");
  loading.value = false;
});

// 切到「申請中」再抓 pending（且必須是主揪）
watch(activeTab, async (tab) => {
    if (tab === "applying" && canReview.value && !pendingLoaded.value) {
        loading.value = true;
        await fetchMembers("pending");
        loading.value = false;
    }
});

// 切到不同活動時，重查權限與名單
watch(activityId, async (id, old) => {
    if (!id || id === old) return;
    pendingLoaded.value = false;
    loading.value = true;
    await checkPermission();
    await fetchMembers("approved");
    if (activeTab.value === "applying" && canReview.value) {
        await fetchMembers("pending");
    }
    loading.value = false;
});
async function handleAccept(userId) {
    try {
        const res = await fetch(`${API_BASE}/users/joiner-review.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            activity_no: activityId.value,
            participant_id: userId,
            action: "accept"
        })
        });
        const data = await res.json();
        if (data.code === "0000") {
        // 從 pending 移到已參加
        const idx = pendingList.value.findIndex(u => u.userid === userId);
        if (idx > -1) {
            const [accepted] = pendingList.value.splice(idx, 1);
            memberList.value.push(accepted);
        }
        } else {
        alert("接受失敗: " + data.msg);
        }
    } catch (e) {
        alert("API error: " + e.message);
    }
}

async function handleReject(userId) {
    try {
        const res = await fetch(`${API_BASE}/users/joiner-review.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            activity_no: activityId.value,
            participant_id: userId,
            action: "delete"
        })
        });
        const data = await res.json();
        if (data.code === "0000") {
        // 從列表移除
        const idx = pendingList.value.findIndex(u => u.userid === userId);
        if (idx > -1) pendingList.value.splice(idx, 1);
        // 若你也允許刪「已參加」的，記得把 memberList 也找找看
        } else {
        alert("刪除失敗: " + data.msg);
        }
    } catch (e) {
        alert("API error: " + e.message);
    }
}


// 導航
function backbtn() { router.back(); }
function gotoActivity() { router.push(`/activity/${activityId.value}`); }
</script>



<template>
    <div class="member-tabs">
        <ul class="tab-header">
            <li>
                <button
                    :class="{ active: activeTab === 'list' }"
                    @click="activeTab = 'list'"
                >
                    <h3>團員列表</h3>
                </button>
            </li>
            <li v-if="canReview">
                <button
                    :class="{ active: activeTab === 'applying' }"
                    @click="activeTab = 'applying'"
                >
                    <h3>申請中</h3>
                </button>
            </li>
        </ul>
        <div class="tab-body">
            <div
                v-show="activeTab === 'list'"
                class="tab-content"
            >
                <div
                    v-for="member in memberList"
                    :key="member.userid"
                    class="member-item"
                >
                    <div class="member-info">
                        <img
                            :src="member.image"
                            :alt="member.name"
                            class="profile-image"
                        />
                        <div class="member-text">
                            <div class="name">
                                {{ member.name }}
                                <span v-if="member.role === 'host'" class="role-badge">(主揪)</span>
                            </div>
                            <div class="rating-line">
                                <StarRating
                                    :score="member.rating"
                                    :count="member.reviews"
                                    :color="member.role === 'host' ? 'yellow' : 'blue'"
                                    showScore
                                    class="score"
                                />
                            </div>
                            <div class="details">
                                {{ member.location }} | {{ member.age }}歲 |
                                {{ member.occupation }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-show="activeTab === 'applying'"
                class="tab-content"
            >
                <div v-if="pendingList.length === 0">
                    <p class="placeholder-text">目前沒有待審核的申請</p>
                </div>

                <!-- 
                    v-else 條件：
                    - 如果 pendingList 陣列的長度不為 0 (有人申請)，就顯示這個區塊
                -->
                <div v-else>
                    <!-- 我們重用 member-item 的結構來顯示申請者資訊 -->
                    <div
                        v-for="member in pendingList"
                        :key="member.userid"
                        class="member-item"
                    >
                        <div class="member-info">
                            <img
                                :src="member.image"
                                :alt="member.name"
                                class="profile-image"
                            />

                            <div class="member-text">
                                <div class="name">{{ member.name }}</div>
                                <div class="rating-line">
                                    <StarRating
                                    :score="member.rating"
                                    :count="member.reviews"
                                    color="blue"
                                    showScore
                                    class="score"
                                />
                                </div>
                                <div class="details">
                                    {{ member.location }} | {{ member.age }}歲 |
                                    {{ member.occupation }}
                                </div>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <template v-if="canReview">
                                <Button 
                                    theme="primary" size="sm" class="approve-btn" 
                                    @click="handleAccept(member.userid)">接受
                                </Button>
                                <Button 
                                    theme="secondary" :isOutline="true" size="sm" class="reject-btn" @click="handleReject(member.userid)">拒絕</Button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-list">
            <Button
                theme="info"
                size="sm"
                class="back"
                @click="backbtn"
                >回到會員頁</Button
            >
            <Button
                theme="primary"
                size="sm"
                class="gotoActivity"
                @click="gotoActivity"
                >活動詳細頁</Button
            >
        </div>
    </div>
</template>

<!-- <style> 區塊保持原樣，不需要修改 -->
<style scoped lang="scss">
.btn-list {
    display: flex;
    margin-block: 3vh;
    gap: 20px;
    justify-content: center;
    @include desktop {
        .btn-list {
            justify-content: flex-end;
        }
        Button {
            border-radius: 6px;
        }
    }
}
.member-tabs {
    width: 100%;
    padding: 20px;
    margin: auto;
}

.tab-header {
    display: flex;
    gap: 10px;
    position: relative; /* 為了 z-index */
    z-index: 1; /* 確保頁籤在內容區塊之上 */
    margin-bottom: -2px; /* 向下移動 1px，蓋住下方邊框 */
    button {
        background-color: #f5f0cd;
        border-radius: 3px 3px 0 0;
        border: 2px solid $black;
        padding: 10px 15px;
        cursor: pointer;
        &.active {
            background-color: $blue;
            color: $white;
            border-bottom-color: $blue;
        }
    }
}

.tab-body {
    min-height: 400px;
    line-height: 1.6;
    background-color: #fff;
    border: 2px solid $black;
    border-radius: 3px;
    padding: 15px;
}

.member-item {
    display: flex;
    align-items: center;
    padding: 20px 3vw;
    justify-content: space-between;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    &:not(:last-child) {
        border-bottom: 1px solid #eee;
    }
}
.member-info {
    display: flex;
}
.profile-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
    flex-shrink: 0;
    background-color: #f0f0f0; // 圖片載入失敗時的底色
}

.member-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.name {
    font-size: 1.25rem;
}

.role-badge {
    margin-left: 10px;
    font-size: 14px;
    color: #888;
}

.details {
    color: #333;
    font-size: 1rem;
}

.tab-content {
    max-height: 500px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: $color-secondary #e0f3f8;
}
.tab-content::-webkit-scrollbar {
    width: 8px;
}
.tab-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}
.tab-content::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #81bfda, #4f8da8);
    border-radius: 8px;
}
.action-buttons {
    display: flex;
    gap: 20px;
    flex-direction: row;
    justify-content: flex-end;
}

//桌機版 (樣式保留)
@include desktop {
    .member-tabs {
        width: 70%;
    }

    .tab-header {
        button {
            border-radius: 6px 6px 0 0;
            border: 2px solid $black;
            width: 250px;
            h3 {
                font-size: 24px;
            }
        }
    }

    .member-item {
        flex-direction: row;
    }
    .action-buttons {
        flex-direction: column;
    }
}
@include mobile() {
    .tab-header {
        button {
            h3 {
                font-family: sans-serif;
                font-size: 16px;
            }
        }
    }
}
</style>
