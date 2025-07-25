<script setup>
import ActivityCard from "@/components/activity/activity-card.vue";
import { FakeActivity } from "@/assets/data/fake-activity";
import Button from "@/components/Button.vue";
import { ref } from "vue";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Test from "@/components/test.vue";
const SearchText = ref("");
const dateRange = ref([]);
const minDate = ref(new Date());
const format = ref("yyyy-MM-dd");
</script>

<template>
  <Test />
  <div class="hint">揪團探索/揪團列表</div>
  <div class="container">
    <div class="banner"></div>
  </div>

  <div class="search-bar-container">
    <div class="search-bar">
      <input v-model="SearchText" type="text" />
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

  <div class="category"></div>

  <div class="activity-list">
    <RouterLink
      v-for="item in FakeActivity"
      :key="item.activity_no"
      :to="`/activity/${item.activity_no}`"
      class="activity-link"
    >
      <ActivityCard :item="item"></ActivityCard>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  width: 100%;
}
.banner {
  display: flex;
  background-position: center;
  border: 1px solid black;
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
  width: 100%;
  display: grid;
  gap: 20px;
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
  display: grid;
}
.search-bar {
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
</style>
