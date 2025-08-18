<script setup>
import { reactive, ref, watch } from "vue";
import Button from "@/components/Button.vue";
import CaptchaBox from "@/components/auth/CaptchaBox.vue";
import { useRouter } from "vue-router";
import { loginByPhonePassword } from "@/assets/data/authState";
;

const realCaptcha = ref(""); // 接住 emit 的驗證碼

// ✅ 專用接收器：保證 realCaptcha 保持是 ref，不會被改壞成字串
const onCaptchaUpdate = (val) => {
  realCaptcha.value = String(val || '')
  console.log('[login] captcha =', realCaptcha.value)  
}

const router = useRouter();
const captchaRef = ref(null);

const error = reactive({ mobile: "", password: "", verifyCode: "" });
const form = reactive({ mobile: "", password: "", verifyCode: "" });

// 即時輸入清除錯誤
watch(() => form.mobile, v => { if (error.mobile && v) error.mobile = "" })
watch(() => form.password, v => { if (error.password && v) error.password = "" })
watch(() => form.verifyCode, v => { if (error.verifyCode && v) error.verifyCode = "" })

//登入按鈕
const handleLogin = async () => {
  // 1) 必填檢查
  error.mobile = error.password = error.verifyCode = ""
  if (!form.mobile) error.mobile = "請輸入手機號碼"
  if (!form.password) error.password = "請輸入密碼"
  if (!form.verifyCode) error.verifyCode = "請輸入驗證碼"
  if (error.mobile || error.password || error.verifyCode) return

  // 2) 驗證碼先過
  if (form.verifyCode.toLowerCase() !== realCaptcha.value.toLowerCase()) {
    error.verifyCode = "驗證碼錯誤"; return
  }

  // 3) 呼叫後端登入（會自動收 Session Cookie）
  const { ok, data } = await loginByPhonePassword({
    phone: form.mobile, password: form.password
  })

  if (ok) router.push("/member/member-content")
  else {
    if (data?.code === "0001") error.mobile = "電話不存在"
    else if (data?.code === "0002") error.password = "密碼錯誤"
    else alert(data?.msg || "登入失敗")
  }
}

const goToRegister = () => {
  router.push("/auth/signup");
};
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
            id="member_phone" 
            v-model="form.mobile"
          />
          <p class="error-msg" v-if="error.mobile">{{ error.mobile }}</p>
        </div>

        <div class="form-group">
          <label for="password">密碼</label>
          <input type="password" id="member_password" v-model="form.password" />
          <p class="error-msg" v-if="error.password">{{ error.password }}</p>
        </div>

        <div class="form-group">
          <label for="verify-code">驗證碼</label>
          <div class="captcha-input-wrapper">
            <input type="text" id="verify-code" v-model="form.verifyCode" />
            <div class="captcha-overlay">
              <CaptchaBox
                @updateIdentifyCode="onCaptchaUpdate"
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
