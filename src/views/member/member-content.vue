<script setup>
  import StarRating from '@/components/StarRating.vue';
  import Button from '@/components/Button.vue';
  import EditIcon from "@/assets/img/icon/edit.svg";
  import NotifyIcon from "@/assets/img/icon/notification.svg";
  import { ref } from 'vue'

  const activities = ['水上活動', '露營', '登山'];

  const eventColorMap = {
    "登山": "#56DD61",
    "水上活動": "#81BFDA",
    "運動": "#567ADD",
    "露營": "#F05ECC",
    "唱歌": "#FADA7A",
    "展覽": "#FF7F5B",
    "聚餐": "#FFB65D",
    "桌遊": "#F5F0CD",
    "電影": "#B1F0F7",
    "手作": "#DBF964",
    "文化體驗": "#6AF6C5",
    "演出表演": "#EA64FF",
    "其他": "#969696"
  };

const getEventColor = (eventName) => {
  return eventColorMap[eventName] || '#adb5bd';
};

const currentTab = ref('group')

</script>

<template>

  <div class="member-content">
    <div class="member-header">
      
      <div class="member-image">
        <img src="/src/assets/img/member/headshot.jpg" alt="Member Headshot">
      </div>
      <div class="member-info">
        <p class="user-name">Amooo.___.</p>
        <StarRating :score="5.0" :count="3" color="yellow" showScore class="score"/>
        <StarRating :score="4.0" :count="1" color="blue" showScore class="score" />
        <div class="tags">
          <div
            v-for="(activity, index) in activities"
            :key="index"
            class="tag"
            :style="{ backgroundColor: getEventColor(activity) }"
          >
            {{ activity }}
          </div>
        </div>
      </div>
      <div class="button-group">
        <Button :prefixIcon="NotifyIcon" size="lg" theme="primary" >通知訊息</Button>
        <Button :prefixIcon="EditIcon" size="lg" theme="info">編輯檔案</Button>
      </div>
    </div> 

    <div class="member-body">
      <div class="tab-bar">
        <button 
          :class="{ active: currentTab === 'group' }" 
          @click="currentTab = 'group'">揪團</button>
        <button 
          :class="{ active: currentTab === 'calendar' }" 
          @click="currentTab = 'calendar'">行事曆</button>
        <button 
          :class="{ active: currentTab === 'post' }" 
          @click="currentTab = 'post'">貼文</button>
        <button 
          :class="{ active: currentTab === 'comment' }" 
          @click="currentTab = 'comment'">評論</button>
      </div>
      <div class="tab-content">
        <div v-if="currentTab === 'group'">
          我是揪團頁
        </div>
        <div v-else-if="currentTab === 'calendar'">
          我是行事曆頁
        </div>
        <div v-else-if="currentTab === 'post'">
          我是文章
        </div>
        <div v-else-if="currentTab === 'comment'">
          我是評論
        </div>
      </div>
</div>  
  </div>
</template>

<style scoped lang="scss">
.member-content {
  padding: 50px 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),url("/src/assets/img/group/group-explore/group-explore-taiwan/bgc.svg");
  background-size: contain;

}
.member-header{
  border: 1px solid $black;
  padding: 20px;
  margin-bottom:25px;
  display: flex;
  flex-direction: column;

  .member-image{
    display: flex;
    justify-content: center;
    margin: 0;
    }

  img{
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  .user-name{
    font-size: $font-size-h3;
    margin-bottom: 10px;
  }

  .score{
    margin-bottom: 10px;
  }

  .tags{
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom:10px;

    .tag{
      text-align: center;
      padding: 5px;
      color: $black;
      border: 1px solid $black;
      border-radius: 3px;
      width: 80px;
    }
  }

  .button-group{
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;
  }
}

.tab-bar {
  display: flex;
  justify-content: center;
  gap: 10px;

  button {
    background-color: $color-secondary;
    border-radius: 3px 3px 0 0;
    border: 1px solid $black;
    padding: 10px 15px;
    width: 80px;
    cursor: pointer;
    &.active {
      background-color: $blue;
      color: $white;
    }
  }
}

.tab-content{
  border: 1px solid $black;
  height: 500px;
}

@media (min-width: 768px) {
  .member-header{
    width: 1200px;
    margin: auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    gap: 30px;

    .button-group{
      flex-direction: column;
      gap: 15px;
      align-items: flex-end;
    }
  }



}




</style>
