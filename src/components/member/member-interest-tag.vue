<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  memberId: {
    type: [String, Number],
    required: true,
  },
});

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "";

const memberTags = ref([]);   // [{ id, name, color }]
const loading    = ref(false);
const errorMsg   = ref("");

async function fetchMemberTags() {
  if (!props.memberId) return;
  loading.value = true;
  errorMsg.value = "";
  try {
    const u = new URL(`${API_BASE}/users/interests-list.php`);
    // 建議明確帶 member_id，避免只靠 session
    u.searchParams.set("member_id", String(props.memberId));

    const res  = await fetch(u.toString(), { credentials: "include" });
    const json = await res.json();

    if (json.code !== "0000") throw new Error(json.msg || "取得興趣失敗");

    // 後端已經只回 id/name/color，直接用
    memberTags.value = json.data || [];
  } catch (err) {
    errorMsg.value = err.message || String(err);
    memberTags.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchMemberTags);
watch(() => props.memberId, fetchMemberTags);
</script>

<template>
  <div class="member-tags">
    <div v-if="loading">載入中…</div>
    <div v-else-if="errorMsg">{{ errorMsg }}</div>

    <div v-else-if="memberTags.length" class="tags">
      <span
        v-for="tag in memberTags"
        :key="tag.id"
        class="tag"
        :style="{ backgroundColor: tag.color }"
      >
        {{ tag.name }}
      </span>
    </div>

    <div v-else>尚未設定興趣</div>
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
