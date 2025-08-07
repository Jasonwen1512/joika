<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import { articleList } from "@/assets/data/fake-article"; //引入文章假資料
import MemberActivityCard from "@/components/member/member-activity-card.vue";

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

//靜態資料 留言 之後要串
const comments = ref([
    {
        userid: "M0001",
        author: "SunnyDive",
        avatar: "https://i.pravatar.cc/150?u=sunnydive", // 假頭像，每次刷新會變
        timestamp: "2025/07/07 18:45",
        content: "我們那天也在那欸哈哈～真的超美！Joika平台揪團越來越專業了！",
    },
    {
        userid: "M0002",
        author: "kelly_travel",
        avatar: "https://i.pravatar.cc/150?u=kellytravel",
        timestamp: "2025/07/07 20:13",
        content: "哇我也有看到這團但沒報名到 QAQ 希望下次還有類似的！",
    },
    {
        userid: "M0003",
        author: "ocean_rookie",
        avatar: "https://i.pravatar.cc/150?u=oceanrookie",
        timestamp: "2025/07/08 09:07",
        content: "我是這團的其中一員！很開心認識大家～謝謝你分享這段回憶❤️",
    },
    {
        userid: "M0004",
        author: "sandy_test",
        avatar: "https://i.pravatar.cc/150?u=sandy_test",
        timestamp: "2025/07/07 09:30",
        content: "有誰也有跟過嗎?好奇其他人的想法?",
    },
]);

//抓顏色
const GetEventColor = (eventName) => {
    return eventColorMap[eventName] || "#adb5bd";
};

// 後續抓會員ID用  用於抓到該會員的揪團與文章
// 現在先假設是M0001
const route = useRoute();
// const currentUserId = route.params.userid;
const currentUserId = "M0002";

const FilteredArticles = computed(() => {
    // 依照該會員的 userid 篩選
    const filtered = articleList.filter((a) => a.userid === currentUserId);

    // 排序：由新到舊
    return filtered.slice().sort((a, b) => {
        const ReformatDate = (dateString) => {
            const parts = dateString.trim().split(" ");
            const timeStr = parts[1];
            const indicator = timeStr.substring(0, 2); // AM / PM
            const time = timeStr.substring(2);
            const standardFormat = `${parts[0]} ${time} ${indicator}`;
            return new Date(standardFormat);
        };

        return ReformatDate(b.date) - ReformatDate(a.date);
    });
});
const visibleCount = ref(2); // 預設電腦是 2 張
</script>
<template>
    <section class="article-list">
        <div
            v-for="(article, index) in FilteredArticles"
            :key="article.postid"
            class="article-item"
        >
            <div class="article-img">
                <img
                    :src="article.image"
                    :alt="article.title"
                />
            </div>
            <router-link
                :to="`/article/${article.postid}`"
                class="article-text-link"
            >
                <div class="article-text">
                    <div class="articleHeader">
                        <div class="article-date">
                            <span
                                class="event-label"
                                :style="{
                                    borderColor: GetEventColor(article.event),
                                }"
                            >
                                {{ article.event }}
                            </span>
                            <p>{{ article.date }}</p>
                        </div>
                        <div class="article-title">
                            <h3>{{ article.title }}</h3>
                        </div>
                    </div>
                    <div class="article-body">
                        <p v-html="article.content"></p>
                    </div>
                </div>
            </router-link>
            <hr />
        </div>
        <div v-if="FilteredArticles.length === 0">
            <p>這位會員目前尚未發表留言。</p>
        </div>
    </section>
</template>
<style scoped lang="scss">
.article-item {
    display: flex;
    justify-items: start;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    @include desktop() {
        flex-direction: row;
    }
}

.article-date {
    display: flex;
    gap: 10px;
    align-items: center;
}
.article-img {
    display: flex;
    width: 100%;
    height: auto;
    overflow: hidden;

    flex-direction: column;
    @include desktop() {
        max-width: 285px;
        max-height: 190px;
    }
}
// .article-img img{
//   width: 100%;

// }
//文章只顯示2行
.article-body p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;

    -webkit-box-orient: vertical;
}

.article-text {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 20px;
}
.event-label {
    text-align: center;
    padding: 2px;
    margin: 2px;
    border: solid 3px;
    border-radius: 6px;
    width: 80px;
}
.article-title {
    padding-block: 5px;
}
//取消 router預設的click樣式
.router-link-active,
.router-link-exact-active,
.article-text-link {
    text-decoration: none;
    color: inherit;
}
</style>
