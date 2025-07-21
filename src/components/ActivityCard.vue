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
  border: red solid 2px;
  display: flex;
  flex-direction: column;
}

.activity_img {
  border: blue solid 2px;
  justify-content: center;
  align-items: center;
}

.activity_title {
  border: green solid 2px;
}
.activity_intro {
  border: purple solid 2px;
}

.button {
  border: yellow solid 2px;
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
}
</style>
