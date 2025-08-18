<script setup>
import StarRating from "@/components/StarRating.vue";
import Button from "@/components/Button.vue";
import EditIcon from "@/assets/img/icon/edit.svg";
import NotifyIcon from "@/assets/img/icon/notification.svg";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from 'vue-router'
import FullCalendar from "@/components/member/member-content/FullCalendar.vue";
import { articleList } from "@/assets/data/fake-article"; //引入文章假資料
import MemberActivityCard from "@/components/member/member-activity-card.vue";
import { FakeActivity } from "@/assets/data/fake-activity";
import memberarticle from "@/components/member/member-post.vue";
import membercomment from "@/components/member/member-comment.vue";
import { authState, isAuthenticated, logout } from '@/assets/data/authState'

//靜態資料 活動類別與標籤顏色
const activities = ["水上活動", "露營", "登山"];

const eventColorMap = {
    //分類顏色

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


const visibleCount = ref(2); // 預設電腦是 2 張

//抓顏色
const GetEventColor = (eventName) => {
    return eventColorMap[eventName] || "#adb5bd";
};
const currentTab = ref("group");

const handleResize = () => {
    visibleCount.value = window.innerWidth < 768 ? 1 : 2;
};

onMounted(() => {
    handleResize(); // 初次判斷
    window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
});


const visibleActivities = computed(() => {
    return openActivities.value.slice(0, visibleCount.value);
});
const currentSubTab = ref("my-activity");
//揪團狀態
const selectedStatus = ref('');
const isFilterVisible = ref(false); // 預設為 false，所以選單是隱藏的
const filteredActivities = computed(() => {
    let activitiesToDisplay = [];
    activitiesToDisplay = FakeActivity;
 // 根據下拉選單的選擇，對上面的列表進行二次篩選
 //這邊目前是抓假資料裡面全部的揪團資訊，之後應該要多加一條篩選成會員ID有在該團才顯示
    if (selectedStatus.value) { // 如果 selectedStatus 有值 (不是空字串)
        return activitiesToDisplay.filter(activity => 
            activity.activity_status === selectedStatus.value
        );
    }
    
    // 如果沒有選擇任何狀態，回傳完整的活動列表
    return activitiesToDisplay;
});
//行事曆
const openActivities = computed(() => {
    return FakeActivity.filter((a) => a.activity_status === "開團中");
});

//登出
const router = useRouter()
const loading = ref(false)

const handleLogout = async () => {
    if (loading.value) return
    loading.value = true
    try {
        await logout()               // 呼叫 /users/logout.php，清掉 PHP session
        // authState.user 會在 logout() 裡被設為 null，UI 會自動變成未登入
        router.replace('/auth/login') // 導回登入頁（用 replace 避免「上一頁」回到會員頁）
    } catch (e) {
        console.error(e)
        alert('登出失敗，稍後再試')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="member-content">
        <div class="member-header">
            <div class="member-details">
                <div class="member-image">
                    <img
                        src="/src/assets/img/member/headshot.jpg"
                        alt="Member Headshot"
                    />
                </div>
                <div class="member-info">
                    <p class="user-name">Amooo.___.</p>
                    <StarRating
                        :score="5.0"
                        :count="3"
                        color="yellow"
                        showScore
                        class="score"
                    />
                    <StarRating
                        :score="4.0"
                        :count="1"
                        color="blue"
                        showScore
                        class="score"
                    />
                    <p class="user-demographics">基隆市 | 29歲 | 社畜</p>
                    <div class="tags">
                        <div
                            v-for="(activity, index) in activities"
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
                <RouterLink :to="`member-notify`"
                    ><Button
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
                    {{ loading ? '登出中…' : '登出' }}
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
                            <MemberActivityCard
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
                                :key="activity.id"
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
}
</style>
