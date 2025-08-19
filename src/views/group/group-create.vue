<script setup>
import { ref, reactive, watch, nextTick, computed, onMounted } from "vue"
import { ActivityCategories } from "@/assets/data/fake-activity-category"
import { taiwanDistricts } from "@/assets/data/taiwan-city-district"
import Popup from "@/components/group/group-create-popup.vue"
import Button from "@/components/Button.vue"
import { useGroupFormStore } from "@/stores/group-form"
import GroupCreatePreview from "@/components/group/group-create-preview.vue"
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

const props = defineProps({
  mode: { type: String, required: true },         
  activity_no: { type: String, default: undefined }
  },
);
const route = useRoute()
const router = useRouter()
const store = useGroupFormStore();
const isCreate  = computed(() => props.mode === 'create')
const isPreview = computed(() => props.mode === 'preview')
const isEdit    = computed(() => props.mode === 'edit')

if (isCreate.value) {
  store.resetForm()        // 進 create：清空
} else {
  store.loadDraft()        // 其他模式：載草稿
}
watch(() => props.mode, (m) => {
  if (m === 'create') store.resetForm()
})


const ruleFormRef = ref();

const ruleForm = store.formData;

let last = 0
const save = () => {
  const now = Date.now()
  if (now - last > 500) {
    last = now
    store.saveDraft()
  }
}

const onPopupClosed = () => {
sessionStorage.setItem(hasSeen, '1')
  hasSeenGuidelines.value = true
}
const rules = reactive({
  dateRange: [
    { required: true, message: "請選擇活動開始與結束時間", trigger: "change" },
  ],
  activity_name: [
    { required: true, message: "請輸入活動名稱", trigger: "blur" },
    { min: 3, max: 20, message: "活動名稱字數限制3-20字", trigger: "blur" },
  ],
  category_no: [
    {
      required: true,
      message: "請選擇活動類別",
      trigger: "change",
    },
  ],
  location: [
    {
      required: true,
      message: "請選擇城市",
      trigger: "change",
    },
  ],
  address: [
    {
      required: true,
      message: "請輸入活動詳細地址",
      trigger: "change",
    },
  ],
  registration_deadline: [
    {
      type: "date",
      required: true,
      message: "請選擇揪團截止日",
      trigger: "change",
    },
  ],

  activity_start_date: [
    {
      type: "date",
      required: true,
      message: "請選擇活動開始日期時間",
      trigger: "change",
    },
  ],
  activity_end_date: [
    {
      type: "date",
      required: true,
      message: "請選擇活動結束日期時間",
      trigger: "change",
    },
  ],
  fee_notes: [
    {
      required: true,
      message: "請輸入預估費用",
      trigger: "change",
    },
  ],
  min_participant: [
    {
      type: "number",
      required: true,
      message: "請輸入最少人數",
      trigger: "change",
    },
  ],
  max_participant: [
    {
      type: "number",
      required: true,
      message: "請輸入最多人數",
      trigger: "change",
    },
  ],
  activity_description: [
    {
      required: true,
      message: "請輸入活動介紹",
      trigger: "change",
    },
    { min: 10, max: 500, message: "活動名稱字數限制10-500字", trigger: "blur" },
  ],
  participant_limitation: [
    {
      validator: (rule, value, callback) => {
        if (ruleForm.hasLimitation && !value.trim()) {
          callback(new Error("請輸入限制內容"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  activity_img: [
    {
      required: true,
      message: "請上傳活動圖片",
      trigger: "change",
    },
  ],
});



const activityCategories = ActivityCategories.filter(
  (item) => item.category_no !== "0"
);
const at00 = (d) => {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
const addDays = (d, n) => {
  const x = new Date(d); x.setDate(x.getDate() + n); 
  return at00(x)
}
const today = at00(new Date())
const minStart = addDays(today, 3)
const disableActivityDate = (date) => {return at00(date) < minStart}

const disableDeadline = (date) => {
  const start = ruleForm.dateRange?.[0]
  if (!start) return true             
  const latest = addDays(at00(new Date(start)), -1)
  return at00(date) > latest         
}

watch(() => ruleForm.dateRange?.[0], (start) => {
  if (!start) {ruleForm.registration_deadline = null; return }
  if (!ruleForm.registration_deadline) return
  const latest = addDays(at00(new Date(start)), -1)
  if (at00(form.registration_deadline) > latest) {
    ruleForm.registration_deadline = latest        
  }
})



const cityList = taiwanDistricts.map((city) => {
  return {
    name: city.city,
    value: city.city,
  };
});

watch(() => store.formData, save, { deep: true })
watch(() => store.image.previewUrl, save)

const defaultTime2 = [
  new Date(2000, 1, 1, 8, 0, 0),
  new Date(2000, 2, 1, 12, 0, 0),
]; // '12:00:00', '08:00:00'

const handleChange = () => {
  if (
    ruleForm.min_participant != null &&
    ruleForm.max_participant != null &&
    ruleForm.min_participant > ruleForm.max_participant
  ) {
    ruleForm.max_participant = ruleForm.min_participant
  }
}
const labelPosition = ref("top");

const fileInput = ref(null); // 取得 input DOM


// 按下自訂按鈕 → 觸發隱藏 input
const triggerFileInput = () => {
  fileInput.value.click();
};

// 選擇檔案後處理
const handleFileChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  await store.setImage(file) // 會自動產生 base64 預覽
  ruleForm.activity_img = store.image.previewUrl || 'has-image'
  store.saveDraft()
  e.target.value = ''
}

const goPreview = async () => {
   if (!ruleFormRef.value) return
   try {
     await ruleFormRef.value.validate()
      store.setFormData(ruleForm)
      router.push({ name: 'group-create', params: { mode: 'preview' } })
   } catch (err) {
     // 聚焦第一個錯誤欄位（避免只有一個「Object」錯）
     const fields = err || {}
     const firstProp = Object.keys(fields)[0]
     ruleFormRef.value?.scrollToField?.(firstProp)
     nextTick(() => {
       const el = ruleFormRef.value?.$el?.querySelector(
         '.el-form-item.is-error input, .el-form-item.is-error textarea, .el-select .el-input__wrapper input'
       )
       el?.focus()
     })
   }
  
 }

const dataURLtoBlob = (dataURL) => {
  const [header, data] = dataURL.split(',')
  const mime = header.match(/:(.*?);/)[1]
  const binary = atob(data)
  const u8 = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) u8[i] = binary.charCodeAt(i)
  return new Blob([u8], { type: mime })
}
const previewUrl = computed(() => store.image.previewUrl)
const confirmSubmit = async () => {
  const fd = new FormData()
  // 轉換欄位（Date -> ISO、一般字串直接放）
  Object.entries(store.formData).forEach(([k, v]) => {
    if (v instanceof Date) fd.append(k, v.toISOString())
    else fd.append(k, v ?? '')
  })
  // 圖片：用 base64 還原成 Blob 再上傳（若你後端必須要檔案）
  if (store.image.previewUrl) {
    const blob = dataURLtoBlob(store.image.previewUrl)
    fd.append('activity_img', blob, store.image.filename || 'upload.png')
  }

  // TODO: 送出
  // await axios.post('/api/activities', fd)

  // 成功後可清空草稿
  // store.resetForm()
  // router.push(...)
}

const hasSeen = 'group_guidelines_seen_v1' // 之後內容改版可改 v2
const hasSeenGuidelines = ref(sessionStorage.getItem(hasSeen) === '1')
onBeforeRouteLeave((to) => {
  store.resetForm()
})


 onMounted(() => {
  if (route.params.mode === 'create') {
    store.resetForm()
  }
})
// 顯示彈出視窗
watch(
  () => route.params.mode,
  (newMode) => {
    if (newMode === 'create') {
      store.resetForm()
    }
  }
)
// 監聽 participant_limitation 狀態變化，若有輸入則勾選 hasLimitation
watch(() => ruleForm.participant_limitation, (val) => {
  ruleForm.hasLimitation = !!val.trim();
});

// 監聽 hasLimitation 狀態變化，若取消勾選則清空 participant_limitation
watch(() => ruleForm.hasLimitation, (checked) => {
  if (!checked) ruleForm.participant_limitation = "";
});

watch(() => ruleForm.dateRange, (range) => {
  if (!range || range.length < 2) {
    ruleForm.activity_start_date = null
    ruleForm.activity_end_date = null
    return
  }
  // Element Plus datePicker 拿到的是 Date 物件，要轉成後端要的字串
  const format = (d) =>
    d ? new Date(d).toISOString().slice(0, 19).replace('T', ' ') : ''

  ruleForm.activity_start_date = format(range[0])
  ruleForm.activity_end_date   = format(range[1])
}, { immediate: true })
</script>

<template>
  <Popup
  v-if="!isEdit && !isPreview && !hasSeenGuidelines"
  @closed="onPopupClosed"> </Popup>
  
  
    <div class="group-create-bakground" >
      <h3>發起揪團</h3>
    </div>
    <div class="group-create-wrap"  v-show="!isPreview">
    <el-form
      :model="ruleForm"
      label-width="auto"
      ref="ruleFormRef"
      :rules="rules"
      :label-position="labelPosition"
      class="form-wrapper"
      @submit.prevent
    >
      <el-form-item label="活動名稱" prop="activity_name">
        <el-input v-model="ruleForm.activity_name" />
      </el-form-item>
      <el-form-item label="活動時間日期" prop="dateRange">
        <div class="activity-time">
          <el-date-picker
            v-model="ruleForm.dateRange"
            type="datetimerange"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            :default-time="defaultTime2"
            :popper-class="'one-panel'"
            :disabled-date="disableActivityDate"
          />
        </div>
      </el-form-item>
      <el-form-item label="活動類別" prop="category_no">
        <el-select v-model="ruleForm.category_no" placeholder="請選擇活動類別">
          <el-option
            v-for="cat in activityCategories"
            :value="cat.category_no"
            :key="cat.category_no"
            :label="cat.category_name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="成團人數" prop="min_participant">
        <div
          class="participants"
          :style="'display: flex; gap: 10px; padding: 0 10px; align-items: center;'"
        >
          <div class="min-participant">
            <span>最少人數</span>
            <el-input-number
              v-model="ruleForm.min_participant"
              :min="1"
              :max="99"
              size="small"
              controls-position="right"
              @change="handleChange"
              :style="'padding:0 25px 0 5px; max-width:55px;'"
            />
            <span>人</span>
          </div>
          <div class="max-participant">
            <span>最多人數</span>
            <el-input-number
              v-model="ruleForm.max_participant"
              :min="1"
              :max="99"
              size="small"
              controls-position="right"
              @change="handleChange"
              :style="'padding:0 25px 0 5px; max-width:55px;'"
            />
            <span>人</span>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="活動地點" prop="location">
        <div class="location-wrapper">
          <el-select
            v-model="ruleForm.location"
            placeholder="城市"
            class="city-select"
          >
            <el-option
              v-for="city in cityList"
              :key="city.name"
              :label="city.name"
              :value="city.name"
            ></el-option>
          </el-select>

          <el-input
            v-model="ruleForm.address"
            placeholder="請輸入詳細地址"
          ></el-input>
        </div>
      </el-form-item>

      <el-form-item label="預估費用" prop="fee_notes">
        <el-input v-model="ruleForm.fee_notes" placeholder="請輸入預估費用">
        </el-input>
      </el-form-item>

      <el-form-item label="活動簡介" prop="activity_description">
        <el-input
          v-model="ruleForm.activity_description"
          type="textarea"
          placeholder="說明一下活動內容，讓更多人有興趣參與"
        />
      </el-form-item>
      <el-form-item label="揪團截止日" prop="registration_deadline">
        <div class="registration-deadline">
        <el-date-picker
          v-model="ruleForm.registration_deadline"
          type="date"
          placeholder="請選擇揪團截止日"
          :editable="false"
          :clearable="false"
          :disabled="!ruleForm.dateRange?.[0]"
           :disabled-date="disableDeadline"
        >
        </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item prop="participant_limitation">
        <el-checkbox v-model="ruleForm.hasLimitation"> 揪團限制 </el-checkbox>
        <el-input v-model="ruleForm.participant_limitation"></el-input>
      </el-form-item>
      <div class="select-img">
        <el-form-item
          label="圖片上傳"
          :label-position="'right'"
          prop="activity_img"
        >
          <Button type="button" theme="info" size="sm" @click="triggerFileInput"
            >檔案</Button
          >
        </el-form-item>
      </div>
      <input
        class="hidden-input"
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
      />

      <div v-if="store.image.previewUrl" class="img-preview">
        <p>預覽圖片：</p>
        <img :src="store.image.previewUrl" alt="預覽" />
      </div>
      <el-form-item>
        <div class="submit-button">
          <Button type="button" theme="primary" size="md" @click="goPreview">送出</Button>
        </div>
      </el-form-item>
    </el-form>
  </div>
  <div v-show="isPreview">
 <GroupCreatePreview
    :form="store.formData"
    :image="store.image"
    @back="router.push({ name: 'group-create', params: { mode: 'edit' } })"
    @confirm="confirmSubmit"
  /> 
  </div>
</template>

<style lang="scss" scoped>
.group-create-wrap {
  background-image: url(../../assets/img/group/group-explore/form-decoration.svg);
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: contain;

  
}
.group-create-bakground {
  background-image: url(../../assets/img/group/group-create/group-create-banner-background.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top;
  min-height: 150px;
  @include tablet() {
    //768-1023
    min-width: 768px;
    min-height: 300px;
    background-size: 100%;
  }

  @include desktop() {
    //1024以上
    min-height: 400px;
    background-size: 100%;

    @include flex-center;

    width: 100%;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    min-width: 1024px;
    min-height: 300px;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: top;
  }
}
h3 {
  display: none;
}
.form-wrapper {
  margin: 20px auto;
  max-width: 300px;
  @include tablet() {
    //768-1023
    max-width: 500px;
  }

  @include desktop() {
    //1024以上
    max-width: 800px;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    max-width: 800px;
  }
}
.activity-time {

  :deep(.el-date-editor.el-range-editor) {
    max-width: 300px;
  }

  // 768–1023
  @include tablet() {
    :deep(.el-date-editor.el-range-editor) {
      min-width: 500px;
    }
  }

  // 1024+
  @include desktop() {
    :deep(.el-date-editor.el-range-editor) {

      min-width: 800px;

      flex-shrink: 0;
    }
  }
}

.min-participant {
  display: flex;
  align-items: center;
  gap: 5px;
  span {
    margin-top: 1px;
  }
}
.max-participant {
  display: flex;
  align-items: center;
  gap: 5px;
  span {
    margin-top: 1px;
  }
}
:deep(
    .el-input-number--small.is-controls-right
      .el-input--small
      .el-input__wrapper
  ) {
  padding: 0px 5px 0px 5px;
  max-width: 45px;
}
:deep(.el-picker-panel__content:last-child) {
  display: none;
}
/* 補滿可視寬度 */
.el-picker-panel {
  width: 100%;
  max-width: 100%;
}

:deep(.el-input-number.is-center .el-input__inner) {
  text-align: left;
}

.location-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;

  .city-select {
    width: 40%;
    margin-right: 10px;
    font-size: 14px;

    :deep(> div:first-child) {
      padding: 4px 10px;
    }
  }
}

.registration-deadline {
  :deep(.el-date-editor.el-date-editor--date) {
    min-width: 300px;}
    @include tablet() {
      //768-1023
       :deep(.el-date-editor.el-date-editor--date){min-width: 500px;
    }}

    @include desktop() {
      //1024以上
       :deep(.el-date-editor.el-date-editor--date){min-width: 800px;
    }}

    @media screen and (min-width: 1023px) and (max-width: 1199px) {
      //1023-1199
       :deep(.el-date-editor.el-date-editor--date){min-width: 800px;
    }}
}

.submit-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}
:deep(.el-form-item__content):has(.submit-button) {
  display: flex;
  justify-content: center;
  align-items: center;
}
.hidden-input {
  display: none;
}
.img-preview {
  max-width: 350px;
  p {
    padding: 10px 0;
  }
  img {
    width: 100%;
  }
}
</style>
