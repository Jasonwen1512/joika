<script setup>
// 這裡先用假的登入者資料
const currentUser = ref({ userid: "M0001" });
import { ref, computed, h, render, onMounted, onUnmounted, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios"; // <-- 新增 axios

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { articleList } from "@/assets/data/fake-article";
import Button from "@/components/Button.vue";
import DeleteIcon from "@/assets/img/icon/delete.svg";
import SmEditIcon from "@/assets/img/icon/sm-edit.svg";
import konanImage from "@/assets/img/article/movie_konan.jpg";
import CommentComponent from "@/components/article/comment.vue"; // <-- 修改這裡
import { usePreviewStore } from "@/stores/preview";
import ReportForm from "@/components/ReportForm.vue";

const previewStore = usePreviewStore();
// console.log(previewData);

// 環境變數
const VITE_API_BASE = import.meta.env.VITE_API_BASE;

//分類顏色
const EventColorMap = {
  登山: "#6DE1D2",
  水上活動: "#77BEF0",
  運動: "#FFD63A",
  露營: "#FF8C86",
  唱歌: "#FFA955",
  展覽: "#6DE1D2",
  聚餐: "#77BEF0",
  桌遊: "#FFD63A",
  電影: "#FF8C86",
  手作: "#FFA955",
  文化體驗: "#6DE1D2",
  演出表演: "#77BEF0",
  其他: "#969696",
};
const GetEventColor = (eventName) => {
  return EventColorMap[eventName] || "#adb5bd";
};
// ===================================================================
// 1. 使用 defineProps 接收來自路由的「指令」和「預覽資料」
// ===================================================================
const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false,
  },
});

// ===================================================================
// 2. 使用 computed 智慧地決定要顯示哪一份文章資料
// ===================================================================
onUnmounted(() => {
  previewStore.isPreview = false;
});
const article = computed(() => {
  // 預覽模式
  if (previewStore.isPreview) {
    // console.log("這是預覽模式");
    // console.log(previewStore.previewData);

    return previewStore.previewData;
  }

  // 正常瀏覽模式 (保持不變)
  const postId = route.params.postid;
  if (!postId) return null;

  const foundArticle = articleList.find((item) => item.postid === postId);
  if (foundArticle) {
    return foundArticle;
  }

  return null;
});

//判斷是不是發文者
const isOwner = computed(() => {
  return article.value && currentUser.value.userid === article.value.userid;
});
function EditArticle() {
  // 防禦性檢查
  if (!article.value) {
    console.error("文章資料未載入，無法編輯");
    return;
  }
  router.push({
    name: "ArticleModify",
    params: {
      mode: "edit",
      postid: article.value.postid,
    },
  });
}

//預覽模式的送出
async function submitArticle() {
  if (props.mode === "edit") {
    // --- 未來串接 API 的位置 (更新/PUT) ---
    // await updateArticleAPI(form.postid, form);
    alert("文章更新成功！");
  } else {
    // --- 未來串接 API 的位置 (新增/POST) ---
    // const newArticle = await createArticleAPI(form);
    alert("文章發表成功！");
  }
  // 成功後跳轉回列表頁
  router.push("/article/article");
}

//刪除
function DeleteCheck() {
  Swal.fire({
    title: "確定要刪除嗎？",
    text: "文章刪除後將無法復原！",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    cancelButtonText: "取消",
    confirmButtonText: "是的，刪除它！",
    reverseButtons: true,

    buttonsStyling: false,

    customClass: {
      confirmButton: "my-swal-confirm-button",
      cancelButton: "my-swal-cancel-button",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "已刪除！",
        text: "您的文章已經被刪除。",
        icon: "success",
        buttonsStyling: false,
        customClass: {
          confirmButton: "my-swal-check-button",
        },
        // 在此處串接後端刪除 API
        // 以下為使用 fetch API 的範例
        /*
      fetch('YOUR_API_ENDPOINT/posts/YOUR_POST_ID', { // 將 YOUR_API_ENDPOINT/posts/YOUR_POST_ID 替換為你的 API 端點和文章 ID
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 如果需要，可以在這裡加入授權 token
          // 'Authorization': 'Bearer YOUR_TOKEN'
        }
      })*/
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/article/article");
        }
      });
    } else if (result.isDismissed) {
      // 如果使用者點擊了「取消」、按了 Esc 鍵或點擊視窗外部
      console.log("使用者取消了刪除操作。");
    }
  });
}
function openReportModal() {
  const container = document.createElement("div");
  render(
    h(ReportForm, {
      onSubmit: (data) => {
        console.log("檢舉資料：", data);
        Swal.close();
        Swal.fire("已送出", "感謝您的檢舉，我們會盡快處理", "success");
      },
    }),
    container
  );
  Swal.fire({
    title: "檢舉留言",
    html: container,
    showCancelButton: false,
    showConfirmButton: false,
    willClose: () => {
      render(null, container);
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
    },
    zIndex: 20000,
  });
}

//抓留言API
const comments = ref(null);
const isLoading = ref(true); // 初始設為 true
const error = ref(null);

async function fetchComments() {
  const postNo = route.params.postid;

  // 如果是預覽模式，或沒有 postid，就不要執行抓取
  if (previewStore.isPreview || !postNo) {
    comments.value = []; // 確保在預覽模式下留言是清空的
    isLoading.value = false;
    return;
  }

  console.log(`父元件：開始為文章 #${postNo} 抓取留言...`);
  isLoading.value = true;
  error.value = null;
  // comments.value = null; // 重置為 null，以配合 v-if="comments"

  axios
    .get(`${VITE_API_BASE}/comments/post-list.php?post_no=${postNo}`)
    .then((res) => {
      let allComments = [];
      console.log(res.data);

      if (res.data && Array.isArray(res.data)) {
        // 先把每一筆留言整理成統一格式
        allComments = res.data.map((c) => ({
          id: c.POST_COMMENT_NO,
          userid: c.MEMBER_ID,
          author: c.MEMBER_NICKNAME || "匿名",
          avatar:
            c.MEMBER_AVATAR || `https://i.pravatar.cc/150?u=${c.MEMBER_ID}`,
          timestamp: c.CREATED_AT,
          content: c.COMMENT_CONTENT,
          likenum: Number(c.LIKE_NUM || 0),
          liked: false,
          parentId: c.PARENT_NO, // 父留言 ID
          replies: [],
          isRepliesExpanded: false,
          animateLike: false,
        }));
      }

      // --- 關鍵步驟：把留言整理成樹狀 ---
      const commentMap = {}; // 暫存所有留言，方便用 id 查
      const rootComments = []; // 最外層留言（父留言）

      allComments.forEach((c) => {
        commentMap[c.id] = c;
      });

      allComments.forEach((c) => {
        if (c.parentId && commentMap[c.parentId]) {
          // 如果有 parentId，且 parent 存在 → 放進 parent 的 replies
          commentMap[c.parentId].replies.push(c);
        } else {
          // 沒有 parentId → 視為最上層留言
          rootComments.push(c);
        }
      });

      // 只留下父留言 (每個父留言已經帶好 replies)
      comments.value = rootComments;
    })
    .catch((err) => {
      console.error("取得文章留言失敗", err);
      error.value = "無法載入留言，請稍後再試。";
      comments.value = [];
    })
    .finally(() => {
      isLoading.value = false;
    });
}

// --- 4. 使用 watch 監聽路由變化並觸發 API ---
watch(
  () => route.params.postid,
  () => {
    fetchComments();
  },
  { immediate: true }
);
</script>

<template>
  <div class="bg"></div>
  <main>
    <!-- ================================== -->
    <!--           文章內容區塊             -->
    <!-- ================================== -->
    <section class="author-information">
      <div v-if="article" class="avatar">
        <img
          class="avatar-img"
          src="/src/assets/img/member/headshot.jpg"
          alt="Member Headshot"
        />
        <p>{{ article.userid }}</p>
      </div>
      <div v-if="!isPreview" class="btn-list">
        <template v-if="isOwner">
          <Button
            @click="EditArticle"
            :suffixIcon="SmEditIcon"
            theme="info"
            size="sm"
            >編輯</Button
          >
          <Button
            @click="DeleteCheck"
            isOutline
            :suffixIcon="DeleteIcon"
            theme="secondary"
            size="sm"
            >刪除</Button
          >
        </template>
        <template v-else>
          <Button @click="openReportModal" theme="info" size="sm">檢舉</Button>
        </template>
      </div>
    </section>

    <section class="Content">
      <div class="article" v-if="article">
        <h3>{{ article.title }}</h3>
        <div class="article-head">
          <span
            class="event-label"
            :style="{ borderColor: GetEventColor(article.event) }"
            >{{ article.event }}</span
          >
          <p>{{ article.date }}</p>
        </div>
        <span v-if="previewStore.isPreview" class="preview"
          >此為預覽模式！文章尚未送出！</span
        >
        <div class="article-img">
          <img :src="article.image" alt="文章圖片" />
        </div>
        <p v-html="article.content" alt="內文"></p>

        <div v-if="previewStore.isPreview" class="btn">
          <Button theme="primary" size="md" @click="submitArticle">
            送出
          </Button>
        </div>
      </div>
      <div v-else>
        <p>找不到這篇文章111。</p>
      </div>
    </section>
    <!-- ================================== -->
    <!--           留言系統區塊             -->
    <!-- ================================== -->
    <!-- 將父元件的 `comments` 資料，透過名為 `comments-data` 的 prop 傳給子元件 -->
    <div v-if="!isPreview" class="comments-section">
      <div v-if="isLoading">正在載入留言...</div>
      <div v-else-if="error">{{ error }}</div>
      <CommentComponent
        v-if="comments"
        :comments="comments"
        @comment-added="fetchComments"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
body {
  position: relative;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1200px;
  background-image: url("@/assets/img/support/bg.svg");
  background-size: cover;
  background-position: center;
  z-index: -1;
  pointer-events: none;
}

main {
  max-width: 1200px;
  margin: 10px auto;
  padding: 20px;
}

.author-information {
  display: flex;
  justify-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: flex-end;
  justify-content: space-between;
  align-items: center;
}

.avatar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar-img,
.comment-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.btn-list {
  display: flex;
  gap: 10px;
}

.article {
  max-width: 1200px;
  margin: 10px auto;

  display: flex;
  flex-direction: column;
  gap: 10px;
}
.article-head {
  display: flex;
  align-items: center;
  padding-block: 5px;
  position: relative;
}
.preview {
  // position: absolute;
  background-color: $tp;
  color: #f00;
  right: 0;
  font-size: $font-size-p;
  font-family: "MyFont", sans-serif;
  padding: 10px 14px;
  text-align: center;
  vertical-align: middle;
  border: 2px dotted #f00;
  border-radius: 3px;
  @include tablet() {
    border-radius: 6px;
  }
}
.event-label {
  text-align: center;
  padding: 5px;
  margin: 5px;
  border: solid 3px;
  border-radius: 6px;
  width: 80px;
}
.article-img img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

.Content {
  margin-bottom: 15vh;
}
.comment-content {
  display: grid;
  gap: 20px;
  margin-block: 30px;
}
.comment-header {
  gap: 10px;
  display: flex;
  align-items: center;
  padding-block: 10px;
}
.timestamp {
  display: block;
  text-align: right;
}
.comment-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
}

.pagination {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-block: 5vh;
}
.page {
  border: #4f8da8 2px solid;
  border-radius: 6px;
  padding: 5px 10px;
  background: #ffffff;
  cursor: pointer;
  color: #4f8da8;

  &.active {
    background: #81bfda;
    color: #000;
  }
}
.my-comment {
  background-color: #fff;
  width: 100%;
  padding: 8px 12px;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border: black 1.5px solid;
  @include desktop() {
    border-radius: 6px;
  }
}
main {
  margin-block: 5vh;
}
.comment-input {
  width: 100%;
}
.send-button {
  display: flex;
  text-align: right;
  align-items: center;
}
.action-icon img {
  width: 100%;
}
.like {
  color: #ff8c86;
  display: flex;
  align-items: center;
  gap: 5px;
}
.action-icon.animate img {
  animation: pop 0.3s ease;
}
.send-button.animate {
  animation: pop 0.3s ease;
}
@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
</style>
<style lang="scss">
//刪除燈箱的按鈕
//取消
.my-swal-cancel-button {
  margin-inline: 10px;
  font-size: 16px;
  min-width: 86px;
  min-height: 38px;
  padding: 0 10px;
  border-radius: 6px;
  color: #4f8da8; /* outline-color */
  background-color: #ffffff; /* outline-background-color */
  border: 1px solid #4f8da8; /* outline-border-color */

  /* === Hover 狀態 === */
  &:hover {
    color: #81bfda; /* outline-hover-color */
    background-color: #edf8ff; /* outline-hover-background-color */
    border-color: #81bfda; /* outline-hover-border-color */
  }

  /* === Active 狀態 === */
  &:active {
    color: #4f8da8; /* outline-active-color */
    background-color: #edf8ff; /* outline-active-background-color */
    border-color: #4f8da8; /* outline-active-border-color */
  }

  /* === Disabled 狀態 === */
  &:disabled {
    color: #d0d0d0; /* outline-disabled-color */
    background-color: #ffffff; /* outline-disabled-background-color */
    border-color: #d0d0d0; /* outline-disabled-border-color */
    cursor: not-allowed;
    opacity: 0.6;
  }
}
//確認
.my-swal-confirm-button,
.my-swal-check-button {
  margin-inline: 10px;

  font-size: 16px;
  min-width: 86px;
  min-height: 38px;
  padding: 0 10px;
  border-radius: 6px;
  color: #000;
  background-color: #fada7a;
  border: 1px solid #000;

  &:hover {
    color: #000;
    background-color: #f9ff4d;
  }

  &:active {
    color: #fff;
    background-color: #fdc520;
  }

  &:disabled {
    color: #fff;
    background-color: #d0d0d0;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

//預覽的送出
.btn {
  padding-block: 20px;
  margin: auto;
}
button {
  border-radius: 3px;
  @include desktop() {
    border-radius: 6px;
  }
}
</style>
