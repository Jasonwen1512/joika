import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";

export const usePreviewStore = defineStore("preview", () => {
  const previewData = reactive({
    postid: null,
    userid: "CJ D.", // 可換成實際登入者資料
    title: "",
    content: "", // 這個將與 TinyMCE 的內容保持同步
    event: "",
    type: "揪團心得",
    date: new Date().toLocaleDateString("sv"), // YYYY-MM-DD
    image: "/src/assets/img/article/article-img.png?url", // 預設圖片
  });

  const isPreview = ref(false);

  return { previewData, isPreview };
});
