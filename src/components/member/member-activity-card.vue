<script setup>
import ActivityTag from "@/components/member/activity-status-tag.vue";
import Button from "@/components/Button.vue";
import {computed } from "vue";

const props = defineProps({
    item: Object,
    status: String,
});

const titleDate = computed(() => {
    if (!props.item) return "";
    const no = props.item.activity_start_txt ?? "";
    const name = props.item.activity_name ?? "";
  return `${no} ${name}`; // 可讀性更好
});

</script>

<template>
    <div
        v-if="item"
        class="member-activity-card"
    >
        <RouterLink :to="`/activity/${item.activity_no}`">
        <div class="img">   
            <img
                :src="item.activity_img"
                :alt="item.activity_name"
            />
            <ActivityTag :activity_status="item.activity_status" />
        </div>
        </RouterLink>
        <RouterLink :to="`/activity/${item.activity_no}`">
        <h3 class="activity-name">{{ titleDate }}</h3>
        </RouterLink>
        <RouterLink :to="`/activity/${item.activity_no}`" class="desc-link">
        <p class="activity-description">{{ item.activity_description }}</p>
        </RouterLink>

        <div class="button-group">
            <template v-if="item.activity_status === '已取消'">
                <Button theme="disabled" size="sm" disabled>團員列表</Button>
            </template>
            <template v-else>
                <RouterLink :to="'/member/member-list'">
                <Button theme="info" size="sm">團員列表</Button>
                </RouterLink>
            </template>
        </div>

    </div>
</template>

<style lang="scss" scoped>

a {
  color: inherit;         // 繼承父層顏色
  text-decoration: none;  // 移除底線
}

.member-activity-card {
    width: 284px;
    height: 390px;
    justify-self: center;
    margin: 20px;
    display: flex;         
  flex-direction: column;
}
.img {
    height: 200px;
    position: relative;
}
.img img {
    width: 100%;
    height: 100%;
}

.activity-name {
    max-width: 264px;
    font-size: $font-size-h4;
    padding: 14px 0 0px;
    line-height: 1.7;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: unset;
    letter-spacing: 0.5px;
}

.activity-description {
    color: $black;
    font-size: $font-size-p;
    padding: 10px 0 0;
    line-height: 1.7;
    max-width: 264px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    flex-grow: 1;
}

.button-group {
    display: flex;
    justify-content: right;

    padding-top: 10px;
    max-width: 264px;
}

button[disabled],
button.disabled {
  background-color: #ccc;  // 灰色
  color: #666;             // 字也變淡
  cursor: not-allowed;     // 滑鼠移過去顯示禁止符號
  pointer-events: none;    // 確保不能被點擊
}
.desc-link {
  display: block;
    flex: 1;  
}
</style>
