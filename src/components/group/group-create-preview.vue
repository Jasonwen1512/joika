<script setup>
import Button from "@/components/Button.vue";
import smEditIcon from "@/assets/img/icon/edit.svg";
import { useRouter } from "vue-router";
import { useGroupFormStore } from "@/stores/group-form";
import { computed, ref } from "vue";
const store = useGroupFormStore();
const router = useRouter();


const emit = defineEmits(['back', 'confirm'])     // ✅ 宣告事件
const props = defineProps({
  form:   { type: Object, required: true },
  image:  { type: Object, default: () => ({ previewUrl: '', filename: '', mime: '' }) },
})
const previewUrl = computed(() => store.image?.previewUrl || '')
const previewData = computed(() => store.formData);
async function submit() {
  // 上傳檔案拿 URL，填到 activity_img 後送 API
  store.clearDraft()
  store.resetForm()
  router.replace('/group/success')
}
const goBackToEdit = () => {
  
  emit('back')


  router.push({ name: 'group-create', params: { mode: 'edit', activity_no: '1' } })
}
const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}/${m}/${day} ${hh}:${mm}`;
};
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}/${day}`;
};
const hosterRating = ref(3.8);
const joinerRating = ref(4.5);


// const activityFormToEdit = activityFormList.find(
//       (item) => item.activity_no === props.activity_no
//     );
</script>

<template>
  <div class="preview-form-wrap">
    <div class="title">
    <p>🎉揪團完成啦！ </p>
     <p> 來看一下你的活動長什麼樣</p>
</div>
    <div class="form-check">
      <p>
        感謝你發起活動
        <br />
        你的揪團頁面已經建立好囉！這是大家會看到的版本，建議花 1~2
        分鐘檢查看看資訊有沒有打錯：
      </p>
      <div class="check-list">
        <ul>
          🔍檢查建議
        </ul>
        <li>活動標題和時間 OK 嗎？</li>
        <li>費用和地點有寫清楚嗎</li>
        <li>圖片或介紹有沒有typo？</li>
        <li>有需要補充的注意事項嗎</li>
      </div>

      <p>想改？沒問題~ 你可以點右上角 編輯按鈕馬上修改。</p>
    </div>

    <div class="form-preview">
      <div class="edit-button" >
        <Button
        type="button"
          :prefixIcon="smEditIcon"
          theme="secondary"
          size="sm"
          @click="goBackToEdit"
          >編輯</Button
        >
      </div>

      <div class="activity-content">
        <h2>
          {{ formatDate(previewData.dateRange[0]) }}
          {{ previewData.activity_name }}
        </h2>
        <div class="activity-img">
          <img :src="previewUrl" alt="" />
        </div>
        <hr />
        <div class="activity-intro">
          <div class="activity-time">
            <span>日期與時間 </span>
            <span
              >{{ formatDateTime(previewData.dateRange[0]) }} ~
              {{ formatDateTime(previewData.dateRange[1]) }}</span
            >
          </div>
          <div class="activity-location">
            <span>地點</span>
            <span>{{ previewData.location }} {{ previewData.address }}</span>
          </div>
          <div class="activity-participants">
            <span>成團人數</span>
            <span> {{ previewData.min_participant }}</span>
          </div>
          <div class="activity-estimated-fee">
            <span>預估費用</span>
            <span>{{ previewData.fee_notes }}</span>
          </div>
          <div class="activity-deadline">
            <span>揪團截止日</span>
            <span>{{ formatDate(previewData.registration_deadline) }}</span>
          </div>
          <div class="activity-limitation">
            <span>跟團限制</span>
            <span>{{ previewData.participant_limitation }}</span>
          </div>
        </div>
        <hr />
        <div class="activity-hoster">
          <div class="hoster-intro">
          <span>主揪</span>
          </div>
          <div class="hoster-img">
            <img
              src="../../assets/img/welcome/community-cards/user-image5.jpg"
              alt=""
            />
          </div>
          <div class="hoster-profile">
            <p class="hoster-name">小單</p>
            <div class="ranting">
              <div class="hoster-rating">
                <el-rate
                  v-model="hosterRating"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </div>
              <div class="joiner-rating">
                <el-rate
                  v-model="joinerRating"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </div>
            </div>
            <div class="info">
            <ul class="hoster-info">
              <li>台中市</li>
              <li>30歲</li>
              <li>健身教練</li>
            </ul>
            </div>
          </div>
         
          
        </div>
         <hr />
        <div class="activity-detail">
            <span>活動詳情</span>
            <p>{{ previewData.activity_description }}</p>
          </div>
      </div>
    </div>
    <div class="final-check">
      <h4>⏳ 下一步：送出審核！</h4>
      <p>
        完成檢查後請點「送出審核」，平台會在72 小時內完成審核（有時更快⚡）
        <br />審核通過後，你的活動就會正式上線，大家就能看到並報名囉！<br />
        感謝你用心揪團～<br />讓我們一起讓揪卡更精彩 🎈
      </p>
    </div>
  </div>
  <div class="background-decoration">
    <div class="submit-button">
      <Button theme="primary" size="md" @click="emit('confirm')">送出</Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview-form-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
}
h2 {
  text-align: center;
  margin: 20px 0;
  font-size: $font-size-h2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.title {
  max-width: 720px;
  width: 100%;
display: flex;
flex-direction: column;
  text-align: left;
   margin: auto 0 ;
  justify-content: left;
  @include desktop() {
      //1024以上
flex-direction: row;
    }

    @media screen and (min-width: 1023px) and (max-width: 1199px) {
      //1023-1199
      flex-direction: row;
      
  
    }
 p {
    font-size: $font-size-h4;
    margin: 0;
   
    
  }


}

.activity-time,
.activity-participants,
.activity-estimated-fee,
.activity-location,
.activity-deadline,
.activity-limitation {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  flex-wrap: wrap;
  span {
    width: 40%;

  }
@include tablet() {
      //768-1023
justify-content: space-evenly;
    }


}
.activity-img {
  margin: 50px auto;
  max-width: 350px;
  height: 200px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
    border: 1px solid $black;
  }
}
.form-check {
  margin: 10px;
  border: 2px solid $black;
  max-width: 1200px;
  font-size: $font-size-p;
  padding: 10px;
}
.ranting{
  width: 100%;

}
li {
  list-style: disc;
  margin: 5px 10px;
}
.button-wrapper {
  display: flex;
  justify-content: right;
  margin: 30px 15px 20px 0;
}
.activity-content {
  margin: 0 auto;
  
  font-size: $font-size-p;
  padding: 10px;
  .activity-intro {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px 0;

     @include tablet() {
      //768-1023
      display: grid;
      grid-template-columns: repeat(2, 1fr);

    }

    @include desktop() {
      //1024以上

    }

    @media screen and (min-width: 1023px) and (max-width: 1199px) {
      //1023-1199
  
    }
  }
}

.activity-detail{
  margin: 20px 0;
  padding: 10px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  
  p {
    margin: 5px 0;
    font-size: $font-size-p;
  }
  @include tablet() {
      //768-1023
     margin: 0 20px ;

    }

    @include desktop() {
      //1024以上

    }

    @media screen and (min-width: 1023px) and (max-width: 1199px) {
      //1023-1199
  
    }
}





.activity-hoster {
   
  @include tablet() {
    //768-1023
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    margin: auto ;
    
  }
  
  
  @include desktop() {
    display: flex;
    
    align-items: center;
    gap: 20px;
      
    }
  span {
  
    justify-self: center;
    margin: 20px 0;
   
  }
}
.hoster-img {
 max-width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid $black;
  justify-self: center;

  // @include tablet() {
  //     //768-1023
  //   width: 30%;
  //   height: 100%;
  //   margin: 0 auto;
  //   }

  //   @include desktop() {
  //     //1024以上
  //    width: 120px;
  //    height: 120px;
  //   }

  //   @media screen and (min-width: 1023px) and (max-width: 1199px) {
  //     //1023-1199
  //     width: 120px;
  //     height: 120px;
  //   }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.joiner-rating > .el-rate {
  --el-rate-fill-color: #81bfda;
}
.hoster-profile {
    margin: 20px 20px 10px 20px;
  
  @include tablet() {
      //768-1023
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: left;
    width: 40%;
     
    p{
      width: 100%;
    }
    }

    @include desktop() {
      //1024以上
     display: flex;
      align-items: center;
      gap: 20px;
    }

    @media screen and (min-width: 1023px) and (max-width: 1199px) {
      //1023-1199
  display: flex;
      align-items: center;
      gap: 20px;
    }

  
}
.hoster-intro {
  display: flex;
  flex-direction: column;
  justify-self: center;
  gap: 10px;
  margin-bottom: 10px;
  text-align: center;

  @include tablet() {
      //768-1023
    flex-direction:row;
    align-items: center;
    gap: 50px;
    width: 30%;
    margin-left: 10px;
    }

    @include desktop() {
      //1024以上

    }

    @media screen and (min-width: 1023px) and (max-width: 1199px) {
      //1023-1199
  
    }




}
.info {
 width: 100%;
}
.hoster-info {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 0;
  padding: 0;

  li {
    margin: 0 0 10px 0;
    padding-right: 10px;
  }

  > * {
    list-style: none;
    position: relative;
  }

  > * + * {
    padding: 0 10px;
  }

  > * + *::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-40%);
    width: 1px;
    height: 1em;
    background: currentColor;
    opacity: 0.35;
  }
}

.final-check {
  margin: 10px;
  border: 2px solid $black;
  min-width: 350px;
  font-size: $font-size-p;
  padding: 20px;
  max-width: 1200px;
  h4 {
    margin: 10px 0;
    font-size: $font-size-h4;
  }
}
.submit-button > .button-wrapper {
  justify-content: center;
  margin: 20px auto;
}

.background-decoration {
  background-image: url("@/assets/img/group/group-explore/group-explore-taiwan/bgc.svg");
  min-height: 30vh;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.edit-button{
  max-width: 700px;
  margin: 0 auto;
}
</style>
