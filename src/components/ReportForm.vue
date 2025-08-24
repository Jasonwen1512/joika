<script setup>
import { ref, onMounted } from 'vue'
import Button from "@/components/Button.vue";
import axios from 'axios';

const props = defineProps({
    onSubmit: Function
})

    const reason = ref(null)
    const detail = ref('')
    const reasons = ref([])

    onMounted(async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/reports/report-reasons.php`)
        console.log(res.data)
        reasons.value = res.data
    } catch (err) {
        console.error("檢舉原因清單載入失敗", err)
    }
})

    function submitForm() {
    if (!reason.value) {
        alert('請選擇檢舉原因')
        return
    }
    props.onSubmit({ 
        reason: Number(reason.value), 
        detail: (detail.value || '').trim() })
    }
    // 取消
    function cancelForm() {
    // 直接關閉 SweetAlert
    import('sweetalert2').then(({ default: Swal }) => Swal.close())
    }

    </script>

    <template>
    <div class="report-wrapper">
        <div class="report-reason">
            <label>檢舉原因：</label>
            <select v-model="reason" class="reason-select">
                <option value="">請選擇</option>
                <option 
                    v-for="r in reasons" 
                    :key="r.REASON_NO" 
                    :value="Number(r.REASON_NO)"
                >
                    {{ r.REASON }}
                </option>
            </select>

            <textarea class="report-detail" v-model="detail" placeholder="請簡短說明"></textarea>
            <div class="reportForm-btns">
                <Button size="sm" theme="secondary" :is-outline="true" @click=" cancelForm">取消</Button>
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
