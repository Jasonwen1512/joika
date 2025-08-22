<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Button from '@/components/Button.vue';

// 1. 定義 props 和 emits
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  activity: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'submit']);
const selectedReasonNo = ref(null);

// 2. 內部狀態

const details = ref('');
const isDropdownOpen = ref(false); // 新增：控制自訂下拉選單的開關
const dropdownRef = ref(null); // 新增：用於偵測點擊範圍

const reasonOptions = [
 { no: 1, label: '時間無法配合' },
  { no: 2, label: '活動地點太遠' },
  { no: 3, label: '找到其他活動' },
  { no: 4, label: '臨時有事' },
  { no: 5, label: '其他原因' },
];
const selectReason = (no) => {
  selectedReasonNo.value = no
  isDropdownOpen.value = false
}

// 3. 事件處理函式
const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (selectedReasonNo.value === null) {
    alert('請選擇一個取消原因');
    return;
  }
  emit('submit', {
    reason_no: Number(selectedReasonNo.value),
    reason_detail: details.value ? details.value.trim() : ''
  });
};

// --- 新增：自訂下拉選單的邏輯 ---
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};



// 處理點擊外部區域關閉選單的邏輯
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
// --- End 新增 ---

// 監聽 show prop 的變化，當彈窗關閉時重設內部狀態
watch(() => props.show, (newVal) => {
  if (!newVal) {
    selectedReasonNo.value = null;
    details.value = '';
    isDropdownOpen.value = false; // 確保下拉選單也關閉
  }
});
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <button class="close-button" @click="handleClose">×</button>

      <div class="modal-body">
        <h2 class="title">確定要取消參加這個揪團嗎？</h2>
        <h3 class="activity-name">{{ activity?.activity_name }}</h3>

        <div class="activity-info">
          <span>活動日期：{{ activity?.activity_start_date }}</span>
          <span>參團人數：{{ activity?.current_participant }}/{{ activity?.max_participant }}</span>
        </div>

        <div class="form-group">
          <!-- === 修改：將 select 替換為自訂的 dropdown === -->
          <div class="custom-select" ref="dropdownRef">
            <div class="select-trigger" @click="toggleDropdown">
              <span v-if="selectedReasonNo !== null" class="selected-text">{{ (reasonOptions.find(reason => reason.no === selectedReasonNo) || {}).label }}</span>
              <span v-else class="placeholder">取消原因</span>
              <span class="arrow" :class="{ 'is-open': isDropdownOpen }">▼</span>
            </div>
            <ul v-if="isDropdownOpen" class="options-list">
              <li
                v-for="reason in reasonOptions"
                :key="reason.no"
                @click="selectReason(reason.no)"
                class="option-item"
              >
                {{ reason.label }}
              </li>
            </ul>
          </div>
          <!-- === End 修改 === -->

          <textarea
            v-model="details"
            class="details-textarea"
            placeholder="為了幫助團員了解情況，請補充說明（選填）。"
          ></textarea>
        </div>

        <p class="warning-text">取消後將無法恢復，確定要取消參加嗎？</p>

        <div class="button-group">
          <Button theme="secondary" :is-outline="true" @click="handleClose" class="cancel-btn">
            取消
          </Button>
          <Button theme="primary" @click="handleSubmit" class="submit-btn">
            送出
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// === 基礎樣式 (Mobile First) ===
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  position: relative;
  width: 370px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px 20px;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.activity-name {
  font-size: 20px;
  text-align: center;
}

.activity-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// === 新增：自訂下拉選單樣式 ===
.custom-select {
  position: relative;
  width: 100%;
  font-size: 16px;
}

.select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.placeholder {
  color: #555;
}

.arrow {
  font-size: 12px;
  color: #888;
  transition: transform 0.2s ease-in-out;
  &.is-open {
    transform: rotate(180deg);
  }
}

.options-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.option-item {
  padding: 12px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
}
// === End 新增 ===

.details-textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize:none;

  &::placeholder {
    color: #999;
  }
}

.warning-text {
  font-size: 14px;
  color: #555;
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;

  :deep(.button) {
    font-size: 24px;
  }
}

// === 桌機版樣式 ===
@include desktop() {
  .modal-content {
    width: 1200px;
    padding: 60px;
  }

  .modal-body {
    gap: 32px;
  }

  .title {
    font-size: 32px;
  }

  .activity-name {
    font-size: 24px;
  }

  .activity-info {
    font-size: 20px;
  }

  .form-group {
    width: 800px;
  }

  // 自訂下拉選單和文字區的桌機樣式
  .custom-select,
  .details-textarea {
    font-size: 20px;
  }
  
  .select-trigger,
  .option-item {
     padding: 16px;
  }

  .details-textarea {
    height: 150px;
  }

  .warning-text {
    font-size: 24px;
  }
}
</style>