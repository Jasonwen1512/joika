<script setup>
import { ref , computed } from "vue";

import { useRoute } from 'vue-router'
import { articleList } from "@/assets/data/fake-article";
import Button from "@/components/Button.vue";
import DeleteIcon from "@/assets/img/icon/delete.svg";
import SmEditIcon from "@/assets/img/icon/sm-edit.svg";
import konanImage from '@/assets/img/article/movie_konan.jpg';

const route = useRoute()
const postid = route.params.postid
const article = articleList.find(item => item.postid === postid)


//分類顏色
  const EventColorMap = {
  "登山": "#56DD61",
  "水上活動": "#81BFDA",
  "運動": "#567ADD",
  "露營": "#F05ECC",
  "唱歌": "#FADA7A",
  "展覽": "#FF7F5B",
  "聚餐": "#FFB65D",
  "桌遊": "#F5F0CD",
  "電影": "#B1F0F7",
  "手作": "#DBF964",
  "文化體驗": "#6AF6C5",
  "演出表演": "#EA64FF",
  "其他": "#969696"
};
const GetEventColor = (eventName) => {
  return EventColorMap[eventName] || '#adb5bd';
};

//下方留言區

const comments = ref([
  {
    id: 1,
    author: 'SunnyDive',
    avatar: 'https://i.pravatar.cc/150?u=sunnydive', // 假頭像，每次刷新會變
    timestamp: '2025/07/07 18:45',
    content: '我們那天也在那欸哈哈～真的超美！Joika平台揪團越來越專業了！'
  },
  {
    id: 2,
    author: 'kelly_travel',
    avatar: 'https://i.pravatar.cc/150?u=kellytravel',
    timestamp: '2025/07/07 20:13',
    content: '哇我也有看到這團但沒報名到 QAQ 希望下次還有類似的！'
  },
  {
    id: 3,
    author: 'ocean_rookie',
    avatar: 'https://i.pravatar.cc/150?u=oceanrookie',
    timestamp: '2025/07/08 09:07',
    content: '我是這團的其中一員！很開心認識大家～謝謝你分享這段回憶❤️'
  },
    {
    id: 4,
    author: 'sandy_test',
    avatar: 'https://i.pravatar.cc/150?u=sandy_test',
    timestamp: '2025/07/07 09:30',
    content: '有誰也有跟過嗎?好奇其他人的想法?'
  }

]);

// 用於雙向綁定留言輸入框的內容
const newComment = ref('');

// 處理發送留言的函式 (目前只在 console 中印出)
function postComment() {
  if (!newComment.value.trim()) return; // 如果沒內容就不執行
  console.log('發送留言:', newComment.value);
  // 在實際應用中，這裡會呼叫 API 將留言送到後端
  newComment.value = ''; // 發送後清空輸入框
}

//留言分頁
// --- [新增] 留言區分頁的專用邏輯 ---

// 定義每頁顯示幾則留言
const COMMENTS_PER_PAGE = 3;

// [新增] 留言區的當前頁碼狀態
const currentCommentPage = ref(1);

// [改造] 計算留言的總頁數
const totalCommentPages = computed(() => {
  return Math.ceil(comments.value.length / COMMENTS_PER_PAGE);
});

// [新增/核心] 計算出「當前頁面應該顯示的留言」
// 這會根據 currentCommentPage 的變化，自動從完整的 comments 陣列中「切」出對應的部分
const paginatedComments = computed(() => {
  const startIndex = (currentCommentPage.value - 1) * COMMENTS_PER_PAGE;
  const endIndex = startIndex + COMMENTS_PER_PAGE;
  return comments.value.slice(startIndex, endIndex);
});

// [改造] 產生留言區的分頁數字列表 (沿用您之前的聰明邏輯)
const commentPaginationList = computed(() => {
  const pages = [];
  const total = totalCommentPages.value;
  const current = currentCommentPage.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 1 && i < total) pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
  }
  return pages;
});

// [改造] 留言區的分頁導覽函式
function goToCommentPage(page) {
  if (page >= 1 && page <= totalCommentPages.value) {
    currentCommentPage.value = page;
  }
}

function goToPreviousCommentPage() {
  goToCommentPage(currentCommentPage.value - 1);
}

function goToNextCommentPage() {
  goToCommentPage(currentCommentPage.value + 1);
}

// [改造] 判斷是否為第一頁或最後一頁
const isFirstCommentPage = computed(() => currentCommentPage.value === 1);
const isLastCommentPage = computed(() => currentCommentPage.value === totalCommentPages.value)


</script>

<template>
  <div>
  <!-- <img class="bg-img2" src="/src/assets/img/bg-decorate2.png" alt="背景圖藍">
  <img class="bg-img3" src="/src/assets/img/bg-decorate3.png" alt="背景圖黃"> -->
  </div>

<main>
  <section class="author-information">
    <!-- 這邊之後要串會員資料頭像與名稱  先暫時寫死 -->
<div class="avatar">
  <img class="avatar-img" src="/src/assets/img/member/headshot.jpg" alt="Member Headshot">
  
  <p>{{ article.userid }}</p>
</div>
    <div class="btn-list">
  <Button :suffixIcon="SmEditIcon" theme="info" size="sm">編輯</Button>  
  <Button isOutline :suffixIcon="DeleteIcon" theme="secondary" size="sm">刪除</Button>
    </div>
  </section>
  <section class="Content">
    <div class="article" v-if="article">
      <h3>{{ article.title }}</h3>
      <div class="article-head">   
        <span  class="event-label"  :style="{ borderColor: GetEventColor(article.event), }">{{ article.event }}</span> 
        <p>{{ article.date }}</p>
      </div>
      <div class="article-img">
  <img :src="article.image" alt="文章圖片" />
</div>
      <p v-html="article.content" alt="內文"></p>
    </div>
    <div v-else>
      <p>找不到這篇文章。</p>
    </div>
</section>
<section class="Comment">
  <!-- 這邊也要串 先寫死 -->
   <!-- 留言列表區塊 -->
    <div class="comments-list">
      <!-- 使用 v-for 遍歷所有留言 -->
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-content">
       
          <!-- 頭像 -->
          
          <!-- 右側內容 (使用者資訊 + 留言文字) -->
          <div class="comment-details">
            <div class="comment-header">          
              <img :src="comment.avatar" alt="用戶頭像" class="comment-avatar">
              <span class="author-name">{{ comment.author }}</span>
              <span class="timestamp">{{ comment.timestamp }}</span>
            </div> <div class="comment-text">
            <p> {{ comment.content }} </p>
          </div>
        </div>
        
        <!-- 留言互動按鈕 (讚、回覆、檢舉) -->
        <div class="comment-actions">
          <div class="action-icon">👍</div> <!-- TODO: 替換成您的按讚 icon -->
          <div class="action-icon">💬</div> <!-- TODO: 替換成您的回覆 icon -->
          <div class="action-icon">⚠️</div> <!-- TODO: 替換成您的檢舉 icon -->
        </div>

        <hr class="separator">
      </div>
    </div> 
  </div>  
    <div class="comments-list">
      <div v-for="comment in paginatedComments" :key="comment.id" class="comment-item">
      </div>
    </div> 

    <div class="pagination">
   
      <button class="pre" @click="goToPreviousCommentPage" :disabled="isFirstCommentPage">
        <
      </button>

      <button
        class="page"
        v-for="(page, index) in commentPaginationList"
        :key="index"
        @click="typeof page === 'number' && goToCommentPage(page)"
        :disabled="page === '...'"
        :class="{ active: currentCommentPage === page }"
      >
        {{ page }}
      </button>

      <button class="next" @click="goToNextCommentPage" :disabled="isLastCommentPage">
        >
      </button>
    </div>

</section>
  </main>
</template>

<style scoped lang="scss">
body{
  position: relative;
}

.bg-img3{
    position: absolute;
    bottom: -50vh;
    right: 0;
    width: 15%;
    height: auto;
    z-index: -999;
}
.bg-img2[data-v-fd3376ce] {
    position: absolute;
    top: 45vh;
    left: 0;
    width: 15%;
    z-index: -999;
}
main{
  max-width: 1200px;
  margin:auto;
  padding: 20px;
}

.author-information {
    display: flex
;
    justify-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: flex-end;
    justify-content: space-between;
    align-items: center;
}


.avatar{
    display: flex;
    gap: 10px;
    align-items: center;
}

.avatar-img ,.comment-avatar{
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.btn-list{
  display: flex;
gap: 10px;
}

.article{
max-width: 1200px;
margin: 10px auto;
display: flex;
  flex-direction: column; 
  gap: 10px;

}
.article-head {
    display: flex;
    align-items: center;
    padding-block: 5px;
}
.event-label {
    text-align: center;
    padding: 5px;
    margin: 5px;
    border: solid 3px;
    border-radius: 6px;
    width: 80px;
}
.article-img img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}
.comment-content{
  display: grid;
  gap:20px;
  margin-block: 30px;
}
.comment-header {
    gap: 10px;
    display: flex
;
    align-items: center;
    padding-block: 10px;
}
.timestamp {
  display: block;
  text-align: right;
}
.comment-actions{
  display: flex;
    justify-content: flex-end;
    flex-wrap: nowrap;
}

.pagination {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 5vh;
 }
  .page {
    border: #4f8da8 2px solid;
    border-radius: 6px;
    padding: 5px 10px;
    background: #ffffff;
    cursor: pointer;
    color: #4f8da8;

    &.active {
      background: #81bfda;
      color: #000;
    }
 
}
</style>
