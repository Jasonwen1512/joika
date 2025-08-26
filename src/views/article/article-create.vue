<script setup>
import axios from "axios";
import { reactive, ref, watch, toRefs, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router"; // 引入 useRoute
import { articleList } from "@/assets/data/fake-article";
import tinymce from "tinymce/tinymce.js";
import Button from "@/components/Button.vue";
import bgImgUrl from "@/assets/img/support/bg.svg?url";
import articleimg from "@/assets/img/article/article-img.png?url";
import Illustration from "@/components/article/Illustration.vue";
import AirPlane from "@/assets/img/article/airplane.png";
import Swal from "sweetalert2";
// ... (外觀、Icon、其他外掛的 import 省略，請保留您原有的) ...
import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/themes/silver";
import "tinymce/icons/default";
// import "tinymce/plugins/emoticons";
// import "tinymce/plugins/emoticons/js/emojis.js";
import "tinymce/plugins/table";
import "tinymce/plugins/quickbars";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/image"; // 確保 image 外掛已引入

// 語言包
import "tinymce-i18n/langs5/zh_TW.js";

import Editor from "@tinymce/tinymce-vue";

import { usePreviewStore } from "@/stores/preview";

const previewStore = usePreviewStore();
// 環境變數
const VITE_API_BASE = import.meta.env.VITE_API_BASE;

// --- Props (保持不變) ---
const title = ref(null);
const props = defineProps({
  // ===== 新增的 Props，用於接收路由指令 =====
  mode: {
    type: String, // 'create' or 'edit'
    required: true,
  },
  postid: {
    type: String, // 在 create 模式下會是 undefined
    default: null,
  },
  modelValue: { type: String, default: "" },
  plugins: {
    type: [String, Array],
    default: "quickbars  table autoresize image",
  },
  toolbar: {
    type: [String, Array],
    default:
      "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | image | removeformat | table | emoticons",
  },
});
const emit = defineEmits(["update:modelValue"]);
const router = useRouter();
// 【新增】建立統一的表單資料物件，用來綁定所有欄位

const form = reactive({
  postid: null,
  userid: "test", // 可換成實際登入者資料
  title: "",
  content: "", // 這個將與 TinyMCE 的內容保持同步
  event: "",
  type: "揪團心得",
  date: new Date().toLocaleDateString("sv"), // YYYY-MM-DD
  image: "", // 預設圖片
});

// === 新增：首圖上傳（檔案與預覽） ===
const coverFile = ref(null);
const coverPreview = ref(""); // Object URL for preview
function onCoverChange(e) {
  const file = e.target.files?.[0];
  if (!file) {
    coverFile.value = null;
    coverPreview.value = "";
    return;
  }
  coverFile.value = file;
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value);
  coverPreview.value = URL.createObjectURL(file);
}
// 清理預覽 URL（避免記憶體洩漏）
onBeforeUnmount(() => {
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value);
});
// === 新增結束 ===

// 3.【關鍵】當處於「編輯模式」時，載入舊資料
onMounted(() => {
  window.addEventListener("resize", handleResize);
  isVisible.value = true;

  if (props.mode === "edit" && props.postid) {
    titleText.value = "編輯你的故事";
    // 串接資料庫 API 抓文章
    axios
      .get(`${VITE_API_BASE}/posts/detail.php?id=${props.postid}`)
      .then((response) => {
        const raw = response.data;
        // 處理圖片路徑（依你的資料庫欄位調整）
        const backendImagePath = raw.POST_IMG || "";
        const cleanedPath = backendImagePath.replace(/^\.\.\//, "");
        const fullImageUrl = `${VITE_API_BASE}/${cleanedPath}`;

        // 填入表單
        Object.assign(form, {
          postid: raw.POST_NO,
          userid: raw.MEMBER_ID,
          title: raw.POST_TITLE,
          content: raw.POST_CONTENT,
          event: raw.CATEGORY_NO,
          type: "揪團心得", // 可依你的資料庫欄位調整
          date: raw.CREATED_AT,
          image: fullImageUrl,
        });
      })
      .catch((err) => {
        console.error("找不到要編輯的文章！", err);
        router.push("/article/article");
      });
  } else {
    titleText.value = "今天想說點什麼？";
  }
});
// 4.【函式區】處理使用者操作
function previewArticle() {
  Object.assign(previewStore.previewData, form);
  previewStore.previewData.coverFile = coverFile.value; // ← 關鍵補這行  預覽模式也要帶首圖

  previewStore.isPreview = true;
  router.push({
    name: "ArticlePreview",
    query: { mode: props.mode }, // 用 query 傳遞
  });
  // 當點擊預覽時，將整個 form 物件透過 history.state 傳遞
  // router.push({
  //   name: "ArticlePreview",
  //   // 【修改】不再使用 params，改用 state
  //   state: {
  //     // 我們將資料包裹在一個自訂的鍵 (例如 'previewData') 裡面
  //     previewData: form,
  //   },
  // });
}
//專門給 TinyMCE 編輯器 v-model 使用的 ref
const editorContent = ref(props.modelValue);
// 【監聽 1】當使用者在編輯器中輸入時，將新內容同步到 form.content
watch(editorContent, (newValue) => {
  form.content = newValue;
});

// 【監聽 2】當 form.content 被程式碼修改時 (例如在 onMounted 中)，將變更同步給編輯器
watch(
  () => form.content,
  (newValue) => {
    editorContent.value = newValue;
  }
);
async function submitArticle() {
  const categoryIndex = categories.indexOf(form.event);
  const categoryNo = categoryIndex >= 0 ? categoryIndex + 1 : null;

  if (!categoryNo) {
    alert("請選擇有效的分類");
    return;
  }
  const formData = new FormData();
  formData.append("category_no", categoryNo);
  formData.append("post_title", form.title);
  formData.append("post_content", form.content);
  if (coverFile.value) {
    formData.append("post_img", coverFile.value);
  }
  // 這裡可以根據 mode 決定要呼叫哪個 API
  let apiUrl = "";

  if (props.mode === "edit") {
    // --- 未來串接 API 的位置 (更新/PUT) ---
    formData.append("post_no", form.postid); // 編輯時要加文章編號
    apiUrl = `${VITE_API_BASE}/posts/update.php`;
    console.log("正在【更新】文章:", form);
    alert("文章更新成功！");
  } else {
    // --- 未來串接 API 的位置 (新增/POST)
    apiUrl = `${VITE_API_BASE}/posts/create.php`;

    // 因為蠻多重複共用的程式 先寫在一起 ---
    // try {
    //   const categoryIndex = categories.indexOf(form.event);
    //   const categoryNo = categoryIndex >= 0 ? categoryIndex + 1 : null;

    //   if (categoryIndex === -1) {
    //     alert("請選擇有效的分類");
    //     return;
    //   }
    //   const formData = new FormData();
    //   formData.append("category_no", categoryNo);
    //   formData.append("post_title", form.title);
    //   formData.append("post_content", form.content);

    //   // === 新增：若有選首圖，夾帶 POST_IMG 給後端 ===
    //   if (coverFile.value) {
    //     formData.append("post_img", coverFile.value); // 後端 create.php 會存成封面
    //   }
    //   // === 新增結束 ===

    //   const res = await axios.post(
    //     `${import.meta.env.VITE_API_BASE}/posts/create.php`,
    //     formData,
    //     {
    //       headers: { "Content-Type": "multipart/form-data" },
    //       withCredentials: true,
    //     }
    //   );
    //   router.push("/article/article");
    //   // const newArticle = await createArticleAPI(form);
    //   console.log("正在【新增】文章:", form);
    //   alert("文章發表成功！");
    // } catch (err) {
    //   console.error("發表失敗:", err);
    //   alert("文章發表失敗，請稍後再試！");
    //   return;
    // }
    // 成功後跳轉回列表頁
    //router.push("/article/article");
  }
  try {
    const res = await axios.post(apiUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    if (res.data.ok) {
      alert(props.mode === "edit" ? "文章更新成功！" : "文章發表成功！");
      router.push("/article/article");
    } else {
      throw new Error(res.data.error || "送出失敗");
    }
  } catch (err) {
    alert("送出失敗：" + (err?.message || "請稍後再試"));
  }
}
// --- 圖片上傳處理邏輯 (保持不變) ---

const uploadImageAndGetUrl = (blobInfo) =>
  new Promise((resolve, reject) => {
    console.log(blobInfo, 666);
    const formData = new FormData();
    formData.append("activity_img", blobInfo.blob(), blobInfo.filename());
    console.log(formData);
    // // 請將 '/api/upload-image' 換成您真實的後端上傳 API 位址
    // fetch(`${VITE_API_BASE}/posts/upload-image.php`, {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => {
    //     if (!response.ok)
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     return response.json();
    //   })
    //   .then((json) => {
    //     if (!json || typeof json.location !== "string") {
    //       throw new Error("無效的 JSON 格式: " + JSON.stringify(json));
    //     }
    //     resolve(json.location); // 成功，回傳圖片 URL
    //   })
    //   .catch((error) => {
    //     reject("圖片上傳失敗: " + error.message);
    //   });
    axios
      .post(`${VITE_API_BASE}/posts/upload-image.php`, formData)
      .then((res) => {
        // console.log("新增成功：", res.data);
      })
      .catch((err) => {
        console.error("錯誤：", err);
      });
  });

// 新增 file_picker_callback 函式
const handleFilePicker = (callback, value, meta) => {
  // 只針對圖片類型的檔案選擇器生效
  if (meta.filetype === "image") {
    // 建立一個隱藏的 input[type="file"] 元素
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    // 監聽檔案選擇
    input.onchange = function () {
      const file = this.files[0];

      // 使用 Tinymce 內建的 reader 讀取檔案
      const reader = new FileReader();
      reader.onload = function () {
        const id = "blobid" + new Date().getTime();
        const blobCache = tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(",")[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        callback(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    // 觸發點擊事件，開啟檔案選擇視窗
    input.click();
  }
};
//社群規定
function showRule() {
  Swal.fire({
    title: "社群規定",
    html: `
    <div style="text-align:center;">
      <ul style="display:inline-block; text-align:left;">
        <li>禁止發表違法、暴力、色情、歧視等內容</li>
        <li>禁止人身攻擊、謾罵、騷擾他人</li>
        <li>請尊重他人隱私與著作權</li>
        <li>違規將依規定處理，嚴重者停權</li>
      </ul>
    </div>
    `,
    icon: "info",
    confirmButtonText: "我知道了",
    customClass: { confirmButton: "my-swal-confirm-button" },
  });
}

// --- TinyMCE 初始化設定 ---
const init = reactive({
  language: "zh_TW",
  height: 500,
  min_height: 500,
  menubar: false,
  plugins: props.plugins,
  toolbar: props.toolbar,
  branding: false,
  placeholder:
    "請遵守社群規定，不得發表違規言論或進行違反法律之相關情事，如有違規需自負法律責任",
  autoresize_bottom_margin: 25,
  images_reuse_filename: true,

  // [關鍵] 處理拖曳上傳
  images_upload_handler: uploadImageAndGetUrl,

  // [關鍵] 處理點擊按鈕上傳
  file_picker_callback: handleFilePicker,

  // [建議] 允許直接貼上圖片並觸發上傳
  paste_data_images: true,
});
window["tinymce"] = tinymce;
window["Editor"] = Editor;

// --- 其他 Vue 生命週期與邏輯 (保持不變) ---
const { modelValue } = toRefs(props);
const editorValue = ref(modelValue.value);
const editorInstance = ref(null);
const handleEditorInit = (evt, editor) => {
  editorInstance.value = editor;
};
const handleResize = () => {
  if (editorInstance.value) editorInstance.value.execCommand("mceRepaint");
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (editorInstance.value) tinymce.remove(editorInstance.value);
});

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

//標題字
const titleText = ref("今天想說點什麼？");
const isVisible = ref(false);

function selectType(typeName) {
  form.type = typeName;
}
</script>

<template>
  <div class="background">
    <img class="bgimg" :src="bgImgUrl" alt="背景圖三角" />
    <img class="bg-airplane" :src="AirPlane" alt="背景插圖飛機" />
    <div class="decoration">
      <Illustration />
    </div>
  </div>

  <main class="create">
    <div>
      <h2 class="title">
        <span
          v-for="(char, index) in titleText.split('')"
          :key="index"
          :style="`--index: ${index}`"
          :class="{ show: isVisible }"
        >
          {{ char }}
        </span>
      </h2>
    </div>
    <input
      class="titlebox"
      type="text"
      placeholder="請輸入文章標題"
      v-model="form.title"
    />
    <!-- <div class="category-btn-list">
      建議修正 props 寫法
      <label>文章類型：</label>
      <Button
        @click="selectType('揪團心得')"
        :theme="form.type === '揪團心得' ? 'secondary' : 'info'"
        size="sm"
        >揪團心得</Button
      >
      <Button
        @click="selectType('閒聊')"
        :theme="form.type === '閒聊' ? 'secondary' : 'info'"
        size="sm"
        >閒聊</Button
      >
      <Button
        @click="selectType('分享')"
        :theme="form.type === '分享' ? 'secondary' : 'info'"
        size="sm"
        >分享</Button
      >
    </div> -->
    <div class="topic-category">
      <label for="topic-category">文章分類：</label>
      <select id="topic-category" name="category" v-model="form.event">
        <option disabled value="">活動類型</option>
        <option
          v-for="(category, index) in categories"
          :key="index"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>
</
    <!-- === 新增：首圖上傳區塊（預覽 + 檔案 input） === -->
    <div class="cover-upload">
      <label class="cover-label">首圖（選填）：</label>
      <div class="cover-uploader">
        <label class="custom-file-label" for="coverInput">選擇圖片</label>
        <input
          id="coverInput"
          class="cover-input"
          type="file"
          accept="image/*"
          @change="onCoverChange"
        />
        <div v-if="coverPreview" class="cover-preview">
          <img :src="coverPreview" alt="首圖預覽" />
        </div>
        <div v-else class="cover-placeholder">未選擇圖片</div>
      </div>
      <small class="cover-hint">建議比例 16:9、JPG/PNG，小於 5MB</small>
    </div>
    <!-- === 新增結束 === -->

    <div class="text-editor">
      <editor v-model="editorContent" :init="init" @onInit="handleEditorInit" />
      <p class="notice">
        請遵守<span class="rule-link" @click="showRule">社群規定</span>，不得發表違規言論或進行違反法律之相關情事，如有違規需自負法律責任
      </p>
    </div>

    <div class="btn">
      <Button theme="info" size="md" @click="previewArticle">預覽</Button>
      <Button theme="primary" size="md" @click="submitArticle"> 送出 </Button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.bgimg {
  width: 100vw;
  height: auto;
  max-height: 100vh;
  margin-inline: auto;
  z-index: -999;
  position: absolute;
  top: 0;
  overflow: hidden;
}
.bg-airplane {
  display: none;
  width: 200px;
  height: auto;
  z-index: -1;
  position: absolute;
  right: 3vw;
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

template {
  position: relative;
}
.decoration {
  position: absolute;
  bottom: -45vh;
  z-index: 1;
  display: none;

  @include desktop() {
    display: block;
  }
}
@media screen and (max-width: 1500px) {
  .decoration {
    display: none;
  }
  .bg-airplane {
    display: none;
  }
}
.decoration img {
  width: 100%;
  height: auto;
}

.create {
  display: grid;
  margin: 10vh auto;
  max-width: 1200px;
  gap: 25px;
  padding: 0 15px;
  box-sizing: border-box;
  /* 明確定義 Grid 欄位 */
  grid-template-columns: 1fr;
  z-index: 5;
}

.titlebox {
  background-color: #fff;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
  border: black 1.5px solid;
  @include desktop() {
    border-radius: 6px;
  }
}

select {
  background-color: #fff;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1.5px black solid;
  @include desktop() {
    border-radius: 6px;
  }
}

.topic-category {
  display: flex;
  align-items: center;
  gap: 10px; /* label 和 select 之間的距離 */
  flex-wrap: wrap; /* RWD 關鍵，寬度不夠時才換行 */
  width: 100%;
}
.topic-category label {
  white-space: nowrap;
  flex-shrink: 0; /* 防止被壓縮 */
}
.topic-category select {
  flex: 1;
  min-width: 200px; /* 可依需求設最小寬度 */
}
.text-editor {
  width: 100%;
  /* 覆蓋 Grid/Flex item 的預設最小寬度 */
  min-width: 0;
}

.btn {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.category-btn-list {
  gap: 15px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}

.text-editor {
  width: 100%;
}

.notice {
  color: #ccc;
  padding: 10px;
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
}

.title span {
  display: inline-block;
  opacity: 0;
}

.title span.show {
  animation: showLetter 0.5s cubic-bezier(0.34, 2.55, 0.64, 1)
    calc(var(--index) * 0.1s) forwards;
}

.create {
  gap: 15px;
}

/* === 首圖上傳樣式 === */
.cover-upload {
  display: grid;
  gap: 8px;
}
.cover-label {
  font-weight: 600;
}
.cover-uploader {
  display: grid;
  gap: 10px;
  align-items: start;
}
.cover-input {
  display: none; /* 隱藏原生 input */
}

.custom-file-label {
  font-size: 16px;
  display: inline-block;
  padding: 8px 20px;
  max-width: 158px;
  border: 1px solid #000000;
  border-radius: 3px;
  background: #fada7a;
  cursor: pointer;
  text-align: center;

  @include desktop() {
    border-radius: 6px;
  }
}
.custom-file-label:hover {
  background: #f9ff4d;
}
.cover-preview {
  max-width: 100%;
  border: 1px dashed #ccc;
  padding: 8px;
  border-radius: 6px;
  background: #fff;
}
.cover-preview img {
  max-width: 100%;
  height: auto;
  display: block;
}
.cover-placeholder {
  font-size: 14px;
  color: #888;
}
.cover-hint {
  color: #999;
}
.rule-link {
  color: #81BFDA;
  text-decoration: underline;
  cursor: pointer;
}
.rule-link:hover {
  color: #FADA7A;
}
.swal-center {
  text-align: center;
}

:deep(.swal2-styled.swal2-confirm.my-swal-confirm-button) {
  margin-inline: 10px;
  font-size: 16px;
  min-width: 86px;
  min-height: 38px;
  padding: 0 10px;
  border-radius: 6px;
  color: #000 !important;
  background-color: #fada7a !important;
  border: 1px solid #000 !important;
}
:deep(.swal2-styled.swal2-confirm.my-swal-confirm-button:hover) {
  color: #000 !important;
  background-color: #f9ff4d !important;
}
:deep(.swal2-styled.swal2-confirm.my-swal-confirm-button:active) {
  color: #000000 !important;
  background-color: #fdc520 !important;
}

</style>
