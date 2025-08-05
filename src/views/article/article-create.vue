<script setup>
import { reactive, ref, watch, toRefs, onMounted, onBeforeUnmount } from "vue";
import tinymce from "tinymce/tinymce.js";
import Button from "@/components/Button.vue";
import bgImgUrl from "@/assets/img/support/bg.svg?url";
import articleimg from "@/assets/img/article/article-img.png?url";
import Illustration from "@/components/article/Illustration.vue";
import AirPlane from "@/assets/img/article/airplane.png";
// ... (外觀、Icon、其他外掛的 import 省略，請保留您原有的) ...
import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/emoticons/js/emojis.js";
import "tinymce/plugins/table";
import "tinymce/plugins/quickbars";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/image"; // 確保 image 外掛已引入
// 語言包
import "tinymce-i18n/langs5/zh_TW.js";

import Editor from "@tinymce/tinymce-vue";

// --- Props (保持不變) ---
const props = defineProps({
    modelValue: { type: String, default: "" },
    plugins: {
        type: [String, Array],
        default: "quickbars emoticons table autoresize image",
    },
    toolbar: {
        type: [String, Array],
        default:
            "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | image | removeformat | table | emoticons",
    },
});

const emit = defineEmits(["update:modelValue"]);

// --- 圖片上傳處理邏輯 (保持不變) ---
const uploadImageAndGetUrl = (blobInfo) =>
    new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", blobInfo.blob(), blobInfo.filename());

        // 請將 '/api/upload-image' 換成您真實的後端上傳 API 位址
        fetch("/api/upload-image", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((json) => {
                if (!json || typeof json.location !== "string") {
                    throw new Error(
                        "無效的 JSON 格式: " + JSON.stringify(json)
                    );
                }
                resolve(json.location); // 成功，回傳圖片 URL
            })
            .catch((error) => {
                reject("圖片上傳失敗: " + error.message);
            });
    });

// [關鍵修正] 新增 file_picker_callback 函式
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

                // 上傳圖片並取得 URL
                uploadImageAndGetUrl(blobInfo)
                    .then((url) => {
                        // 將 URL 回傳給 TinyMCE 對話框
                        callback(url, { title: file.name });
                    })
                    .catch((error) => {
                        console.error(error);
                        // 可以在這裡加入錯誤提示
                        tinymce.activeEditor.notificationManager.open({
                            text: "圖片上傳失敗",
                            type: "error",
                        });
                    });
            };
            reader.readAsDataURL(file);
        };

        // 觸發點擊事件，開啟檔案選擇視窗
        input.click();
    }
};

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
onMounted(() => {
    window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
    if (editorInstance.value) tinymce.remove(editorInstance.value);
});

const categories = [
    "登山",
    "水上活動",
    "運動",
    "露營",
    "唱歌",
    "展覽",
    "聚餐",
    "桌遊",
    "電影",
    "手作",
    "文化體驗",
    "演出表演",
    "其他",
];

//標題字
const titleText = ref("今天想說點什麼？");
const isVisible = ref(false);

onMounted(() => {
    // 元件掛載後，直接將 isVisible 設為 true
    isVisible.value = true;
});
</script>

<template>
    <div class="background">
        <img
            class="bgimg"
            :src="bgImgUrl"
            alt="背景圖三角"
        />
        <img
            class="bg-airplane"
            :src="AirPlane"
            alt="背景插圖飛機"
        />
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
        />
        <div class="category-btn-list">
            <!-- 建議修正 props 寫法 -->
            <label>文章類型：</label>
            <Button
                theme="secondary"
                size="sm"
            >
                揪團心得
            </Button>
            <Button
                theme="info"
                size="sm"
            >
                閒聊
            </Button>
            <Button
                theme="info"
                size="sm"
            >
                分享
            </Button>
        </div>
        <div class="topic-category">
            <label for="topic-category">文章分類：</label>
            <select
                id="topic-category"
                name="category"
                v-model="selectedCategory"
            >
                <option
                    disabled
                    value=""
                >
                    活動類型
                </option>
                <option
                    v-for="(category, index) in categories"
                    :key="index"
                    :value="category"
                >
                    {{ category }}
                </option>
            </select>
        </div>
        <div class="text-editor">
            <editor
                v-model="editorValue"
                :init="init"
                @onInit="handleEditorInit"
            ></editor>
            <p class="notice">
                請遵守社群規定，不得發表違規言論或進行違反法律之相關情事，如有違規需自負法律責任
            </p>
        </div>

        <div class="btn">
            <Button
                theme="primary"
                size="md"
            >
                送出
            </Button>
        </div>
    </main>
    <div class="decoration">
        <Illustration />
    </div>
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
.decoration {
    position: absolute;
    bottom: 0px;
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

.create {
    display: grid;
    margin: 10vh auto;
    max-width: 1200px;
    gap: 25px;
    padding: 0 15px;
    box-sizing: border-box;
    /* [關鍵修正] 明確定義 Grid 欄位 */
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
    /* [關鍵修正] 覆蓋 Grid/Flex item 的預設最小寬度 */
    min-width: 0;
}

.btn {
    justify-self: center;
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
</style>
