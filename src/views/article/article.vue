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
    postId:"pst-0001",
    userId:	"M001",
    date: '2025/3/15 ',
    title: '第一次夜衝合歡山！星星多到爆炸',
    event:'climbing',
    image: '@/assets/img/article/movie_konan.jpg',
    content: '昨天晚上跟幾個大學同學衝上合歡山看星星，本來還擔心會不會太冷、太累，結果完全值得！！半夜開車有點刺激哈哈，一邊聽歌一邊聊天就到了。最驚喜的是凌晨三點多，整個天空滿滿的銀河，完全沒有光害，超壯觀，人生第一次看到這麼清楚的星空。大家還帶了泡麵跟熱可可，坐在車旁邊邊吃邊看星星，有種小時候看動畫的感覺不過提醒大家，上山真的要注意保暖，我穿了發熱衣+羽絨外套還是有點抖…如果你也想體驗什麼叫做「被星星包圍」，真的可以試一次夜衝！'
  },
   {
    postId:"pst-0002",
    userId:	"M0002",
    date: '2025/4/20',
    title: '陌生人也能變朋友！第一次桌遊揪團超出預期'
,event:'boardGame',
image: '@/assets/img/article/movie_konan.jpg',
    content: '身為業務員，平常接觸超多人，但很多時候反而更想認識一些**「無壓力的新朋友」**。上週剛好在 Juika 上看到有人發起桌遊揪團，我就鼓起勇氣報名了～結果整個過程超級驚喜我們約在中山站附近的桌遊店，空間舒適又不限時，一開始還有點尷尬，但只要開始玩狼人殺，氣氛馬上破冰！大家超有戲，還有一個設計師大哥模仿警長口條笑死我玩到最後還交換了 IG，有人說下次想開個「劇本殺主題場」，我馬上說+1！如果你也想拓展生活圈、又不想太有壓力，真的可以試試 JOIKA 上的這種主題揪團，跟網路交友完全不同的感覺，而且安全又安心！'
  },
  { postId:"pst-0003",
    userId:	"M0003",
    date:"2025/4/20 下午 9:07:00",
    title:"我不懂為什麼要那麼嚴格，只是晚到一下也要罵人？",
    event:"other",
    image:"@/assets/img/article/movie_konan.jpg",
    content:'上週六參加了一場登山跟團，是在這個平台上報名的。活動整體不錯，但我必須說，有些帶團的人態度真的可以不要那麼兇。我只是因為公車誤點，遲到了大概30分鐘，一到現場就一直被帶隊的大哥念：「下次別來了」「你這樣很自私」。這到底什麼態度？我也是花錢報名的，難道參加活動就要被羞辱？而且我們最後還不是照原定路線出發？一點都沒耽誤時間。為什麼揪團變成一種壓力來源？我覺得這樣的團不如不要辦，如果不能包容一點小狀況，那乾脆寫清楚遲到就會被罵、被趕走。我只是把自己遇到的狀況說出來，可能很多人會覺得我不對，但我不覺得有必要為了30分鐘被羞辱整路。'
  },
   {postId:"pst-0004", 
    userId:	"M0004",
    date:"22025/6/2 下午 2:10:00",
    title:"【新手必讀】淺水潛水三大關鍵技巧，一次上手不慌張！",
    event:"diving",
    image:"@/assets/img/article/movie_konan.jpg",
    content:'這幾年台灣越來越多人對潛水有興趣，但很多初學者會在第一次下水時緊張或手忙腳亂，甚至對「自由潛水」和「水肺潛水」分不清楚。我從 2018 年開始教學生潛水課程，累積不少經驗，也觀察到新手常見的三個問題。今天簡單整理一下，給想入門的你參考：一、別忽略耳壓平衡淺水不代表風險低，下潛過程中若不及時做耳壓平衡，耳膜會感到刺痛甚至受傷。每下潛一公尺，請主動捏鼻子輕輕出氣。二、呼吸要穩定，別憋氣很多人緊張就憋氣，其實這是最危險的反應。穩定呼吸才是安全下潛的關鍵，就算在水下感覺心跳加快，也要專注放鬆節奏。三、潛伴制度一定要記得永遠不要一個人下水。即便是在岸邊練習，也需要有潛伴互相注意狀況，這是國際潛水守則中最基本的一條。這篇文章是給完全沒學過但想試試的人看的，如果你也有類似問題，歡迎留言我會回覆；另外我近期會開一場「基礎淺水體驗團」，有興趣也可以預約參加。'
  },
  
  
  
  ]
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
            <p>{{ article.date }}</p><p>{{ article.event }}</p>
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
  -webkit-line-clamp: 3; 
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
