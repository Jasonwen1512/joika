<script setup>
import { RouterLink, useRouter } from "vue-router";
import LikeButton from "./like-button.vue";
import Button from "@/components/Button.vue";
import { ref, computed } from "vue";
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const props = defineProps({
  item: Object,
});

const likeMap = ref({});

const toggleLike = (id) => {
  likeMap.value[id] = !likeMap.value[id];
};

const imageUrl = computed(() => {
  const src = props.item?.activity_img || "";
  return /^https?:\/\//i.test(src) ? src : `${VITE_API_BASE}${src}`;
});
const router = useRouter();
const gotoSignup = (id) => {
  router.push(`/group/group-signup/${id}`);
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
  const start = formDate(props.item.activity_start_date);
  const end = formDate(props.item.activity_end_date);

  // console.log(
  //   `start:${start}  end:${end} 活動名稱：${props.item.ACTIVITY_NAME}`
  // );

  if (start === end) {
    return `${start} ${props.item.activity_name}`;
  } else {
    return `${start}-${end} ${props.item.activity_name}`;
  }
});
</script>

<template>
  <div class="activity-card" v-if="props.item">
    <RouterLink
      :to="`/activity/${props.item.activity_no}`"
      class="activity-img"
    >
      <img :src="imageUrl" :alt="props.item.activity_name" />
    </RouterLink>
    <RouterLink :to="`/activity/${props.item.activity_no}`"
      ><h4 class="activity-name">
        {{ titleDate }}
      </h4></RouterLink
    >
    <RouterLink :to="`/activity/${props.item.activity_no}`" class="desc-link"
      ><p class="activity-description">
        {{ props.item.activity_description }}
      </p></RouterLink
    >

    <div class="button-group" @click.stop.prevent>
      <Button
        @click.stop.prevent="gotoSignup(item.activity_no)"
        theme="primary"
        size="md"
        >我要跟團!</Button
      >
      <LikeButton :activity-no="item.ACTIVITY_NO"></LikeButton>
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

// .activity-img:hover {
//   transform: rotate(-5deg);
// }

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
