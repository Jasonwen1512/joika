<script setup>
import { ref, onMounted } from "vue";
import Button from "@/components/Button.vue";
import InputField from "@/components/auth/Inputfield.vue";
import InterestSelector from "@/components/auth/Interestselector.vue";

const currentStep = ref(2);
const avatarUrl = ref("");
const avatarFile = ref(null);
const isSubmitting = ref(false);

const genderOptions = [
  { label: "男性", value: "M" },
  { label: "女性", value: "F" },
  { label: "其他", value: "O" },
  { label: "不透露", value: "N" },
];

const formData = ref({
  name: "",
  nickname: "",
  gender: "",
  birthdate: "",
  location: null,
  occupation: null,
  avatar: "",
});

const allOptions = ref({
  cities: [],
  occupations: [],
  interests: [],
});

const selectedInterestIds = ref([]);

const errors = ref({
  name: "",
  nickname: "",
  gender: "",
  birthdate: "",
  location: "",
  occupation: "",
  interests: "",
});

onMounted(async () => {
  try {
    // console.log("--- 開始載入資料 ---");

    const [optionsRes, profileRes] = await Promise.all([fetch(`${import.meta.env.VITE_API_BASE}/users/get-registration-options.php`), fetch(`${import.meta.env.VITE_API_BASE}/users/profile-origin.php`, { credentials: "include" })]);

    const optionsData = await optionsRes.json();
    const profileData = await profileRes.json();

    // console.log("【API 回應 1】 所有選項資料:", optionsData);
    // console.log("【API 回應 2】 會員個人資料:", profileData);

    if (optionsData.success) {
      allOptions.value = optionsData.data;
      // console.log("【步驟 A】 allOptions 已賦值:", allOptions.value);
    }

    if (profileData.success) {
      const user = profileData.data;

      formData.value.name = user.name;
      formData.value.nickname = user.nickname;
      formData.value.gender = user.gender;
      formData.value.birthdate = user.birthdate;
      formData.value.location = user.cityNo;
      formData.value.occupation = user.occupationNo;
      // console.log("【步驟 B】 formData 已賦值:", formData.value);

      if (user.avatar) {
        avatarUrl.value = `${import.meta.env.VITE_API_BASE}/upload/member/${encodeURIComponent(user.avatar)}`;
      }

      if (user.interests && user.interests.length > 0) {
        selectedInterestIds.value = user.interests.map((interest) => interest.id);
        // console.log("【步驟 C】 selectedInterestIds 已賦值 (應為數字陣列):", selectedInterestIds.value);
      }
    }
    // console.log("--- 資料載入完畢 ---");
  } catch (err) {
    console.error("會員資料載入失敗", err);
  }
});

// step2
async function handleStepTwoSubmit() {
  // 檢查是否正在提交中，如果是，則直接返回
  if (isSubmitting.value) return;

  // 清空錯誤
  Object.keys(errors.value).forEach((key) => (errors.value[key] = ""));

  // 基本驗證
  let hasError = false;
  if (!formData.value.name) {
    errors.value.name = "請輸入姓名";
    hasError = true;
  }
  if (!formData.value.nickname) {
    errors.value.nickname = "請輸入暱稱";
    hasError = true;
  }
  if (!formData.value.gender) {
    errors.value.gender = "請選擇性別";
    hasError = true;
  }
  if (!formData.value.birthdate) {
    errors.value.birthdate = "請選擇生日";
    hasError = true;
  }
  if (!formData.value.location) {
    errors.value.location = "請選擇居住城市";
    hasError = true;
  }
  if (!formData.value.occupation) {
    errors.value.occupation = "請選擇職業";
    hasError = true;
  }
  if (!selectedInterestIds.value || selectedInterestIds.value.length === 0) {
    errors.value.interests = "請至少選擇一個興趣";
    hasError = true;
  }

  if (hasError) return;

  // 開始提交，鎖定狀態
  isSubmitting.value = true;

  // 建立要傳送的 FormData
  const payload = new FormData();
  payload.append("step", 2);
  payload.append("name", formData.value.name);
  payload.append("nickname", formData.value.nickname);
  payload.append("gender", formData.value.gender);
  payload.append("birthdate", formData.value.birthdate);
  payload.append("location", formData.value.location);
  payload.append("occupation", formData.value.occupation);

  // 直接新增 interest_no 陣列
  if (selectedInterestIds.value.length > 0) {
    selectedInterestIds.value.forEach((id) => {
      payload.append("interests[]", id);
    });
  } else {
    payload.append("interests[]", ""); // 若使用者取消了所有興趣，則回傳空值
  }

  // avatar
  if (avatarFile.value) {
    const file = avatarFile.value;
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
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/profile-update.php`, {
      method: "POST",
      credentials: "include",
      body: payload,
    });
    const data = await res.json();
    if (data.success) {
      currentStep.value = 3; // 更新完成
    } else if (data.errors) {
      Object.assign(errors.value, data.errors);
    }
  } catch (err) {
    console.error("資料更新失敗", err);
  } finally {
    // 解除鎖定
    isSubmitting.value = false;
  }
}

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarUrl.value = URL.createObjectURL(file); // 用於預覽
    avatarFile.value = file; // <--- 新增這一行，儲存檔案本身
  }
};

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
        <h1>編輯會員資料</h1>
        <ul class="progress-bar" id="progress-bar">
          <li :class="['progress-step', getStepState(2)]">
            <div class="step-label">基本資料</div>
            <div class="step-circle"></div>
          </li>
          <li :class="['progress-step', getStepState(3)]">
            <div class="step-label">編輯完成</div>
            <div class="step-circle"></div>
          </li>
        </ul>
      </div>

      <!-- 步驟 2-->
      <section v-show="currentStep === 2" class="form-step">
        <form>
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

          <InputField id="name" label="姓名" type="text" v-model="formData.name" :error="errors.name" />

          <InputField id="nickname" label="暱稱" type="text" v-model="formData.nickname" :error="errors.nickname" />

          <InputField id="gender" label="性別" type="select" :options="genderOptions" v-model="formData.gender" :error="errors.gender" />

          <div class="form-group">
            <label class="form-label" for="birthdate">生日</label>
            <el-date-picker id="birthdate" v-model="formData.birthdate" type="date" value-format="YYYY-MM-DD" placeholder="請選擇出生年月日" class="custom-date" />
            <p v-if="errors.birthdate" class="error-text birthdate-error-text">{{ errors.birthdate }}</p>
          </div>

          <InputField id="location" label="居住地" type="select" :options="allOptions.cities" v-model="formData.location" :error="errors.location" />

          <InputField id="occupation" label="職業" type="select" :options="allOptions.occupations" v-model="formData.occupation" :error="errors.occupation" />

          <InterestSelector v-model="selectedInterestIds" :options="allOptions.interests" :error="errors.interests" :max="3" />

          <div class="button-group">
            <Button size="md" theme="primary" @click="handleStepTwoSubmit" :disabled="isSubmitting">下一步</Button>
          </div>
        </form>
      </section>

      <!-- 步驟 3: 編輯完成 -->
      <section v-show="currentStep === 3" class="form-step">
        <p class="subtitle">編輯成功</p>
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
    max-width: 250px;
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
  color: $red;
  font-size: 14px;
  margin-top: -26px; // 抵銷 .tos-group 的 margin-bottom: 30px，確保 .error-text 與 .tos-group 的間距為 4px
}

.restriction-notice {
  color: $red;
  font-size: 14px;
  text-align: center;
}

.form-group {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
}

/* === 套用原本 input/select 樣式到 DatePicker === */
:deep(.custom-date.el-date-editor) {
  display: block;
  width: 100%;
}

:deep(.custom-date .el-input__wrapper) {
  width: 100%;
  padding: 7px 15px;
  border: 1px solid black;
  border-radius: 3px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &.is-focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.3);
  }
}

:deep(.el-input__inner) {
  color: black;
  font-size: 16px;
}

.error-text {
  color: red;
  font-size: 14px;
}

.birthdate-error-text {
  margin-top: 18px;
}
</style>
