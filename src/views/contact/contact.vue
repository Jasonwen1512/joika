<script setup>
import Button from "@/components/Button.vue";
import { ref, watch, onMounted } from "vue";
import contactbg from "@/assets/img/bg-contact.svg?url";
import AirPlane from "@/assets/img/article/airplane.png";
import PostBox from "@/assets/img/article/postbox.png";
import Swal from "sweetalert2";
import axios from "axios";

// 標題字
const titleText = ref("聯絡我們");
const isVisible = ref(false);

// 會員檢查
onMounted(async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE}/users/me.php`,
      { withCredentials: true }
    );
    if (res.data.authenticated && res.data.user) {
      isVisible.value = true;
      name.value = res.data.user.nickname || res.data.user.name || "";
      phone.value = res.data.user.phone || "";
      email.value = res.data.user.email || "";
      memberId.value = res.data.user.id || "";
    } else {
      throw new Error("未登入");
    }
  } catch (err) {
    console.error("會員驗證失敗", err);
    Swal.fire("未登入", "請先登入會員才能使用聯絡表單", "warning").then(() => {
      window.location.href = `${import.meta.env.BASE_URL}auth/login`;
    });
  }
});

// --- 新增部分 ---
// 為每個輸入框建立一個 ref 來儲存其值
const name = ref("");
const phone = ref("");
const email = ref("");
const subject = ref("");
const content = ref("");
const memberId = ref(""); // 新增會員ID

// const isModalVisible = ref(false);
// const submittedData = ref({});

const Submit = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE}/contact/submit.php`,
      {
        member_id: memberId.value,
        member_phone: phone.value,
        member_email: email.value,
        form_title: subject.value,
        form_content: content.value,
      },
      { withCredentials: true }
    );
    if (res.data.success) {
      Swal.fire("送出成功", "我們已收到您的聯絡事項", "success");
      subject.value = "";
      content.value = "";
    } else {
      Swal.fire("送出失敗", res.data.message || "請稍後再試", "error");
    }
  } catch (err) {
    Swal.fire("錯誤", err.message || "伺服器錯誤", "error");
  }
};
</script>

<template>
  <!-- 這是聯絡表單頁 -->

  <main class="contact">
    <div class="bg" :style="{ backgroundImage: `url(${contactbg})` }">
      <img class="bg-airplane" :src="AirPlane" alt="背景插圖飛機" />
      <img class="bg-postbox" :src="PostBox" alt="背景圖郵筒" />

      <div class="contact-form">
        <div>
          <h3 class="title">
            <span
              v-for="(char, index) in titleText.split('')"
              :key="index"
              :style="`--index: ${index}`"
              :class="{ show: isVisible }"
            >
              {{ char }}
            </span>
          </h3>
        </div>
        <form @submit.prevent="Submit">
          <label>姓名</label>
          <input
            class="inputbox"
            type="text"
            placeholder="請輸入姓名"
            v-model="name"
          />
          <label>手機</label>
          <input
            class="inputbox"
            type="tel"
            placeholder="請輸入手機號碼"
            v-model="phone"
          />
          <label>E-mail</label>
          <input
            class="inputbox"
            type="email"
            placeholder="請輸入 E-mail"
            v-model="email"
          />
          <label>問題標題</label>
          <input class="inputbox" type="text" v-model="subject" />
          <label>內容</label>
          <textarea class="inputbox-l" type="text" v-model="content" />

          <Button class="submitbtn" theme="primary" size="md"> 送出</Button>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.bg {
  z-index: -1;
  background-image: v-bind(contactbg);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top;

  // @include tablet() {
  //   background-image: v-bind(contactbg);
  //   background-repeat: no-repeat;
  //   background-size: cover;
  //   background-position: center;
  // }
}
.bg-airplane {
  display: none;
  width: 200px;
  height: auto;
  z-index: 3;
  position: absolute;
  right: 4vw;
  top: 25vh;
  animation: float 4s ease-in-out infinite;
  @include desktop() {
    display: block;
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3vh) translateX(3vh);
  }
  100% {
    transform: translateY(0);
  }
}

.bg-postbox {
  display: none;
  width: 250px;
  height: auto;
  z-index: -1;
  position: absolute;
  left: 0px;
  bottom: -50px;
  @include desktop() {
    display: block;
  }
}
form {
  max-width: 756px;
  margin-inline: auto;
  margin-bottom: 15vh;
}

@keyframes showLetter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-block: 3vh;
  @include desktop() {
    font-size: 32px;
  }
}

.title span {
  display: inline-block;
  opacity: 0;
}

.title span.show {
  animation: showLetter 0.5s cubic-bezier(0.34, 2.55, 0.64, 1)
    calc(var(--index) * 0.1s) forwards;
}

.contact-form {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}
form {
  display: grid;
  gap: 20px;
}
.inputbox,
.inputbox-l {
  background-color: #fff;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  // box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border: black 1.5px solid;
  @include desktop() {
    border-radius: 6px;
  }
}
.inputbox-l {
  height: 200px;
}
.submitbtn {
  margin: auto;
}
input {
}
</style>
