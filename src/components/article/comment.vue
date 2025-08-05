<script setup>
import { ref, computed, h, render } from "vue";
import reprot from "@/assets/img/icon/errorred.svg?url";
import like from "@/assets/img/icon/likeicon.svg?url";
import commenticon from "@/assets/img/icon/commenticon.svg?url";
import Swal from "sweetalert2";
import ReportForm from "@/components/ReportForm.vue";
import PreIcon from "@/assets/img/icon/pre-arrow.svg?url";
import NextIcon from "@/assets/img/icon/next-arrow.svg?url";

// === 這是最重要的改造：安裝標準的「樂高訊號接收器 (Props)」 ===

const emit = defineEmits([
    'add-comment',    // 頻道一：用來呼叫「新增主留言」
    'add-reply'       // 頻道二：用來呼叫「新增回覆」
]);

const props = defineProps({
  // 接收器一：專門接收「留言列表」
  commentsData: {
    type: Array,
    required: true,
  },
  // 接收器二：專門接收「當前使用者」
  userData: {
    type: Object,
    required: true,
  },
});

// --- 底下是原本的邏輯，但現在它們的資料來源全部變成了 props ---

const newComment = ref("");
const activeReplyId = ref(null);
const isReplyAnimating = ref(false);
const isMainCommentAnimating = ref(false);
const newReplyText = ref("");

function postComment() {
  if (!newComment.value.trim()) return;
  isMainCommentAnimating.value = true;
  setTimeout(() => { isMainCommentAnimating.value = false; }, 300);

  // 1. 先把要新增的留言內容打包好
  const newCommentObject = {
    id: Date.now(),
    userid: props.userData.userid,
    author: props.userData.author,
    avatar: props.userData.avatar,
    timestamp: new Date().toLocaleString("zh-TW"),
    content: newComment.value,
    likenum: 0,
    replies: [],
  };

    // 2. 【關鍵改造】拿起對講機，按下 'add-comment' 按鈕，並把打包好的留言內容喊出去
  emit('add-comment', newCommentObject);

  // props.commentsData.push(newCommentObject); // <--- 改用 props
  newComment.value = "";
  // goToCommentPage(totalCommentPages.value);
}

// --- 留言分頁 ---
const COMMENTS_PER_PAGE = 3;
const currentCommentPage = ref(1);

const totalCommentPages = computed(() => {
  return Math.ceil(props.commentsData.length / COMMENTS_PER_PAGE); // <--- 改用 props
});

const paginatedComments = computed(() => {
  const startIndex = (currentCommentPage.value - 1) * COMMENTS_PER_PAGE;
  const endIndex = startIndex + COMMENTS_PER_PAGE;
  return props.commentsData.slice(startIndex, endIndex); // <--- 改用 props
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

function goToCommentPage(page) {
  if (page >= 1 && page <= totalCommentPages.value) {
    currentCommentPage.value = page;
  }
}
function goToPreviousCommentPage() { goToCommentPage(currentCommentPage.value - 1); }
function goToNextCommentPage() { goToCommentPage(currentCommentPage.value + 1); }
const isFirstCommentPage = computed(() => currentCommentPage.value === 1);
const isLastCommentPage = computed(() => currentCommentPage.value === totalCommentPages.value);

function toggleReplyBox(commentId) {
  if (activeReplyId.value === commentId) {
    activeReplyId.value = null;
  } else {
    activeReplyId.value = commentId;
    newReplyText.value = "";
  }
}



// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

function postReply(parentComment) {
  if (!newReplyText.value.trim()) {
    alert("請輸入留言");
    return;
  }
  isReplyAnimating.value = true;
  setTimeout(() => { isReplyAnimating.value = false; }, 300);

  // 1. 先把要新增的回覆內容打包好
  const replyObject = {
    id: Date.now(),
    userid: props.userData.userid,
    author: props.userData.author,
    avatar: props.userData.avatar,
    timestamp: new Date().toLocaleString("zh-TW"),
    content: newReplyText.value,
    likenum: 0,
  };

   // 2. 【關鍵改造】拿起對講機，按下 'add-reply' 按鈕，
  //    並把「父留言的ID」和「打包好的回覆內容」這兩樣東西一起喊出去
  emit('add-reply', { 
    parentId: parentComment.id, 
    reply: replyObject 
  });

   // 3. 清空自己的輸入框，任務完成！
  newReplyText.value = "";

  if (!parentComment.replies) {
    parentComment.replies = [];
  }
  // parentComment.replies.push(replyObject);
  newReplyText.value = "";
}

const likeIt = (comment) => {
  comment.likenum++;
  comment.animateLike = true;
  setTimeout(() => { comment.animateLike = false; }, 300);
};

function ReportIt() {
  const container = document.createElement("div");
  render(h(ReportForm, {
    onSubmit: (data) => {
      console.log("檢舉資料：", data);
      Swal.close();
      Swal.fire("已送出", "感謝您的檢舉，我們會盡快處理", "success");
    },
  }), container);

  Swal.fire({
    title: "檢舉留言",
    html: container,
    showCancelButton: false,
    showConfirmButton: false,
    willClose: () => render(null, container),
    zIndex: 20000,
  });
}
</script>

<template>
    <section class="Comment">
        <!-- 1. 留言列表 -->
        <div class="comments-list">
            <div
                v-for="comment in paginatedComments"
                :key="comment.id"
                class="comment"
            >
                <!-- 1a. 父留言的內容與互動按鈕 -->
                <div class="comment-content">
                    <div class="comment-details">
                        <div class="comment-header">
                            <img :src="comment.avatar" alt="用戶頭像" class="comment-avatar" />
                            <span class="author-name">{{ comment.author }}</span>
                            <span class="timestamp">{{ comment.timestamp }}</span>
                        </div>
                        <div class="comment-text">
                            <p>{{ comment.content }}</p>
                        </div>
                    </div>
                    <div class="comment-actions">
                        <div class="action-icon like" :class="{ animate: comment.animateLike }" @click="likeIt(comment)">
                            <img :src="like" />
                            <p v-if="comment.likenum > 0">{{ comment.likenum }}</p>
                        </div>
                        <div class="action-icon" @click="toggleReplyBox(comment.id)">
                            <img :src="commenticon" />
                        </div>
                        <div class="action-icon" @click="ReportIt">
                            <img :src="reprot" />
                        </div>
                    </div>
                </div>

                <!-- 1b. 巢狀回覆的子區塊 -->
                <div v-if="activeReplyId === comment.id" class="reply-section">
                    <!-- 子留言列表 -->
                    <div v-for="reply in comment.replies" :key="reply.id" class="comment reply-item">
                        <div class="comment-content">
                            <div class="comment-details">
                                <div class="comment-header">
                                    <img :src="reply.avatar" alt="用戶頭像" class="comment-avatar" />
                                    <span class="author-name">{{ reply.author }}</span>
                                    <span class="timestamp">{{ reply.timestamp }}</span>
                                </div>
                                <div class="comment-text">
                                    <p>{{ reply.content }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 新增回覆的輸入框 -->
                    <div class="my-comment reply-input">
                        <input type="text" v-model="newReplyText" placeholder="新增回覆..." class="comment-input" @keyup.enter="postReply(comment)" />
                        <button class="send-button" :class="{ animate: isReplyAnimating }" @click="postReply(comment)">
                            <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1566_5695)"><path d="M9.59021 17.4098L24 3L9.59021 17.4098ZM24 3L15.4851 26.5797C15.4276 26.7051 15.3354 26.8114 15.2193 26.8859C15.1032 26.9604 14.9681 27 14.8301 27C14.6922 27 14.5571 26.9604 14.441 26.8859C14.3249 26.8114 14.2326 26.7051 14.1751 26.5797L9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3Z" fill="#F5F0CD"/><path d="M9.59021 17.4098L24 3M9.59021 17.4098L14.1751 26.5797C14.2326 26.7051 14.3249 26.8114 14.441 26.8859C14.5571 26.9604 14.6922 27 14.8301 27C14.9681 27 15.1032 26.9604 15.2193 26.8859C15.3354 26.8114 15.4276 26.7051 15.4851 26.5797L24 3M9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></g>
                                <defs><clipPath id="clip0_1566_5695"><rect width="29" height="30" fill="white"/></clipPath></defs>
                            </svg>
                        </button>
                    </div>
                </div>
                <hr class="separator" />
            </div>
        </div>
        <!-- 2. 分頁控制項 -->
        <div class="pagination">
            <button class="pre" @click="goToPreviousCommentPage" :disabled="isFirstCommentPage">
                <img :src="PreIcon" alt="上一張箭頭" />
            </button>
            <button class="page" v-for="(page, index) in commentPaginationList" :key="index" @click="typeof page === 'number' && goToCommentPage(page)" :disabled="page === '...'" :class="{ active: currentCommentPage === page }">
                {{ page }}
            </button>
            <button class="next" @click="goToNextCommentPage" :disabled="isLastCommentPage">
                <img :src="NextIcon" alt="下一張箭頭" />
            </button>
        </div>
        <!-- 3. 新增「父留言」的輸入框 -->
        <div class="my-comment">
            <input type="text" v-model="newComment" placeholder="留言" class="comment-input" @keyup.enter="postComment" />
            <button class="send-button" :class="{ animate: isMainCommentAnimating }" @click="postComment">
                <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1566_5695)"><path d="M9.59021 17.4098L24 3L9.59021 17.4098ZM24 3L15.4851 26.5797C15.4276 26.7051 15.3354 26.8114 15.2193 26.8859C15.1032 26.9604 14.9681 27 14.8301 27C14.6922 27 14.5571 26.9604 14.441 26.8859C14.3249 26.8114 14.2326 26.7051 14.1751 26.5797L9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3Z" fill="#F5F0CD"/><path d="M9.59021 17.4098L24 3M9.59021 17.4098L14.1751 26.5797C14.2326 26.7051 14.3249 26.8114 14.441 26.8859C14.5571 26.9604 14.6922 27 14.8301 27C14.9681 27 15.1032 26.9604 15.2193 26.8859C15.3354 26.8114 15.4276 26.7051 15.4851 26.5797L24 3M9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></g>
                    <defs><clipPath id="clip0_1566_5695"><rect width="29" height="30" fill="white"/></clipPath></defs>
                </svg>
            </button>
        </div>
    </section>
</template>

<style scoped lang="scss">
.comment-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
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
