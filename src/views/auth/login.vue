<script setup>
import { reactive, ref, watch, createApp} from "vue";
import Button from "@/components/Button.vue";
import CaptchaBox from "@/components/auth/CaptchaBox.vue";
import Swal from "sweetalert2"
import { useRouter, useRoute } from "vue-router";
import { loginByPhonePassword,fetchMe } from "@/assets/data/authState";
import ForgotPasswordModal from "@/components/member/member-content/ForgotPasswordModal.vue";

const realCaptcha = ref(""); // 接住 emit 的驗證碼

// ✅ 專用接收器：保證 realCaptcha 保持是 ref，不會被改壞成字串
const onCaptchaUpdate = (val) => {
  realCaptcha.value = String(val || '')
  console.log('[login] captcha =', realCaptcha.value)  
}

const router = useRouter();
const route = useRoute();
const captchaRef = ref(null);

const error = reactive({ mobile: "", password: "", verifyCode: "" });
const form = reactive({ mobile: "", password: "", verifyCode: "" });

const loading = ref(false);

// 即時輸入清除錯誤
watch(() => form.mobile, v => { if (error.mobile && v) error.mobile = "" })
watch(() => form.password, v => { if (error.password && v) error.password = "" })
watch(() => form.verifyCode, v => { if (error.verifyCode && v) error.verifyCode = "" })

//登入按鈕
const handleLogin = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    // 1) 必填檢查
    error.mobile = error.password = error.verifyCode = "";
    form.mobile = String(form.mobile || "").trim();
    form.password = String(form.password || "");
    form.verifyCode = String(form.verifyCode || "");

    if (!form.mobile)   { error.mobile = "請輸入手機號碼"; return }
    if (!form.password) { error.password = "請輸入密碼";   return }
    if (!form.verifyCode) { error.verifyCode = "請輸入驗證碼"; return }

    // 2) 驗證碼先過
    if (form.verifyCode.toLowerCase() !== realCaptcha.value.toLowerCase()) {
      await Swal.fire({ icon: "error", title: "登入失敗", text: "驗證碼錯誤" });
      captchaRef?.value?.refreshCode?.();
      return;
    }

    // 3) 呼叫後端登入
    const { ok, data } = await loginByPhonePassword({
      phone: form.mobile, password: form.password
    });

    if (ok) {
      await Swal.fire({ icon: "success", title: "登入成功", timer: 900, showConfirmButton: false });
      const back = (typeof route.query.redirect === 'string' && route.query.redirect)
        ? route.query.redirect
        : "/member/member-content";
      router.replace(back);
    } else {
      await Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: data?.msg || "帳號或密碼錯誤"
      });
      captchaRef?.value?.refreshCode?.();
      return;
    }
  } catch (err) {
    await Swal.fire({ icon: "error", title: "登入失敗", text: "連線異常，請稍後再試" });
    captchaRef?.value?.refreshCode?.();
  } finally {
    loading.value = false; // ✅ 無論哪個 return 都會執行
  }
};
const goToRegister = () => {
  router.push("/auth/signup");
};

const openForgot = async () => {
  let app; // 保存 Vue app 實例，關閉時卸載
  await Swal.fire({
    // 1) 放一個掛載點
    html: '<div id="fp-root"></div>',
    // 2) 交給我們自己的元件處理按鈕，所以關掉 Swal 內建按鈕
    showConfirmButton: false,
    showCancelButton: false,
    // 3) 自訂彈窗外觀（可選）
    customClass: {
      popup: 'swal-reset-popup'
    },
    // 4) 掛元件
    didOpen: () => {
      const el = document.getElementById('fp-root');
      app = createApp(ForgotPasswordModal, {
        // 傳入函式 props：元件內會 await 這個 Promise
        async onSubmit(email) {
          // ===== 這裡做「寄出重設信」的 API 呼叫 =====
          try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/forgot-password.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ email })
            });
            const data = await res.json();
            // 關掉內層彈窗，再開結果彈窗（避免「彈窗疊彈窗」不好關）
            Swal.close();
            if (res.ok && data?.code === '0000') {
              await Swal.fire({ icon: 'success', title: '已寄出', text: '若信箱存在，將收到重設連結' });
            } else {
              await Swal.fire({ icon: 'error', title: '送出失敗', text: data?.msg || '請稍後再試' });
            }
          } catch (e) {
            Swal.close();
            await Swal.fire({ icon: 'error', title: '連線異常', text: '請稍後再試' });
          }
        },
        onCancel() {
          Swal.close();
        }
      });
      app.mount(el);
    },
    willClose: () => {
      if (app) app.unmount();
    }
  });
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
            id="mobile"                 
            v-model="form.mobile"
            autocomplete="username" 
            :disabled="loading"
          />
          <p class="error-msg" v-if="error.mobile">{{ error.mobile }}</p>
        </div>

        <div class="form-group">
          <label for="password">密碼</label>
          <input
            type="password"
            id="password"               
            v-model="form.password"
            autocomplete="current-password" 
            :disabled="loading"
          />
          <p class="error-msg" v-if="error.password">{{ error.password }}</p>
        </div>

        <div class="form-group">
          <label for="verify-code">驗證碼</label>
          <div class="captcha-input-wrapper">
            <input
              type="text"
              id="verify-code"
              v-model="form.verifyCode"
              :disabled="loading"
            />
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
          <p class="error-msg" v-if="error.verifyCode">{{ error.verifyCode }}</p>
        </div>

  <a href="#" class="forgot-password" @click.prevent="openForgot">忘記密碼</a>

  <div class="button-group">
    <Button size="lg" theme="info" type="button" @click="goToRegister" :disabled="loading">註冊</Button>
    <Button size="lg" theme="primary" type="submit" :disabled="loading">
      {{ loading ? '登入中…' : '登入' }}
    </Button>
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
