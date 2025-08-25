<script setup>
import axios from "axios";
import { ref, onMounted, onUnmounted } from "vue";
// import { FakeActivity } from "@/assets/data/fake-activity";
import { useRouter } from "vue-router";
import { authState } from "@/assets/data/authState.js";

import { useParticipationStore } from '@/stores/participation-store.js';

const isMobile = ref(window.innerWidth < 768);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const { id } = defineProps({
  id: {
    type: String,
    default: "no-data",
  },
});

// const data = FakeActivity.filter((item) => item.activity_no === id);
const target = ref({
  no: "",
  name: "",
  date: "",
  current: 0,
  min: 0,
  max: 0,
});

const data = ref([]);

// 環境變數
const VITE_API_BASE = import.meta.env.VITE_API_BASE;

const memberData = ref({
  MEMBER_NAME: "",
  MEMBER_GENDER: "M",
  MEMBER_NICKNAME: "",
  MEMBER_PHONE: "",
  MEMBER_EMAIL: "",
});

onMounted(async () => {
  window.addEventListener("resize", checkMobile);
  try {
    const res = await axios.get(`${VITE_API_BASE}/activities/list.php`);

    data.value = res.data.filter((item) => item.ACTIVITY_NO === id);

    if (data.value.length > 0) {
      target.value = {
        no: data.value[0].ACTIVITY_NO,
        name: data.value[0].ACTIVITY_NAME,
        startDate: data.value[0].ACTIVITY_START_DATE.slice(5, 10).replace(
          "-",
          "/"
        ),
        endDate: data.value[0].ACTIVITY_END_DATE.slice(5, 10).replace("-", "/"),
        current: data.value[0].CURRENT_PARTICIPANT,
        min: data.value[0].MIN_PARTICIPANT,
        max: data.value[0].MAX_PARTICIPANT,
      };
      // console.log(target.value);
    }
  } catch (error) {
    console.error("串接list.php失敗，或是target給值失敗", error);
  }
  // console.log(authState.user.id);
  try {
    const res = await axios.get(
      `${VITE_API_BASE}/admin/members/list-search.php`,
      {
        params: { MEMBER_ID: authState.user.id },
      }
    );
    memberData.value = {
      MEMBER_NAME: res.data.MEMBER_NAME,
      MEMBER_GENDER: res.data.MEMBER_GENDER,
      MEMBER_NICKNAME: res.data.MEMBER_NICKNAME,
      MEMBER_PHONE: res.data.MEMBER_PHONE,
      MEMBER_EMAIL: res.data.MEMBER_EMAIL,
    };
    // console.log(memberData.value);
  } catch (error) {
    console.error("API抓取會員資料出錯", error);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const router = useRouter();

const goBack = () => {
  router.back();
};

// 送出跟團表單 API 放置處
const handle = async () => {
  const participationStore = useParticipationStore();

  const payload = {
    activityNo: target.value.no,
    memberId: authState.user.id,
  };

  try {
    const response = await axios.post(
      `${VITE_API_BASE}/activities/group-signup-create.php`,
      payload
    );

    // === 關鍵修正：在這裡統一處理所有來自後端的回應 ===
    
    // 檢查後端回傳的 JSON 中，success 欄位是否為 true
    if (response.data.success) {
      // --- 成功的流程 ---
      participationStore.addJoinedActivity(target.value.no);
      alert("報名成功！");
      router.back();
    } else {
      // --- 失敗的流程 ---
      // 如果 success 不為 true，就顯示後端傳來的 error 訊息
      // 如果後端沒有提供 error 訊息，就顯示一個通用的預設訊息
      alert(response.data.error || "報名失敗，原因未知。");
    }

  } catch (error) {
    // catch 區塊現在主要處理網路錯誤，或伺服器回傳非 2xx 狀態碼的情況
    console.error("報名 API 請求失敗", error);
    
    // 嘗試從 error 物件中讀取更詳細的後端錯誤訊息
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert("報名過程中發生網路或伺服器錯誤。");
    }
  }
};
</script>

<template>
  <div class="group-signup">
    <div class="title-area">
      <div class="title">來報名一起玩！</div>
      <router-link :to="`/activity/${target.no}`"
        ><div class="group-content">
          <div class="A">
            {{ target.name }}
          </div>
          <div class="B">
            {{ `活動日期：${target.startDate}` }}
            <!-- 只有一天的話，只顯示當天日期 -->
            <span v-if="target.startDate !== target.endDate">
              - {{ target.endDate }}</span
            >
          </div>
          <div class="C">{{ `參團人數：${target.current}/${target.max}` }}</div>
        </div></router-link
      >
    </div>

    <form class="form-area">
      <fieldset>
        <legend>基本資料</legend>

        <label for="name">姓名</label>
        <input
          type="text"
          id="name"
          name="name"
          class="readonly-input"
          v-model="memberData.MEMBER_NAME"
          readonly
        />

        <label for="sname">暱稱</label>
        <input
          type="text"
          id="sname"
          name="sname"
          class="readonly-input"
          v-model="memberData.MEMBER_NICKNAME"
          readonly
        />

        <label>性別</label>
        <div class="gender-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              :checked="memberData.MEMBER_GENDER === 'M'"
              disabled
            />
            男
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              :checked="memberData.MEMBER_GENDER === 'F'"
              disabled
            />
            女
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="other"
              :checked="memberData.MEMBER_GENDER === 'other'"
              disabled
            />
            其他
          </label>
        </div>

        <label for="contact">電話號碼</label>
        <input
          type="text"
          id="contact"
          name="contact"
          class="readonly-input"
          v-model="memberData.MEMBER_PHONE"
          readonly
        />

        <label for="email">電子信箱</label>
        <input
          type="email"
          id="email"
          name="email"
          class="readonly-input"
          v-model="memberData.MEMBER_EMAIL"
          readonly
        />

        <label class="checkbox">
          ※ 此為自動代入的會員資料，不可在此編輯 ※
        </label>
        <label style="margin-top: 4px"> ※ 僅供檢查資料用 ※ </label>
      </fieldset>
      <div class="button-area">
        <button type="button" class="cancel" @click="goBack">取消</button>
        <button type="button" class="submit" @click="handle">送出</button>
      </div>
    </form>
  </div>
  <img
    v-if="isMobile"
    src="@/assets/img/group/group-signup/bg.svg?url"
    alt=""
    class="bgi"
  />
  <img
    v-else
    src="@/assets/img/group/group-signup/bgt.svg?url"
    alt=""
    class="bgit"
  />
</template>

<style scoped lang="scss">
.group-signup {
  padding: 20px 0;
  position: relative;
  overflow: hidden;
  @include tablet() {
    overflow-x: visible;
    padding-top: 50px;
    margin: 50px 10% 50px 10%;
    border: 2px solid #000;
    background-color: #fff;
    border-radius: 6px;
  }
  @include desktop() {
    margin: 80px 20% 80px 20%;
  }
}
.bgi {
  width: 100%;
  position: absolute;
  top: 7%;
  z-index: -1;
  pointer-events: none;
}
.bgit {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 200px;
  z-index: -1;
  pointer-events: none;
  object-fit: cover;
}
.title-area {
  text-align: center;
  font-family: "MyFont", sans-serif;
  line-height: 1.5;
  .title {
    font-size: $font-size-h3;
    margin-bottom: 20px;
  }
  .group-content {
    font-size: 16px;
    text-decoration: underline;
    color: #4f8da8;
    cursor: pointer;
    @include tablet() {
      font-size: 18px;
    }
  }
}

.form-area {
  width: 90%;
  margin: auto;
  margin-top: 20px;
  @include tablet() {
    width: 70%;
  }
}
fieldset {
  border: none;
  padding: 0;
  margin: 0;
  input[type="text"],
  input[type="email"],
  textarea {
    width: 100%;
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ced4da;
    color: #495057;
    background-color: #e9ecef;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 5px;
    cursor: not-allowed;
    pointer-events: none;
  }
  input[type="radio"],
  input[type="checkbox"] {
    accent-color: #000;
    cursor: not-allowed;
    pointer-events: none;
  }
}
legend {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

label {
  display: block;
  margin-top: 16px;
  font-weight: bold;
}

textarea {
  height: 180px;
  resize: none;
}

.gender-group {
  display: flex;
  gap: 16px;
}

.gender-group label {
  font-weight: normal;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.button-area {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-top: 15vw;
  margin-bottom: 10vw;
  button {
    border-radius: 6px;
    padding: 6px 15%;
    font-size: 20px;
    cursor: pointer;
  }
  .cancel {
    background-color: #fff;
    border: 1px solid #4f8da8;
    color: #4f8da8;
  }
  .submit {
    background-color: #fada7a;
    border: 1px solid #000;
    color: #000;
  }
  @include tablet() {
    margin: 5vw;
  }
}
</style>
