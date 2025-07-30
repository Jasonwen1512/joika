<script setup>

import { articleList } from "@/assets/data/fake-article";

import Button from "@/components/Button.vue";
import { ref, computed ,watch} from "vue";
import konanImage from '@/assets/img/article/movie_konan.jpg';
import ArticleDetail from "./article-detail.vue";
import PreIcon from '@/assets/img/icon/pre-arrow.svg?url';
import NextIcon from '@/assets/img/icon/next-arrow.svg?url';

//banner的跑馬燈


const ImageModules = import.meta.glob('@/assets/img/article/banner/*', { eager: true });


function getImageUrl(name) {

  const path = `/src/assets/img/article/banner/${name}`; // <--- 
  return ImageModules[path]?.default || '';
}

  const BaseActivities = [
  { label: "登山", color: "#56DD61", img: getImageUrl("banner_climbing.png") },
  { label: "水上活動", color: "#81BFDA", img: getImageUrl("banner_diving.png") },
  { label: "運動", color: "#567ADD", img: getImageUrl("banner_sports.png") },
  { label: "露營", color: "#F05ECC", img: getImageUrl("banner_camping.png") },
  { label: "唱歌", color: "#FADA7A", img: getImageUrl("banner_sing.png") },
  { label: "展覽", color: "#FF7F5B", img: getImageUrl("banner_exhibition.png") },
  { label: "聚餐", color: "#FFB65D", img: getImageUrl("banner_Dinner.png") },
  { label: "桌遊", color: "#F5F0CD", img: getImageUrl("banner_board_games.png") },
  { label: "電影", color: "#B1F0F7", img: getImageUrl("banner_movie.png") },
  { label: "手作", color: "#DBF964", img: getImageUrl("banner_Handmade.png") },
  { label: "文化體驗", color: "#6AF6C5", img: getImageUrl("banner_culturalHxperience.png") },
  { label: "演出表演", color: "#EA64FF", img: getImageUrl("banner_live.png") },
  { label: "其他", color: "#969696", img: getImageUrl("cpboy.svg") }
];
const activities = [...BaseActivities, ...BaseActivities, ...BaseActivities];

//靜態資料文章分類
const categories = [
  "全部",
  "登山",
"水上活動",
  "運動",
  "露營",
  "唱歌",
  "展覽",
  "聚餐",
  "桌遊",
  "電影",
  "手作",
  "文化體驗",
  "演出表演",
  "其他"
];
//靜態資料-文章內容

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

//  狀態
const ActiveCategory = ref("全部");
const CurrentPage = ref(1); // 預設第 1 頁
const ArticlesPerPage = 4;
//計算文章分類並排序
const FilteredArticles = computed(() => {
  const filtered = (ActiveCategory.value === "全部")
    ? articleList
    : articleList.filter(a => a.event === ActiveCategory.value);
    
  return filtered.slice().sort((a, b) => {
    // 輔助函式：用來將 'YYYY/M/D PMH:MM' 格式重組為 'YYYY/M/D H:MM PM'
    const ReformatDate = (dateString) => {
      // 1. 去掉前後空格，並用空白分割字串
      const parts = dateString.trim().split(' '); // e.g., ["2025/3/15", "PM11:48"]
      
      // 2. 處理時間部分
      const timeStr = parts[1]; // e.g., "PM11:48"
      const indicator = timeStr.substring(0, 2); // "PM"
      const time = timeStr.substring(2); // "11:48"

      // 3. 重新組合成 new Date() 可以解析的標準格式
      const StandardFormat = `${parts[0]} ${time} ${indicator}`; // "2025/3/15 11:48 PM"
      
      return new Date(StandardFormat);
    };

    return ReformatDate(b.date) - ReformatDate(a.date);
  });
});


// 取得當前頁要顯示的文章

const PaginatedArticles = computed(() => {
  const start = (CurrentPage.value - 1) * ArticlesPerPage;
  return FilteredArticles.value.slice(start, start + ArticlesPerPage);
});


// 換頁 function


function goToPage(page) {
  if (page >= 1 && page <= TotalPages.value) {
    CurrentPage.value = page;
  }
}
//換分類
function setActive(category) {
  ActiveCategory.value = category;
}
//每跳一個分類回第一頁
watch(ActiveCategory, () => {
  CurrentPage.value = 1;
});

// 計算頁數
const TotalPages = computed(() =>
  Math.ceil(FilteredArticles.value.length / ArticlesPerPage)
);

// 新增：判斷是否為第一頁的計算屬性
const IsFirstPage = computed(() => CurrentPage.value === 1);

// 新增：判斷是否為最後一頁的計算屬性
const IsLastPage = computed(() => CurrentPage.value === TotalPages.value);

// 新增：跳轉到上一頁的方法
function GoToPreviousPage() {
  goToPage(CurrentPage.value - 1);
}

// 新增：跳轉到下一頁的方法
function GoToNextPage() {
  goToPage(CurrentPage.value + 1);
}

//只顯示+-1與頭尾頁
const PaginationList = computed(() => {
  const pages = []
  const total = TotalPages.value
  const current = CurrentPage.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current > 3) pages.push('...')

    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 1 && i < total) {
        pages.push(i)
      }
    }

    if (current < total - 2) pages.push('...')

    pages.push(total)
  }

  return pages
})
//我要發文按鈕
const ula = () => {
  alert('我要發文');
  // 在這裡可以加入跳轉到發文頁面的邏輯，例如使用 Vue Router
  // router.push('/create-post');
  }

</script>

<template>
<!-- 背景色塊 -->
<div>
  <img class="bg-img2" src="/src/assets/img/bg-decorate2.png" alt="背景圖藍">
  <img class="bg-img3" src="/src/assets/img/bg-decorate3.png" alt="背景圖黃">
</div>
  <!-- 熱門文章頁 -->
  <div>這是熱門文章頁</div>
  <!-- banner的跑馬燈 -->
    <section id="marquee">
    <div class="view">
      <div class="pic-container">
        <div
          class="pic"
          v-for="(item, index) in activities"
          :key="index"
          :style="{ backgroundColor: item.color }"

        >
                <!-- <h3 class="banner-text">{{ item.label }}</h3> -->

          <img :src="item.img" :alt="item.label" />
        </div>
      </div>
    </div>
  </section>

  <main class="artic">
    <div class="title">
      <h2>文章列表</h2>
    </div>
<!-- 文章類別 -->
    <section class="article-category">
      <div class="category-list">
        <div
          v-for="(cat, index) in categories"
          :key="index"
          :class="['category-label', { active: cat === ActiveCategory }]"
          @click="setActive(cat)"
        >
          {{ cat }}
        </div>
      </div>
      <router-link to="/article/article-create" class="article-link">

<div class="post-btn">
      <Button  theme="primary" size="md">我要發文</Button>
    </div>
    </router-link>
    </section>
    <hr/>
    <!-- 文章列表 -->
   <section class="article-list">
    <div
v-for="(article, index) in PaginatedArticles"
      :key="index"
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
  :style="{ borderColor: GetEventColor(article.event), }"
>
  {{ article.event }}
</span> <p>{{ article.date }}</p>
          </div>
          <div class="article-title">
            <h3>{{ article.title }}</h3>
          </div>
        </div>
        <div class="article-body">
<p v-html="article.content"></p>

        </div> 
          <div class="read-more">      
              <Button :onClick="readarticle" theme="info" size="sm">閱讀更多</Button>
          </div>
      </div>
     
      </router-link>
        
 
    </div>  
    <hr>
  </section>
  <!-- 分頁按鈕
<div class="pagination">
<button class="pre" @click="GoToPreviousPage"
      :disabled="IsFirstPage">
  <img :src="PreIcon" alt="上一張箭頭">
</button >  <button class="page"
    v-for="page in TotalPages" 
    :key="page" 
    @click="goToPage(page)"
    :class="{ active: CurrentPage === page }"
  >
    {{ page }}
  </button>
<button class="next"  @click="GoToNextPage"      :disabled="IsLastPage">
  <img :src="NextIcon" alt="下一張箭頭">
</button>
</div>   -->

<!-- 試試智慧分類...因應太多頁數的時候畫面不要太亂 -->
<div class="pagination">
  <button class="pre" @click="GoToPreviousPage" :disabled="IsFirstPage">
    <img :src="PreIcon" alt="上一張箭頭" />
  </button>

  <button
    class="page"
    v-for="(page, index) in PaginationList"
    :key="index"
    @click="typeof page === 'number' && goToPage(page)"
    :disabled="page === '...'"
    :class="{ active: CurrentPage === page }"
  >
    {{ page }}
  </button>

  <button class="next" @click="GoToNextPage" :disabled="IsLastPage">
    <img :src="NextIcon" alt="下一張箭頭" />
  </button>
</div>
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



#marquee .view {
  overflow: hidden;
  width: 100%;
}

.pic-container {
  display: flex;
  width: max-content;
  animation: marquee 60s linear infinite;
}

.pic {
  padding: 20px;
    flex-shrink: 0;
    width: 300px;
    height: 300px;
    margin-right: 25px;
    color: #000000;
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    border-radius: 6px;
    align-items: center;
    flex-direction: column;
}

.pic img {
    width: 120%;
    height: auto;
    object-fit: cover;
    overflow: visible;
    transform: scale(0.8);
    transition: transform 0.5s ease, width 0.5s ease;
}
.pic img:hover {
  width: 100%;
  height: auto;
  transform: scale(1);

}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.3333%);
  }
}

/*.banner {
  width: 100%;
}
*/
.imglist {
  display: flex;
  gap: 1vw;
  margin: 4vw 2vw;
  height: 30vh;
}

.activity {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-weight: bold;
  border-radius: 6px;
  text-align: center;
}

.category-label {
  padding: 10px 12px;
  background-color: #81bfda;
  border: 1px black solid;
  border-radius: 6px;
}

.active {
  background-color: #4f8da8;
  color: #fff;
}
.category-list {
  display: flex;
  gap: 10px;
 
}
.title {
  margin-block: 3vh;
}

section.article-category {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  align-items: center;
}

main.artic {
  max-width: 1200px;
  align-content: center;
  margin: auto;
}
hr {
  margin-block: 5vh;
}
.article-body p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
    line-clamp: 2;          /* 新標準寫法（新版瀏覽器） */

  -webkit-box-orient: vertical;
  
 
}
.article-item {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin: 5vh auto;
}

section.article-list {
    margin: 5vh;
}


.article-text {
  flex: 2;
    display: flex;
    flex-direction: column;
    /* gap: 20px; */
    justify-content: space-around;
    gap:5px;
}
.event-label {
    text-align: center;
    padding: 5px;
    margin: 5px;
    border: solid 3px;
    border-radius: 6px;
    width: 80px;
}
.article-date {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
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
.article-title {
    padding-block: 5px;
}
.article-img{
  margin: 10px;
  flex:1;
}

.read-more{
  display: grid;
justify-content: end;
margin-top: 10px;
}
a.article-text-link {
    flex: 2;
    display: flex;
    color: inherit;
  text-decoration: none;
  align-items: stretch;
}
.next:hover  {
   transition: transform 0.5s ease;

transform:translateX(5px)
}
.pre:hover{
    transition: transform 0.5s ease; 

  transform:translateX(-5px)

}

@media (max-width: 1024px) {
  .title{
      margin-inline: 20px;

  }
.category-list{
  flex-wrap: wrap;
flex:3;
}
section.article-category{
  margin-inline: 20px;

// flex-direction: column;
}
.post-btn{
display: flex;
flex:1;
margin: auto;
justify-content: center;
}
}

@media (max-width: 768px) {
  .bg-img2,.bg-img3{
    width: 50%!important;
  }
.pic{
  width: 150px;
  height: 150px;
}
.banner-text{
  font-size: 1.25rem;
}
.category-list {

 gap: 10px;
        flex-direction: row;
        justify-content: left;
        flex-wrap: wrap;
        padding: 20px;
}
.button-wrapper {
    margin: 3vh auto;
}
section.article-category {

    flex-direction: column;
}
.title {
text-align: center;
}
.article-item{
    flex-direction: column;
}
.article-title h3{
  font-family: 'Noto Sans';
  font-size: 1.25rem;
}
.article-body{
  display: none;
  
}

.event-label,.category-label,.page,.activity{
  border-radius: 3px;
}

}

</style>
