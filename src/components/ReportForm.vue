<script setup>
import { ref, onMounted } from 'vue'
import Button from "@/components/Button.vue";
import axios from 'axios';

const props = defineProps({
  onSubmit: Function  // 由外層傳入：提交時要做什麼（呼叫哪支 API）
})

const reason  = ref('')     // 用空字串好配合 <option value="">
const detail  = ref('')
const reasons = ref([])

onMounted(async () => {
try {
    const res = await axios.get(
    `${import.meta.env.VITE_API_BASE}/reports/report-reasons.php`,
    { withCredentials: true } // 若後端需 session
    )
    console.log('report reasons:', res.data)

    // 只取需要欄位，REASON_NO 穩定轉數字；兼容 REASON / REASON_NAME 命名
    reasons.value = (Array.isArray(res.data) ? res.data : [])
    .map(r => ({
        REASON_NO: Number(r.REASON_NO),
        REASON_NAME: r.REASON_NAME ?? r.REASON
    }))
    .filter(r => Number.isInteger(r.REASON_NO))
} catch (err) {
    console.error("檢舉原因清單載入失敗", err)
}
})

function submitForm() {
const reasonNo = Number(reason.value)
if (!Number.isInteger(reasonNo) || reasonNo <= 0) {
    alert('請選擇檢舉原因')
    return
}
props.onSubmit?.({
    reason: reasonNo,                           // 一律送整數
    detail: (detail.value || '').trim()
})
}

function cancelForm() {
import('sweetalert2').then(({ default: Swal }) => Swal.close())
}
</script>

<template>
<div class="report-wrapper">
    <div class="report-reason">
    <label>檢舉原因：</label>

    <!-- 用 .number 強制 v-model 為數字 -->
    <select v-model.number="reason" class="reason-select">
        <option value="">請選擇</option>
        <option
        v-for="r in reasons"
        :key="r.REASON_NO"
        :value="r.REASON_NO"
        >
        {{ r.REASON_NAME }}
        </option>
    </select>

    <textarea
        class="report-detail"
        v-model="detail"
        placeholder="請簡短說明"
    ></textarea>

    <div class="reportForm-btns">
        <Button size="sm" theme="secondary" :is-outline="true" @click="cancelForm">取消</Button>
        <Button size="sm" theme="primary" @click="submitForm">送出</Button>
    </div>
    </div>
</div>
</template>

<style scoped>
.report-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 250px;
}
.reportForm-btns{
    display: flex;
    gap: 20px;
    margin-top: 30px;
    margin-bottom: 30px;
    justify-content: center;
}
.report-reason{
    width: 80%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    line-height: 2;
    border-radius: 3px;
    gap: 10px;
    text-align: left;
}
.reason-select{
    border: 1px solid black;
    width: 100%;
    border-radius: 3px;
}
.report-detail{
    border: 1px solid black;
    width: 100%;
    height: 100px;
    border-radius: 3px;
}
</style>
