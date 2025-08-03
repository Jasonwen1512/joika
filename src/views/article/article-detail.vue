<script setup>
import { ref , computed } from "vue";

import { useRoute } from 'vue-router'
import { articleList } from "@/assets/data/fake-article";
import Button from "@/components/Button.vue";
import DeleteIcon from "@/assets/img/icon/delete.svg";
import SmEditIcon from "@/assets/img/icon/sm-edit.svg";
import konanImage from '@/assets/img/article/movie_konan.jpg';
import reprot from '@/assets/img/icon/errorred.svg?url';
import like from '@/assets/img/icon/likeicon.svg?url';
import commenticon from '@/assets/img/icon/commenticon.svg?url';
const route = useRoute()
const postid = route.params.postid
const article = articleList.find(item => item.postid === postid)


//分類顏色
  const EventColorMap = {
  "登山": "#6DE1D2",
  "水上活動": "#77BEF0",
  "運動": "#FFD63A",
  "露營": "#FF8C86",
  "唱歌": "#FFA955",
  "展覽": "#6DE1D2",
  "聚餐": "#77BEF0",
  "桌遊": "#FFD63A",
  "電影": "#FF8C86",
  "手作": "#FFA955",
  "文化體驗": "#6DE1D2",
  "演出表演": "#77BEF0",
  "其他": "#969696"
};
const GetEventColor = (eventName) => {
  return EventColorMap[eventName] || '#adb5bd';
};

//下方留言區

const comments = ref([
  {
    userid: 'M0001',
    author: 'SunnyDive',
    avatar: 'https://i.pravatar.cc/150?u=sunnydive', // 假頭像，每次刷新會變
    timestamp: '2025/07/07 18:45',
    content: '我們那天也在那欸哈哈～真的超美！Joika平台揪團越來越專業了！',
    likenum: 0,

  },
  {
    userid: 'M0002',
    author: 'kelly_travel',
    avatar: 'https://i.pravatar.cc/150?u=kellytravel',
    timestamp: '2025/07/07 20:13',
    content: '哇我也有看到這團但沒報名到 QAQ 希望下次還有類似的！',
    likenum: 0,
  },
  {
    userid: 'M0003',
    author: 'ocean_rookie',
    avatar: 'https://i.pravatar.cc/150?u=oceanrookie',
    timestamp: '2025/07/08 09:07',
    content: '我是這團的其中一員！很開心認識大家～謝謝你分享這段回憶❤️',
    likenum: 0,
  },
    {
    id: 4,
    author: 'sandy_test',
    avatar: 'https://i.pravatar.cc/150?u=sandy_test',
    timestamp: '2025/07/07 09:30',
    content: '有誰也有跟過嗎?好奇其他人的想法?',
    likenum: 0,
  }

]);

// 用於雙向綁定留言輸入框的內容
const newComment = ref('');

// 處理發送留言的函式 (目前只在 console 中印出)
function postComment() {
  if (!newComment.value.trim()) return; // 如果沒內容就不執行
  console.log('發送留言:', newComment.value);
  alert( newComment.value,'之後會串API到後端  先這樣')
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
//發留言

const DeleteCheck = () =>{
  alert("文章刪除後無法復原，確定要刪除嗎?  (之後會做一個小彈窗 先用這樣)")
}
const likeIt = (index) => {
  const comment = comments.value[index]
  comment.likenum++

  // 觸發動畫
  comment.animateLike = true

  // 動畫播放完後移除 class（確保下次還會動）
  setTimeout(() => {
    comment.animateLike = false
  }, 300) // 和 CSS 動畫時間一致
}

const GoToComment = () =>{
      alert("回覆")

}

const ReportIt = () =>{
      alert("跳檢舉彈窗")

  
}



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
  <Button @click="DeleteCheck" isOutline :suffixIcon="DeleteIcon" theme="secondary" size="sm">刪除</Button>
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
  <!-- 這邊也要串 -->
   <!-- 留言列表區塊 -->
    <div class="comments-list">
      <!-- 使用 v-for 遍歷所有留言 -->
               <div v-for="(comment, index) in comments" :key="comment.id" class="comment">

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
          <p>{{ comment.text }}</p>
          <div class="comment-actions">
            <div class="action-icon like":class="{ animate: comment.animateLike }" @click="likeIt(index)">
              <img :src="like" />
              <p v-if="comment.likenum > 0">{{ comment.likenum }}</p>
            </div>
       
            <div class="action-icon" @click="GoToComment"><img :src="commenticon"></img></div> <!-- TODO: 替換成您的回覆 icon -->
            <div class="action-icon" @click="ReportIt"><img :src="reprot"></img></div> <!-- TODO: 替換成您的檢舉 icon -->
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
        
      </button>
    </div>
 <div class="my-comment">
      <input 
        type="text" 
        v-model="newComment"
        placeholder="留言" 
        class="comment-input"
        @keyup.enter="postComment"
      >
      <button class="send-button" @click="postComment">
        <!-- TODO: 在這裡放入您的紙飛機 icon -->
        <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1566_5695)">
      <path d="M9.59021 17.4098L24 3L9.59021 17.4098ZM24 3L15.4851 26.5797C15.4276 26.7051 15.3354 26.8114 15.2193 26.8859C15.1032 26.9604 14.9681 27 14.8301 27C14.6922 27 14.5571 26.9604 14.441 26.8859C14.3249 26.8114 14.2326 26.7051 14.1751 26.5797L9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3Z" fill="#F5F0CD"/>
      <path d="M9.59021 17.4098L24 3M9.59021 17.4098L14.1751 26.5797C14.2326 26.7051 14.3249 26.8114 14.441 26.8859C14.5571 26.9604 14.6922 27 14.8301 27C14.9681 27 15.1032 26.9604 15.2193 26.8859C15.3354 26.8114 15.4276 26.7051 15.4851 26.5797L24 3M9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_1566_5695">
      <rect width="29" height="30" fill="white"/>
      </clipPath>
      </defs>
      </svg>
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
  margin:10px auto;
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
margin: 10px auto ;

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

.Content{
    margin-bottom: 15vh;
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
    gap:10px;
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
.my-comment {
  background-color: #fff;
  width: 100%;
    padding: 8px 12px;
  border-radius: 3px;
  box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
     display: flex;
    justify-content: space-between;
}
main{
  margin-block: 5vh;
}
.comment-input{
  width: 100%;
}
.send-button{
display: flex;
    text-align: right;
    align-items: center;
}
.action-icon img{
  width: 100%;
}
.like{
  color:#FF8C86;
  display: flex
;
    align-items: center;
    gap: 5px;
}
.action-icon.animate img {
  animation: pop 0.3s ease;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.4); 
    animation: draw-line-1 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

  100% { transform: scale(1); }
}

</style>
