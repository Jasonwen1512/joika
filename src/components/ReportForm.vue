<script setup>
import { ref } from 'vue'
import Button from "@/components/Button.vue";

const props = defineProps({
    onSubmit: Function
    })

    const reason = ref('')
    const detail = ref('')

    function submitForm() {
    if (!reason.value) {
        alert('請選擇檢舉原因')
        return
    }
    props.onSubmit({ 
        reason: reason.value, 
        detail: detail.value })
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
                <option value="spam">垃圾訊息</option>
                <option value="abuse">辱罵/騷擾</option>
                <option value="ads">廣告/推銷內容</option>
                <option value="fakeNews">散佈不實消息</option>
                <option value="LeakpersonalInfo">洩漏他人個資</option>
                <option value="other">其他</option>
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
