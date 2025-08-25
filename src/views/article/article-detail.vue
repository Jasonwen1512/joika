<script setup>
import { ref, computed, h, render, onMounted, onUnmounted, watch } from "vue";
import axios from "axios"; // <-- 新增 axio
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { usePreviewStore } from "@/stores/preview";
import { authState } from "@/assets/data/authState";

//引入元件
// import { articleList } from "@/assets/data/fake-article"; 假資料已再不使用
import Button from "@/components/Button.vue";
import CommentComponent from "@/components/article/comment.vue"; // <-- 修改這裡
import ReportForm from "@/components/ReportForm.vue";
//引入靜態資源
import DeleteIcon from "@/assets/img/icon/delete.svg";
import SmEditIcon from "@/assets/img/icon/sm-edit.svg";
import konanImage from "@/assets/img/article/movie_konan.jpg";
import defaultImg from "@/assets/img/article/nopicture.jpg";

// 這裡先用假的登入者資料
// 假的自己 展示用
// const currentUser = {
//   member_id: authState.user.id, // 假設這是當前使用者的 ID
//   author: authState.user.nickname, // 您的名字
//   avatar: "https://i.pravatar.cc/150?u=me", // 一個代表您自己的頭像
//   replies: [],
// };
// console.log({ currentUser });

// 環境變數與初始設定
const previewStore = usePreviewStore();
const route = useRoute();
const router = useRouter();
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const coverFile = ref(null);
const currentUser = ref({
  member_id: null,
  author: "",
  avatar: "",
  replies: [],
});
//抓是預覽模式是從編輯還是發文送出
const mode = computed(() => route.query.mode || "create");
async function fetchCurrentUser() {
  try {
    const res = await axios.get(`${VITE_API_BASE}/users/me.php`, {
      withCredentials: true, // 若有跨域 session
    });
    if (res.data.authenticated && res.data.user) {
      currentUser.value.member_id = res.data.user.id;
      currentUser.value.author = res.data.user.nickname;
      currentUser.value.avatar =
        res.data.user.avatar ||
        `https://i.pravatar.cc/150?u=${res.data.user.id}`;
      console.log("取得登入者資料：", res.data);
      console.log("currentUser:", currentUser.value);
    }
  } catch (err) {
    console.error("取得登入者資料失敗", err);
  }
}
// ===================================================================
// Props 定義 (Single Source of Truth)
// 【重要】我們需要 'mode' prop 來讓 'submitArticle' 函式正常運作
// ===================================================================
const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false,
  },
  mode: {
    // 【新增】補上您在 submitArticle 中用到的 mode
    type: String,
    default: "create", // 'create' 或 'edit'
  },
});
//分類顏色
const EventColorMap = {
  登山: "#6DE1D2",
  桌遊: "#FFD63A",
  運動: "#FFD63A",
  露營: "#FF8C86",
  唱歌: "#FFA955",
  展覽: "#6DE1D2",
  水上活動: "#77BEF0",
  聚餐: "#77BEF0",
  電影: "#FF8C86",
  手作: "#FFA955",
  文化體驗: "#6DE1D2",
  演出表演: "#77BEF0",
  其他: "#969696",
};
const GetEventColor = (eventName) => {
  return EventColorMap[eventName] || "#adb5bd";
};

// 將後端 API 的分類 ID (數字) 轉換為中文名稱的對照表
const categoryMap = {
  1: "登山",
  2: "桌遊",
  3: "運動",
  4: "露營",
  5: "唱歌",
  6: "展覽",
  7: "水上活動",
  8: "聚餐",
  9: "電影",
  10: "手作",
  11: "文化體驗",
  12: "演出表演",
  13: "其他",
};

// 文章區塊的狀態
const apiArticleData = ref(null);
const postError = ref(null);
const postIsLoading = ref(true);
// ===================================================================
// 使用 computed 智慧地決定要顯示哪一份文章資料
// ===================================================================
// onMounted(async () => {
//   if (!previewStore.isPreview) {
//     try {
//       const postNo= route.params.postid;
//       if (!postNo) {
//         throw new Error('找不到文章 ID');
//       }

//       const response = await axios.get(`http://localhost/your_api_path/getArticle.php?id=${postNo}`);

//       if (response.status === 200) {
//         apiArticleData.value = response.data;
//       } else {
//         throw new Error(response.data.error || '載入文章失敗');
//       }

//     } catch (err) {
//       // 將錯誤訊息存入更名後的 postError
//       if (err.response) {
//         postError.value = err.response.data.error || '發生未知的伺服器錯誤';
//       } else if (err.request) {
//         postError.value = '無法連線到伺服器';
//       } else {
//         postError.value = err.message || '載入文章時發生錯誤';
//       }
//       console.error('API 請求失敗:', err);
//     } finally {
//       // 更新更名後的 postIsLoading
//       postIsLoading.value = false;
//     }
//   } else {
//     // 預覽模式，同樣更新更名後的 postIsLoading
//     postIsLoading.value = false;
//   }
// });

// const article = computed(() => {
//   if (previewStore.isPreview) {
//     return previewStore.previewData;
//   } else {
//     return apiArticleData.value;
//   }
// });

// computed 屬性：根據 props 決定最終要顯示的文章資料
const article = computed(() => {
  // 【關鍵修改】統一使用 props.isPreview 進行判斷
  if (props.isPreview) {
    return previewStore.previewData; // 預覽模式，從 Store 取資料
  } else {
    return apiArticleData.value; // 一般模式，從 API 取資料
  }
});

// computed 屬性：判斷是否為文章擁有者
const isOwner = computed(() => {
  return (
    article.value && currentUser.value.member_id === article.value.post_user_id
  ); // 請確認資料庫欄位名稱是否為 POST_USER_ID
});

// 生命週期鉤子：在元件掛載時獲取資料
onMounted(() => {
  fetchCurrentUser();
  fetchArticle();
  fetchComments();
});

// 監聽路由參數變化，以便在不同文章間切換時重新載入資料
watch(
  () => route.params.postid,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchArticle();
      fetchComments();
    }
  }
);

// 函式：獲取文章內容
async function fetchArticle() {
  console.log("fetchArticle 函式已開始執行..."); // 偵錯用

  // 【關鍵修改】如果是預覽模式，就直接結束，不發送 API 請求
  if (props.isPreview) {
    postIsLoading.value = false;
    console.log("正在預覽模式"); // 偵錯用

    return;
  }

  postIsLoading.value = true;
  postError.value = null;
  const postNo = route.params.postid;
  if (!postNo) {
    postError.value = "找不到文章 ID";
    postIsLoading.value = false;
    return;
  }

  try {
    // 【修改】請將 URL 換成您 PHP API 的實際位址
    const response = await axios.get(
      `${VITE_API_BASE}/posts/detail.php?id=${postNo}`
    );
    // 資料欄位轉換
    const raw = response.data;
    // --- 處理圖片路徑 ---
    const backendImagePath = raw.POST_IMG;
    let fullImageUrl = defaultImg; // 先設定為預設圖片

    if (backendImagePath && typeof backendImagePath === "string") {
      const cleanedPath = backendImagePath.replace(/^\.\.\//, "");
      fullImageUrl = `${import.meta.env.VITE_API_BASE}/${cleanedPath}`;
    }
    apiArticleData.value = {
      postid: raw.POST_NO,
      title: raw.POST_TITLE,
      post_user_id: raw.MEMBER_ID,
      nickname: raw.MEMBER_NICKNAME,
      content: raw.POST_CONTENT,
      image: fullImageUrl,
      date: raw.CREATED_AT,
      event: raw.CATEGORY_NO,
    };
  } catch (err) {
    if (err.response) {
      postError.value = err.response.data.error || "發生未知的伺服器錯誤";
    } else if (err.request) {
      postError.value = "無法連線到伺服器";
    } else {
      postError.value = err.message || "載入文章時發生錯誤";
    }
    console.error("獲取文章失敗:", err);
  } finally {
    postIsLoading.value = false;
  }
}

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

async function submitArticle() {
  // 取得預覽資料
  const previewData = previewStore.previewData;

  // 取得分類編號
  const categories = [
    "登山",
    "桌遊",
    "運動",
    "露營",
    "唱歌",
    "展覽",
    "水上活動",
    "聚餐",
    "電影",
    "手作",
    "文化體驗",
    "演出表演",
    "其他",
  ];
  const categoryIndex = categories.indexOf(previewData.event);
  const categoryNo = categoryIndex >= 0 ? categoryIndex + 1 : null;

  // if (!categoryNo) {
  //   alert("請選擇有效的分類");
  //   return;
  // }

  const formData = new FormData();
  formData.append("category_no", categoryNo);
  formData.append("post_title", previewData.title);
  formData.append("post_content", previewData.content);

  // 編輯模式要加 post_no
  if (mode.value === "edit") {
    formData.append("post_no", previewData.postid);
  }
  // 圖片檔案來源
  const previewCoverFile = previewData.coverFile || coverFile.value;
  if (previewCoverFile) {
    formData.append("post_img", previewCoverFile);
  }

  // 判斷 API 路徑
  const apiUrl =
    mode.value === "edit"
      ? `${VITE_API_BASE}/posts/update.php`
      : `${VITE_API_BASE}/posts/create.php`;

  try {
    const res = await axios.post(apiUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    if (res.data.ok) {
      alert(mode.value === "edit" ? "文章更新成功！" : "文章發表成功！");
      router.push("/article/article");
    } else {
      throw new Error(res.data.error || "送出失敗");
    }
  } catch (err) {
    alert("送出失敗：" + (err?.message || "請稍後再試"));
  }
}
//刪除文章功能
function DeleteCheck() {
  if (!article.value) return; // 保險

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
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    try {
      // 真正呼叫後端刪除 API（POST: post_no）
      const params = new URLSearchParams();
      params.append("post_no", String(article.value.postid));
      // params.append("hard", "1"); // 若要從資料庫完全刪除才打開

      const res = await axios.post(
        `${VITE_API_BASE}/posts/delete.php`,
        params,
        { withCredentials: true } // 帶 cookie（PHPSESSID）
      );

      if (res.data?.ok) {
        await Swal.fire({
          title: "已刪除！",
          text: "您的文章已經被刪除。",
          icon: "success",
          buttonsStyling: false,
          customClass: { confirmButton: "my-swal-check-button" },
        });
        router.push("/article/article");
      } else {
        throw new Error(res.data?.error || "刪除失敗");
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.error ||
        (status === 401
          ? "請先登入會員"
          : status === 403
          ? "沒有刪除權限"
          : status === 404
          ? "找不到文章"
          : "刪除失敗，請稍後再試");

      await Swal.fire({ icon: "error", title: "刪除失敗", text: msg });
    }
  });
}

//文章檢舉功能
function openReportModal() {
  const container = document.createElement("div");

  render(
    h(ReportForm, {
      onSubmit: async (data) => {
        const baseURL = import.meta.env.VITE_API_BASE;
        const postNo = article.value?.postid;

        if (!postNo) {
          Swal.fire("錯誤", "找不到文章編號", "error");
          return;
        }

        // 後端用 Session 取 member_id，不再傳 reporter_id
        const payload = {
          post_no: Number(postNo),
          report_reason_no: Number(data.reason),
          report_description: (data.detail || "").trim(),
        };
        // console.log('report payload:', payload);

        try {
          const res = await axios.post(
            `${baseURL}/reports/post-report.php`,
            {
              reporter_id: reporterId,
              post_no: postNo,
              report_reason_no: Number(data.reason),
              report_description: data.detail,
            },
            {
              withCredentials: true, // 這個一定要加
            }
          );

          if (res.data.ok) {
            Swal.close();
            Swal.fire("已送出", "感謝您的檢舉，我們會盡快處理", "success");
          } else {
            Swal.fire("送出失敗", resp?.error || "請稍後再試", "error");
          }
        } catch (error) {
          console.error("檢舉 API 錯誤：", error);
          const msg =
            error?.response?.data?.error || error.message || "發送失敗，請稍後再試";
          Swal.fire("錯誤", msg, "error");
        }
      },
    }),
    container
  );

  // 
  Swal.fire({
    title: "檢舉文章",
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
//留言的狀態
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

  // console.log(`父元件：開始為文章 #${postNo} 抓取留言...`);
  isLoading.value = true;
  error.value = null;
  // comments.value = null; // 重置為 null，以配合 v-if="comments"

  axios
    .get(`${VITE_API_BASE}/comments/post-list.php?post_no=${postNo}`)
    .then((res) => {
      let allComments = [];
      // console.log(res.data);

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
          likenum: Number(c.LIKE_COUNT || 0),
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

// 清理函式 (Cleanup)
onUnmounted(() => {
  previewStore.isPreview = false;
});
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
        <p>{{ article.nickname }}</p>
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
            :style="{
              borderColor: GetEventColor(
                typeof article.event === 'number'
                  ? categoryMap[article.event]
                  : article.event
              ),
            }"
          >
            {{
              typeof article.event === "number"
                ? categoryMap[article.event]
                : article.event
            }}
          </span>
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
        <p>找不到這篇文章。</p>
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
        :current-user="currentUser"
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
