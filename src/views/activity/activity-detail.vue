<script setup>
// 1. 引入我們準備好的、獨立的留言板元件
import commentSection from "@/components/activity/activity-detail/comment-section.vue";
import { useRoute, useRouter } from "vue-router";
// === 第一步：在 import ref 的地方，加入 onMounted 和 onUnmounted ===
import { computed, ref, onMounted, onUnmounted } from "vue";
import { FakeActivity } from "@/assets/data/fake-activity";
import Button from "@/components/Button.vue";
import LikeButton from "@/components/activity/like-button.vue";
import "@fortawesome/fontawesome-free/css/all.min.css";

// === 第二步：在這裡只引入您確定已存在的「彈窗元件」 ===
import RatingModal from "@/components/activity/activity-detail/rating-modal.vue";
// === 新增：為未來的「取消彈窗」預留 import 位置 ===
import CancelModal from "@/components/activity/activity-detail/cancel-modal.vue";

// --- Swiper  ---
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
// --- End Swiper ---

const route = useRoute();
const activityNo = route.params.activity_id;

const activity = computed(() =>
  FakeActivity.find((item) => String(item.activity_no) === String(activityNo))
);

const likeMap = ref({});

const toggleLike = (id) => {
  likeMap.value[id] = !likeMap.value[id];
};

const aloha = () => {
  alert("我要跟團！");
};

const router = useRouter();
const gotoSignup = (id) => {
  router.push(`/group/group-signup/${id}`);
};

// === 第三步：在 aloha 函式的正下方，貼上所有「新的邏輯」 ===

// --- 按鈕切換 & 鍵盤監聽 ---
const isGroupJoined = ref(false); // 用於切換按鈕

const handleKeydown = (event) => {
  if (event.ctrlKey && event.key === "m") {
    event.preventDefault();
    isGroupJoined.value = !isGroupJoined.value;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// --- 評價彈窗控制 ---
const isRatingModalVisible = ref(false); // 評價彈窗的「開關」

const openRatingModal = () => {
  isRatingModalVisible.value = true; // 打開評價彈窗
};

const closeRatingModal = () => {
  isRatingModalVisible.value = false; // 關閉評價彈窗
};

const submitRatings = (ratingsData) => {
  console.log("從彈窗收到的評分資料:", ratingsData);
  alert("評分已送出！感謝你的評價");
  closeRatingModal(); // 提交後關閉彈窗
};

// === 新增：取消彈窗相關邏輯 ===
const isCancelModalVisible = ref(false); // 取消彈窗的「開關」

const openCancelModal = () => {
  isCancelModalVisible.value = true; // 打開取消彈窗
};

const closeCancelModal = () => {
  isCancelModalVisible.value = false; // 關閉取消彈窗
};

// 這個函式將用於接收從彈窗傳來的取消原因，並在提交後切換回原來的按鈕狀態
const handleCancelSubmit = (reason) => {
  console.log("收到的取消原因:", reason);
  alert("已提交取消申請。");
  closeCancelModal(); // 關閉彈窗
  isGroupJoined.value = false; // 將按鈕狀態切換回去
};
// === End 新增 ===

// 團員假資料
const participants = ref([
  {
    id: 1,
    name: "小黃",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop",
    rating: 5,
    reviews: 3,
    city: "新北市",
    age: 22,
    role: "大學生",
  },
  {
    id: 2,
    name: "阿強",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
    rating: 4,
    reviews: 5,
    city: "台北市",
    age: 28,
    role: "工程師",
  },
  {
    id: 3,
    name: "艾蜜莉",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    rating: 5,
    reviews: 8,
    city: "高雄市",
    age: 25,
    role: "設計師",
  },
  {
    id: 4,
    name: "大衛",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop",
    rating: 4,
    reviews: 2,
    city: "台中市",
    age: 31,
    role: "行銷企劃",
  },
  {
    id: 5,
    name: "潔西卡",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    rating: 5,
    reviews: 10,
    city: "台南市",
    age: 27,
    role: "自由工作者",
  },
  {
    id: 6,
    name: "布萊恩",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1170&auto=format&fit=crop",
    rating: 3,
    reviews: 1,
    city: "新竹市",
    age: 35,
    role: "軟體開發",
  },
]);

// 2. 準備要傳遞給留言板的「留言列表」資料
//    (我們先借用您頁面上現有的團員資料來展示，並用 map 整理成留言板要的格式)

const fakeComments = [
  "這活動真的太棒了，完全超出我的預期！下次還要再來！👍",
  "主揪人超好，把所有事情都安排得妥妥當當，給個大大的讚！",
  "哇，原來這裡這麼美！感謝分享，不然我都不知道這個好地方。",
  "我是第一次參加，本來有點緊張，但大家都好親切，很開心認識大家！😊",
  "有人知道主揪用的那款藍色背包是什麼牌子的嗎？好好看！",
  "雖然那天有點小下雨，但完全不影響興致，反而有種特別的氛圍。",
  "推！這是我今年參加過最棒的活動，沒有之一！",
  "照片拍得真好！可以分享原圖給我嗎？謝謝你！",
  "哈哈，我就是照片裡笑得最傻的那個！那天真的玩瘋了！🤣",
  "可惜這次沒跟到，看你們玩得這麼開心，下次有團一定要通知我！",
];

const commentsForBoard = ref(
  participants.value.map((p) => {
    // === 魔法在這裡發生！===
    // 1. 從我們的「台詞本」中，隨機選一個位置 (index)
    const randomIndex = Math.floor(Math.random() * fakeComments.length);

    // 2. 根據這個隨機位置，抽出對應的台詞
    const randomComment = fakeComments[randomIndex];

    // 3. 回傳組合好的、擁有獨一無二留言的資料
    //    (注意：只有 content 欄位被修改了)
    return {
      id: p.id,
      author: p.name,
      avatar: p.avatar,
      content: randomComment, // <-- 使用我們隨機抽出的台- 詞，取代掉原本固定的文字！
      timestamp: new Date().toLocaleDateString(),
      likenum: p.reviews,
      replies: [],
    };
  })
);

// 監聽員一：負責處理「新增主留言」的請求
function handleAddNewComment(newCommentData) {
  commentsForBoard.value.push(newCommentData);
}

// 監聽員二：負責處理「新增回覆」的請求
function handleAddNewReply({ parentId, reply }) {
  // 1. 先從我們的留言黑板上，找到那則被回覆的父留言
  const parentComment = commentsForBoard.value.find((c) => c.id === parentId);

  // 2. 如果找到了，就把新的回覆加到它的 replies 背包裡
  if (parentComment) {
    if (!parentComment.replies) {
      parentComment.replies = [];
    }
    parentComment.replies.push(reply);
  }
}

// 3. 準備要傳遞給留言板的「當前使用者」資料
const currentUserForBoard = ref({
  userid: "M-MYSELF",
  author: "我本人",
  avatar: "https://i.pravatar.cc/150?u=me",
});

// Swiper modules
const swiperModules = [Pagination];
</script>

<template>
  <div class="activity-detail-page">
    <!-- 藍色背景 -->
    <div class="activity-hero-bg">
      <div class="hint">揪團探索/揪團列表/{{ activity?.category_name }}</div>
    </div>

    <!-- 圖片 -->
    <div class="activity-image">
      <img :src="activity?.activity_img" :alt="activity?.activity_name" />
    </div>

    <!-- 標題 -->
    <div class="activity-title-wrap">
      <h2>{{ activity?.activity_name }}</h2>
    </div>

    <!-- === 第四步：用這段「新的按鈕區塊」取代您原本的 === -->
    <div class="activity-button-wrap">
      <!-- 狀態一：尚未跟團 -->
      <template v-if="!isGroupJoined">
        <Button
          @click.stop.prevent="gotoSignup(activity?.activity_no)"
          theme="primary"
          size="md"
        >
          我要跟團!
        </Button>
        <LikeButton
          :isActive="likeMap[activity?.activity_no]"
          @click.stop.prevent="toggleLike(activity?.activity_no)"
        ></LikeButton>
      </template>

      <!-- 狀態二：已經跟團 (直接使用現有的 Button 元件) -->
      <template v-else>
        <!-- === 修改：新增取消按鈕，並綁定 openCancelModal 事件 === -->
        <Button
          @click="openCancelModal"
          theme="cancel"
          :is-outline="true"
          size="md"
          >取消</Button
        >
        <Button @click="openRatingModal" theme="primary" size="md">評價</Button>
      </template>
    </div>

    <!-- 裝飾圖 -->
    <div class="bg-decorate2">
      <img src="@/assets/img/bg-decorate2.png" alt="" />
    </div>

    <!-- === 新增裝飾圖  === -->
    <div class="bg-decorate3">
      <img src="@/assets/img/bg-decorate3.png" alt="背景裝飾圖" />
    </div>
    <!-- === End 新增裝飾圖 === -->

    <!-- 活動資訊版面 -->
    <section class="activity-info">
      <div class="info-grid">
        <!-- 左欄 -->
        <div class="info-col">
          <div class="info-row">
            <strong>日期與時間</strong>
            <span
              >{{ activity?.activity_start_date }} ~ <br />{{
                activity?.activity_end_date
              }}</span
            >
          </div>
          <div class="info-row">
            <strong>地點</strong>
            <span>{{ activity?.location }}</span>
          </div>
          <div class="info-row">
            <strong>揪團人數</strong>
            <span
              >{{ activity?.current_participant }}/{{
                activity?.max_participant
              }}人</span
            >
          </div>
        </div>

        <!-- 右欄 -->
        <div class="info-col">
          <div class="info-row">
            <strong>預估費用</strong>
            <span>{{ activity?.fee_notes }}</span>
          </div>
          <div class="info-row">
            <strong>揪團截止日</strong>
            <span>{{ activity?.registration_deadline }}</span>
          </div>
          <div class="info-row">
            <strong>跟團限制</strong>
            <span>{{ activity?.participant_limitation }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 主揪 (寫死版本) -->
    <section class="host-info">
      <div class="host-title">主揪</div>
      <div class="host-content">
        <!-- 這裡的路徑可以換成您專案中的圖片 -->
        <img
          src="@/assets/img/activity/activity-detail/dan.png"
          alt=""
          class="host-avatar"
        />
        <div class="host-details">
          <div class="host-name">小單</div>
          <div class="rating-line">
            <div class="stars stars-yellow">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <span>5.0(3)</span>
          </div>
          <div class="rating-line">
            <div class="stars stars-blue">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-regular fa-star"></i>
            </div>
            <span>4.0(1)</span>
          </div>
          <div class="host-bio">台中市 | 30歲 | 健身教練</div>
        </div>
      </div>
    </section>

    <!-- 活動詳情 -->
    <section class="activity-description">
      <div class="description-title">詳細</div>
      <p class="description-content">{{ activity?.activity_description }}</p>
    </section>

    <!-- 目前團員 -->
    <section class="current-participants">
      <div class="participants-title">目前團員</div>
      <div class="participants-slider">
        <swiper
          :modules="swiperModules"
          :pagination="{ clickable: true }"
          :space-between="20"
        >
          <swiper-slide
            v-for="participant in participants"
            :key="participant.id"
          >
            <div class="participant-card">
              <img
                :src="participant.avatar"
                alt=""
                class="participant-avatar"
              />
              <div class="participant-details">
                <div class="participant-name">{{ participant.name }}</div>
                <div class="rating-line">
                  <div class="stars stars-blue">
                    <i
                      v-for="n in 5"
                      :key="n"
                      :class="
                        n <= participant.rating
                          ? 'fa-solid fa-star'
                          : 'fa-regular fa-star'
                      "
                    ></i>
                  </div>
                  <span
                    >{{ participant.rating.toFixed(1) }}({{
                      participant.reviews
                    }})</span
                  >
                </div>
                <div class="participant-bio">
                  {{ participant.city }} | {{ participant.age }}歲 |
                  {{ participant.role }}
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </section>

    <div class="comments-container">
      <commentSection
        :comments-data="commentsForBoard"
        :user-data="currentUserForBoard"
        @add-comment="handleAddNewComment"
        @add-reply="handleAddNewReply"
      />
    </div>

    <!-- === 第五步：在 template 的最下方，加入這段「彈窗元件」 === -->
    <RatingModal
      :show="isRatingModalVisible"
      :activity="activity"
      :participants="participants"
      @close="closeRatingModal"
      @submit="submitRatings"
    />

    <!-- === 新增：為未來的「取消彈窗」預留的元件位置 === -->

    <CancelModal
      :show="isCancelModalVisible"
      :activity="activity"
      @close="closeCancelModal"
      @submit="handleCancelSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
// === 您的所有既有樣式都保持不變 ===
.activity-detail-page {
  position: relative;
}

.activity-hero-bg {
  background-image: url("@/assets/img/activity/activity-detail/bg-blue-triangle.svg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center bottom;
  width: 100%;
  height: 320px;

  @include desktop() {
    height: 730px;
  }
}

.hint {
  line-height: 27px;
  margin: 0px auto 11px 18px;
  padding: 30px 0 0 17px;
  @include tablet() {
  }
  @include desktop() {
    display: none;
    font-size: $font-size-p;
  }
}

.activity-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -240px;

  img {
    width: 360px;
    height: 210px;
    object-fit: cover;

    @include desktop() {
      width: 1030px;
      height: 660px;
      margin-top: -240px;
    }
  }
}

.activity-title-wrap {
  display: flex;
  justify-content: center;
  margin: 50px auto;

  @include desktop() {
    margin: 32px auto;
  }

  h2 {
    @include mobile() {
      font-size: 24px;
    }

    @include desktop() {
      position: absolute;
      top: 110px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.activity-button-wrap {
  @include flex-center;
  gap: 60px;
  margin: 24px 0;

  @include mobile() {
    gap: 25px;
  }
}

.activity-info {
  max-width: 1200px;
  margin: 0 auto 0px;
  padding: 32px 20px;

  @include desktop() {
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: space-between;
    padding: 40px 0;
    border: none;

    @include desktop() {
      border-top: 1px solid #000;
      flex-direction: row;
    }
  }

  .info-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;

    @include desktop() {
      width: 48%;
    }
  }

  .info-row {
    display: flex;
    padding-bottom: 8px;

    strong {
      font-size: 24px;
      font-weight: bold;
      width: 30%;

      @include mobile() {
        font-size: 20px;
      }
    }

    span {
      font-size: 16px;
      padding-left: 70px;
      max-width: 70%;
      line-height: 1.5;
    }
  }
}

.bg-decorate2 {
  position: absolute;
  top: 500px;
  left: 0;
  width: auto;
  width: 50%;

  @include mobile() {
    z-index: -1;
    margin-top: 90px;
  }

  @include tablet() {
    top: 600px;
    width: 20%;
  }

  @include desktop() {
    top: 400px;
    width: 15%;
  }

  img {
    width: 180px;
    height: auto;

    @include desktop() {
      width: 380px;
    }
  }
}

.bg-decorate3 {
  position: absolute;
  z-index: -1;

  // --- 手機版樣式 (Mobile First) ---
  // 估算從頁面頂部到目標位置的距離
  top: 1750px;
  right: 0;
  width: 160px;
  padding-top: 230px;

  img {
    width: 100%;
    height: auto;
  }

  // --- 桌機版樣式 ---
  @include desktop() {
    // 估算從頁面頂部到目標位置的距離
    top: 1400px;
    right: -40px;
    width: 450px;
  }
}

// === 共用樣式 ===
.rating-line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 4px;
  font-size: 16px;

  .fa-regular {
    color: #dcdcdc;
  }
}

.stars-yellow .fa-solid {
  color: #ffc700;
}

.stars-blue .fa-solid {
  color: #5ea8a8;
}

// === 主揪資訊 ===
.host-info {
  max-width: 1200px;
  margin: 0 auto 10px;
  padding: 32px 20px;

  .host-title {
    text-align: center;
    font-weight: bold;
    margin-bottom: 24px;
    font-size: 24px;

    @include mobile() {
      margin-bottom: 46px;
    }
  }

  .host-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .host-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;

    @include desktop() {
      margin-left: 140px;
    }
  }

  .host-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .host-name {
    font-size: 20px;
    font-weight: 500;

    @include mobile() {
      padding-right: 155px;
      margin: 15px 0;
    }
  }

  .rating-line {
    @include mobile() {
      padding-right: 30px;
    }
  }

  .host-bio {
    margin-top: 8px;
    font-size: 20px;

    @include mobile() {
      padding-left: 10px;
    }
  }

  // --- 桌機版樣式 ---
  @include desktop() {
    margin-top: 0;
    padding: 60px 20px;
    display: flex;
    align-items: center;
    gap: 40px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;

    .host-title {
      margin-bottom: 0;
      flex-shrink: 0;
    }

    .host-content {
      flex-direction: row;
      gap: 40px;
    }

    .host-details {
      align-items: flex-start;
    }
  }
}

// === 活動詳情 ===
.activity-description {
  max-width: 1200px;
  margin: 0 auto 0px;
  padding: 0 20px;

  .description-title {
    display: none;
  }

  .description-content {
    line-height: 1.8;
    white-space: pre-wrap;
  }

  // --- 桌機版樣式 ---
  @include desktop() {
    display: flex;
    gap: 40px;
    padding: 80px 20px 80px;
    border-bottom: 1px solid #000;

    .description-title {
      display: block;
      font-size: 24px;
      font-weight: bold;
      flex-shrink: 0;
      margin-right: 150px;
    }
  }
}

// === 目前團員 ===
.current-participants {
  max-width: 1200px;
  margin: 0px auto 100px;
  padding: 0 20px;
  position: relative;

  .participants-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-top: 40px;

    @include mobile() {
      margin-top: 100px;
      margin-bottom: 80px;
    }
  }

  .participant-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 0 0 80px;
  }

  .participant-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }

  .participant-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    @include mobile() {
      margin-top: 60px;
    }
  }

  .participant-name {
    font-size: 20px;
    font-weight: 500;

    @include mobile() {
      display: none;
    }
  }

  .participant-bio {
    font-size: 20px;
  }

  // --- Swiper 分頁圓點樣式 ---
  :deep(.swiper-pagination-bullet) {
    width: 12px;
    height: 12px;
    background-color: #5ea8a8;
    opacity: 1;
  }

  :deep(.swiper-pagination-bullet-active) {
    background-color: #ffc700;
  }

  // --- 桌機版樣式 ---
  @include desktop() {
    display: flex;
    align-items: flex-start;
    gap: 40px;
    padding: 60px 20px;
    border-bottom: 1px solid #000;
    margin-bottom: 40px;

    .participants-title {
      text-align: left;
      margin-bottom: 0;
      flex-shrink: 0;
      margin-right: 100px;
    }

    .participants-slider {
      width: 100%;
    }

    .participant-card {
      flex-direction: row;
      justify-content: flex-start;
      gap: 40px;
      padding-bottom: 80px;
    }

    .participant-details {
      align-items: flex-start;
    }

    :deep(.swiper-pagination) {
      text-align: center;
      padding-left: 0;

      @include desktop() {
        text-align: left;
        padding-left: 200px;
      }
    }
  }
}

.comments-container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-block: 7.5vh;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
