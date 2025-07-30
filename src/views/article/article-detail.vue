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

</script>

<template>
  <background>
  <!-- <img class="bg-img2" src="/src/assets/img/bg-decorate2.png" alt="背景圖藍">
  <img class="bg-img3" src="/src/assets/img/bg-decorate3.png" alt="背景圖黃"> -->
</background>

<main>
  <section class="author-information">
    <!-- 這邊之後要串會員資料頭像與名稱  先暫時寫死 -->
<div class="avatar"><img src="/src/assets/img/bg-decorate3.png" class="masked-avatar" />    
  <p>文章作者：{{ article.userid }}</p>
</div>
    <div class="btn-list">
  <Button :suffixIcon="SmEditIcon" theme="info" size="sm">編輯</Button>  
  <Button isOutline :suffixIcon="DeleteIcon" theme="secondary" size="sm">刪除</Button>
    </div>
  </section>
  <section class="Content">
  <div class="article" v-if="article">



    <h3>{{ article.postid }}</h3>
            <div><span>分類：{{ article.event }}</span>
發布時間：{{ article.date }}</div>
<div class="article-img"> {{article.image }}</div>
    <p v-html="article.content"></p>
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

.article{

max-width: 1200px;
display: block;
margin: auto;

}

  .masked-avatar {
    width: 50px;
    height: 50px;
    mask-image: radial-gradient(circle, black 98%, transparent 100%);
    -webkit-mask-image: radial-gradient(circle, black 98%, transparent 100%);
    mask-size: cover;
    mask-repeat: no-repeat;
  }

</style>
