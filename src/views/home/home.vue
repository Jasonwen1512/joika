<script setup>
import AtivityCard from '@/components/activity/activity-card.vue';
import { FakeActivity } from '@/assets/data/fake-activity';
import Marquee from '@/components/marquee.vue';
import Marquee2 from '@/components/marquee2.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';
const modules = [FreeMode, Pagination];

const items = [
  {name:"水上活動", img:'/src/assets/img/index-img/diving.png', color:'#4F8DA8'},
  {name:"電影", img:'/src/assets/img/index-img/movie.png', color:'#FFA68D'},
  {name:"運動", img:'/src/assets/img/index-img/sports.png', color:'#FADA7A'},
  {name:"登山", img:'/src/assets/img/index-img/hiking3.png', color:'#90DA81'},
  {name:"露營", img:'/src/assets/img/index-img/camping3.png', color:'#A281DA'},
  {name:"桌遊", img:'/src/assets/img/index-img/board-games.png', color:'#F315BB'},
  {name:"展覽", img:'/src/assets/img/index-img/exhibition.png', color:'#FFFCE2'},
  {name:"聚餐", img:'/src/assets/img/index-img/gathering.png', color:'#FB900C'},
  {name:"手作", img:'/src/assets/img/index-img/DIY.png', color:'#81BFDA'},
  {name:"文化體驗", img:'/src/assets/img/index-img/cultural-experience.png', color:'#1FB92C'},
  {name:"演出表演", img:'/src/assets/img/index-img/concert.png', color:'#FFE100'},
  {name:"唱歌", img:'/src/assets/img/index-img/ktv.png', color:'#2AA9FF'},
]
</script>

<template>
  <Marquee2/>
  <!-- 限時揪團區塊 -->
  <div> 
    <img class="bg-img2" src="/src/assets/img/bg-decorate2.png" alt="背景圖藍">
    <img class="bg-img" src="/src/assets/img/bg-decorate1.png" alt="背景圖黃">
    <div class="index-section-start">
      <img src=" @/assets/img/index-img/first-section-img.png" alt="限時揪團標題圖">
      <h2>限時揪團<br>差你一咖</h2>
    </div>
    <div class="first-section">
      <div class="card-grid">
        <AtivityCard v-for="item in FakeActivity.slice(0, 8)" :key="item.activity_id" :item="item"/>
      </div>
    </div>
    <img class="bg-img3" src="/src/assets/img/bg-decorate3.png" alt="背景圖藍">
  </div>  
  <Marquee/>
  <!-- 最新揪團卡片區塊 -->
    <div class="index-section-start">
      <img src=" @/assets/img/index-img/second-section-img.png" alt="最新揪團標題圖">
      <h2>最新揪團<br>差你一咖</h2>
    </div>
  <div class="card-grid">
    <AtivityCard v-for="item in FakeActivity.slice(0, 8)" :key="item.activity_id" :item="item"/>
  </div>
  <Marquee2/>
  <!-- 揪團推薦-分類框區塊 -->
  <div class="index-section-start">
      <img src="@/assets/img/index-img/third-section-img.png" alt="最新揪團標題圖">
      <h2>揪團推薦<br>差你一咖</h2>
  </div>
  <img class="bg-img4" src="/src/assets/img/bg-decorate4.png" alt="背景圖淺藍">
  <Swiper
    :slides-per-view="6"
    :space-between="30"
    :free-mode="true"
    :pagination="{ clickable: true }"
    :breakpoints="{
      1024: { slidesPerView: 6 },
      768: { slidesPerView: 3 },
      480: { slidesPerView: 1 }
    }"
    :modules="modules"
    class="recommendations-swiper"
  >
    <SwiperSlide v-for="(item, index) in items" :key="index">
      <div class="recommendations-card">
        <div class="recommendations-pic" :style="{ backgroundColor: item.color }">
        <img :src="item.img" :alt="item.name">
        </div>
        <h3>{{item.name}}</h3>
      </div>
    </SwiperSlide>
  </Swiper>
  <Marquee/>
  <!-- 品牌介紹區塊 -->
    <div class="index-section-start">
      <img src="@/assets/img/index-img/fourth-section-img.png" alt="品牌介紹標題圖">
      <h2>JOIKA<br>差你一咖</h2>
    </div>
    <img class="bg-img6" src="/src/assets/img/bg-decorate6.png" alt="背景圖深藍">
    <div class="intro-section">
    <img class="bg-img5" src="/src/assets/img/index-img/bg-decorate5.png" alt="背景圖噪點淺藍">
    <img class="float-img" src="/src/assets/img/index-img/float.png" alt="浮動圖">
    <div class="introduction">
      <p>
        每個人都有過「想參加活動卻找不到人一起」的時候。 一場登山、一趟潛水、一局桌遊，因為缺一咖而不了了之，原本期待的週末就這樣變成空白。我們也是這樣一路走來的年輕人，熱愛生活、熱愛活動，但總是被「人數不足」打敗。
        <br><br>
        於是，我們決定打造一個平台——Joika 揪一咖，讓這些「原本不該錯過的事」，不再因為缺人而流失。
        <br><br>
        不論你是第一次嘗試某項活動、還是想認識志同道合的朋友，Joika 都歡迎你來， 在這裡，你不用再尷尬開口問「有人要一起嗎？」
        <br><br>
        ——因為我們都在找，願意一起行動的那一咖。
        <br><br>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-section-start {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  img{
    width: 80px;
  }
  margin-top: 50px;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;
}
.first-section{
  width: 100%;
  margin: auto;
  position: relative;
}
.bg-img{
  position: absolute;
  top: 180px;
  left: 0;
  width: 100%;
  height: 150%;
  z-index: 0;
}
.bg-img2{
  position: absolute;
  top: 50px;
  left: 0;
  width: 15%;
  z-index: 1;
}
.bg-img3{
  position: absolute;
  top: 1200px;
  right: 0;
  width: 15%;
  z-index: 1;
}
.bg-img4{
  position: absolute;
  top: 2500px;
  left: 0;
  width: 20%;
  height: 50%;
  z-index: 0;
}
.bg-img5{
  position: absolute;
  top: 2800px;
  left: 0;
  width: 100%;
  height: 145%;
  z-index: 0;
}
.bg-img6{
  position: absolute;
  top: 3000px;
  right: 0;
  width: 20%;
  height: 50%;
  z-index: 1;
}
.float-img{
  position: absolute;
  z-index: 2;
  right: 0;
}
.card-grid{
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: center;
  align-items: center;
  margin: auto;
  position: relative;
  z-index: 2;
}
.recommendations-swiper {
  padding: 20px 0;
  .swiper-slide {
    display: flex;
    justify-content: center;
  }

}
.recommendations-card{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-bottom: 50px;
}
.recommendations-pic{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 183px;
  height: 183px;
  border: 1px solid black;
  border-radius: 50%;
  overflow: hidden;
  img{
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}
.intro-section{
  margin-bottom: 150px;
}
.introduction{
  border: 2px solid #fff;
  padding: 20px;
  background-color: #ADDAEE;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 900px;
  margin: auto;
  p{
    line-height: 3;
  }
  position: relative;
  z-index: 1;
}
</style>
