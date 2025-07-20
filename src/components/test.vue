<script setup>
import Button from "@/components/Button.vue";
import FilterIcon from "@/assets/img/icon/filter.svg";
import EditIcon from "@/assets/img/icon/edit.svg";
import NotifyIcon from "@/assets/img/icon/notification.svg";
import SortIcon from "@/assets/img/icon/sort.svg";
const aloha = () => {
  alert("阿囉哈");
};
</script>

<template>
  <div class="test">
    <Button :onClick="aloha" theme="primary" size="md">送出</Button>
    <br />
    <Button theme="primary" size="md">評價</Button>
    <Button theme="secondary" size="md" disabled="disabled">取消</Button>
    <br />
    <Button isFull theme="primary" size="md">GO</Button>
    <br />
    <Button :suffixIcon="FilterIcon" theme="secondary" size="sm">篩選</Button>
    <Button :suffixIcon="SortIcon" theme="secondary" size="sm">排序</Button>
    <br />
    <Button :prefixIcon="NotifyIcon" theme="primary" size="lg">通知訊息</Button>
    <Button :prefixIcon="EditIcon" theme="info" size="lg">編輯檔案</Button>
  </div>
</template>

<style lang="scss" scoped>
.test {
  width: 100%;
}
</style>
