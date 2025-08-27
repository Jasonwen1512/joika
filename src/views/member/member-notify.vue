<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
axios.defaults.withCredentials = true
const API = import.meta.env.VITE_API_BASE

// 頁籤與資料
const activeTab = ref('system')
const systemNotifications = ref([])
const generalNotifications = ref([])

// 紅點統計（後端回傳為準）
const unreadAll = ref(0)
const unreadSystem = ref(0)
const unreadInteract = ref(0)

// 共用：更新三個未讀統計
function applyUnreadMeta(meta = {}) {
  unreadAll.value      = Number(meta.unread_count ?? unreadAll.value ?? 0)
  unreadSystem.value   = Number(meta.unread_count_system ?? unreadSystem.value ?? 0)
  unreadInteract.value = Number(meta.unread_count_interact ?? unreadInteract.value ?? 0)
}

// ---- API 包裝 ----
async function getList(params) {
  const res = await axios.get(`${API}/notifications/list.php`, {
    params,
    withCredentials: true
  })
  return res.data
}
async function postMarkRead(body) {
  const res = await axios.post(`${API}/notifications/mark-read.php`, body, {
    withCredentials: true
  })
  return res.data
}

// 抓「系統通知」清單（不主動全清，用展開單筆時才標已讀）
async function loadSystemNotifications() {
  try {
    const data = await getList({ type: 'system', status: 'all', limit: 50, offset: 0 })
    systemNotifications.value = (data?.data || []).map(n => ({
      id: Number(n.notification_no),
      title: n.title,
      content: n.content ?? '',
      status: n.status,                 // '未讀' | '已讀'
      type: n.type,                     // '系統通知'
      created_at: n.created_at,
      expanded: false
    }))
    applyUnreadMeta(data?.meta)
  } catch (err) {
    console.error('載入系統通知失敗：', err.response?.data || err.message)
  }
}

// 先嘗試全清互動未讀 → 抓清單 → 若仍有未讀再 ids 精準清一次
async function loadInteractNotificationsWithEnsureRead() {
  try {
    // 1) 嘗試全清（type: interact）
    try {
      const mark = await postMarkRead({ all: true, type: 'interact' })
      applyUnreadMeta(mark)
    } catch (e) {
      // 不中斷流程，先往下抓清單
      console.warn('互動通知全清失敗，將改用 ids 精準清：', e.response?.data || e.message)
    }

    // 2) 抓互動清單（看還剩多少未讀）
    const data = await getList({ type: 'interact', status: 'all', limit: 50, offset: 0 })
    generalNotifications.value = (data?.data || []).map(n => ({
      id: Number(n.notification_no),
      title: n.title,
      content: n.content ?? '',
      status: n.status,                 // 先保留後端值；等會確認是否需要 ids 再清
      type: n.type,
      created_at: n.created_at
    }))
    applyUnreadMeta(data?.meta)

    // 3) 如果仍有互動未讀，收集未讀 id，再補一次 ids 精準清
    if ((data?.meta?.unread_count_interact ?? 0) > 0) {
      const unreadIds = generalNotifications.value
        .filter(n => n.status === '未讀')
        .map(n => n.id)

      if (unreadIds.length > 0) {
        const fix = await postMarkRead({ ids: unreadIds })
        applyUnreadMeta(fix)
        // 本地同步設為已讀（立即 UI 回饋）
        generalNotifications.value = generalNotifications.value.map(n =>
          unreadIds.includes(n.id) ? { ...n, status: '已讀' } : n
        )
      }
    } else {
      // 沒未讀，直接把 list 狀態視為已讀（避免畫面仍顯示未讀點）
      generalNotifications.value = generalNotifications.value.map(n => ({ ...n, status: '已讀' }))
    }
  } catch (err) {
    console.error('載入一般通知（互動）失敗：', err.response?.data || err.message)
  }
}

// 首次載入：抓兩個分頁（不自動清互動，等切到頁籤再清）
async function fetchNotifications() {
  await Promise.allSettled([
    loadSystemNotifications(),
    (async () => {
      const data = await getList({ type: 'interact', status: 'all', limit: 50, offset: 0 })
      generalNotifications.value = (data?.data || []).map(n => ({
        id: Number(n.notification_no),
        title: n.title,
        content: n.content ?? '',
        status: n.status,
        type: n.type,
        created_at: n.created_at
      }))
      applyUnreadMeta(data?.meta)
    })()
  ])
}
onMounted(fetchNotifications)

// 切換頁籤：切到一般（互動）時執行「全清 → 抓清單 → 必要時 ids 再清一次」
async function selectTab(tab) {
  activeTab.value = tab
  if (tab === 'general') {
    await loadInteractNotificationsWithEnsureRead()
  }
}

// 單筆標記為已讀（系統通知在展開時）
async function markRead(ids = []) {
  if (!ids.length) return
  try {
    const res = await postMarkRead({ ids })
    applyUnreadMeta(res)
  } catch (e) {
    console.error('mark-read 失敗', e.response?.data || e.message)
  }
}

// 展開/收合 + 首次展開即標已讀（系統通知用）
function toggleAccordion(list, item) {
  list.forEach(n => {
    if (n.id === item.id) {
      const willExpand = !n.expanded
      n.expanded = willExpand
      if (willExpand && n.status === '未讀') {
        n.status = '已讀'   // 立即回饋
        markRead([n.id])    // 後端同步 + 回傳統計更新紅點
      }
    } else {
      n.expanded = false
    }
  })
}
</script>

<template>
  <div class="notify-tabs">
    <ul class="tab-header">
      <li>
        <button :class="{ active: activeTab === 'system' }" @click="selectTab('system')">
          系統通知
          <span v-if="unreadSystem > 0" class="badge">{{ unreadSystem }}</span>
        </button>
      </li>
      <li>
        <button :class="{ active: activeTab === 'general' }" @click="selectTab('general')">
          一般通知
          <span v-if="unreadInteract > 0" class="badge">{{ unreadInteract }}</span>
        </button>
      </li>
    </ul>

    <div class="notify-body">
      <!-- 系統通知內容 -->
      <div v-show="activeTab === 'system'" class="tab-content">
        <div v-if="systemNotifications.length === 0" class="empty-state">
          目前尚無任何通知
        </div>
        <template v-else>
          <div
            v-for="item in systemNotifications"
            :key="item.id"
            class="notify-item"
          >
            <div class="notify-title system" @click="toggleAccordion(systemNotifications, item)">
              <div class="title-wrap">
                <span v-if="item.status === '未讀'" class="unread-dot"></span>
                <span :class="{'unread-text': item.status === '未讀'}">{{ item.title }}</span>
              </div>
              <span class="icon-wrapper" :class="{ rotated: item.expanded }">
                <svg class="icon" viewBox="0 0 36 36" width="26" height="26" stroke="black" stroke-width="3">
                  <line class="line1" x1="8" y1="18" x2="28" y2="18" />
                  <line class="line2" x1="18" y1="8" x2="18" y2="28" />
                </svg>
              </span>
            </div>
            <transition name="accordion">
              <div v-if="item.expanded" class="notify-detail">
                <p v-for="line in item.content.split('\n')" :key="line">{{ line }}</p>
              </div>
            </transition>
          </div>
        </template>
      </div>

      <!-- 一般通知（互動）內容 -->
      <div v-show="activeTab === 'general'" class="tab-content">
        <div v-if="generalNotifications.length === 0" class="empty-state">
          目前尚無任何通知
        </div>
        <template v-else>
          <div
            v-for="item in generalNotifications"
            :key="item.id"
            class="notify-item"
          >
            <h4 class="notify-title">
              <span class="title-wrap">
                <span v-if="item.status === '未讀'" class="unread-dot"></span>
                <span :class="{'unread-text': item.status === '未讀'}">{{ item.title }}</span>
              </span>
            </h4>
            <p class="notify-detail">{{ item.content }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/mixin" as *;
@import "@/assets/scss/_color.scss";
@font-face {
  font-family: "Baloo 2";
  src: url("@/assets/fonts/Baloo2-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Baloo 2";
  src: url("@/assets/fonts/Baloo2-Bold.woff2") format("woff2");
  font-weight: 700;
}

.notify-tabs{
  width: 100%;
  padding: 20px;
  margin: auto;
}
.notify-body{
  border: 2px solid black;
  border-radius: 3px;
  min-height: 200px;
  line-height: 1.5;
  background-color: #fff;
}
.tab-header{
  display: flex;
  padding: 0;
  margin: 0;
  gap: 10px;

  li button{
    flex: 1;
    border: 2px solid #000;
    border-bottom: 0;
    padding: 8px;
    cursor: pointer;
    background: #C7E5F1;
    border-radius: 3px;
  }
}
.tab-header button.active {
  background: $header-text-color;
  color: #fff;
}
.tab-content:nth-of-type(2) .notify-title {
  margin: 8px;
}
.tab-content:nth-of-type(2) .notify-item:not(:last-child) {
  border-bottom: 2px solid #000;
}
.notify-title.system {
  background-color:$color-primary;
  border-bottom:1px solid #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}
.icon-wrapper svg{
  vertical-align: middle;
}
.icon-wrapper .line2 {
  transition: transform 0.5s ease;
  transform-origin: center;
}
.icon-wrapper.rotated .line2 {
  transform: scaleY(0);
}
.notify-detail{
  padding: 8px 12px 8px 8px;
  border-bottom: 1px solid #ccc;
}
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.5s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* 捲軸 */
.tab-content {
  max-height: 300px;
  overflow-y: overlay;
  scrollbar-width:thin;
  scrollbar-color: $color-secondary #E0F3F8;
}
.tab-content::-webkit-scrollbar {
  width: 8px;
}
.tab-content::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.4);
  border-radius: 8px;
}
.tab-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #81BFDA, #4F8DA8);
  border-radius: 8px;
}

/* 已讀未讀 */
.title-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff5a5a;
  display: inline-block;
}
.unread-text {
  font-weight: 700;
}
.badge {
  margin-left:6px;
  padding:0 6px;
  border-radius:10px;
  font-size:12px;
  background:#ff5a5a;
  color:#fff;
}
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-family: "Baloo 2", "Noto Sans TC", "Microsoft JhengHei", sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 桌機版 */
@include desktop{
  .notify-tabs{
    width: 70%;
  }
}
</style>
