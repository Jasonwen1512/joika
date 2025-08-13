<script setup>
import { ref, reactive, watch, nextTick} from 'vue'
import { ActivityCategories } from '@/assets/data/fake-activity-category'
import { taiwanDistricts } from "@/assets/data/taiwan-city-district";
import Popup from "@/components/group/group-create-popup.vue";
import Button from '@/components/Button.vue';
import { useGroupFormStore } from '@/stores/group-form'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useGroupFormStore()
const ruleFormRef = ref()
const ruleForm = reactive({
  activity_name: '',
  category_no: '',
  location: '',
  registration_deadline: '',
  activity_start_date: null,
  activity_end_date: null,
  max_participant: null,
  min_participant: 1,
  fee_notes: '',
  activity_description: '',
  address: '',
  dateRange: [],
  participant_limitation:'',
  activity_img  : '',
  
})

const rules = reactive({
    dateRange: [
    { required: true, message: '請選擇活動開始與結束時間', trigger: 'change' }
  ],
  activity_name: [
    { required: true, message: '請輸入活動名稱', trigger: 'blur' },
    { min: 3, max: 20, message: '活動名稱字數限制3-20字', trigger: 'blur' },
  ],
  category_no: [
    {
      required: true,
      message: '請選擇活動類別',
      trigger: 'change',
    },
  ],
  location: [
    {
      required: true,
      message: '請選擇城市',
      trigger: 'change',
    },
  ],
   address: [
    {
      required: true,
      message: '請輸入活動詳細地址',
      trigger: 'change',
    },
  ],
  registration_deadline: [
    {
      type: 'date',
      required: true,
      message: '請選擇揪團截止日',
      trigger: 'change',
    },
  ],
  
  activity_start_date: [
    {
      type: 'date',
      required: true,
      message: '請選擇活動開始日期時間',
      trigger: 'change',
    },
  ],
   activity_end_date: [
    {
      type: 'date',
      required: true,
      message: '請選擇活動結束日期時間',
      trigger: 'change',
    },
  ],
  fee_notes: [
    {
      required: true,
      message: '請輸入預估費用',
      trigger: 'change',
    },
  ],
  min_participant: [
    {
      type: 'number',
      required: true,
      message: '請輸入最少人數',
      trigger: 'change',
    },
  ],
  max_participant: [
    {
      type: 'number',
      required: true,
      message: '請輸入最多人數',
      trigger: 'change',
    },
  ],
  activity_description: [
    {
      required: true,
      message: '請輸入活動介紹',
      trigger: 'change',
      
    },
     { min: 10, max: 500, message: '活動名稱字數限制10-500字', trigger: 'blur' },
  ],
 participant_limitation: [
    {
      required: true,
      message: '請輸入參團者限制',
      trigger: 'blur',
      
    }],
     activity_img: [{
      required: true,
      message: '請上傳活動圖片',
      trigger: 'change',}]
})


const submitForm = async () => {
  if (!ruleFormRef.value) return
  try {
    await ruleFormRef.value.validate()

    // 存到 Pinia
    store.setFormData({ ...ruleForm })

    // 跳轉到預覽頁面
    router.push("/group/form-preview")

  } catch (fields) {
    const firstProp = Object.keys(fields)[0]
    ruleFormRef.value.scrollToField(firstProp)
    nextTick(() => {
      const el = ruleFormRef.value.$el.querySelector(
        '.el-form-item.is-error input, .el-form-item.is-error textarea, .el-select .el-input__wrapper input'
      )
      el?.focus()
    })
  }
}


const activityCategories = ActivityCategories.filter(
  (item) => item.category_no !== null
);
const dateRange = ref([])
const cityList = taiwanDistricts.map((city) => {
  return {
    name: city.city,
    value: city.city,
  };
});

watch(ruleForm.dateRange, (val)=>{
  if(val && val.length === 2) {
    ruleForm.activity_start_date = val[0]
    ruleForm.activity_end_date = val[1]
  } else {
    ruleForm.activity_start_date = null
    ruleForm.activity_end_date = null
  }
})


const defaultTime2= [
  new Date(2000, 1, 1, 12, 0, 0),
  new Date(2000, 2, 1, 8, 0, 0),
] // '12:00:00', '08:00:00'
const num = ref(1)
const handleChange = (value) => {
  console.log(value)
}

const labelPosition = ref('top')
const itemLabelPosition = ref('')


const fileInput = ref(null); // 取得 input DOM
const previewUrl = ref(null); // 存圖片預覽網址

// 按下自訂按鈕 → 觸發隱藏 input
const triggerFileInput = () => {
  fileInput.value.click();
  console.log('觸發檔案選擇');
};

// 選擇檔案後處理
const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  // 本地預覽
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value) // 換圖先釋放舊 URL（避免記憶體洩漏）
  previewUrl.value = URL.createObjectURL(file)

  // 表單欄位（讓 rules.required 生效）
  ruleForm.activity_img = file

  // 存到 Pinia（給預覽頁讀）
  store.setImage(file)
}



</script>

<template>
  <Popup> </Popup>
  <div class="group-create-wrap">
  <div class="group-create-bakground">
    <h3>發起揪團</h3>
  </div>
  <el-form :model="ruleForm" label-width="auto" ref="ruleFormRef" :rules="rules" :label-position="labelPosition" class="form-wrapper"  @submit.prevent >
    <el-form-item label="活動名稱" prop="activity_name">
      <el-input v-model="ruleForm.activity_name" />
    </el-form-item>
  <el-form-item label="活動時間日期" prop="dateRange">
  <div >
    <el-date-picker
      v-model="ruleForm.dateRange"
      type="datetimerange"
      start-placeholder="開始日期"
      end-placeholder="結束日期"
      :default-time="defaultTime2"
      class="acitvity-time"
       :popper-class="'one-panel'"
      
    />
  </div>

    </el-form-item>
    <el-form-item label="活動類別" prop="category_no">
      <el-select v-model="ruleForm.category_no" placeholder="請選擇活動類別" >
        <el-option v-for="cat in activityCategories"
        :value="cat.category_no"
        :key="cat.category_no"
        :label="cat.category_name"
        />
      </el-select>
    </el-form-item>
   
    <el-form-item label="成團人數" prop="min_participant">
      <div class="participants"  :style="'display: flex; gap: 10px; padding: 0 10px; align-items: center;'">
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
    <el-select v-model="ruleForm.location" placeholder="城市" class="city-select">
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
      <el-input v-model="ruleForm.fee_notes" placeholder="請輸入預估費用" >

      </el-input>
    </el-form-item>


    <el-form-item label="活動簡介" prop="activity_description">
      <el-input v-model="ruleForm.activity_description" type="textarea" placeholder="說明一下活動內容，讓更多人有興趣參與" />
    </el-form-item>
    <el-form-item label="揪團截止日"  prop="registration_deadline" >
      <el-date-picker v-model="ruleForm.registration_deadline" type="date" placeholder="請選擇揪團截止日" :editable="false" :clearable="false" class="registration-deadline">

      </el-date-picker>

    </el-form-item>

    <el-form-item>
      <el-checkbox>
        揪團限制
      </el-checkbox>
      <el-input v-model="ruleForm.participant_limitation"></el-input>
    </el-form-item>
    <div class="select-img">
<el-form-item label="圖片上傳" :label-position="'right'" prop="activity_img">

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

      <div v-if="previewUrl" class="img-preview">
  <p>預覽圖片：</p>
  <img :src="previewUrl" alt="預覽" />
</div>
    <el-form-item>
     <div class="submit-button">
      <Button theme="primary" size="md" @click="submitForm">送出</Button>
      </div>
    </el-form-item>
  </el-form>
  </div>
</template>



<style lang="scss" scoped>
.group-create-wrap {
  background-image: url(../../assets/img/group/group-explore/form-decoration.svg);
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: 100%;
  
}
.group-create-bakground {
   background-image: url(../../assets/img/group/group-create/group-create-banner-background.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
    min-height: 100px;
  @include tablet() {
    //768-1023
    min-width: 768px;
    min-height: 200px;
   
  }

  @include desktop() {
    //1024以上
   

    background-position: center;
    @include flex-center;
    min-height: 300px;
    width: 100%;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    min-width: 1024px;
    min-height: 300px;
   
    background-repeat: no-repeat;
    background-position: top;
  }
  
}
h3{
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
:deep(.acitvity-time.el-date-editor.el-range-editor) {
max-width: 300px;
  @include tablet() {
    //768-1023
  min-width: 500px;
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

.min-participant{
  display: flex;
  align-items: center;
  gap: 5px;
   span{
  margin-top: 1px;
}
}
.max-participant{
    display: flex;
  align-items: center;
  gap: 5px;
   span{
  margin-top: 1px;
}
}
:deep(.el-input-number--small.is-controls-right .el-input--small .el-input__wrapper){
  padding:0px 5px 0px 5px;
  max-width: 45px;
}
:deep(.el-picker-panel__content:last-child) {
    display: none ;
  }
  /* 補滿可視寬度 */
  .el-picker-panel {
    width: 100% ;
    max-width: 100% ;
  }

  :depp(.el-input-number.is-center .el-input__inner){
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

.registration-deadline{
  min-width: 300px;
  >div>div.el-input__wrapper{
    max-width: 300px;
  @include tablet() {
    //768-1023
  min-width: 500px;
  }

  @include desktop() {
    //1024以上
     max-width: 800px;
  }


  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
       max-width: 800px;
  
  }
}}
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
