<script setup>
import axios from "axios";
import { ref, onMounted, onUnmounted } from "vue";
// import { FakeActivity } from "@/assets/data/fake-activity";
import { useRouter } from "vue-router";

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
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const router = useRouter();
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
        <legend>個人資料</legend>

        <label for="name">姓名</label>
        <input type="text" id="name" name="name" />

        <label>性別</label>
        <div class="gender-group">
          <label><input type="radio" name="gender" value="male" /> 男</label>
          <label><input type="radio" name="gender" value="female" /> 女</label>
          <label><input type="radio" name="gender" value="other" /> 其他</label>
        </div>

        <label for="age">年齡</label>
        <input type="text" id="age" name="age" />

        <label for="contact">聯絡方式</label>
        <input type="text" id="contact" name="contact" />

        <label for="email">電子信箱</label>
        <input type="email" id="email" name="email" />

        <label class="checkbox">
          <input type="checkbox" id="autoFill" name="autoFill" checked />
          自動代入會員資料
        </label>

        <label for="intro">介紹</label>
        <textarea
          id="intro"
          name="intro"
          placeholder="想跟主揪說什麼？多多介紹自己可以增加揪團成功率喔！"
        ></textarea>
      </fieldset>
      <div class="button-area">
        <button class="cancel">取消</button>
        <button class="submit">送出</button>
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
    border: 1px solid #000;
    background-color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 5px;
  }
  input[type="radio"],
  input[type="checkbox"] {
    accent-color: #000;
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
