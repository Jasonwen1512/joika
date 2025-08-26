<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import MemberActivityCard from "@/components/member/member-activity-card.vue";

// ✅ 從 .env 抓 API 基底網址（例如 http://localhost/api）
const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "";

/** 分類顏色（沿用你的） */
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
const GetEventColor = (eventName) => eventColorMap[eventName] || "#adb5bd";

// ====== 狀態 ======
const articles = ref([]);         // 從後端撈回並轉好的資料
const loading = ref(false);
const error = ref("");

// （如果你要看別人的頁面再用得到，目前 API 用 session，不需要 userId）
const route = useRoute();
// const currentUserId = route.params.userid;

// ====== 工具：日期格式化（後端回來通常是 "YYYY-MM-DD HH:mm:ss"）======
function formatDate(isoOrSqlDate) {
  // 讓 "YYYY-MM-DD HH:mm:ss" 也能被 Date 抓，替換空白成 "T"
  const d = new Date(isoOrSqlDate.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return isoOrSqlDate;
  const pad = (n) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
}

// ====== 串 API：用 credentials: 'include' 帶 session cookie ======
async function loadArticles() {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch(`${API_BASE}/users/post-comment-get.php`, {
      method: "GET",
      credentials: "include", // 🔴 關鍵：帶上 PHPSESSID
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${txt}`);
    }

    const json = await res.json();
    if (json.code !== "0000" || !Array.isArray(json.data)) {
      throw new Error(json.msg || "資料格式不正確");
    }

    // 從後端欄位 ➜ 映射成前端要的欄位
    // 後端：POST_NO, CATEGORY_NAME, POST_TITLE, CREATED_AT, POST_CONTENT, POST_IMG
    articles.value = json.data.map((row) => ({
      postid: row.POST_NO,                 // ➜ 你的 router-link 用這個
      event: row.CATEGORY_NAME,            // ➜ 類別
      date: formatDate(row.CREATED_AT),    // ➜ 顯示用日期
      title: row.POST_TITLE,
      content: row.POST_CONTENT,           // 你用 v-html，請確認內容來源可信
      image: `${API_BASE}${row.POST_IMG}`,
      // 如果你之後需要 userid 再補
    }));
  } catch (e) {
    console.error(e);
    error.value = e.message || "載入失敗";
  } finally {
    loading.value = false;
  }
}

// 排序（由新到舊）
const SortedArticles = computed(() => {
  return articles.value.slice().sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

onMounted(() => {
  loadArticles();
});
</script>

<template>
  <section class="article-list">
    <!-- 載入/錯誤狀態 -->
    <p v-if="loading">載入中…</p>
    <p v-else-if="error">發生錯誤：{{ error }}</p>

    <!-- 列表 -->
    <div
      v-else
      v-for="(article, index) in SortedArticles"
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
                :style="{ borderColor: GetEventColor(article.event) }"
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
            <!-- 你目前用 v-html，注意 XSS 風險（內容請從可信後端輸出） -->
            <p v-html="article.content"></p>
          </div>
        </div>
      </router-link>

      <hr />
    </div>

    <!-- 空狀態 -->
    <div v-if="!loading && !error && SortedArticles.length === 0">
      <p>你目前尚未發表留言過的文章。</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.article-item {
  margin-bottom: 10px ;
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

/* 文章只顯示2行 */
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

/* 取消 router 預設樣式 */
.router-link-active,
.router-link-exact-active,
.article-text-link {
    text-decoration: none;
    color: inherit;
}
</style>
