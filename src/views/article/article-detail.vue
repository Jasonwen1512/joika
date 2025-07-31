<script setup>
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
<div class="comment-header">

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

.avatar-img {
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
</style>
