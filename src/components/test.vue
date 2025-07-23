<script setup>
import Button from "@/components/Button.vue";
import DeleteIcon from "@/assets/img/icon/delete.svg";
import EditIcon from "@/assets/img/icon/edit.svg";
import NotifyIcon from "@/assets/img/icon/notification.svg";
import SortIcon from "@/assets/img/icon/sort.svg";
import FilterIcon from "@/assets/img/icon/filter.svg";
import SmEditIcon from "@/assets/img/icon/sm-edit.svg";

const aloha = () => {
  alert("阿囉哈");
};
</script>

<template>
  <Button isOutline :suffixIcon="DeleteIcon" theme="secondary" size="sm"
    >刪除</Button
  >
  <Button isOutline theme="secondary" size="md">取消 </Button>
  <Button :onClick="aloha" theme="primary" size="md">確認</Button>
  <Button theme="primary" size="md">送出</Button>
  <Button theme="primary" size="md">我要發文</Button>
  <Button theme="primary" size="md">我要跟團!</Button>

  <Button :prefixIcon="EditIcon" theme="info" size="md">編輯檔案</Button>
  <Button :prefixIcon="NotifyIcon" theme="primary" size="md">通知訊息</Button>
  <Button :suffixIcon="SmEditIcon" theme="info" size="sm">編輯</Button>

  <Button :suffixIcon="SortIcon" theme="info" size="sm">排序</Button>
  <Button :suffixIcon="FilterIcon" theme="info" size="sm">篩選</Button>
  <Button theme="info" size="md">註冊</Button>

  <Button isDisabled theme="primary" size="md">Disabled</Button>
</template>

<style lang="scss" scoped>
.test {
  width: 100%;
  display: grid;
  gap: 8px;
  padding: 10px;
  justify-items: center;
  grid-template-columns: repeat(4, 1fr);
  @include mobile() {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  @include tablet() {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @include desktop() {
    .test {
      max-width: 1200px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);

      justify-self: center;
    }
  }
}
</style>
