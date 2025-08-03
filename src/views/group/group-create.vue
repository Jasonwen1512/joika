<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import datePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ActivityCategories } from "@/assets/data/fake-activity-category";
import { taiwanDistricts } from "@/assets/data/taiwan-city-district";
import Button from "@/components/Button.vue";
import { GoogleMap, Marker } from "vue3-google-map";
import Popup from "@/components/group/group-create-popup.vue";
import Test from "@/components/member/member-interest-tag.vue";
import MemberInterest from "@/components/member/member-interest-tag.vue";

// console.log(taiwanDistricts.map((item) => item.city));
const currentMemberId = "M0001";
const customRangeFormat = (dates) => {
  if (!dates || dates.length < 2) return "";
  const [start, end] = dates;
  return `${start.getFullYear()}/${
    start.getMonth() + 1
  }/${start.getDate()} - ${end.getFullYear()}/${
    end.getMonth() + 1
  }/${end.getDate()}`;
};
const cityList = taiwanDistricts.map((item) => item.city);
// console.log(cityList);
const fakeActivityCategories = ActivityCategories.filter(
  (item) => item.category_no !== null
);
const dateRange = ref([]);
watch(dateRange, (newVal) => {
  if (newVal && newVal.length === 2) {
    form.value.activity_start_date = newVal[0];
    form.value.activity_end_date = newVal[1];
    console.log(newVal[0]);
  } else {
    form.value.activity_start_date = "";
    form.value.activity_end_date = "";
  }
});
const form = ref({
  activity_name: "",
  activity_start_date: "",
  activity_end_date: "",
  category_no: "",
  min_participant: "",
  max_participant: "",
  fee_note: "",
  activity_description: "",
  participant_limitation: "",
  hasCondition: "false",
  registration_deadline: "",
  selectedCity: "",
  location: "",
  latitude: null,
  longitude: null,
  activity_img: "",
});
// 控制地圖顯示
const showMap = ref(false);

// focus 時顯示
const handleFocus = () => {
  showMap.value = true;
};

// 點擊外部隱藏
const handleClickOutside = (e) => {
  const mapEl = document.getElementById("map-wrapper");
  const inputEl = document.getElementById("location-input");

  if (
    mapEl &&
    !mapEl.contains(e.target) &&
    inputEl &&
    !inputEl.contains(e.target)
  ) {
    showMap.value = false;
  }
};

// 取得使用者位置
const getCurrentPosition = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.value.latitude = position.coords.latitude;
        form.value.longitude = position.coords.longitude;
      },
      () => {
        console.log("使用者不同意取得位置");
      }
    );
  } else {
    console.log("此瀏覽器不支援定位功能");
  }
};

onMounted(() => {
  getCurrentPosition();
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

const fileInput = ref(null); // 取得 input DOM
const previewUrl = ref(null); // 存圖片預覽網址

// 按下自訂按鈕 → 觸發隱藏 input
const triggerFileInput = () => {
  fileInput.value.click();
};

// 選擇檔案後處理
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file); // 產生臨時預覽網址
  }
};
</script>

<template>
  <div class="group-create-wrap">
    <div class="banner-background">
      <h2>發起揪團</h2>
    </div>
    <div class="form-wrap">
      <label for="activity_name">活動名稱</label>
      <input v-model="form.activity_name" type="text" id="activity_name" />
      <label for="">活動日期時間</label>
      <datePicker
        v-model="dateRange"
        range
        :format="customRangeFormat"
      ></datePicker>
      <label for="category_name">活動類別</label>
      <select
        v-model="form.category_no"
        id="category_name"
        placeholder="請選擇"
      >
        <option
          v-for="item in fakeActivityCategories"
          :key="item.category_no"
          :value="item.category_no"
        >
          {{ item.category_name }}
        </option>
      </select>

      <label for="">成團人數</label>
      <div class="participant-limitation">
        <div class="group">
          <span>最少人數</span>
          <input v-model="form.min_participant" type="number" /> <span>人</span>
        </div>
        <div class="group">
          <span>最多人數</span>
          <input v-model="form.max_participant" type="number" /><span>人</span>
        </div>
      </div>
      <label for="">活動地點</label>
      <div class="location">
        <select v-model="form.selectedCity" id="select-city">
          <option value="" readonly>城市</option>
          <option v-for="city in cityList" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
        <input
          id="location-input"
          type="text"
          v-model="form.location"
          @focus="handleFocus"
        />
      </div>
      <div
        class="map-wrap"
        id="map-wrapper"
        v-if="showMap"
        style="
          width: 300px;
          height: 300px;
          border: 1px solid #ccc;
          background: #fff;
        "
      >
        <GoogleMap
          api-key="AIzaSyAcYBlu72Zer6DOhpRIDiy0_L2BvBlC-M8"
          :center="{
            lat: form.latitude || 25.033964,
            lng: form.longitude || 121.564468,
          }"
          :zoom="14"
          style="width: 100%; height: 300px"
        >
          <Marker
            :options="{
              position: {
                lat: form.latitude || 25.033964,
                lng: form.longitude || 121.564468,
              },
            }"
          />
        </GoogleMap>
      </div>
      <label for="">預估費用</label>
      <input v-model="form.fee_note" />
      <label for="">活動簡介</label>
      <textarea
        placeholder="說明一下活動內容，讓更多人有興趣參與"
        v-model="form.activity_description"
        class="description"
      />
      <label for="">揪團截止日</label>
      <datePicker
        v-model="form.registration_deadline"
        format="yyyy/MM/dd"
      ></datePicker>
      <div class="limited">
        <input type="checkbox" v-model="form.hasCondition" />
        <label for="">跟團條件限制</label>
      </div>
      <input type="text" v-model="form.participant_limitation" />
      <div class="select-img">
        <span>圖片上傳</span>
        <Button type="button" theme="info" size="sm" @click="triggerFileInput"
          >檔案</Button
        >
      </div>
      <input
        class="hidden-input"
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
      />

      <div v-if="previewUrl" class="img-preview">
        <p>預覽圖片：</p>
        <img :src="previewUrl" alt="預覽" />
      </div>
    </div>
    <div class="submit">
      <Button theme="primary" size="md">送出</Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.dp__input) {
  border: 1px solid $black;
  border-radius: 3px;
  padding: 5px 5px 5px 50px;
  line-height: auto;
}
:deep(.dp__input_icons) {
  padding: 0 12px;
}
.group-create-wrap {
  background-image: url(../../assets/img/group/group-explore/form-decoration.svg);
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: contain;
}
.banner-background {
  background-image: url(../../assets/img/group/group-create/group-create-banner-background.png);
  background-size: contain;
  background-repeat: no-repeat;
  min-height: 115px;

  @include tablet() {
    //768-1023
    min-width: 768px;
    min-height: 250px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;
  }

  @include desktop() {
    //1024以上
    @include flex-center;
    min-height: 400px;
    width: 100%;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    min-width: 1024px;
    min-height: 300px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;
  }
}

h2 {
  display: none;
  @include tablet() {
    //768-1023
  }

  @include desktop() {
    //1024以上
    @include flex-center;
    padding: 10px 0;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
  }
}

select {
  border: 1px solid $black;
  border-radius: 3px;
  width: 100%;
  padding: 8px 5px;
  background-color: $white;
}

input {
  display: flex;
  border: 1px solid $black;
  border-radius: 3px;
  width: 100%;
  padding: 8px 5px;
  background-color: $white;
}
.form-wrap {
  transform: translateY(-95px);
  max-width: 350px;
  display: flex;
  flex-direction: column;
  text-align: start;
  justify-self: center;
  gap: 15px;
  > :nth-child(even) {
    margin-bottom: 27px;
  }
  @include tablet() {
    //768-1023
    transform: translateY(-150px);
    max-width: 800px;
  }

  @include desktop() {
    transform: translateY(-100px);
    //1024以上
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
  }
}
.description {
  min-height: 200px;
}
.participant-limitation {
  display: flex;
  gap: 20px;
  text-align: center;
}
.group {
  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    width: 40%;
    padding: 8px 5px;
  }
}
.limited {
  display: flex;
  gap: 10px;
  align-items: center;
  input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 1px solid $black;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.2s;
    &:checked {
      background-image: url("@/assets/img/icon/check.svg");
      background-position: center;
      background-repeat: no-repeat;
    }
  }
}
.location {
  display: flex;
  gap: 10px;
  #select-city {
    width: 30%;
    font-size: $font-size-p;
    text-align: center;
  }
}
.map-wrap {
  min-width: 350px;
  transform: translateY(-25px);
}
.hidden-input {
  display: none;
}

.img-preview {
  max-width: 350px;
  p {
    padding: 10px 0;
  }
  img {
    width: 100%;
  }
}

.select-img {
  display: flex;
  align-items: center;
  gap: 10px;
}
.submit {
  @include flex-center;
  padding-bottom: 80px;
}
.description {
  border: 1px solid $black;
  display: flex;
  border: 1px solid $black;
  border-radius: 3px;
  width: 100%;
  padding: 8px 5px;
  background-color: $white;
}
</style>
