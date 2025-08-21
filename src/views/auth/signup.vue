<script setup>
import { ref, watch, onMounted, computed } from "vue";
import Button from "@/components/Button.vue";
import InputField from "@/components/auth/Inputfield.vue";
import InterestSelector from "@/components/auth/Interestselector.vue";

const currentStep = ref(1);
const avatarUrl = ref("");
const genderOptions = [
  { label: "男性", value: "M" },
  { label: "女性", value: "F" },
];
const cityOptions = ref([]); // 縣市
const occupationOptions = ref([]); // 職業
const interestOptions = ref([]); // 興趣
const tmpId = ref(""); // step 1 暫存資料 id

const form = ref({
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agreed: false,
  name: "",
  nickname: "",
  gender: "",
  birthdate: "",
  location: "",
  occupation: "",
  interests: [],
});

const errors = ref({
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agreed: "",
  name: "",
  nickname: "",
  gender: "",
  birthdate: "",
  location: "",
  occupation: "",
  interests: "",
});

const selectedInterests = ref([]); // v-model 綁定多選興趣

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:8888/joika-api-server/users/get-registration-options.php");
    const data = await res.json();
    if (data.success) {
      cityOptions.value = data.data.cities;
      occupationOptions.value = data.data.occupations;
      interestOptions.value = data.data.interests;
    }
  } catch (err) {
    console.error("載入選項失敗", err);
  }
});

// 自動清除錯誤
function setupAutoClearError(dataRef, errorRef) {
  Object.keys(dataRef.value).forEach((key) => {
    watch(
      () => dataRef.value[key],
      (val) => {
        if (errorRef.value[key] && val) {
          errorRef.value[key] = "";
        }
      }
    );
  });
}

// step1 驗證
const validateStepOne = async () => {
  // 清除錯誤
  Object.keys(errors.value).forEach((key) => (errors.value[key] = ""));

  const { email, phone, password, confirmPassword, agreed } = form.value;
  let hasError = false;

  if (!email) {
    errors.value.email = "請輸入信箱";
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.value.email = "信箱格式錯誤";
    hasError = true;
  }

  if (!phone) {
    errors.value.phone = "請輸入手機";
    hasError = true;
  } else if (!/^09\d{8}$/.test(phone)) {
    errors.value.phone = "手機格式錯誤";
    hasError = true;
  }

  if (!password) {
    errors.value.password = "請輸入密碼";
    hasError = true;
  } else if (password.length < 6 || password.length > 12) {
    errors.value.password = "密碼長度需介於 6 ~ 12 字元";
    hasError = true;
  }

  if (!confirmPassword) {
    errors.value.confirmPassword = "請確認密碼";
    hasError = true;
  } else if (password !== confirmPassword) {
    errors.value.confirmPassword = "密碼不一致";
    hasError = true;
  }

  if (!form.value.agreed) {
    errors.value.agreed = "請勾選會員條款";
    hasError = true;
  }

  if (!hasError) {
    // step1 送到後端暫存
    try {
      const res = await fetch("http://localhost:8888/joika-api-server/users/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          step: 1,
          email: email,
          phone: phone,
          password: password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        tmpId.value = data.tmp_id;
        currentStep.value = 2; // 前進 Step2
      } else if (data.errors) {
        // 後端檢查錯誤回填
        Object.assign(errors.value, data.errors);
      }
    } catch (err) {
      console.error("Step1 暫存失敗", err);
    }
  }
};

// step2
async function handleStepTwoSubmit() {
  // 清空錯誤
  Object.keys(errors.value).forEach((key) => (errors.value[key] = ""));

  // 基本驗證
  let hasError = false;
  if (!form.value.name) {
    errors.value.name = "請輸入姓名";
    hasError = true;
  }
  if (!form.value.nickname) {
    errors.value.nickname = "請輸入暱稱";
    hasError = true;
  }
  if (!form.value.gender) {
    errors.value.gender = "請選擇性別";
    hasError = true;
  }
  if (!form.value.birthdate) {
    errors.value.birthdate = "請選擇生日";
    hasError = true;
  }
  if (!form.value.location) {
    errors.value.location = "請選擇居住城市";
    hasError = true;
  }
  if (!form.value.occupation) {
    errors.value.occupation = "請選擇職業";
    hasError = true;
  }
  if (!form.value.interests || form.value.interests.length === 0) {
    errors.value.interests = "請至少選擇一個興趣";
    hasError = true;
  }

  if (hasError) return;

  const payload = new FormData();
  payload.append("step", 2);
  payload.append("tmp_id", tmpId.value);
  payload.append("name", form.value.name);
  payload.append("nickname", form.value.nickname);
  payload.append("gender", form.value.gender);
  payload.append("birthdate", form.value.birthdate);
  payload.append("location", form.value.location);
  payload.append("occupation", form.value.occupation);
  form.value.interests.forEach((i) => payload.append("interests[]", i));

  const avatarUrl = computed(() => {
    const base = import.meta.env.VITE_API_BASE; // e.g. http://localhost:8888/JOIKA_PHP
    const avatar = member.value?.MEMBER_AVATAR;

    if (!avatar) return ""; // 沒有上傳 → 空字串

    // 只給檔名時，固定拼上 /upload/avatars/
    return `${base.replace(/\/$/, "")}/upload/member/${encodeURIComponent(avatar)}`;
  });

  // avatar
  const fileInput = document.getElementById("avatar-input");
  if (fileInput && fileInput.files[0]) {
    const file = fileInput.files[0];
    const maxSize = 5 * 1024 * 1024; // 限制 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      errors.value.avatar = "僅允許 JPEG / PNG / GIF 圖檔";
      return;
    }

    if (file.size > maxSize) {
      errors.value.avatar = "檔案需小於 5MB";
      return;
    }

    payload.append("avatar", file);
  }

  try {
    const res = await fetch("http://localhost:8888/joika-api-server/users/register.php", {
      method: "POST",
      credentials: "include",
      body: payload,
    });
    const data = await res.json();
    if (data.success) {
      currentStep.value = 3; // 註冊完成
    } else if (data.errors) {
      Object.assign(errors.value, data.errors);
    }
  } catch (err) {
    console.error("Step2 註冊失敗", err);
  }
}

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarUrl.value = URL.createObjectURL(file);
  }
};

setupAutoClearError(form, errors);

const getStepState = (step) => {
  if (currentStep.value > step) return "completed";
  if (currentStep.value === step) return "current";
  return "";
};
</script>

<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="registration-header">
        <h1>註冊</h1>
        <ul class="progress-bar" id="progress-bar">
          <li :class="['progress-step', getStepState(1)]" data-step="1">
            <div class="step-label">帳號申請</div>
            <div class="step-circle"></div>
          </li>
          <li :class="['progress-step', getStepState(2)]">
            <div class="step-label">基本資料</div>
            <div class="step-circle"></div>
          </li>
          <li :class="['progress-step', getStepState(3)]">
            <div class="step-label">註冊完成</div>
            <div class="step-circle"></div>
          </li>
        </ul>
      </div>

      <!--步驟1-->
      <section v-show="currentStep === 1" class="form-step">
        <form @submit.prevent="validateStepOne">
          <InputField
            id="email"
            label="信箱"
            type="email"
            v-model="form.email"
            :error="errors.email"
            @blur="
              () => {
                errors.email = '';
              }
            " />

          <InputField
            id="phone"
            label="手機"
            type="tel"
            v-model="form.phone"
            :error="errors.phone"
            @blur="
              () => {
                errors.phone = '';
              }
            " />

          <InputField
            id="password"
            label="密碼"
            type="password"
            v-model="form.password"
            :error="errors.password"
            @blur="
              () => {
                errors.password = '';
              }
            " />

          <InputField
            id="confirm-password"
            label="確認密碼"
            type="password"
            v-model="form.confirmPassword"
            :error="errors.confirmPassword"
            @blur="
              () => {
                errors.confirmPassword = '';
              }
            " />
          <div class="tos-group">
            <input type="checkbox" id="tos" v-model="form.agreed" />
            <label for="tos">我已閱讀並同意 JOIKA 會員條款</label>
          </div>
          <p v-if="errors.agreed" class="error-text">{{ errors.agreed }}</p>

          <div class="button-group">
            <Button size="md" theme="primary">送出</Button>
          </div>
        </form>
      </section>

      <!-- 步驟 2-->
      <section v-show="currentStep === 2" class="form-step">
        <form @submit.prevent="handleStepTwoSubmit">
          <div class="avatar-upload">
            <label for="avatar-input" class="avatar-label">
              <div class="avatar-circle">
                <img v-if="avatarUrl" :src="avatarUrl" alt="預覽頭貼" />
                <span v-else>頭貼上傳</span>
              </div>
              <p v-if="errors.avatar" class="restriction-notice">{{ errors.avatar }}</p>
            </label>
            <input type="file" id="avatar-input" accept="image/*" @change="handleAvatarChange" hidden />
          </div>

          <InputField id="name" label="姓名" type="text" v-model="form.name" :error="errors.name" />

          <InputField id="nickname" label="暱稱" type="text" v-model="form.nickname" :error="errors.nickname" />

          <InputField id="gender" label="性別" type="select" :options="genderOptions" v-model="form.gender" :error="errors.gender" />

          <InputField id="birthdate" label="生日" type="date" v-model="form.birthdate" :error="errors.birthdate" />

          <InputField id="location" label="居住地" type="select" :options="cityOptions" v-model="form.location" :error="errors.location" />

          <InputField id="occupation" label="職業" type="select" :options="occupationOptions" v-model="form.occupation" :error="errors.occupation" />

          <InterestSelector v-model="form.interests" :options="interestOptions" :error="errors.interests" :max="3" />

          <div class="button-group">
            <Button size="md" theme="primary" @click="handleStepTwoSubmit">下一步</Button>
          </div>
        </form>
      </section>

      <!-- 步驟 3: 註冊完成 -->
      <section v-show="currentStep === 3" class="form-step">
        <p class="subtitle">註冊成功</p>
        <p class="subtitle">就差一點點就能一起出發啦！</p>
        <p class="info">我們正在確認您的資料，審核通過後就可以開始揪團玩樂囉</p>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/style.scss" as *;

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0;
  padding: 20px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    background-image: url("@/assets/img/bg-decorate5.png");
    background-size: contain;
    background-repeat: no-repeat;
    width: 150px;
    aspect-ratio: 334 / 591;
    top: -20px;
    left: 0px;
    z-index: -1;
  }

  &::after {
    content: "";
    position: absolute;
    background-image: url("@/assets/img/bg-decorate7.png");
    background-size: contain;
    background-repeat: no-repeat;
    aspect-ratio: 406 / 518;
    width: 150px;
    bottom: -50px;
    right: 0;
    z-index: -1;
  }
}

.signup-container {
  width: 100%;
  max-width: 800px;
  background-color: $white;
  padding: 25px;
  border-radius: 3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  h1 {
    text-align: center;
    font-size: $font-size-h3;
    font-weight: 400;
    margin-bottom: 40px;
  }

  .step-label {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .tos-group {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;

    input {
      width: 16px;
    }

    label {
      margin: 0px;
    }
  }

  .button-group {
    display: flex;
    justify-content: center;
  }

  .subtitle {
    font-size: $font-size-h3;
    color: $blue;
    text-align: center;
    margin-bottom: 30px;
  }

  .info {
    text-align: center;
    color: $black;
    margin-bottom: 30px;
  }
}

.registration-header {
  align-items: center;
  margin-bottom: 30px;

  .progress-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 420px;
    align-items: center;
    list-style: none;
    margin: 0 auto 35px;
    padding: 0 10px;
  }

  .progress-step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .step-circle {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background-color: $white;
      border: 1px solid $black;
      position: relative;
      display: inline-block;
      transition: all 0.3s ease;

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 100%;
        width: 110px;
        height: 2px;
        background-color: $black;
        transform: translateY(-50%);
      }
    }

    &:last-child .step-circle::after {
      display: none;
    }

    &.completed .step-circle {
      background-color: #c6f1fb; // 淺藍色（已完成）
    }

    &.current .step-circle {
      background-color: #4a87a7; // 深藍色（當下步驟）
    }
  }
}

.avatar-upload {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  .avatar-label {
    cursor: pointer;
  }

  .avatar-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: $lighter-yellow;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: 0.3s;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}

@media (min-width: 768px) {
  .signup-page {
    &::before {
      width: 200px;
    }

    &::after {
      width: 200px;
    }
  }

  .signup-container {
    border-radius: 6px;
    padding: 50px 100px;

    h1 {
      font-size: $font-size-h2;
      font-weight: 600;
      margin-bottom: 30px;
    }
  }

  .registration-header {
    .progress-bar {
      margin-bottom: 70px;
    }

    .progress-step {
      .step-circle {
        &::after {
          width: 150px;
        }
      }
    }
  }

  .subtitle {
    font-size: $font-size-h2;
    margin-bottom: 50px;
  }

  .info {
    text-align: center;
    color: $black;
    margin-bottom: 50px;
  }
}

.avatar-upload {
  .avatar-circle {
    width: 200px;
    height: 200px;
  }
}

.error-text {
  color: red;
  font-size: 14px;
  margin-top: -26px; // 抵銷 .tos-group 的 margin-bottom: 30px，確保 .error-text 與 .tos-group 的間距為 4px
}

.restriction-notice {
  color: red;
  font-size: 14px;
  text-align: center;
}
</style>
