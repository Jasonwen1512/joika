<script setup>
import { useRoute, useRouter } from "vue-router";
import { ActivityCategories } from "@/assets/data/fake-activity-category";
import ActivityCard from "@/components/activity/activity-card.vue";
import Button from "@/components/Button.vue";
import { ref, computed, watch, onMounted } from "vue";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import SearchIcon from "@/assets/img/icon/search1.svg";
import CategoryTag from "@/components/activity/category-tag.vue";
import axios from "axios";


const route = useRoute();
const router = useRouter();
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const setDefaultCategory = () => {
  const categoryFromQuery = route.query.category;
  if (categoryFromQuery) {
    activeCategory.value = categoryFromQuery;
  } else {
    activeCategory.value = 0;
    router.replace({ query: { category: activeCategory.value } });
  }
};

watch(
  () => route.query.category,
  (newVal) => {
    activeCategory.value = newVal || 0;
    searchTrigger.value++;
  }
);
const SearchText = ref("");
const confirmedSearch = ref({
  keyword: "",
  dateRange: [],
});
const dateRange = ref([]);
const isRangeComplete = computed(() => {
  return Array.isArray(dateRange.value) && dateRange.value.length === 2;
});
const minDate = ref(new Date());
const searchTrigger = ref(0);
const customFormat = (dates) => {
  if (!dates || dates.length < 2) return "";
  const [start, end] = dates;
  return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()} - ${
    end.getMonth() + 1
  }/${end.getDate()}`;
};
const handleSearch = () => {
  const safeDateRange = Array.isArray(dateRange.value) ? dateRange.value : [];

  // 如果只選了一天，複製成 [start, start]
  if (safeDateRange.length === 1) {
    safeDateRange.push(safeDateRange[0]);
  }

  confirmedSearch.value = {
    keyword: (SearchText.value || "").trim().toLowerCase(),
    dateRange: safeDateRange,
  };

  SearchText.value = "";

  searchTrigger.value++;
};

function formatCategoryNo(no) {
  return `CA${String(no).padStart(3, "0")}`;
}
function formatActivityNo(no) {
  return `ACT${String(no).padStart(5, "0")}`;
}
const errorMsg = ref("");
function imageUrl(img) {
  if (!img) return "";
  // 已是絕對網址
  if (/^https?:\/\//i.test(img)) return img;
  // 後端給 /upload/... -> 直接接在 API_BASE 後面
  if (img.startsWith("/upload")) return `${VITE_API_BASE}${img}`;
  // 只有檔名 -> 補上資料夾
  return `${VITE_API_BASE}/upload/activities-img/${img}`;
}
const normalizeActivity = (r) => {
  const img = r.ACTIVITY_IMG ?? r.activity_img ?? "";
  return {
    activity_no: formatActivityNo(r.ACTIVITY_NO ?? r.activity_no),
    activity_name: r.ACTIVITY_NAME ?? r.activity_name ?? "",
    location: r.LOCATION ?? r.location ?? "",
    activity_start_date: r.ACTIVITY_START_DATE ?? r.activity_start_date ?? "",
    activity_end_date: r.ACTIVITY_END_DATE ?? r.activity_end_date ?? "",
    category_no: formatCategoryNo(r.CATEGORY_NO ?? r.category_no ?? 0),
activity_description:r.ACTIVITY_DESCRIPTION ?? r.activity_description ?? "",
    activity_img: imageUrl(img),
  };
};
const activities = ref([]);
const categories = ActivityCategories;
const activeCategory = ref("0");

//串活動資料API
const loading = ref(false);
async function fetchActivities(){
  loading.value=true;
  try{
    const{ data } = await axios.get(`${VITE_API_BASE}/activities/list.php`);
    activities.value = (Array.isArray(data) ? data : [] )
    .map(normalizeActivity)
    .sort(
      (a, b)=>
      new Date(a.activity_start_date).getTime() -
      new Date(b.activity_start_date).getTime()
    );
    searchTrigger.value++
    currentPage.value = 1;
  }catch (err) {
     errorMsg.value="抓取活動失敗";
  }finally {
    loading.value = false;
  }

}



const selectCategory = (id) => {
  const current = route.query.category;
  if (current === id) {
    router.push({ query: { category: "0" } });
  } else {
    router.push({ query: { category: id } });
  }
  confirmedSearch.value = { keyword: "", dateRange: [] };
  SearchText.value = "";
  dateRange.value = [];
};

const filterActivities = computed(() => {
  searchTrigger.value; // 觸發重新計算

  return activities.value.filter((act) => {
    // 關鍵字搜尋
    const keyword = confirmedSearch.value.keyword;
    const matchKeyword =
      !keyword || act.activity_name.toLowerCase().includes(keyword);

    // 日期搜尋
    let matchDate = true;
    const safeDateRange = Array.isArray(confirmedSearch.value.dateRange)
      ? confirmedSearch.value.dateRange
      : [];

    // 如果只選了一天，把它複製成 [start, start]
    if (safeDateRange.length === 1) {
      safeDateRange.push(safeDateRange[0]);
    }

    if (safeDateRange.length === 2) {
      const [selectStart, selectEnd] = safeDateRange;

      const activityStart = new Date(act.activity_start_date);
      const activityEnd = new Date(act.activity_end_date);

      // 檢查交集（包含單日）
      matchDate =
        activityEnd.getTime() >= selectStart.getTime() &&
        activityStart.getTime() <= selectEnd.getTime();
    }

    // 分類搜尋
    const matchCategory =
      activeCategory.value === "0" || act.category_no === activeCategory.value;

    return matchKeyword && matchDate && matchCategory;
  });
});

const pageSize = ref(12);
const currentPage = ref(1);
const total = computed(() => filterActivities.value.length)

const updatePageSize = () => {
  pageSize.value = window.innerWidth < 769 ? 6 : 12
}


const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filterActivities.value.slice(start, end);
});
watch(activeCategory, () => {
  currentPage.value = 1;
});

onMounted(() => {
  setDefaultCategory();
  updatePageSize();
  window.addEventListener("resize", updatePageSize);
  fetchActivities();
});
</script>

<template>
  <div class="activity-wrap">
    <div class="hint">揪團探索/揪團列表</div>
    <div class="banner-container">
      <div class="banner">
        <img src="../../assets/img/activity/activity-banner.jpg" alt="" />
      </div>
    </div>
    <div class="background">
      <img
        class="bg-decorate2"
        src="../../assets/img/bg-decorate2.png"
        alt=""
      />
      <img
        class="bg-decorate3"
        src="../../assets/img/bg-decorate3.png"
        alt=""
      />
    </div>
    <div class="search-bar-container">
      <div class="search-bar">
        <input v-model="SearchText" type="text" />
        <div class="search-icon">
          <SearchIcon></SearchIcon>
        </div>
      </div>
      <div @click.prevent="" class="calendar">
        <DatePicker
          v-model="dateRange"
          range
          :partial-range="false"
          :min-date="minDate"
          :format="customFormat"
          :enable-time-picker="false"
          placeholder="請選擇起訖日期"
        >
          <!-- 自訂確認與取消按鈕 -->
          <template #action="{ selectDate, closePicker }">
            <button
              class="dp__action_cancel"
              type="button"
              @click="closePicker"
            >
              取消
            </button>
            <button
              class="dp__action_select"
              type="button"
              :disabled="!isRangeComplete"
              @click="selectDate"
            >
              確認
            </button>
          </template>
        </DatePicker>
      </div>
      <div class="button-go">
        <Button isFull theme="primary" size="sm" :onClick="handleSearch"
          >GO!!!</Button
        >
      </div>
    </div>

    <div class="category-list">
      <CategoryTag
        v-for="cat in categories"
        :key="cat.category_no"
        :label="cat.category_name"
        class="category-tag"
        :isActive="activeCategory === cat.category_no"
        @click="selectCategory(cat.category_no)"
      ></CategoryTag>
    </div>

    <div class="activity-list">
      <!-- 有資料才顯示卡片 -->
      <template v-if="paginatedActivities.length > 0">
        <ActivityCard
          :item="item"
          v-for="item in paginatedActivities"
          :key="item.activity_no"
        >
          </ActivityCard
        >
      </template>

      <!-- 沒資料顯示提示 -->
      <p v-else class="no-data">該分類目前沒有活動唷!快來新增一個吧!</p>
    </div>

    <el-pagination
  v-if="total > 0"
  :current-page="currentPage"
  :page-size="pageSize"
  :total="total"
  :page-sizes="[6,12,24]"
  layout="prev, pager, next"
  default
  @current-change="p => { currentPage = p; window.scrollTo(0,0) }"
  @size-change="s => { pageSize = s; currentPage = 1; window.scrollTo(0,0) }"
/>
  </div>
</template>

<style scoped lang="scss">
.activity-wrap {
  position: relative;
  min-height: 100vh;
  
margin-bottom: 20vh;

}
.banner {
  margin: 0 auto;
  height: 212px;
  overflow: hidden;
  padding-bottom: 41px;

  @include tablet() {
    height: 414px;
  }

  @include desktop() {
    width: 100%;
    height: 414px;
  }
}
.banner img {
  display: block;
  border-top: 1px solid $black;
  border-bottom: 1px solid $black;
  width: 100%;
  object-fit: cover;
  object-position: left;
  height: 100%;

  @include tablet() {
    height: 414px;
    object-position: center;
  }

  @include desktop() {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}
.activity-list {
  z-index: 10;
  max-width: 100%;
  display: grid;
  gap: 25px;
  padding: 10px;
  justify-self: center;
  grid-template-columns: repeat(1, 1fr);

  @include tablet() {
    grid-template-columns: repeat(2, 1fr);
  }

  @include desktop() {
    min-width: 1200px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
    justify-self: center;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
    min-width: 1024px;
    gap: 25px;
    justify-items: center;
  }
}

.hint {
  line-height: 27px;
  margin: 29px auto 11px 18px;

  @include tablet() {
  }
  @include desktop() {
    display: none;
    font-size: $font-size-p;
  }
}
.search-bar-container {
  display: grid;
  grid-template-columns: 1fr;
  padding: 15px 21px;
  gap: 13px;

  @include tablet() {
    grid-template-columns: 2fr 1fr 2fr;
    width: auto;
  }
  @include desktop() {
    grid-template-columns: 2fr 1fr 2fr;
    max-width: 1200px;
    justify-self: center;
  }
}
.search-bar {
  display: flex;
  flex-direction: row-reverse;
  border: 1px solid $black;
  border-radius: 3px;
  background-color: $white;
  min-height: 34px;
  width: 100%;
}
.search-bar input {
  width: 100%;
}
.search-icon {
  padding: 3px 12px 0 12px;
  align-content: center;
}

.calendar {
  min-height: 34px;
  border: 1px solid $black;
  border-radius: 3px;
  width: 100%;
}
:deep(.dp__input_icon) {
  color: $black;
}
:deep(.dp__action_cancel) {
  background-color: $white;
  border: 1px solid $blue;
  color: $blue;
  &:hover {
    background-color: $light-blue;
    color: $color-primary;
    border: 1px solid $color-primary;
  }
  &:active {
    background-color: $light-blue;
    color: $blue;
    border: 1px solid $blue;
  }
}
:deep(.dp__action_select) {
  background-color: $color-highlight;
  color: $black;
  &:hover {
    background-color: $yellow;
    color: $black;
  }
  &:active {
    background-color: $orange;
    color: $white;
  }
}

.dp__range_start,
.dp__range_end {
  background-color: $yellow;
}

.button-go {
  width: 100%;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  padding: 20px 15px 50px 20px;
  gap: 5px;
  max-width: 1200px;
  margin: 0 auto;

  @include tablet() {
    max-width: 1200px;
    gap: 10px;
  }

  @include desktop() {
    width: 1200px;
    gap: 10px;
    justify-content: space-between;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    width: 1024px;
  }
}


.bg-decorate2 {
  position: absolute;
  z-index: -1;
  top: 500px;
  left: 0;
  width: auto;
  width: 50%;
  @include tablet() {
    top: 600px;
    width: 20%;
  }

  @include desktop() {
    top: 400px;
    width: 15%;
  }
}

.bg-decorate3 {
  position: absolute;
  z-index: -1;
  top: 1350px;
  right: 0;
  width: auto;
  width: 45%;
  overflow: hidden;
  @include tablet() {
    bottom: 300px;
    width: 25%;
  }

  @include desktop() {
    bottom: 250px;
    width: 15%;
  }
}

:deep(.el-pagination){
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 5vh;
}
:deep(.el-pager){
    gap: 10px;
}

:deep(.el-pagination .el-pager li){
border: #4f8da8 2px solid;
  border-radius: 6px;
  padding: 5px 10px;
  background: #ffffff;
  cursor: pointer;
  color: #4f8da8;
  font-weight: none;
  @media (max-width: 768px) {
    border-radius: 3px;
  }
  &.is-active {
    background: #81bfda;
    color: #000;
  }
}
:deep(.el-pagination button[aria-disabled="true"]) {
  background: none;     
  color: #ccc;         
  cursor: not-allowed;  
  opacity: 0.5;        
}
:deep(.btn-next.is-last){
  background:none;
  font-weight:bold;
}
:deep(.btn-prev.is-first){
    background:none;
  font-weight:bold;
}
:deep(.el-pagination button .el-icon) {
  font-size: 16px;   /* 控制大小 */
  font-weight:bold; /* 粗細（部分 icon 線條可見差異） */
  stroke-width: 12px; /* 若要調整 SVG 線條粗細，可以加這個 */
}


</style>
