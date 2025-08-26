<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Button from "@/components/Button.vue";

const router = useRouter();
const route = useRoute();

// 活動 ID：路由參數優先，沒有就先用預設
const activityId = route.params.id ?? "ACT00001";

// 後端 API base
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

// UI 狀態
const activeTab = ref("list"); // 'list' | 'applying'
const loading = ref(false);
const error = ref("");

// 由 API 取得的資料
const memberList = ref([]);  // 已參加（approved）
const pendingList = ref([]); // 申請中（pending）
const pendingLoaded = ref(false); // 是否已載入過申請中

const DEFAULT_AVATAR = "/img/default-avatar.png";

// 後端回傳欄位 → 映射到卡片顯示欄位
function mapRowToCard(row) {
    return {
        userid: String(row.member_id),
        name: row.MEMBER_NICKNAME || "匿名",
        image: row.MEMBER_AVATAR || DEFAULT_AVATAR,
        rating: Number(row.rating ?? 0),       // 後端已算好
        reviews: Number(row.reviews ?? 0),     // 後端已算好
        location: row.MEMBER_CITY_NAME || "—",
        age: row.AGE ?? "—",                   // 後端用 TIMESTAMPDIFF 算好
        occupation: row.MEMBER_OCCUPATION_NAME || "—",
    };
}

// 叫後端 API 取得成員
async function fetchMembers(status /* 'approved' | 'pending' */) {
    const u = new URL(`${API_BASE}/users/joind-member.php`);
    u.searchParams.set("activity_no", activityId);
    u.searchParams.set("status", status);
    try {
        const res = await fetch(u.toString(), {
        method: "GET",
        credentials: "include", // ✅ 一定要帶 session cookie
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
    await fetchMembers("approved");
    loading.value = false;
    });

// 切到「申請中」才去抓 pending（只抓一次）
watch(activeTab, async (tab) => {
    if (tab === "applying" && !pendingLoaded.value) {
        loading.value = true;
        await fetchMembers("pending");
        loading.value = false;
    }
});

// ====== 你原本的接受/拒絕（先保留前端移動；之後再改成呼叫審核 API） ======
function handleAccept(userId) {
    const idx = pendingList.value.findIndex((u) => u.userid === userId);
    if (idx === -1) return;
    const [accepted] = pendingList.value.splice(idx, 1);
    memberList.value.push(accepted);
}
function handleReject(userId) {
    const idx = pendingList.value.findIndex((u) => u.userid === userId);
    if (idx === -1) return;
    pendingList.value.splice(idx, 1);
}

function backbtn() { router.back(); }
function gotoActivity() { router.push(`/activity/${activityId}`); }
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
            <li>
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
                            <div class="name">{{ member.name }}</div>
                            <div class="rating-line">
                                <div class="stars stars-blue">
                                    <i
                                        v-for="n in 5"
                                        :key="n"
                                        :class="
                                            n <= Math.round(member.rating)
                                                ? 'fa-solid fa-star'
                                                : 'fa-regular fa-star'
                                        "
                                    ></i>
                                </div>
                                <span
                                    >{{ member.rating.toFixed(1) }}({{
                                        member.reviews
                                    }})</span
                                >
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
                                    <div class="stars stars-blue">
                                        <i
                                            v-for="n in 5"
                                            :key="n"
                                            :class="
                                                n <= Math.round(member.rating)
                                                    ? 'fa-solid fa-star'
                                                    : 'fa-regular fa-star'
                                            "
                                        ></i>
                                    </div>
                                    <span
                                        >{{ member.rating.toFixed(1) }}({{
                                            member.reviews
                                        }})</span
                                    >
                                </div>
                                <div class="details">
                                    {{ member.location }} | {{ member.age }}歲 |
                                    {{ member.occupation }}
                                </div>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <Button
                                theme="primary"
                                size="sm"
                                class="approve-btn"
                                @click="handleAccept(member.userid)"
                                >接受</Button
                            >
                            <Button
                                theme="secondary"
                                isOutline="true"
                                size="sm"
                                class="reject-btn"
                                @click="handleReject(member.userid)"
                                >拒絕</Button
                            >
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
.rating-line {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1rem;
}

.stars {
    display: flex;
    gap: 4px; /* 星星之間的間距 */
    font-size: 16px; /* 星星的大小 */

    /* 控制空心星星的顏色 */
    .fa-regular {
        color: #dcdcdc;
    }
}

/* 控制藍色實心星星的顏色 */
.stars-blue .fa-solid {
    color: #5ea8a8; /* 沿用前一份元件的藍色，確保視覺統一 */
}

.details {
    color: #333;
    font-size: 1rem;
}

.placeholder-text {
    text-align: center;
    color: #888;
    padding-top: 50px;
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
