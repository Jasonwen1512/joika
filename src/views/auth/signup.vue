<script setup>
  import { ref } from 'vue';
  import Button from '@/components/Button.vue';

  const currentStep = ref(1)

  const goNext = () => {
    if (currentStep.value < 3) {
      currentStep.value++
      console.log(`Current Step: ${currentStep.value}`)
    }
  }

</script>

<template>
  <div class="registration">
    <div class="registration-container">
      <div class="registration-header">
        <h1> 註冊</h1>
          <ul class="progress-bar" id="progress-bar">
            <li :class="['progress-step', currentStep >= 1 ? 'active' : '']" data-step="1">
              <div class="step-label">帳號申請</div>
              <div class="step-circle"></div>
            </li>
            <li :class="['progress-step', currentStep >= 2 ? 'active' : '']" data-step="2">
              <div class="step-label">基本資料</div>
              <div class="step-circle"></div>
            </li>
            <li :class="['progress-step', currentStep === 3 ? 'active' : '']" data-step="3">
              <div class="step-label">註冊完成</div>
              <div class="step-circle"></div>
            </li>
          </ul>
      </div>

    <!--步驟1-->
    <section v-if="currentStep === 1" class="form-step active">
      <form>
        <div class="form-group">
          <label for="email">信箱</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="phone">手機</label>
            <input type="tel" id="phone" name="phone" required>
        </div>
        <div class="form-group">
            <label for="password">密碼</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div class="form-group">
            <label for="confirm-password">確認密碼</label>
            <input type="password" id="confirm-password" name="confirm-password" required>
        </div>
        <div class="tos-group">
            <input type="checkbox" id="tos" name="tos" required>
            <label for="tos">我已閱讀並同意 JOIKA 會員條款</label>
        </div>

        <div class="button-group">
          <Button size="md" theme="primary" @click="goNext">送出</Button>
        </div>
      </form>
    </section>

    <!-- 步驟 2-->
    <section v-if="currentStep === 2" class="form-step">
      <form>
        <div class="avatar-upload">
            <label for="avatar-input">
                <div class="avatar-circle">頭貼上傳</div>
            </label>
            <input type="file" id="avatar-input" accept="image/*">
        </div>
        <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="nickname">暱稱</label>
            <input type="text" id="nickname" name="nickname" required>
        </div>
        <div class="form-group">
            <label for="gender">性別</label>
            <input type="text" id="gender" name="gender" required>
        </div>
        <div class="form-group">
            <label for="birthdate">生日</label>
            <input type="text" id="birthdate" name="birthdate" placeholder="例如: 1990/01/01" required>
        </div>
        <div class="form-group">
            <label for="location">居住地</label>
            <input type="text" id="location" name="location" required>
        </div>
        <div class="form-group">
            <label for="occupation">職業</label>
            <input type="text" id="occupation" name="occupation" required>
        </div>
        <div class="form-group">
            <label for="interests">興趣</label>
            <input type="text" id="interests" name="interests" required>
        </div>
        <div class="button-group">
          <Button size="md" theme="primary" @click="goNext">下一步</Button>
        </div>
      </form>
    </section>

    <!-- 步驟 3: 註冊完成 -->
    <section v-if="currentStep === 3" class="form-step">
        <h2>註冊成功</h2>
        <p class="subtitle">就差一點點就能一起出發啦！</p>
        <p class="info">我們正在確認您的資料，審核通過後就可以開始揪團玩樂囉</p>
    </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use '@/style.scss' as *;

  *{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .registration {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px 0;
    padding: 20px;
    position: relative;
  }

  .registration-container {
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

    .registration-header{
      align-items: center;
      margin-bottom: 30px;
    }

    .progress-bar{
      display: flex;
      justify-content: space-between;
      align-items: center;
      list-style: none;
      position: relative;
      margin: 0 auto;
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

        &.active{
          background-color: $blue;
        }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 100%;
        width: 100px;
        height: 2px;
        background-color: $black;
        transform: translateY(-50%);
      }
    }

  &:last-child .step-circle::after {
    display: none;
  }
}
  
  .step-label {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .form-step {
      display: none;
  }
  .form-step.active {
      display: block;
  }

    .form-group {
      margin-bottom: 30px;
    }

    label {
      display: block;
      margin-bottom: 8px;
    }

    input[type="email"],
    input[type="text"],
    input[type="password"],
    input[type="tel"] {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid $black;
      border-radius: 3px;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        outline: none;
        border-color: $color-primary;
        box-shadow: 0 0 0 2px rgba($color-primary, 0.3);
      }
    }

    .tos-group{
      display: flex;
      gap: 10px;
      margin-bottom: 30px;

      input{
        width: 16px;
      }

      label{
        margin: 0px;
      }
    }

  .button-group {
    display: flex;
    justify-content: center;
  }
}
</style>
