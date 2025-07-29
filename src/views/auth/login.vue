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
@use '@/style.scss' as *;

  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px 0;
    padding: 20px;
    // background-image:url(@/img/bgc.jpg);
    position: relative;
  }

.login-page::before {
  content: '';
  position: absolute;
  background-image: url("/src/assets/img/bg-decorate5.png");
  background-size: contain;
  background-repeat: no-repeat; 
  width: 200px;
  height: 200px;
  top: -20px;
  left: -50px;
  z-index: -1;
}

.login-page::after {
  content: '';
  position: absolute;
  // npm
  background-size: contain;
  background-repeat: no-repeat; 
  width: 200px; 
  height: 200px;
  bottom: -100px;
  right: -50px;
  z-index: -1;
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
      font-size: $font-size-p;
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
    }
  }

  @media (min-width: 768px) {

    .login-container {
      border-radius: 6px;
      padding: 50px 100px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

    h1 {
      font-size: $font-size-h2;
      font-weight: 600;
      margin-bottom: 30px;
    }

    // .button-group {
    //   display: flex;
    //   justify-content:center;
    //   gap: 100px;
    // }



    }


    .login-page::before {
      top: 0px;
      left: -300px;
      width: 700px;
      height: 400px;
    }

    .login-page::after {
      bottom: 0px;
      right: 0px;
      width: 700px;
      height: 400px;
    }





  }
</style>