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
      <img :src="item.activity_img" :alt="item.activity_name" />
    </div>
    <h4 class="activity-name">{{ item.activity_name }}</h4>
    <p class="activity-description">{{ item.activity_description }}</p>
    <div class="button-group" @click.stop.prevent>
      <Button @click.stop.prevent="aloha" theme="primary" size="md"
        >我要跟團!</Button
      >
      <LikeButton
        :isActive="likeMap[item.activity_no]"
        @click.stop.prevent="toggleLike(item.activity_no)"
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
  margin: 45px 5px;
  min-height: 390px;
  color: black;
}
.activity-img img {
  width: 100%;
  height: 100%;
  border: black solid 1px;
}
.activity-img {
  max-width: 264px;
  height: 200px;
  object-fit: cover;
}

.activity-img:hover {
  transition: ease 0.5s;
  transform: rotate(-5deg); //
}

.activity-name {
  display: block;
  max-width: 264px;
  font-size: $font-size-h4;
  padding: 14px 0 0px;
  line-height: 1.7;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: unset;
  letter-spacing: 0.5px;
}
.activity-description {
  font-size: $font-size-p;
  padding: 10px 0 0;
  line-height: 1.7;
  max-width: 264px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.button-group {
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding-top: 10px;
  max-width: 264px;
}
</style>
