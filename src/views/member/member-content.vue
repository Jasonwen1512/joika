<script setup>
import StarRating from "@/components/StarRating.vue";
import Button from "@/components/Button.vue";
import EditIcon from "@/assets/img/icon/edit.svg";
import NotifyIcon from "@/assets/img/icon/notification.svg";
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useRouter } from "vue-router";
import FullCalendar from "@/components/member/member-content/FullCalendar.vue";
import MemberActivityCard from "@/components/member/member-activity-card.vue";
import memberarticle from "@/components/member/member-post.vue";
import membercomment from "@/components/member/member-comment.vue";
import { logout } from "@/assets/data/authState";
import MemberInterestTag from "@/components/member/member-interest-tag.vue";

// ------------ 會員基本資料 ------------
const member = ref(null);
const pageLoading = ref(true);
const error = ref("");
const router = useRouter();

async function loadMember() {
    pageLoading.value = true;
    error.value = "";

    try {
        const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/users/profile-get.php`,
        { method: "GET", credentials: "include" }
        );

        if (res.status === 401) {
        router.replace("/auth/login");
        return;
        }

        if (!res.ok) throw new Error("伺服器錯誤");

        const data = await res.json();
        member.value = data.data ?? data;
    } catch (err) {
        error.value = err.message;
    } finally {
        pageLoading.value = false;
    }
}

const avatarUrl = computed(() => {
    const base = import.meta.env.VITE_API_BASE;
    const avatar = member.value?.MEMBER_AVATAR;
    if (!avatar) return "";
    return `${base.replace(/\/$/, "")}/upload/member/${encodeURIComponent(
        avatar
    )}`;
});

// ------------ RWD 卡片顯示張數 ------------
const visibleCount = ref(2); // 桌機 2、手機 1
const buttonSize = ref("lg");
const handleResize = () => {
    visibleCount.value = window.innerWidth < 768 ? 1 : 2;
    buttonSize.value = window.innerWidth < 768 ? "sm" : "lg";
};

// ------------ Tabs 狀態 ------------
const currentTab = ref("group");
const currentSubTab = ref("my-activity"); // my-activity | my-follow-activity | my-activity-collection

// ------------ 揪團清單（接後端 API） ------------
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

// 各子分頁的資料
const activitiesHosted = ref([]);       // 我開的
const activitiesJoined = ref([]);       // 我參與
const activitiesCollection = ref([]);   // 我的收藏
const activitiesAll = ref([]);

// 載入與錯誤
const activitiesLoading = ref(false);
const activitiesError = ref("");

// 後端欄位轉前端卡片欄位
function mapActivity(row) {
    return {
        activity_no: row.ACTIVITY_NO,
        activity_name: row.ACTIVITY_NAME,
        activity_img: `${API_BASE}${row.ACTIVITY_IMG}`,
        activity_status: row.ACTIVITY_STATUS,
        activity_description: row.ACTIVITY_DESCRIPTION,
        activity_start_at: row.ACTIVITY_START_AT,
        activity_start_txt: row.ACTIVITY_START_TXT,
        role: row.role,
    };
}

// 抓資料
async function fetchActivities(type, { limit = 60, offset = 0 } = {}) {
    activitiesLoading.value = true;
    activitiesError.value = "";
    try {
        const u = new URL(`${API_BASE}/users/activity-get.php`);
        u.searchParams.set("type", type);
        u.searchParams.set("limit", String(limit));
        u.searchParams.set("offset", String(offset));

        const res = await fetch(u.toString(), {
        method: "GET",
        credentials: "include",
        });

        if (res.status === 401) {
        router.replace("/auth/login");
        return;
        }
        if (!res.ok) throw new Error("伺服器錯誤");

        const json = await res.json();
        if (json.code !== "0000") throw new Error(json.msg || "讀取失敗");

        const list = (json.data?.items || []).map(mapActivity);

        if (type === "hosted") activitiesHosted.value = list;
        else if (type === "joined") activitiesJoined.value = list;
        else if (type === "collection") activitiesCollection.value = list;
        else if (type === "all") activitiesAll.value = list;
    } catch (err) {
        activitiesError.value = err.message || String(err);
    } finally {
        activitiesLoading.value = false;
    }
}



// 子分頁對應 API type
const subtabToType = {
    "my-activity": "hosted",
    "my-follow-activity": "joined",
    "my-activity-collection": "collection",
    };

// 目前分頁要顯示的清單
const activitiesByTab = computed(() => {
    if (currentSubTab.value === "my-activity") return activitiesHosted.value;
    if (currentSubTab.value === "my-follow-activity") return activitiesJoined.value;
    if (currentSubTab.value === "my-activity-collection")
        return activitiesCollection.value;
    return [];
});

// 狀態篩選
const selectedStatus = ref(""); // "開團中" | "審核中" | "已完成" | "已取消"
const isFilterVisible = ref(false);
const filteredActivities = computed(() => {
    const list = activitiesByTab.value;
    if (!selectedStatus.value) return list;
    return list.filter((a) => a.activity_status === selectedStatus.value);
});


const openActivities = computed(() =>
    activitiesAll.value.filter(a => a.activity_status === "開團中")
);

const visibleActivities = computed(() =>
openActivities.value.slice(0, visibleCount.value) // 預設 visibleCount=2
);


// ------------ 登出 ------------
const logoutLoading = ref(false);
const handleLogout = async () => {
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
};

// ------------ 生命週期 ------------
onMounted(async () => {
    handleResize();
    window.addEventListener("resize", handleResize);
    await loadMember();
    // 預設載入「我開的揪團」
        await fetchActivities("hosted");
        await fetchActivities("all");

});

onBeforeUnmount(() => {
window.removeEventListener("resize", handleResize);
});

// 切換子分頁時，如果尚未有資料再抓
watch(currentSubTab, async (tab) => {
const type = subtabToType[tab];
if (!type) return;
const hasData =
    (type === "hosted" && activitiesHosted.value.length > 0) ||
    (type === "joined" && activitiesJoined.value.length > 0) ||
    (type === "collection" && activitiesCollection.value.length > 0);
if (!hasData) await fetchActivities(type);
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
                                :score="member.hostAvg"
                                :count="member.HOST_COUNT_TOTAL"
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
                        <MemberInterestTag
                            v-if="member && (member.MEMBER_ID ?? member.member_id)"
                            :member-id="String(member.MEMBER_ID ?? member.member_id)"
                        />
                        </div>
                    </div>
                </div>

                <div class="button-group">
                    <RouterLink :to="`member-notify`">
                        <Button :prefixIcon="NotifyIcon" :size="buttonSize" theme="primary">通知訊息</Button>
                    </RouterLink>

                    <RouterLink :to="{ name: 'profileUpdate' }">
                        <Button :prefixIcon="EditIcon" :size="buttonSize" theme="info">編輯檔案</Button>
                    </RouterLink>

                    <Button isOutline theme="secondary" :size="buttonSize" @click="handleLogout">
                        {{ logoutLoading ? '登出中…' : '登出' }}
                    </Button>
                </div>
            </div>

            <div class="member-body">
                <div class="tab-bar">
                    <button :class="{ active: currentTab === 'group' }" @click="currentTab = 'group'">揪團</button>
                    <button :class="{ active: currentTab === 'calendar' }" @click="currentTab = 'calendar'">行事曆</button>
                    <button :class="{ active: currentTab === 'post' }" @click="currentTab = 'post'">貼文</button>
                    <button :class="{ active: currentTab === 'comment' }" @click="currentTab = 'comment'">評論</button>
                </div>

                <div class="tab-content">
                <!-- 揪團 -->
                    <div v-if="currentTab === 'group'">
                        <div class="member-activity-section">
                            <div class="member-activity-btns">
                                <div class="activity-items">
                                    <li>
                                        <button
                                        :class="{ active: currentSubTab === 'my-activity' }"
                                        @click="currentSubTab = 'my-activity'"
                                        >
                                        我開的揪團
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                        :class="{ active: currentSubTab === 'my-follow-activity' }"
                                        @click="currentSubTab = 'my-follow-activity'"
                                        >
                                        參與的揪團
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                        :class="{ active: currentSubTab === 'my-activity-collection' }"
                                        @click="currentSubTab = 'my-activity-collection'"
                                        >
                                        我的收藏
                                        </button>
                                    </li>
                                </div>

                                <div class="filter-item">
                                    <li>
                                        <button class="select-btn" @click="isFilterVisible = !isFilterVisible">篩選</button>
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
                                        <button class="select-btn">排序</button>
                                    </li>
                                </div>
                            </div>

                            <!-- 載入/錯誤/空狀態 -->
                            <div v-if="activitiesLoading">活動載入中…</div>
                            <div v-else-if="activitiesError" style="color:#d33">{{ activitiesError }}</div>
                            <div v-else-if="filteredActivities.length === 0">目前沒有符合條件的活動。</div>

                            <!-- 活動卡片 -->
                            <div v-else class="member-activity-card-section">
                                <MemberActivityCard
                                v-for="activity in filteredActivities"
                                :key="activity.activity_no"
                                :item="activity"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- 行事曆 -->
                    <div v-else-if="currentTab === 'calendar'">
                        <div class="activity-card-groups">
                            <p class="section-title">下一個揪團</p>

                            <!-- 這裡也顯示載入 / 錯誤 / 空 -->
                            <div v-if="activitiesLoading">活動載入中…</div>
                            <div v-else-if="activitiesError" style="color:#d33">{{ activitiesError }}</div>

                            <div class="activity-card-list" v-else>
                                <MemberActivityCard
                                v-for="activity in visibleActivities"
                                :key="activity.activity_no"
                                :item="activity"
                                />
                                <div v-if="visibleActivities.length === 0">
                                <p>目前沒有符合條件的活動。</p>
                                </div>
                            </div>
                        </div>

                        <div class="calerdar">
                        <FullCalendar />
                        </div>
                    </div>

                    <!-- 貼文 -->
                    <div v-else-if="currentTab === 'post'">
                        <memberarticle />
                    </div>

                    <!-- 評論 -->
                    <div v-else-if="currentTab === 'comment'">
                        <!-- 這邊資料串接有問題 因為留言資料裡面沒有對應的文章ID 無法抓取 ，之後要做修正 -->
                        <membercomment />
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
