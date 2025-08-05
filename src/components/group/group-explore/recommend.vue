<script setup>

import {ref, onMounted} from 'vue';
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import CategoryCard from "@/components/group/group-explore/category-card.vue";
import { ActivityCategories } from "@/assets/data/fake-activity-category";
const titleText = ref("不管你是哪一派 JOIKA都包辦!")
const titleRef = ref(null);
const isVisible = ref(false);

onMounted(()=>{
  const observer = new IntersectionObserver (
    (entries) =>{
      if (entries[0].isIntersecting){
        isVisible.value = true;
        observer.unobserve(titleRef.value);
      }
    },
    {threshold: 0.5}
  );
  if (titleRef.value) observer.observe(titleRef.value);
})
const outsideCategories = ActivityCategories.filter(
  (cat) => cat.classify === "outside"
);
const outsideCategoriesDouble = [...outsideCategories, ...outsideCategories];

const insideCategories = ActivityCategories.filter(
  (cat) => cat.classify === "inside"
);
const insideCategoriesDouble = [...insideCategories, ...insideCategories];
</script>

<template>
  <div class="group-recommend-wrap">
    <h3 class="title" ref="titleRef">
    <span
      v-for="(char, index) in titleText.split('')"
      :key="index"
      :style="`--index:${index}`"
      :class="{show:isVisible}"
    >
      {{ char }}
    </span>
  </h3>
   
      <img class="img1"src="../../../assets/img/group/group-recommend/group-background-decoration-l.png" alt="">
      <img class="img2" src="../../../assets/img/group/group-recommend/group-background-decoration-r.png" alt=""></img>
    
    <!-- 野放時光 -->
    <div class="outside-activity">
      <h3 class="sub-title">野放時光</h3>
      <Swiper
        :modules="[Autoplay]"
        :autoplay="{ delay: 1400, disableOnInteraction: false }"
        :loop="true"
        :centered-slides="true"
        slides-per-view="auto"
        :space-between="5"
        class="custom-swiper"
      >
        <SwiperSlide v-for="cat in outsideCategoriesDouble" :key="cat.id">
          <CategoryCard
            :title="cat.name"
            :image-url="cat.img"
            :category-no="cat.id"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- 靜靜聚聚 -->
    <div class="inside-activity">
      <h3 class="sub-title">靜靜聚聚</h3>
      <Swiper
        :modules="[Autoplay]"
        :autoplay="{ delay: 1500, disableOnInteraction: false }"
        :loop="true"
        :centered-slides="true"
        slides-per-view="auto"
        :space-between="5"
        class="custom-swiper"
      >
        <SwiperSlide v-for="cat in insideCategoriesDouble" :key="cat.id">
          <CategoryCard
            :title="cat.name"
            :image-url="cat.img"
            :category-no="cat.id"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<style scoped lang="scss">
.group-recommend-wrap {
  z-index: 1;
  position: relative;
  margin: 70px 0;
  background-image: url("@/assets/img/group/group-recommend/background-decoration.svg"),
    url("@/assets/img/group/group-recommend/background-color.svg");
  background-repeat: repeat, no-repeat;
  background-size: auto, cover;
  // background-position: ;
  @include tablet() {
    //768-1023
    background-image: url("@/assets/img/group/group-recommend/background-decoration.svg"),
      url("@/assets/img/group/group-recommend/background-color-big.svg");
    margin: 120px 0;
    padding: 150px 0;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  @include desktop() {
    //1024以上
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
  }

  @media screen and (min-width: 1023px) and (max-width: 1199px) {
  }
}

.custom-swiper {
  width: 100%;
  @include tablet() {
    //768-1023
  }

  @include desktop() {
    max-width: 1200px;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    width: 90%;
  }
}
.custom-swiper .swiper-slide {
  width: 31%;
  @include tablet() {
    //768-1023
    width: 34%;
  }

  @include desktop() {
    //1024以上
    width: 22%;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    width: 30%;
  }
}
@keyframes showLetter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title span {
  display: inline-block;
  opacity: 0;
}

.title span.show {
  animation: showLetter 0.5s cubic-bezier(0.34, 2.55, 0.64, 1)
    calc(var(--index) * 0.1s) forwards;
}
.title {
  padding: 60px 20px 43px 20px;
  @include tablet() {
    //768-1023

    padding-top: 100px;
  }

  @include desktop() {
    //1024以上
    font-size: $font-size-h1;
    padding-bottom: 70px;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    font-size: $font-size-h1;
  }
}
h3 {
  
  text-align: center;
  margin: auto 0;
  @include desktop() {
    //1024以上
    font-size: $font-size-h2;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    font-size: $font-size-h2;
  }
}

.sub-title {
  padding-bottom: 23px;
}
.outside-activity {
  padding-bottom: 45px;
}

.inside-activity {
  padding-top: 15px;
  padding-bottom: 37px;
  @include tablet() {
    //768-1023
    padding-bottom: 150px;
  }

  @include desktop() {
    //1024以上
    padding-top: 70px;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    padding-top: 70px;
  }
}
.img1{
  
position: absolute;
width: 25%;
top: 0;
left: 0;
transform: translateY(-70px);
z-index: -1;
@include tablet() {  //768-1023
transform: translateY(-125px);
width: 20%;

    }

  @include desktop() { //1024以上
width: 15%;
transform: translateY(-175px);
      }
  @media screen and (min-width: 1023px) and (max-width: 1199px) { //1023-1199
    width: 20%;
  }

}

.img2{
position: absolute;
width: 25%;
bottom: 0;
right: 0;
transform: translateY(10px);
  @include tablet() {  //768-1023

transform: translateY(30px);
    }

  @include desktop() { //1024以上
 width: 15%;
      }
  @media screen and (min-width: 1023px) and (max-width: 1199px) { //1023-1199
     width: 20%;
  }


}

</style>
