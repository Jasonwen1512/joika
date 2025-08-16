<script setup>
import { reactive, ref, watch } from "vue";
import Button from "@/components/Button.vue";
import CaptchaBox from "@/components/auth/CaptchaBox.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

//登入
const auth = useAuthStore();

const realCaptcha = ref(""); // 接住 emit 的驗證碼
const router = useRouter();
const captchaRef = ref(null);
const error = reactive({
  mobile: "",
  password: "",
  verifyCode: "",
});

// 使用 reactive 建立一個響應式的表單資料物件
const form = reactive({
  mobile: "",
  password: "",
  verifyCode: "",
});

// 假資料帳號密碼
const mockUser = {
  mobile: "0912345678",
  password: "1234",
};

// 即時輸入清除錯誤
watch(
  () => form.mobile,
  (val) => {
    if (error.mobile && val) error.mobile = "";
  }
);
watch(
  () => form.password,
  (val) => {
    if (error.password && val) error.password = "";
  }
);
watch(
  () => form.verifyCode,
  (val) => {
    if (error.verifyCode && val) error.verifyCode = "";
  }
);

const handleLogin = () => {
  let hasError = false

  if (!form.mobile) { error.mobile = "請輸入手機號碼"; hasError = true }
  if (!form.password) { error.password = "請輸入密碼"; hasError = true }
  if (!form.verifyCode) { error.verifyCode = "請輸入驗證碼"; hasError = true }

  if (hasError) return

  if (form.mobile !== mockUser.mobile) { error.mobile = "手機號碼錯誤"; return }
  if (form.password !== mockUser.password) { error.password = "密碼錯誤"; return }
  if (form.verifyCode.toLowerCase() !== realCaptcha.value.toLowerCase()) {
    error.verifyCode = "驗證碼錯誤"; return
  }

  // 驗證成功 ➜ 存到 Pinia
  auth.login({
    user: { id: 1, name: "Amo", mobile: form.mobile },
    token: "fake-token-123"
  })

const redirect = router.currentRoute.value.query.redirect
router.push(redirect ? String(redirect) : "/member/member-content")
}

const goToRegister = () => router.push("/auth/signup")
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <form @submit.prevent="handleLogin">
        <h1>登入</h1>

        <div class="form-group">
          <label for="mobile">手機</label>
          <input
            type="tel"
            id="mobile"
            v-model.trim="form.mobile"
          />
          <p class="error-msg" v-if="error.mobile">{{ error.mobile }}</p>
        </div>

        <div class="form-group">
          <label for="password">密碼</label>
          <input 
            type="password" 
            id="password" 
            v-model.trim="form.password" />
          <p class="error-msg" v-if="error.password">{{ error.password }}</p>
        </div>

        <div class="form-group">
          <label for="verify-code">驗證碼</label>
          <div class="captcha-input-wrapper">
            <input type="text" id="verify-code" v-model="form.verifyCode" />
            <div class="captcha-overlay">
              <CaptchaBox
                @updateIdentifyCode="(val) => (realCaptcha.value = val)"
                ref="captchaRef"
              />
            </div>
            <div class="captcha-icon-wrapper">
              <font-awesome-icon
                :icon="['fas', 'arrow-rotate-right']"
                class="captcha-refresh"
                @click="captchaRef?.refreshCode()"
              />
            </div>
          </div>
          <p class="error-msg" v-if="error.verifyCode">
            {{ error.verifyCode }}
          </p>
        </div>

        <a href="#" class="forgot-password">忘記密碼</a>

        <div class="button-group">
          <Button size="md" theme="info" type="button" @click="goToRegister"
            >註冊</Button
          >
          <Button size="md" theme="primary" type="submit">登入</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/style.scss" as *;

.login-page {
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

.login-container {
  width: 100%;
  max-width: 800px;
  background-color: $white;
  padding: 25px;
  border-radius: 3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  h1 {
    text-align: center;
    font-size: $font-size-h3;
    margin-bottom: 30px;
  }

  .form-group {
    margin-bottom: 30px;
  }

  label {
    display: block;
    margin-bottom: 8px;
  }

  input[type="text"],
  input[type="password"],
  input[type="tel"] {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid $black;
    border-radius: 3px;
    font-size: $font-size-p;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba($color-primary, 0.3);
    }
  }

  .error-msg {
    color: $red;
    margin-top: 2px;
  }

  .captcha-input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;

    input#verify-code {
      flex: 1;
    }

    .captcha-overlay {
      flex: 0 0 auto;
      height: 100%;

      canvas {
        height: 100%;
        width: 100px;
        object-fit: cover;
        display: block;
      }
    }
  }

  .captcha-icon-wrapper {
    display: flex;
    justify-content: flex-end;
  }
  .captcha-refresh {
    color: #81bfda;
  }

  .forgot-password {
    display: block;
    text-align: right;
    margin-bottom: 30px;
    color: $blue;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    gap: 15px;

    button {
      flex: 1 1 120px;
      max-width: 100%;
    }
  }
}

@media (min-width: 768px) {
  .login-container {
    border-radius: 6px;
    padding: 50px 100px;

    h1 {
      font-size: $font-size-h2;
      font-weight: 600;
      margin-bottom: 30px;
    }

    .button-group {
      display: flex;
      justify-content: center;
      gap: 100px;
    }
  }

  .login-page::before {
    width: 200px;
  }

  .login-page::after {
    width: 200px;
  }
}
</style>
