<script setup>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

    const calendarOptions = ref({
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        firstDay: 1,
        showNonCurrentDates: false,
        headerToolbar: {
            left: 'title',
            center: '',
            right: 'prev next'
        },
        height: 'auto',
        dayHeaderContent: (args) => args.text.slice(0, 2),
        fixedWeekCount: false,
        events: [],
        dateClick(info) {
            console.log('你點了', info.dateStr)
        },

    })

    onMounted(() => {
        // 4. onMounted 中只負責載入事件資料
        calendarOptions.value.events = [
            { title: '登山', start: '2025-07-30', classNames: ['event-green'] },
            { title: '淺水', start: '2025-08-15', classNames: ['event-blue'] }
        ]
    })
</script>


<template>
    <div class="calendar-wrapper">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>

<style scoped lang="scss">
@use "@/style.scss" as *;

    .calendar-wrapper {
        width: 100%;
        overflow: hidden;
        height: auto;
    }

    :deep(.fc .fc-toolbar.fc-header-toolbar) {
        margin-bottom: 10px;
    }

    :deep(.fc-toolbar-title) {
        font-family: 'Baloo 2';
        font-weight: 700;
        font-size: $font-size-h3;
    }

    :deep(.fc .fc-button) {
        background: none;
        border: none;
        box-shadow: none;
        color: $gray-disabled;
    }

    :deep(.fc-daygrid-day.fc-day-today) {
        background-color: $color-primary;
    }

    :deep(.fc-daygrid-day-frame) {
        display: flex;
        flex-direction: column;
        align-items: center; // 手機上置中
        padding: 4px 6px;
    }

    :deep(.fc-daygrid-day-events) {
        width: 100%;
        margin-top: 4px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 4px;
    }

    /* 這些全域樣式會為事件區塊上色 */
    :deep(.event-blue) {
        background-color: #93c5fd;
        border-radius: 6px;
    }
    :deep(.event-green) {
        width: 100%;
        background-color: #90DA81;
        border-radius: 6px;
    }

    @media (min-width: 768px) {
        .calendar-wrapper {
            max-height: none;
        }
        
        :deep(.fc .fc-toolbar.fc-header-toolbar) {
            margin-bottom: 20px;
        }

        :deep(.fc-toolbar-title) {
            font-size: $font-size-h2;
        }

        :deep(.fc-daygrid-day-number) {
            font-size: $font-size-h4;
        }

        :deep(.fc-daygrid-day-frame) {
            align-items: flex-start; // 電腦版左對齊
        }
    }
</style>