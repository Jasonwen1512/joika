<script setup>
import { useRouter } from "vue-router";
import CategoryCard from "@/components/group/group-explore/activity-category.vue";
const categories = [];
const props = defineProps({
  title: String,
  img: String,
  categoryNo: String,
});

const router = useRouter();

const goToCategory = () => {
  router.push({
    path: "/activity",
    query: { category: props.categoryNo },
  });
};
</script>

<template>
  <div class="group-recommend-wrap">
    <h3>不管你是哪一派JOIKA都包辦!</h3>
    <div class="group-activity">
      <h3>野放時光</h3>
      <div class="grou-recommend-outside">
        <div class="group-recommend-outside-card">
          <!-- <img src="img" alt="" />
          <p>{{ category_name }}</p>
        </div>
      </div>
      <div class="grou-recommend-inside">
        <div class="group-recommend-inside-card">
          <img src="img" alt="" />
          <p>{{ category_name }}</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.group-recommend-wrap {
  position: relative;
  padding: 35px 0;
  background-image: url("@/assets/img/group/group-recommend/group-recommend-background.svg");
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  background-position: center center;
}
</style>
