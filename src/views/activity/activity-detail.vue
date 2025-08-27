<script setup>
// 1. 引入我們準備好的、獨立的留言板元件
import commentSection from "@/components/activity/activity-detail/comment-section.vue";
// import CommentComponent from "@/components/article/comment.vue"; // <-- 改用我的component

import { useRoute, useRouter } from "vue-router";

// 新增一：從外部倉庫，引入我們的「參團狀態管理員」。
import { useParticipationStore } from "@/stores/participation-store.js";
//

// === 第一步：在 import ref 的地方，加入 onMounted 和 onUnmounted ===
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import Button from "@/components/Button.vue";
import LikeButton from "@/components/activity/like-button.vue";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
// === 第二步：在這裡只引入您確定已存在的「彈窗元件」 ===
import RatingModal from "@/components/activity/activity-detail/rating-modal.vue";
// === 新增：為未來的「取消彈窗」預留 import 位置 ===
import CancelModal from "@/components/activity/activity-detail/cancel-modal.vue";
// --- Swiper  ---
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { imageUrl } from "@/assets/utils/normalize";
import { userImg } from "@/assets/utils/normalize";

// 環境變數
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
axios.defaults.withCredentials = true;

const route = useRoute();
const activityNo = route.params.activity_id;
const currentActivityId = computed(() => route.params.activity_id);

const detail = ref(null);
const loading = ref(true);
const err = ref(null);
onMounted(loadDetail);
watch(() => route.params.activity_id, loadDetail);
async function loadDetail() {
  loading.value = true;
  err.value = null;
  try {
    const id = route.params.activity_id;
    const { data } = await axios.get(
      `${VITE_API_BASE}/activities/detail.php?id=${id}`,
      { withCredentials: true }
    );
    console.log("detail:", data);
    detail.value = data;
  } catch (e) {
    console.error(e);
    err.value = e?.response?.data?.error || "讀取詳情失敗";
  } finally {
    loading.value = false;
  }
}
const activity = computed(() => detail.value?.activity ?? null);
const hoster = computed(() => detail.value?.hoster ?? null);
const flags = computed(() => detail.value?.flags ?? {});

const isHost = computed(() => !!flags.value.isHost);
const isJoiner = computed(() => !!flags.value.isJoiner);
const canCancel = computed(() => !!flags.value.canCancel);
const canRate = computed(() => !!flags.value.canRate);

const participantsPreview = computed(
  () => detail.value?.participants?.preview ?? []
);
const participantsCount = computed(
  () => detail.value?.participants?.count ?? 0
);

const ratingsSummary = computed(
  () => detail.value?.ratings ?? { avg: 0, count: 0, mine: null }
);
const hasRated = computed(() => ratingsSummary.value?.mine != null)
const participantsForModal = computed(() => {
  const arr =
    detail.value?.participants?.list ??
    detail.value?.participants?.preview ??
    [];

  return arr.map((p) => {
    const id = Number(p.MEMBER_ID ?? p.id ?? 0);
    return {
      id,
      name: p.NICKNAME ?? p.name ?? `會員 #${id}`,
      avatar: userImg(p.AVATAR ?? p.avatar ?? `https://i.pravatar.cc/150?u=${id}`),
      city: p.CITY_NAME ?? p.city ?? "—",
      age: p.AGE ?? p.age ?? null,
      role: p.OCCUPATION ?? p.role ?? "—",
      rating: Number(p.RATING ?? p.rating ?? 0),
      reviews: Number(p.REVIEWS ?? p.reviews ?? 0),
    };
  });
});

const hosterInfo = computed(() => {
  const host = hoster.value
  if (!host) return null

  const id = Number(host.MEMBER_ID ?? host.id ?? 0)

  return {
    id,
    name:    host.NICKNAME ?? host.name ?? `會員 #${id}`,
    avatar:  userImg(host.AVATAR ?? host.avatar ?? `https://i.pravatar.cc/150?u=${id}`),
    city:    host.CITY_NAME ?? host.city ?? '—',
    age:     host.AGE ?? host.age ?? null,
    role:    host.OCCUPATION ?? host.role ?? '—',

    // 視你的後端欄位而定，這裡做多種鍵名容錯
    ratingAsHost:   Number(host.RATING_HOST ?? host.rating_host ?? host.RATING ?? host.rating ?? 0),
    reviewsAsHost:  Number(host.REVIEWS_HOST ?? host.reviews_host ?? host.REVIEWS ?? host.reviews ?? 0),
    ratingAsJoiner: Number(host.RATING_JOINER ?? host.rating_joiner ?? 0),
    reviewsAsJoiner:Number(host.REVIEWS_JOINER ?? host.reviews_joiner ?? 0),
  }
})
const imgSrc = computed(() =>
  imageUrl(activity.value?.ACTIVITY_IMG || activity.value?.activity_img || "")
);
const rawRouteId = computed(() => String(route.params.activity_id || ""));
const routeIdNumeric = computed(() => {
  const n = Number(rawRouteId.value.replace(/\D/g, ""));
  return Number.isFinite(n) ? n : null;
});

const likeMap = ref({});

const toggleLike = (id) => {
  likeMap.value[id] = !likeMap.value[id];
};

// const aloha = () => {
//   alert("我要跟團！");
// };

const router = useRouter();
const gotoSignup = () => {
  const a = activity.value
  if (!a) return

  const status = a.ACTIVITY_STATUS ?? a.activity_status ?? ''
  const isCancelled = status === '已取消'
  const isFinished  = status === '已完成'
  const ddl = a.REGISTRATION_DEADLINE ?? a.registration_deadline
  const isDeadlinePassed = ddl ? new Date() > new Date(ddl) : false

  if (isCancelled || isFinished || isDeadlinePassed) {
    alert('此活動目前不可報名')
    return
  }

  const actNo = a.ACTIVITY_NO ?? a.activity_no
  // 依你的路由設定擇一：
  router.push(`/group/group-signup/${actNo}`)
  // 或 router.push({ name: 'activity-signup', params: { activity_id: actNo } })
}

// === 第三步：在 aloha 函式的正下方，貼上所有「新的邏輯」 ===
// --- 按鈕切換 & 鍵盤監聽 ---
// const isGroupJoined = ref(false); // 用於切換按鈕

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
  if (!canRate.value || hasRated.value) return
  isRatingModalVisible.value = true
};

const closeRatingModal = () => {
  isRatingModalVisible.value = false; // 關閉評價彈窗
};

async function submitRatings(payload) {
  try {
    // 允許「沒選任何人就關閉」
    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
      closeRatingModal();
      return;
    }

    const body = {
      activity_no: Number(payload.activity_no || activity.value?.ACTIVITY_NO),
      items: payload.items
        .map(x => ({
          ratee_id: Number(x.ratee_id),
          ratee_role: x.ratee_role,                 // '主揪' 或 '參與者'
          rating_score: Number(x.rating_score),
        }))
        .filter(x =>
          Number.isFinite(x.ratee_id) &&
          (x.ratee_role === '主揪' || x.ratee_role === '參與者') &&
          x.rating_score >= 1 && x.rating_score <= 5
        ),
    };

    if (!body.activity_no || body.items.length === 0) {
      closeRatingModal();
      return;
    }

    console.log('rate payload:', body);

    const { data } = await axios.post(
      `${VITE_API_BASE}/activities/rate.php`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, 
      }
    );

    console.log('rate response:', data);
    alert(data?.message || `評分完成`);
    closeRatingModal();
    detail.value = {
      ...detail.value,
      ratings: {
        ...(detail.value?.ratings ?? {}),
        mine: { score: 5, at: new Date().toISOString() } // 真實內容可用 data 回傳覆蓋
      }
    }
    await loadDetail();
  } catch (err) {
    // 把完整錯誤印出來，方便你在 console 看
    console.error('rate error full:', err);
    if (err?.response) {
      console.error('rate error response:', err.response.status, err.response.data);
    }
    const msg = err?.response?.data?.error || err?.message || '評分失敗';
    alert(msg);
  }
}

// === 新增：取消彈窗相關邏輯 ===
const isCancelModalVisible = ref(false); // 取消彈窗的「開關」
const modalResetKey = ref(0);

const openCancelModal = () => {
  isCancelModalVisible.value = true; // 打開取消彈窗
};

const closeCancelModal = () => {
  isCancelModalVisible.value = false; // 關閉取消彈窗
};

const currentUserId = ref(null);
const meLoading = ref(true);
async function fetchMe() {
  try {
    const { data } = await axios.get(`${VITE_API_BASE}/users/me.php`);
    //  console.log('me =', data)
    currentUserId.value = data?.user?.id ?? null;
  } catch (e) {
    currentUserId.value = null;
  } finally {
    meLoading.value = false;
  }
}
onMounted(fetchMe);

//主揪取消活動API
async function handleCancelSubmit(payload) {
  try {
    const actNo = Number(activity.value?.ACTIVITY_NO);
    if (!Number.isFinite(actNo) || actNo <= 0) {
      alert("找不到有效的活動編號");
      return;
    }
    const body = {
      reason_no: Number(payload?.reason_no ?? payload?.reasonNo ?? 0),
      reason_detail: payload?.reason_detail ?? payload?.reasonDetail ?? null,
    };
    if (!Number.isFinite(body.reason_no) || body.reason_no <= 0) {
      alert("請選擇取消原因");
      return;
    }
    const url = isHost.value
      ? `${VITE_API_BASE}/activities/cancel-hoster.php?id=${actNo}`
      : `${VITE_API_BASE}/activities/cancel-joiner.php?id=${actNo}`;

    const { data } = await axios.patch(url, body, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    if (!data || data.error) {
      throw new Error(data?.message || data?.error || "取消失敗");
    }

    isCancelModalVisible.value = false;
    modalResetKey.value++;
    alert(data?.message || "取消成功");
    await loadDetail(); 
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "取消失敗（未知錯誤）";
    alert(msg);
    console.error("cancel error:", err?.response || err);
  }
}

const formDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
};

// 新增二：正式聘請管理員，並定義「我要跟團」按鈕專屬的「交通警察」。
const participationStore = useParticipationStore();

const handleJoinButtonClick = () => {
  // 交通警察直接把工作交給管理員的「總指揮」去處理。
  participationStore.handleJoinProcess(activityNo);
};
// 結束備註

const isGroupJoined = computed(() => {
  // activityNo 來自您檔案頂部的 const activityNo = route.params.activity_id;
  return participationStore.isJoined(activityNo);
});

//留言API

const comments = ref(null);
const isLoading = ref(true);
const error = ref(null);

function getActivityComments(activityId) {
  // 參數名改一下避免混淆
  const activityNoNumeric = String(activityId).replace(/\D/g, "");

  // console.log(`準備為活動 ID: ${activityId} 請求留言 API`); // 偵錯 Log

  isLoading.value = true;
  error.value = null;
  comments.value = [];

  axios
    .get(
      `${VITE_API_BASE}/comments/activities-list.php?activity_no=${activityNoNumeric}`
    )
    .then((res) => {
      // console.log("API 成功回傳留言:", res.data); // 偵錯 Log
      // console.log('API 原始資料:', res.data);
      if (!res.data || !Array.isArray(res.data)) return;

      // --- 先把每筆留言整理成統一格式 ---
      const allComments = res.data.map((c) => ({
        id: c.ACTIVITY_COMMENT_NO,
        userid: c.MEMBER_ID,
        author: c.MEMBER_NICKNAME || "匿名",
        avatar: c.MEMBER_AVATAR || `https://i.pravatar.cc/150?u=${c.MEMBER_ID}`,
        timestamp: c.CREATED_AT,
        content: c.COMMENT_CONTENT,
        likenum: Number(c.LIKE_COUNT || 0),
        liked: false,
        parentId: c.PARENT_NO,
        replies: [],
        isRepliesExpanded: false,
        animateLike: false,
      }));

      // --- 將平面陣列整理成樹狀 ---
      const commentMap = {};
      const rootComments = [];

      allComments.forEach((c) => {
        commentMap[c.id] = c;
      });

      allComments.forEach((c) => {
        if (c.parentId && commentMap[c.parentId]) {
          commentMap[c.parentId].replies.push(c);
        } else {
          rootComments.push(c);
        }
      });

      comments.value = rootComments;
    })
    .catch((err) => {
      console.error("取得留言失敗", err);
      error.value = "無法載入留言，請稍後再試。";
      comments.value = [];
    })
    .finally(() => {
      isLoading.value = false;
    });
}

// --- 監聽路由或活動編號變化 ---
watch(
  // 直接監聽我們的 computed ID
  currentActivityId,
  (newId) => {
    // newId 現在就是 currentActivityId.value
    if (!newId) {
      comments.value = [];
      return;
    }
    getActivityComments(newId);
  },
  { immediate: true }
);
// //偵錯用
// watch(comments, (val) => {
//   console.log('comments 內容:', val);
// });

// Swiper modules
const swiperModules = [Pagination];
</script>

<template>
  <div class="activity-detail-page">
    <!-- 藍色背景 -->
    <div class="activity-hero-bg">
      <div class="hint">揪團探索/揪團列表/{{ activity?.CATEGORY_NAME }}</div>
    </div>
    <!-- 圖片 -->
    <div class="activity-image">
      <img :src="imgSrc" :alt="activity?.ACTIVITY_NAME" />
    </div>

    <!-- 標題 -->
    <div class="activity-title-wrap">
      <h2>{{ activity?.ACTIVITY_NAME }}</h2>
    </div>

    <!-- === 第四步：用這段「新的按鈕區塊」取代您原本的 === -->
    <div class="activity-button-wrap">
      <!-- === 關鍵修改：讓它同時參考後端API的情報和前端Store的情報 === -->
      <template v-if="!meLoading && (isHost || participationStore.isJoined(activityNo))">
        <Button
        type="button"
          @click="openCancelModal"
          theme="cancel"
          isOutline
          size="md"
          :isDisabled="!canCancel"
          :title="!canCancel ? '開始前一天起或狀態不允許取消' : ''"
          >取消</Button
        >
        <Button
        type="button"
          @click="openRatingModal"
          theme="primary"
          size="md"
          :isDisabled="!canRate"
          :title="!canRate ? '活動未完成，暫不可評分' : ''"
          >{{ hasRated ? '已評價' : '評價' }}</Button
        >
      </template>

      <template v-else>
        <!-- <Button
        type="button"
          @click.stop.prevent="gotoSignup()"
          theme="primary"
          size="md"
        >
          我要跟團!
        </Button> -->
        <Button
          type="button"
          @click.stop.prevent="handleJoinButtonClick"
          theme="primary"
          size="md"
          :disabled="participationStore.isLoading"
        >
          <span v-if="participationStore.isLoading">載入中...</span>
          <span v-else>我要跟團!</span>
        </Button>

        <LikeButton :activity-no="activityNo"></LikeButton>
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
              >{{ activity?.ACTIVITY_START_DATE }} ~ <br />{{
                activity?.ACTIVITY_END_DATE
              }}</span
            >
          </div>
          <div class="info-row">
            <strong>地點</strong>
            <span>{{ activity?.LOCATION }}</span>
          </div>
          <div class="info-row">
            <strong>揪團人數</strong>
            <span
              >{{ participantsCount }}/{{
                activity?.MAX_PARTICIPANT
              }}人</span
            >
          </div>
        </div>

        <!-- 右欄 -->
        <div class="info-col">
          <div class="info-row">
            <strong>預估費用</strong>
            <span>{{ activity?.FEE_NOTES }}</span>
          </div>
          <div class="info-row">
            <strong>揪團截止日</strong>
            <span>{{ formDate(activity?.REGISTRATION_DEADLINE) }}</span>
          </div>
          <div class="info-row">
            <strong>跟團限制</strong>
            <span>{{ activity?.PARTICIPANT_LIMITATION }}</span>
          </div>
        </div>
      </div>
    </section>

    
    <section class="host-info" v-if="hosterInfo">
      <div class="host-title">主揪</div>
      <div class="host-content">
       
        <img
          :src="hosterInfo.avatar"
          alt=""
          class="host-avatar"
        />
        <div class="host-details">
          <div class="host-name">{{hosterInfo.name}}</div>
         <div class="rating-line">
        <div class="stars stars-yellow">
          <i v-for="n in 5" :key="'h'+n"
             :class="n <= Math.round(hosterInfo.ratingAsHost) ? 'fa-solid fa-star' : 'fa-regular fa-star'"/>
        </div>
        <span>{{ Number(hosterInfo.ratingAsHost ?? 0).toFixed(1) }} ({{ hosterInfo.reviewsAsHost ?? 0 }})</span>
      </div>

      <div class="rating-line" v-if="hosterInfo.reviewsAsJoiner > 0">
        <div class="stars stars-blue">
          <i v-for="n in 5" :key="'j'+n"
             :class="n <= Math.round(hosterInfo.ratingAsJoiner) ? 'fa-solid fa-star' : 'fa-regular fa-star'"/>
        </div>
        <span>{{ hosterInfo.ratingAsJoiner.toFixed(1) }}({{ hosterInfo.reviewsAsJoiner }})</span>
      </div>

          <div class="host-bio">{{ hosterInfo.city }} | {{ hosterInfo.age ?? '—' }}歲 | {{ hosterInfo.role }}</div>
        </div>
      </div>
    </section>

    <!-- 活動詳情 -->
    <section class="activity-description">
      <div class="description-title">詳細</div>
      <p class="description-content">{{ activity?.ACTIVITY_DESCRIPTION }}</p>
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
            v-for="participant in participantsPreview"
            :key="participant.MEMBER_ID"
          >
            <div class="participant-card">
              <img
                :src="userImg(participant.AVATAR)"
                alt=""
                class="participant-avatar"
              />
              <div class="participant-details">
                <div class="participant-name">{{ participant.NICKNAME }}</div>
                <div class="rating-line">
                  <div class="stars stars-blue">
                    <i
                      v-for="n in 5"
                      :key="n"
                      :class="
                        n <= Math.round(Number(participant.rating || 0))
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
                <span
                  >{{ Number(participant.rating || 0).toFixed(1) }} ({{
                    participant.reviews || 0
                  }})</span
                >
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
    <!-- 留言區 -->
    <div class="comments-container">
      <div class="comments-section">
        <div v-if="isLoading">正在載入留言...</div>
        <div v-else-if="error">{{ error }}</div>
        <commentSection
          v-if="comments"
          :comments="comments"
          @comment-added="getActivityComments(currentActivityId)"
        />
      </div>
      <!-- <commentSection
        :comments-data="commentsForBoard"
        :user-data="currentUserForBoard"
        @add-comment="handleAddNewComment"
        @add-reply="handleAddNewReply"
      /> -->
    </div>

    <!-- === 第五步：在 template 的最下方，加入這段「彈窗元件」 === -->
    <RatingModal
      v-if="activity"
      :show="isRatingModalVisible"
      :activity="activity"
      :participants="participantsForModal"
      :hoster="hoster"
      :current-user-id="currentUserId"
      :is-host="isHost"
      :is-joiner="isJoiner"
      @close="closeRatingModal"
      @submit="submitRatings"
    />

    <!-- === 新增：為未來的「取消彈窗」預留的元件位置 === -->

    <CancelModal
      v-if="activity"
      :key="modalResetKey"
      :show="isCancelModalVisible"
      :activity="activity"
      :participants-count="participantsCount"
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
  position: relative;
  z-index: -10;
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
    align-items: center;

    strong {
      font-size: 24px;
      font-weight: bold;
      width: 30%;
      font-family: "Inter", sans-serif;

      @include mobile() {
        font-size: 20px;
      }
    }

    span {
      font-size: 18px;
      padding-left: 70px;
      max-width: 70%;
      line-height: 1.5;
      font-family: "Inter", sans-serif;
    }
  }
}

.bg-decorate2 {
  position: absolute;
  top: 500px;
  left: 0;
  width: auto;
  width: 50%;
  z-index: -5;

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
    font-family: "Inter", sans-serif;

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
    font-family: "Inter", sans-serif;

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
    font-size: 18px;
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
  z-index: 1;  // === 顯示在下面,不吃到導覽列 ===

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
    // 為下方的絕對定位圓點預留足夠的空間
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
    font-family: "Inter", sans-serif;

    @include mobile() {
      display: none;
    }
  }

  .participant-bio {
    font-size: 20px;
    font-family: "Inter", sans-serif;
  }

  // --- Swiper 分頁圓點外觀樣式 ---
  :deep(.swiper-pagination-bullet) {
    width: 12px;
    height: 12px;
    background-color: #5ea8a8;
    opacity: 1;
  }

  :deep(.swiper-pagination-bullet-active) {
    background-color: #ffc700;
  }

  // --- 全域的分頁圓點置中樣式 ---
  :deep(.swiper-pagination) {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 30px;
    text-align: center;
    padding: 0;
    // 確保圓點本身不會被意外隱藏
    z-index: 10;
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

    // --- 終極關鍵修正 ---
    // Swiper.js 會在其實例 (class="swiper") 上強制加上 position: relative。
    // 我們必須用 !important 來覆蓋它，才能打破這個定位上下文。
    :deep(.swiper) {
      position: static !important;
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
