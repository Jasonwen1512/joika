<script setup>
import LikeButton from "./LikeButton.vue";
import Button from "./Button.vue";
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
  <div class="activity_card" v-if="item">
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
</template>

<style lang="scss" scoped>
.activity_card {
  max-width: 284px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
  min-height: 390px;
}
.activity_img img {
  width: 100%;
  object-fit: contain;
}
.activity_img {
  @include flex-center;
  border: black solid 1px;
}

.activity_title {
  font-size: $font-size-h4;
  padding: 14px 0 0px;
  line-height: 1.7;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.activity_intro {
  font-size: $font-size-p;
  padding: 10px 0 0;
  line-height: 1.7;
  flex-grow: 1;
}

.button {
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding-bottom: 10px;
}
</style>
