<script setup>
import { useRoute } from 'vue-router'
import { articleList } from "@/assets/data/fake-article";
const route = useRoute()
const postid = route.params.postid
const article = articleList.find(item => item.postid === postid)

// 你可以用 postId 去 API 撈資料、顯示內容等等
</script>

<template>
  <div class="article" v-if="article">
    <h2>文章編號：{{ article.postid }}</h2>
        <p>發布時間：{{ article.date }}</p>

    <p>文章作者：{{ article.userid }}</p>
    <p>文章標題：{{ article.title }}</p>
    <p>分類：{{ article.event }}</p>
    <p>內文：</p>
    <p v-html="article.content"></p>
  </div>
  <div v-else>
    <p>找不到這篇文章。</p>
  </div>
</template>

<style scoped lang="scss">
.article{

max-width: 1200px;
display: block;
margin: auto;

}</style>
