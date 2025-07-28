<script setup>
import ActivityCard from "@/components/activity/activity-card.vue";
import { FakeActivity } from "@/assets/data/fake-activity";
import Button from "@/components/Button.vue";
import { ref, computed, watch } from "vue";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import SearchIcon from "@/assets/img/icon/search1.svg";
import CategoryTag from "@/components/activity/category-tag.vue";
import PreArrow from "@/assets/img/icon/pre-arrow.svg";
import NextArrow from "@/assets/img/icon/next-arrow.svg";

const SearchText = ref("");
const dateRange = ref([]);
const minDate = ref(new Date());
const format = ref("yyyy-MM-dd");
const activities = ref(FakeActivity);
const categories = [
  { id: null, name: "全部" },
  { id: "CA001", name: "登山" },
  { id: "CA002", name: "桌遊" },
  { id: "CA003", name: "運動" },
  { id: "CA004", name: "露營" },
  { id: "CA005", name: "唱歌" },
  { id: "CA006", name: "展覽" },
  { id: "CA007", name: "水上活動" },
  { id: "CA008", name: "聚餐" },
  { id: "CA009", name: "電影" },
  { id: "CA010", name: "手作" },
  { id: "CA011", name: "文化體驗" },
  { id: "CA012", name: "演出表演" },
  { id: "CA013", name: "其他" },
];
const activeCategory = ref(null);

const selectCategory = (id) => {
  activeCategory.value = activeCategory.value === id ? null : id;
};

const filterActivities = computed(() => {
  if (!activeCategory.value) {
    return activities.value;
  }
  return activities.value.filter(
    (act) => act.category_no === activeCategory.value
  );
});

const itemsPerPage = 12;
const currentPage = ref(1);

const totalPages = computed(() => {
  return Math.ceil(filterActivities.value.length / itemsPerPage);
});

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filterActivities.value.slice(start, end);
});
watch(activeCategory, () => {
  currentPage.value = 1;
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo(0, 0);
  }
};

const prePage = () => {
  if (currentPage.value > 1) currentPage.value--;
  window.scrollTo(0, 0);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
  window.scrollTo(0, 0);
};
</script>

<template>
  <div class="hint">揪團探索/揪團列表</div>
  <div class="container">
    <div class="banner"></div>
  </div>

  <div class="search-bar-container">
    <div class="search-bar">
      <input v-model="SearchText" type="text" />
      <div class="search-icon">
        <SearchIcon></SearchIcon>
      </div>
    </div>
    <div class="calendar">
      <DatePicker
        v-model="dateRange"
        range
        :min-date="minDate"
        :format="format"
        :enable-time-picker="false"
      />
    </div>
    <div class="button-go">
      <Button isFull theme="primary" size="sm">GO</Button>
    </div>
  </div>

  <div class="category-list">
    <CategoryTag
      v-for="cat in categories"
      :key="cat.id"
      :label="cat.name"
      class="category-tag"
      :isActive="activeCategory === cat.id"
      @click="selectCategory(cat.id)"
    ></CategoryTag>
  </div>
  <div class="bg-decorate2">
    <img src="@/assets/img/bg-decorate2.png" alt="" />
  </div>
  <div class="activity-list">
    <RouterLink
      v-for="item in paginatedActivities"
      :key="item.activity_no"
      :to="`/activity/${item.activity_no}`"
      class="activity-link"
    >
      <ActivityCard :item="item"></ActivityCard>
    </RouterLink>
  </div>
  <div class="pagination">
    <button class="pre-arrow" @click="prePage" :disabled="currentPage === 1">
      <PreArrow></PreArrow>
    </button>

    <button
      class="pages"
      v-for="page in totalPages"
      :key="page"
      @click="changePage(page)"
      :class="{ active: currentPage === page }"
    >
      {{ page }}
    </button>
    <button
      class="next-arrow"
      @click="nextPage"
      :disabled="currentPage === totalPages"
    >
      <NextArrow></NextArrow>
    </button>
  </div>
</template>

<style scoped lang="scss">
main {
  position: relative;
}
.container {
  margin: 0 auto;
  width: 100%;
}
.banner {
  display: flex;
  background-position: center;
  border: 1px solid $black;
  width: 100vw;

  background-image: url(../../assets/img/activity/activity-banner.jpg);
  background-size: contain;
  background-repeat: no-repeat;
  @include mobile() {
    min-height: 212px;
    background-position: left;
    background-size: cover;
  }

  @include tablet() {
  }

  @include desktop() {
  }
}
.activity-list {
  z-index: 10;
  width: 100%;
  display: grid;
  gap: 25px;
  padding: 10px;
  justify-items: center;

  @include mobile() {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  @include tablet() {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @include desktop() {
    max-width: 1200px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    justify-self: center;
  }
}

.hint {
  line-height: 27px;
  margin: 29px auto 11px 18px;
  @include mobile() {
  }

  @include tablet() {
  }
  @include desktop() {
    display: none;
    font-size: $font-size-p;
  }
}
.search-bar-container {
  display: flex;
  flex-direction: column;
  padding: 15px 21px;
  gap: 13px;
}
.search-bar {
  display: flex;
  flex-direction: row-reverse;
  border: 1px solid $black;
  border-radius: 3px;
  background-color: $white;
  min-height: 34px;
}
.search-bar input {
  width: 100%;
  @include mobile() {
  }

  @include tablet() {
  }

  @include desktop() {
  }
}
.search-icon {
  padding: 3px 12px 0 12px;
  align-content: center;
}

.calendar {
  min-height: 34px;
  border: 1px solid $black;
  border-radius: 3px;
}
:deep(.dp__input_icon) {
  color: $black;
}
:deep(.dp__action_cancel) {
  background-color: $white;
  border: 1px solid $blue;
}
:deep(.dp__action_select) {
  color: $color-highlight;
}

.dp__range_start,
.dp__range_end {
  background-color: $yellow;
}

.dp__range_between {
}

.button {
  height: 34px;
}
.category-list {
  @include flex-center;
  flex-wrap: wrap;
  padding: 21px;
  gap: 10px;
}
.pagination {
  padding: 10px;
  display: flex;
  justify-content: center;
}

.pre-arrow,
.next-arrow {
  padding: 3px 5px 0 5px;
  cursor: pointer;
  &:hover {
    background-color: $gray-disabled;
    opacity: 0.5;
  }
  &:disabled {
    color: $gray-disabled;
    cursor: not-allowed;
    background-color: transparent;
    pointer-events: none;
  }
}
.pages {
  cursor: pointer;
  width: 20px;
  padding: 0 5px;

  &:not(.active):hover {
    background-color: $gray-disabled;
    opacity: 0.5;
  }
  &.active {
    border: 1px solid $blue;
    color: $blue;
    pointer-events: none;
  }
}

.pages.active {
  border: 1px solid $blue;
  color: $blue;
  &:hover {
    background-color: none;
  }
}

.bg-decorate2 {
  position: absolute;
  z-index: -1;
  transform: translateY(-45%);
}
.bg-decorate2 img {
  width: 40%;
}
</style>
