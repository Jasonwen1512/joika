<script setup>
import { RouterLink, useRouter } from "vue-router";
import LikeButton from "./like-button.vue";
import Button from "@/components/Button.vue";
import { ref, computed, toRefs } from "vue";
import { imageUrl } from "@/assets/utils/normalize";
import { useParticipationStore } from "@/stores/participation-store.js";

const props = defineProps({
  item: Object,
});
const { item } = toRefs(props);

const imgSrc = computed(() =>
  imageUrl(item.value?.ACTIVITY_IMG ?? item.value?.activity_img ?? "")
);

const likeMap = ref({});

const toggleLike = (id) => {
  likeMap.value[id] = !likeMap.value[id];
};

const participationStore = useParticipationStore();
const router = useRouter();

const gotoSignup = (id) => {
  participationStore.handleJoinProcess(id);
};

const handleButtonClick = (id) => {
  if (participationStore.isJoined(id)) {
    router.push(`/activity/${id}`);
  } else {
    gotoSignup(id);
  }
};

const formDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month.toString().padStart(2, "0")}/${day
    .toString()
    .padStart(2, "0")}`;
};

const titleDate = computed(() => {
  if (!props.item) return "";
  const start = formDate(props.item.ACTIVITY_START_DATE);
  const end = formDate(props.item.ACTIVITY_END_DATE);

  if (start === end) {
    return `${start} ${props.item.ACTIVITY_NAME}`;
  } else {
    return `${start}-${end} ${props.item.ACTIVITY_NAME}`;
  }
});
</script>

<template>
  <div class="activity-card" v-if="props.item">
    <RouterLink
      :to="`/activity/${props.item.ACTIVITY_NO}`"
      class="activity-img"
    >
      <img :src="imgSrc" :alt="props.item.ACTIVITY_NAME" />
    </RouterLink>
    <RouterLink :to="`/activity/${props.item.ACTIVITY_NO}`">
      <h4 class="activity-name">
        {{ titleDate }}
      </h4>
    </RouterLink>
    <RouterLink :to="`/activity/${props.item.ACTIVITY_NO}`" class="desc-link">
      <p class="activity-description">
        {{ props.item.ACTIVITY_DESCRIPTION }}
      </p>
    </RouterLink>

    <div class="button-group" @click.stop.prevent>
      <Button
        @click.stop.prevent="handleButtonClick(item.ACTIVITY_NO)"
        :theme="'primary'"
        size="md"
        :disabled="participationStore.isLoading"
      >
        <span v-if="participationStore.isLoading">載入中...</span>
        <span v-else>
          {{ participationStore.isJoined(item.ACTIVITY_NO) ? "已參團" : "我要跟團！" }}
        </span>
      </Button>

      <LikeButton :activity-no="item.ACTIVITY_NO" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activity-card {
  max-width: 284px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 25px 5px;
  min-height: 390px;
  padding: 0 15px;
  color: black;
  &:hover {
    .activity-img {
      transform: rotate(-5deg);
    }
  }
  .activity-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: ease 0.4s;
    object-fit: cover;
    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      border: black solid 1px;
    }
  }

  @include tablet() {
    margin: 45px 5px;
  }
  @include desktop() {
  }
}

.activity-name {
  color: $black;
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
  color: $black;
  font-size: $font-size-p;
  padding: 10px 0 0;
  line-height: 1.7;
  max-width: 264px;
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.desc-link {
  display: flex;
  flex: 1;
}

.button-group {
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding-top: 10px;
  max-width: 264px;
}
</style>
