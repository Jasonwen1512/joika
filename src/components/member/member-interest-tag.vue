<script setup>
import { computed } from "vue";
import { memberInterest } from "@/assets/data/fake-member-interests";
import { ActivityCategories } from "@/assets/data/fake-activity-category.js";
const props = defineProps({
  memberId: {
    type: String,
    required: true,
  },
});

// 到時候從資料庫抓會員ID,會員興趣, 興趣分類顏色
// 在要用的地方import 這個元件 抓memberId就會帶入會員的興趣 <MemberInterest :memberId="currentMemberId"></MemberInterest>
const memberTags = computed(() => {
  const member = memberInterest.find((m) => m.memberId === props.memberId);
  if (!member) return [];

  return member.interests.map((interestId) => {
    const category = ActivityCategories.find((cat) => cat.id === interestId);
    return {
      id: interestId,
      name: category?.name || "",
      color: category?.color || "#FFF",
    };
  });
});
</script>
<template>
  <div class="member-tags">
    <div v-if="memberTags.length" class="tags">
      <span
        v-for="tag in memberTags"
        :key="tag.id"
        class="tag"
        :style="{ backgroundColor: tag.color }"
      >
        {{ tag.name }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  display: flex;
  gap: 10px;
  padding: 5px 5px;
}
.tag {
  padding: 13px 20px;

  color: $black;
  font-size: 16px;
  min-width: 82px;
  text-align: center;
  border: 1px solid $black;
}
</style>
