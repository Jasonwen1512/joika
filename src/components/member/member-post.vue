<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import FullCalendar from "@/components/member/member-content/FullCalendar.vue";
import MemberActivityCard from "@/components/member/member-activity-card.vue";
import axios from "axios"; // <-- 新增 axio
// 後續抓會員ID用  用於抓到該會員的揪團與文章
// 現在先假設是M0001
// const route = useRoute();
const articleList = ref([]); // 加在最上面
// const currentUserId = route.params.userid;
const currentUserId = "1";
const GetEventColor = (eventName) => {
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

  return eventColorMap[eventName] || "#adb5bd";
};
onMounted(async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE}/posts/list.php`
    );
    const dataFromApi = response.data;
    if (Array.isArray(dataFromApi)) {
      articleList.value = dataFromApi
        .filter((post) => post.MEMBER_ID === currentUserId) // 只取指定會員
        .map((post) => {
          const backendImagePath = post.POST_IMG || "";
          const cleanedPath = backendImagePath.replace(/^\.\.\//, "");
          const fullImageUrl = `${
            import.meta.env.VITE_API_BASE
          }/${cleanedPath}`;
          return {
            postid: post.POST_NO,
            title: post.POST_TITLE,
            content: post.POST_CONTENT,
            image: fullImageUrl,
            date: post.CREATED_AT,
            event: getCategoryName(post.CATEGORY_NO),
          };
        });
    }
  } catch (error) {
    console.error("從後端 API 抓取文章資料失敗:", error);
    if (error.response) {
      console.error("伺服器狀態碼:", error.response.status);
      console.error("伺服器回應:", error.response.data);
    }
  }
});

const FilteredArticles = computed(() => {
  // 這裡已經在 onMounted 篩選過了，可以直接用 articleList.value
  return articleList.value
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
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
        <img :src="article.image" :alt="article.title" />
      </div>
      <router-link :to="`/article/${article.postid}`" class="article-text-link">
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
      <p>這位會員目前尚未發表文章。</p>
    </div>
  </section>
</template>
<style scoped lang="scss">
//這邊開始是文章樣式

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
