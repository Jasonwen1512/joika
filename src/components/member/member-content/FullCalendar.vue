<script setup>
    import { ref } from 'vue'
    import FullCalendar from '@fullcalendar/vue3'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import interactionPlugin from '@fullcalendar/interaction'
    import { useRouter } from 'vue-router' 
    

    const API_BASE = import.meta.env.VITE_API_BASE
    const router = useRouter()

    // 事件載入函式（FullCalendar 會自動傳入目前視圖期間）
    async function fetchEvents(info, success, failure) {
        try {
            const u = new URL(`${API_BASE}/users/fullcalendar-get.php`)
            // 一定要把可視區間帶給後端，這樣月初的也會抓到
            u.searchParams.set('start', info.startStr)
            u.searchParams.set('end', info.endStr)

            const res = await fetch(u.toString(), {
            method: 'GET',
            credentials: 'include', // 帶上 PHPSESSID
            })
            if (!res.ok) throw new Error(await res.text())
            const data = await res.json() // 後端已回 FullCalendar 事件陣列
            success(data)
        } catch (err) {
            console.error('載入事件失敗：', err)
            failure(err)
        }
    }

const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    firstDay: 1,
    showNonCurrentDates: false,
    fixedWeekCount: false,
    height: 'auto',
    headerToolbar: { left: 'title', center: '', right: 'prev next' },
    dayHeaderContent: (args) => args.text.slice(0, 2),
    displayEventTime: false,

    // ⭐ 改成用函式載入事件（不要在 onMounted 塞靜態陣列了）
    events: fetchEvents,

    eventClick({ event, jsEvent }) {
        jsEvent.preventDefault()

        const targetUrl = `${API_BASE}/activity/${event.id}`
        console.log('跳轉網址：', targetUrl)

        // 方式一：SPA 路由跳轉（如果 /activity/:id 在 Vue Router 有定義）
        router.push(`/activity/${event.id}`)
    },

    eventClassNames(arg) {
        return [`status-${arg.event.extendedProps.status}`]
    },
})
</script>

<template>
    <div class="calendar-wrapper">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>

<style scoped lang="scss">
@use "@/style.scss" as *;

/* ===== 版頭與整體 ===== */
.calendar-wrapper { width: 100%; overflow: hidden; height: auto; }
:deep(.fc .fc-toolbar.fc-header-toolbar){ margin-bottom: 12px; }
:deep(.fc-toolbar-title){ font-family: 'Baloo 2'; font-weight: 700; font-size: $font-size-h3; }
:deep(.fc .fc-button){ background: none; border: none; box-shadow: none; color: $gray-disabled; }

/* 今日底色（依你的主色） */
:deep(.fc-daygrid-day.fc-day-today){ background-color: $lighter-yellow; }

/* ===== 日格與事件容器 ===== */
:deep(.fc-daygrid-day-frame){
  display: flex; width: 100%; flex-direction: column; align-items: center; padding: 4px 6px;
}
:deep(.fc-daygrid-day-events){
  width: 100%; margin-top: 4px;
  display: flex; flex-direction: column; align-items: stretch !important; gap: 4px;
}

/* ===== 事件外觀（只顯示標題、不要小圓點） ===== */
/* 關掉 FullCalendar 預設的小圓點 */
:deep(.fc-daygrid-event-dot){ display: none !important; }
/* 保險：即使有時間區塊也隱藏（displayEventTime 已關，但再保護一次） */
:deep(.fc-event-time){ display: none !important; }


:deep(.fc-daygrid-event){
    display: inline-block;     
    max-width: 100%;           
    margin: 0 auto; 
    padding: 4px 8px;
    border-radius: 6px;
    background: $color-primary;
    color: #fff;
    font-weight: 700;
    text-align: center;
    line-height: 1.2;
    cursor: pointer;

    text-decoration: none;
    border: none;
    box-shadow: none;
}

:deep(.fc-daygrid-event.status-開團中){ background-color: $color-primary; }
:deep(.fc-daygrid-event.status-已成團){ background-color: $blue; }
:deep(.fc-daygrid-event.status-已完成){ background-color: $gray-disabled; }

/* Hover 效果（更有互動感） */
:deep(.fc-daygrid-event:hover){ filter: brightness(1.05); transform: translateY(-1px); transition: .15s ease; }

/* ===== RWD：桌機左對齊、字體微放大 ===== */
@media (min-width: 768px){
    .calendar-wrapper { max-height: none; }
    :deep(.fc .fc-toolbar.fc-header-toolbar){ margin-bottom: 18px; }
    :deep(.fc-toolbar-title){ font-size: $font-size-h2; }
    :deep(.fc-daygrid-day-number){ font-size: $font-size-h4; }
    :deep(.fc-daygrid-day-frame){ align-items: flex-start; } /* 桌機左對齊 */
    :deep(.fc-daygrid-event){ 
        padding: 5px 10px;
    }
}
</style>

