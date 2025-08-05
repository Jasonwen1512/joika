<script setup>
import { ref, computed, h, render } from "vue";

import { useRoute, useRouter } from "vue-router";
import { articleList } from "@/assets/data/fake-article";
import Button from "@/components/Button.vue";
import DeleteIcon from "@/assets/img/icon/delete.svg";
import SmEditIcon from "@/assets/img/icon/sm-edit.svg";
import konanImage from "@/assets/img/article/movie_konan.jpg";
import reprot from "@/assets/img/icon/errorred.svg?url";
import like from "@/assets/img/icon/likeicon.svg?url";
import commenticon from "@/assets/img/icon/commenticon.svg?url";
import Swal from "sweetalert2";
import ReportForm from "@/components/ReportForm.vue";
import PreIcon from "@/assets/img/icon/pre-arrow.svg?url";
import NextIcon from "@/assets/img/icon/next-arrow.svg?url";
const route = useRoute();
const router = useRouter();
const postid = route.params.postid;
const article = articleList.find((item) => item.postid === postid);

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

//下方留言區
//假的自己 展示用
const currentUser = {
    userid: "M9999", // 假設這是當前使用者的 ID
    author: "展示用", // 您的名字
    avatar: "https://i.pravatar.cc/150?u=me", // 一個代表您自己的頭像
    replies: [],
};

//假的留言們  展示用
const comments = ref([
    {
        commentid: 1,
        userid: "M0001",
        author: "SunnyDive",
        avatar: "https://i.pravatar.cc/150?u=sunnydive", // 假頭像，每次刷新會變
        timestamp: "2025/07/07 18:45",
        content: "我們那天也在那欸哈哈～真的超美！Joika平台揪團越來越專業了！",
        likenum: 0,
        replies: [],
    },
    {
        commentid: 2,
        userid: "M0002",
        author: "kelly_travel",
        avatar: "https://i.pravatar.cc/150?u=kellytravel",
        timestamp: "2025/07/07 20:13",
        content: "哇我也有看到這團但沒報名到 QAQ 希望下次還有類似的！",
        likenum: 0,
        replies: [],
    },
    {
        commentid: 3,
        userid: "M0003",
        author: "ocean_rookie",
        avatar: "https://i.pravatar.cc/150?u=oceanrookie",
        timestamp: "2025/07/08 09:07",
        content: "我是這團的其中一員！很開心認識大家～謝謝你分享這段回憶❤️",
        likenum: 0,
        replies: [],
    },
    {
        commentid: 4,
        userid: "M0004",
        author: "sandy_test",
        avatar: "https://i.pravatar.cc/150?u=sandy_test",
        timestamp: "2025/07/07 09:30",
        content: "有誰也有跟過嗎?好奇其他人的想法?",
        likenum: 0,
        replies: [],
    },
]);

const newComment = ref("");
const activeReplyId = ref(null);
const isReplyAnimating = ref(false);
const isMainCommentAnimating = ref(false);

const newReplyText = ref("");
// 處理發送留言的函式
function postComment() {
    if (!newComment.value.trim()) {
        return;
    }
    isMainCommentAnimating.value = true;
    setTimeout(() => {
        isMainCommentAnimating.value = false;
    }, 300);
    // 2. 建立一個新的留言物件
    // 這個物件的結構必須和 `comments` 陣列裡的其他物件一樣
    const newCommentObject = {
        // 使用 Date.now() 來產生一個獨一無二的 ID，作為 v-for 的 key
        id: Date.now(),
        userid: currentUser.userid,
        author: currentUser.author,
        avatar: currentUser.avatar,
        timestamp: new Date().toLocaleString("zh-TW"),
        content: newComment.value,
        likenum: 0,
    };

    comments.value.push(newCommentObject);
    newComment.value = "";
    goToCommentPage(totalCommentPages.value);
}

//留言分頁

// 定義每頁顯示幾則留言
const COMMENTS_PER_PAGE = 3;

const currentCommentPage = ref(1);

const totalCommentPages = computed(() => {
    return Math.ceil(comments.value.length / COMMENTS_PER_PAGE);
});

// 這會根據 currentCommentPage 的變化，自動從完整的 comments 陣列中「切」出對應的部分
const paginatedComments = computed(() => {
    const startIndex = (currentCommentPage.value - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    return comments.value.slice(startIndex, endIndex);
});

const commentPaginationList = computed(() => {
    const pages = [];
    const total = totalCommentPages.value;
    const current = currentCommentPage.value;

    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current > 3) pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) {
            if (i > 1 && i < total) pages.push(i);
        }
        if (current < total - 2) pages.push("...");
        pages.push(total);
    }
    return pages;
});

// [改造] 留言區的分頁導覽函式
function goToCommentPage(page) {
    if (page >= 1 && page <= totalCommentPages.value) {
        currentCommentPage.value = page;
    }
}

function goToPreviousCommentPage() {
    goToCommentPage(currentCommentPage.value - 1);
}

function goToNextCommentPage() {
    goToCommentPage(currentCommentPage.value + 1);
}

const isFirstCommentPage = computed(() => currentCommentPage.value === 1);
const isLastCommentPage = computed(
    () => currentCommentPage.value === totalCommentPages.value
);
/**
 * 切換回覆輸入框的顯示/隱藏
 * @param {number} commentId - 要操作的父留言 ID
 */
function toggleReplyBox(commentId) {
    // 如果點擊的是已經打開的留言框，就把它關起來
    if (activeReplyId.value === commentId) {
        activeReplyId.value = null;
    } else {
        // 否則，就打開被點擊的留言框
        activeReplyId.value = commentId;
        newReplyText.value = ""; // 每次打開新的回覆框時，清空上一次的輸入
    }
}

/**
 * 發送一則新的「回覆」
 * @param {object} parentComment - 要在哪一則父留言底下新增回覆
 */
function postReply(parentComment) {
    // 防呆：不讓使用者送出空的回覆
    if (!newReplyText.value.trim()) {
        alert("請輸入留言");
        return;
    }
    isReplyAnimating.value = true;

    setTimeout(() => {
        isReplyAnimating.value = false;
    }, 300);
    // 建立一個新的「回覆物件」
    const replyObject = {
        id: Date.now(),
        userid: currentUser.userid, // 記得您在上一階段已經建立過 currentUser 物件
        author: currentUser.author,
        avatar: currentUser.avatar,
        timestamp: new Date().toLocaleString("zh-TW"),
        content: newReplyText.value,
        likenum: 0,
    };

    // 【最關鍵】把新的回覆物件，加到「父留言」自己的 replies 陣列背包裡
    parentComment.replies.push(replyObject);

    // 清空回覆輸入框
    newReplyText.value = "";
}

//喜歡
const likeIt = (index) => {
    const comment = comments.value[index];
    comment.likenum++;

    // 觸發動畫
    comment.animateLike = true;

    // 動畫播放完後移除 class（確保下次還會動）
    setTimeout(() => {
        comment.animateLike = false;
    }, 300); // 和 CSS 動畫時間一致
};

//檢舉
function ReportIt() {
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
        willClose: () => render(null, container),
        zIndex: 20000,
    });
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

function EditArticle() {
    router.push("/article/article-create");
}
</script>

<template>
    <div class="bg"></div>
    <main>
        <!-- ================================== -->
        <!--           文章內容區塊             -->
        <!-- ================================== -->
        <section class="author-information">
            <div class="avatar">
                <img
                    class="avatar-img"
                    src="/src/assets/img/member/headshot.jpg"
                    alt="Member Headshot"
                />
                <p>{{ article.userid }}</p>
            </div>
            <div class="btn-list">
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
            </div>
        </section>

        <section class="Content">
            <div
                class="article"
                v-if="article"
            >
                <h3>{{ article.title }}</h3>
                <div class="article-head">
                    <span
                        class="event-label"
                        :style="{ borderColor: GetEventColor(article.event) }"
                        >{{ article.event }}</span
                    >
                    <p>{{ article.date }}</p>
                </div>
                <div class="article-img">
                    <img
                        :src="article.image"
                        alt="文章圖片"
                    />
                </div>
                <p
                    v-html="article.content"
                    alt="內文"
                ></p>
            </div>
            <div v-else>
                <p>找不到這篇文章。</p>
            </div>
        </section>

        <!-- ================================== -->
        <!--           留言系統區塊             -->
        <!-- ================================== -->
        <section class="Comment">
            <!-- 1. 留言列表 -->
            <div class="comments-list">
                <!-- 
          最外層的 v-for，遍歷所有「父留言」
        -->
                <div
                    v-for="(comment, index) in paginatedComments"
                    :key="comment.id"
                    class="comment"
                >
                    <!-- 1a. 父留言的內容與互動按鈕 -->
                    <div class="comment-content">
                        <div class="comment-details">
                            <div class="comment-header">
                                <img
                                    :src="comment.avatar"
                                    alt="用戶頭像"
                                    class="comment-avatar"
                                />
                                <span class="author-name">{{
                                    comment.author
                                }}</span>
                                <span class="timestamp">{{
                                    comment.timestamp
                                }}</span>
                            </div>
                            <div class="comment-text">
                                <p>{{ comment.content }}</p>
                            </div>
                        </div>

                        <div class="comment-actions">
                            <div
                                class="action-icon like"
                                :class="{ animate: comment.animateLike }"
                                @click="likeIt(index)"
                            >
                                <img :src="like" />
                                <p v-if="comment.likenum > 0">
                                    {{ comment.likenum }}
                                </p>
                            </div>
                            <div
                                class="action-icon"
                                @click="toggleReplyBox(comment.id)"
                            >
                                <img :src="commenticon" />
                            </div>
                            <div
                                class="action-icon"
                                @click="ReportIt"
                            >
                                <img :src="reprot" />
                            </div>
                        </div>
                    </div>

                    <!-- 1b. 巢狀回覆的子區塊 (核心邏輯) -->
                    <div
                        v-if="activeReplyId === comment.id"
                        class="reply-section"
                    >
                        <!-- 子留言列表 -->
                        <div
                            v-for="reply in comment.replies"
                            :key="reply.id"
                            class="comment reply-item"
                        >
                            <div class="comment-content">
                                <div class="comment-details">
                                    <div class="comment-header">
                                        <img
                                            :src="reply.avatar"
                                            alt="用戶頭像"
                                            class="comment-avatar"
                                        />
                                        <span class="author-name">{{
                                            reply.author
                                        }}</span>
                                        <span class="timestamp">{{
                                            reply.timestamp
                                        }}</span>
                                    </div>
                                    <div class="comment-text">
                                        <p>{{ reply.content }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 新增回覆的輸入框 -->
                        <div class="my-comment reply-input">
                            <input
                                type="text"
                                v-model="newReplyText"
                                placeholder="新增回覆..."
                                class="comment-input"
                                @keyup.enter="postReply(comment)"
                            />
                            <button
                                class="send-button"
                                :class="{ animate: isReplyAnimating }"
                                @click="postReply(comment)"
                            >
                                <svg
                                    width="29"
                                    height="30"
                                    viewBox="0 0 29 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clip-path="url(#clip0_1566_5695)">
                                        <path
                                            d="M9.59021 17.4098L24 3L9.59021 17.4098ZM24 3L15.4851 26.5797C15.4276 26.7051 15.3354 26.8114 15.2193 26.8859C15.1032 26.9604 14.9681 27 14.8301 27C14.6922 27 14.5571 26.9604 14.441 26.8859C14.3249 26.8114 14.2326 26.7051 14.1751 26.5797L9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3Z"
                                            fill="#F5F0CD"
                                        />
                                        <path
                                            d="M9.59021 17.4098L24 3M9.59021 17.4098L14.1751 26.5797C14.2326 26.7051 14.3249 26.8114 14.441 26.8859C14.5571 26.9604 14.6922 27 14.8301 27C14.9681 27 15.1032 26.9604 15.2193 26.8859C15.3354 26.8114 15.4276 26.7051 15.4851 26.5797L24 3M9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3"
                                            stroke="black"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1566_5695">
                                            <rect
                                                width="29"
                                                height="30"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <hr class="separator" />
                </div>
            </div>

            <!-- 2. 分頁控制項 -->
            <div class="pagination">
                <button
                    class="pre"
                    @click="goToPreviousCommentPage"
                    :disabled="isFirstCommentPage"
                >
                    <img
                        :src="PreIcon"
                        alt="上一張箭頭"
                    />
                </button>
                <button
                    class="page"
                    v-for="(page, index) in commentPaginationList"
                    :key="index"
                    @click="typeof page === 'number' && goToCommentPage(page)"
                    :disabled="page === '...'"
                    :class="{ active: currentCommentPage === page }"
                >
                    {{ page }}
                </button>
                <button
                    class="next"
                    @click="goToNextCommentPage"
                    :disabled="isLastCommentPage"
                >
                    <img
                        :src="NextIcon"
                        alt="下一張箭頭"
                    />
                </button>
            </div>

            <!-- 3. 新增「父留言」的輸入框 -->
            <div class="my-comment">
                <input
                    type="text"
                    v-model="newComment"
                    placeholder="留言"
                    class="comment-input"
                    @keyup.enter="postComment"
                />
                <button
                    class="send-button"
                    :class="{ animate: isMainCommentAnimating }"
                    @click="postComment"
                >
                    <svg
                        width="29"
                        height="30"
                        viewBox="0 0 29 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clip-path="url(#clip0_1566_5695)">
                            <path
                                d="M9.59021 17.4098L24 3L9.59021 17.4098ZM24 3L15.4851 26.5797C15.4276 26.7051 15.3354 26.8114 15.2193 26.8859C15.1032 26.9604 14.9681 27 14.8301 27C14.6922 27 14.5571 26.9604 14.441 26.8859C14.3249 26.8114 14.2326 26.7051 14.1751 26.5797L9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3Z"
                                fill="#F5F0CD"
                            />
                            <path
                                d="M9.59021 17.4098L24 3M9.59021 17.4098L14.1751 26.5797C14.2326 26.7051 14.3249 26.8114 14.441 26.8859C14.5571 26.9604 14.6922 27 14.8301 27C14.9681 27 15.1032 26.9604 15.2193 26.8859C15.3354 26.8114 15.4276 26.7051 15.4851 26.5797L24 3M9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3"
                                stroke="black"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_1566_5695">
                                <rect
                                    width="29"
                                    height="30"
                                    fill="white"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>
        </section>
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
</style>
