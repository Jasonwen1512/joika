
<script setup>
  import { reactive } from 'vue';
  import Button from '@/components/Button.vue';
  

  // 使用 reactive 建立一個響應式的表單資料物件
  const form = reactive({
    mobile: '',
    password: '',
    verifyCode: '',
  });

  // 定義表單提交的處理函式
  const handleLogin = () => {
    // 在這裡處理登入邏輯，例如發送 API 請求
    // 目前先在控制台印出表單資料
    console.log('表單已提交:', {
      mobile: form.mobile,
      password: form.password,
      verifyCode: form.verifyCode,
    });

    // 實際應用中可能會像這樣：
    // try {
    //   const response = await api.login(form);
    //   // 登入成功，導向到其他頁面
    // } catch (error) {
    //   // 顯示錯誤訊息
    // }
  };
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <form @submit.prevent="handleLogin">
        <h1>登入</h1>

        <div class="form-group">
          <label for="mobile">手機</label>
          <input type="tel" id="mobile" v-model="form.mobile">
        </div>

        <div class="form-group">
          <label for="password">密碼</label>
          <input type="password" id="password" v-model="form.password">
        </div>

        <div class="form-group">
          <label for="verify-code">驗證碼</label>
          <div class="verification-group">
            <input type="text" id="verify-code" v-model="form.verifyCode">
            <div class="verification-code-box"></div>
          </div>
        </div>

        <a href="#" class="forgot-password">忘記密碼</a>

        <div class="button-group">
          <Button size="md" theme="info">註冊</Button>
          <Button size="md" theme="primary">登入</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
  /* --- Sass 變數定義 --- */
  $bg-container: #ffffff;
  $bg-image: #FEFDF9;
  $primary-color: #F7D97A; // 登入按鈕
  $secondary-color: #FDF5E6; // 註冊按鈕
  $input-border-color: #81BFDA;
  $secondary-border-color: #EADDC5;
  $text-color: #333;
  $label-color: #555;
  $border-color: #ccc;
  $link-color: #007bff;

  /* --- 主要頁面樣式 --- */


  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-image:url(@/img/bgc.jpg);
  }

  /* --- 登入容器樣式 --- */
  .login-container {
    width: 100%;
    max-width: 500px;
    background-color: $bg-container;
    padding: 30px;
    border: 1px solid #EAEAEA;
    border-radius: 3px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    h1 {
      text-align: center;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 30px;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: $label-color;
    }

    input[type="text"],
    input[type="password"],
    input[type="tel"] {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid $border-color;
      border-radius: 4px;
      font-size: 16px;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        outline: none;
        border-color: $input-border-color;
        box-shadow: 0 0 0 2px rgba($input-border-color, 0.3);
      }
    }

    .verification-group {
      display: flex;
      align-items: center;
      gap: 10px;

      input {
        flex-grow: 1;
      }

      .verification-code-box {
        width: 120px;
        height: 47px;
        background-color: #E0E0E0;
        border-radius: 4px;
        flex-shrink: 0;
      }
    }

    .forgot-password {
      display: block;
      text-align: right;
      margin-top: 10px;
      margin-bottom: 25px;
      font-size: 14px;
      color: $link-color;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .button-group {
      display: flex;
      justify-content: space-between;
      gap: 15px;
    }

  }

  /* --- 響應式設計 (RWD) --- */
  /* 當螢幕寬度大於等於 768px 時 (對應您提到的電腦版) */
  @media (min-width: 768px) {

    .login-container {
      // 在大螢幕上，容器樣式不需大改，
      // max-width 屬性會確保它不會變得過寬，
      // 而 login-page 的 flex 屬性會讓它保持置中。
      // 可以加個陰影讓它更立體
      border-radius: 6px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
  }
</style>