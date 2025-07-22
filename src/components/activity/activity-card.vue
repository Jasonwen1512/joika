<script setup>
import LikeButton from "./like-button.vue";
import Button from "@/components/Button.vue";
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
  <div class="activity-card" v-if="item">
    <div class="activity-img">
      <img :src="item.img_url" :alt="item.title" />
    </div>
    <h4 class="activity-title">{{ item.title }}</h4>
    <p class="activity-intro">{{ item.intro }}</p>
    <div class="button" @click.stop.prevent>
      <Button @click.stop.prevent="aloha" theme="primary" size="md"
        >我要跟團!</Button
      >
      <LikeButton
        :isActive="likeMap[item.activity_id]"
        @click.stop.prevent="toggleLike(item.activity_id)"
      ></LikeButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activity-card {
  max-width: 284px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
  min-height: 390px;
  color: black;
}
.activity-img img {
  width: 100%;
  object-fit: contain;
  border: black solid 1px;
}
.activity-img {
  @include flex-center;
}

.activity-img :hover {
  transition: ease 0.5s;
  transform: rotate(-5deg); //
}

.activity-title {
  font-size: $font-size-h4;
  padding: 14px 0 0px;
  line-height: 1.7;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: unset;
}
.activity-intro {
  font-size: $font-size-p;
  padding: 10px 0 0;
  line-height: 1.7;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.button {
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding-bottom: 10px;
}
</style>
