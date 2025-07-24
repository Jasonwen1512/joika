<script setup>
import Button from "@/components/Button.vue";
const activities = [
  { class: "camping", label: "露營", color: "#FFB6C1" },
  { class: "boardGames", label: "桌遊", color: "#ADD8E6" },
  { class: "ball", label: "籃球", color: "#90EE90" },
  { class: "movie", label: "電影", color: "#FFD700" },
  { class: "dinnerGathering", label: "聚餐", color: "#FFA07A" },
];
import { ref } from "vue";

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
const activeCategory = ref("全部");

function setActive(category) {
  activeCategory.value = category;
}


const articleList = [
  {
    date: '2025.07.01',
    title: '今年柯南電影值得看嗎?',
    image: '@/assets/img/article/movie_konan.jpg',
    content: '身為一個每年都會朝聖名偵探柯南劇場版的老觀眾，我今年還是乖乖地走進了電影院。這次的劇場版《名偵探柯南：紅之狙擊者》，主打的是懸疑與爆破場面雙強結合，劇情圍繞一樁暗殺事件與新角色的登場。'
  },
    {
    date: '2025/3/15 ',
    title: '第一次夜衝合歡山！星星多到爆炸',
    image: '@/assets/img/article/movie_konan.jpg',
    content: '昨天晚上跟幾個大學同學衝上合歡山看星星，本來還擔心會不會太冷、太累，結果完全值得！！半夜開車有點刺激哈哈，一邊聽歌一邊聊天就到了。最驚喜的是凌晨三點多，整個天空滿滿的銀河，完全沒有光害，超壯觀，人生第一次看到這麼清楚的星空。大家還帶了泡麵跟熱可可，坐在車旁邊邊吃邊看星星，有種小時候看動畫的感覺不過提醒大家，上山真的要注意保暖，我穿了發熱衣+羽絨外套還是有點抖…如果你也想體驗什麼叫做「被星星包圍」，真的可以試一次夜衝！'
  },]
</script>

<template>
  <!-- 熱門文章頁 -->
  <div>這是熱門文章頁</div>

  <div class="banner">
    <div class="imglist">
      <div
        v-for="(item, index) in activities"
        :key="index"
        :class="['activity', item.class]"
        :style="{ backgroundColor: item.color }"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
  <main class="artic">
    <div class="title">
      <h2>文章列表</h2>
    </div>

    <section class="articleCategory">
      <div class="categoryList">
        <div
          v-for="(cat, index) in categories"
          :key="index"
          :class="['categoryLabel', { active: cat === activeCategory }]"
          @click="setActive(cat)"
        >
          {{ cat }}
        </div>
      </div>

      <Button :onClick="ula" theme="primary" size="sm">我要發文</Button>
    </section>
    <hr/>
   <section class="articleList">
    <div
      v-for="(article, index) in articleList"
      :key="index"
      class="articleItem"
    >
      <div class="articleImg">
        <img :src="article.image" :alt="article.title" />
      </div>
      <div class="articleText">
        <div class="articleHeader">
          <div class="articleDate">
            <p>{{ article.date }}</p>
          </div>
          <div class="articleTitle">
            <h3>{{ article.title }}</h3>
          </div>
        </div>
        <div class="articleBody">
          <p>{{ article.content }}</p>
        </div>
      </div>
    </div>
  </section>
  </main>
</template>

<style scoped lang="scss">
.banner {
  width: 100%;
}

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
  border-radius: 10px;
  text-align: center;
}

.categoryLabel {
  padding: 10px 12px;
  background-color: #81bfda;
  border: 1px black solid;
}

.active {
  background-color: #4f8da8;
  color: #fff;
}
.categoryList {
  display: flex;
  gap: 10px;
}
.title {
  margin-block: 3vh;
}

section.articleCategory {
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
.articleBody p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
  
 
}
.articleItem {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin: 5vh auto;
}

section.articleList {
    margin: 5vh;
}

.articleImg {
    /* display: flex; */
    flex: 1;
}

.articleText {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>
