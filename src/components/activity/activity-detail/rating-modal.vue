<script setup>
import { ref, watch } from 'vue';
import Button from '@/components/Button.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';

// === Props & Emits: 定義這個元件如何與外部溝通 ===
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  activity: {
    type: Object,
    required: true
  },
  participants: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

// === Component State: 元件內部的狀態管理 ===
const ratings = ref({});
const hoverRating = ref({});

// === Methods: 元件的行為函式 ===
const setRating = (participantId, score) => {
  ratings.value[participantId] = score;
};

const setHoverRating = (participantId, score) => {
  hoverRating.value[participantId] = score;
};

const clearHoverRating = (participantId) => {
  delete hoverRating.value[participantId];
};

const submitRatings = () => {
  emit('submit', ratings.value);
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
  
  if (!newVal) {
    ratings.value = {};
    hoverRating.value = {};
  }
});
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <div class="header-content">
          <h2 class="activity-title">{{ activity?.activity_name }}</h2>
          <div class="activity-meta">
            <span>活動日期: {{ activity?.activity_start_date }}</span>
            <span>參團人數: {{ activity?.current_participant }}/{{ activity?.max_participant }}</span>
          </div>
        </div>
        <button class="close-button" @click="emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>
      <main class="modal-body">
        <h3 class="list-title">團員列表</h3>
        <div class="participant-list">
          <div
            v-for="participant in participants"
            :key="participant.id"
            class="participant-item"
          >
            <img :src="participant.avatar" :alt="participant.name" class="participant-avatar" />
            <div class="participant-details">
              <div class="participant-info">
                <span class="participant-name">{{ participant.name }}</span>
                <span class="participant-bio">
                  {{ participant.city }} | {{ participant.age }}歲 | {{ participant.role }}
                </span>
              </div>
              <p class="rating-prompt">評價此團員</p>
              <div
                class="stars"
                @mouseleave="clearHoverRating(participant.id)"
              >
                <i
                  v-for="n in 5"
                  :key="n"
                  class="fa-star"
                  :class="{
                    'fa-solid': (hoverRating[participant.id] || ratings[participant.id] || 0) >= n,
                    'fa-regular': (hoverRating[participant.id] || ratings[participant.id] || 0) < n
                  }"
                  @mouseover="setHoverRating(participant.id, n)"
                  @click="setRating(participant.id, n)"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer class="modal-footer">
        <Button @click="submitRatings" theme="primary" size="md">送出</Button>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
:global(body.modal-open) {
  overflow: hidden;
}

// === SCSS Variables (保持不變) ===
$color-primary: #5ea8a8;
$color-secondary: #ffc700;
$color-text-dark: #333;
$color-text-light: #888;
$color-border: #eee;
$color-black-border: #000;
$z-index-modal: 1000;

// === Modal Layout ===
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: $z-index-modal;
  overflow-y: auto;
  padding: 20px 0;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 370px;
  padding: 24px;
  margin: auto;
}

// === Modal Header ===
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: center;
  width: 100%;
  margin-bottom: 24px;

  .header-content {
    flex-grow: 1;
  }

  .activity-title {
    font-weight: bold;
    color: $color-text-dark;
    margin-bottom: 8px;

    @include mobile() {
      font-size: 24px;
    }
  }

  .activity-meta {
    font-size: 16px;
    color: $color-text-light;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    color: $color-text-light;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    margin-left: 16px;
  }
}

// === Modal Body ===
.modal-body {
  .list-title {
    font-weight: bold;
    color: $color-text-dark;
    margin-bottom: 16px;
    text-align: left;
    font-size: 20px;

    @include desktop() {
      padding-right: 470px;
    }
  }
}

.participant-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.participant-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  @include mobile() {
    margin: 10px;
    min-width: 300px;
  }
}

.participant-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;

}

.participant-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.participant-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.participant-name {
  font-size: 20px;
  font-weight: 500;
  color: $color-text-dark;
  // 移除了舊的 @include mobile 樣式
}

.participant-bio {
  font-size: 16px;
  color: $color-text-light;
  // 移除了舊的 @include mobile 樣式
}

.rating-prompt {
  font-size: 16px;
  color: $color-text-dark;
  margin-bottom: 10px;
  
  @include mobile(){
    margin-top: 10px;
  }
}

.stars {
  display: flex;
  gap: 12px;
  font-size: 28px;
  color: $color-secondary;
  cursor: pointer;
  
  @include mobile(){
    margin-top: 10px;
  }
}

// === Modal Footer ===
.modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

// === RWD Styles ===

// === 修改開始: 手機版 Grid 排版 ===
@include mobile() {
  .participant-item {
    display: grid;
    // 定義欄寬: 1. 頭像寬度 2. 剩餘彈性空間
    grid-template-columns: 80px 1fr;
    // 定義列高: 1. 個人資訊 2. 評價提示 3. 星星
    grid-template-rows: auto auto auto;
    gap: 8px 12px; // row-gap, column-gap
    align-items: center; // 垂直置中第一行的頭像和資訊
  }

  .participant-details {
    // 讓 .participant-details 的子元素直接參與父層的 grid 排版
    display: contents;
  }

  .participant-avatar {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
  }

  .participant-info {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
    align-items: flex-start; // 讓姓名和簡介靠左對齊
  }

  .rating-prompt {
    grid-row: 2 / 3;
    grid-column: 1 / 3; // 橫跨兩欄，使其從最左邊開始
    margin-bottom: 0; // 由 grid-gap 控制間距
  }

  .stars {
    grid-row: 3 / 4;
    grid-column: 1 / 3; // 橫跨兩欄，使其從最左邊開始
  }
}
// === 修改結束 ===

// === Desktop Styles ===
@include desktop() {
  .modal-content {
    width: 1200px;
    padding: 40px;
    border: 1px solid $color-black-border;
    border-radius: 6px;
  }

  .modal-body .list-title {
    text-align: center;
  }

  .participant-list {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 20px;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $color-primary;
      border-radius: 20px;
    }
  }

  .participant-item {
    flex-direction: row;
    align-items: center;
    padding: 16px 0;
    justify-content: center;
  }

  .participant-avatar {
    width: 120px;
    height: 120px;
  }

  .participant-details {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 24px;
    gap: 10px;
  }

  .participant-info {
    align-items: flex-start;

    @include desktop() {
      margin-top: -25px;
    }
  }

  .participant-bio {
    display: none;
  }

  .stars {
    font-size: 24px;
    gap: 8px;
  }
}
</style>