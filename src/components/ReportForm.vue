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
    props.onSubmit({ reason: reason.value, detail: detail.value })
    }
    // 取消
    function cancelForm() {
    // 直接關閉 SweetAlert
    import('sweetalert2').then(({ default: Swal }) => Swal.close())
    }

    async function handleReportSubmit({ reason, detail }) {
  // 對應 reason 字串轉成 reason_no
    const reasonMap = {
        spam: 1,
        abuse: 2,
        ads: 3,
        fakeNews: 4,
        LeakpersonalInfo: 5,
        other: 6,
    };

    const report_reason_no = reasonMap[reason] ?? 6;

    // 測試用固定資料，之後從登入資料或 route 取得
    const reporter_id = 1;  // TODO: 從登入資訊取得
    const post_no = 123;    // TODO: 傳入或從 route 取得

    try {
        const res = await fetch('http://localhost/joika-api-server/reports/post-report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            reporter_id,
            post_no,
            report_reason_no,
            report_description: detail,
        }),
        });

        const result = await res.json();

        if (result.success) {
        alert('檢舉成功！');
        } else {
        alert(result.error || '檢舉失敗');
        }
    } catch (error) {
        console.error('發生錯誤：', error);
        alert('送出失敗，請稍後再試');
    }
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
