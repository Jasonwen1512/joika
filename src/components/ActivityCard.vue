<script setup>
import LikeButton from "./LikeButton.vue";
import Button from "./Button.vue";
import { FakeActivity } from "@/assets/data/fake_activity";
import { ref } from "vue";
defineProps({
  item: Object,
});

const likeMap = ref({});

const toggleLike = (id) => {
  likeMap.value[id] = !likeMap.value[id];
};
const aloha = () => {
  alert("我要跟團！");
};
</script>

<template>
  <ul>
    <li v-for="item in FakeActivity" :key="item.activity_id" v-if="item">
      <div class="activity_card">
        <div class="activity_img">
          <img :src="item.img_url" :alt="item.title" />
        </div>
        <h4 class="activity_title">{{ item.title }}</h4>
        <p class="activity_intro">{{ item.intro }}</p>
        <div class="button">
          <Button :onClick="aloha" theme="primary" size="md">我要跟團!</Button>
          <LikeButton
            :isActive="likeMap[item.activity_id]"
            @click="toggleLike(item.activity_id)"
          ></LikeButton>
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.activity_card {
  max-width: 295px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
}
.activity_img img {
  width: 100%;
  object-fit: contain;
}
.activity_img {
  @include flex-center;
}

.activity_title {
  font-size: $font-size-h4;
  padding: 2px 0;
  letter-spacing: 1px;
  line-height: 1.7;
}
.activity_intro {
  font-size: $font-size-p;
  padding: 2px 0;
  letter-spacing: 1px;
  line-height: 1.7;
}

.button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0px;
}
</style>
