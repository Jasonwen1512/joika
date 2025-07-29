<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { FakeActivity } from '@/assets/data/fake-activity';
import Button from '@/components/Button.vue';
import LikeButton from '@/components/activity/like-button.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';

const route = useRoute();
const activityNo = route.params.activity_id;

const activity = computed(() =>
  FakeActivity.find((item) => String(item.activity_no) === String(activityNo))
);

const aloha = () => {
  alert('我要跟團！');
};
</script>

<template>
  <div class="activity-detail-page">
    <!-- 藍色背景 -->
    <div class="activity-hero-bg"></div>

    <!-- 圖片 -->
    <div class="activity-image">
      <img :src="activity?.activity_img" :alt="activity?.activity_name" />
    </div>

    <!-- 標題 -->
    <div class="activity-title-wrap">
      <h2>{{ activity?.activity_name }}</h2>
    </div>

    <!-- 按鈕 -->
    <div class="activity-button-wrap">
      <Button @click.stop.prevent="aloha" theme="primary" size="md">
        我要跟團!
      </Button>
      <LikeButton />
    </div>

    <!-- 裝飾圖 -->
    <div class="bg-decorate2">
      <img src="@/assets/img/bg-decorate2.png" alt="" />
    </div>

    <!-- 🆕 改版後的資訊排版 -->
      
    <section class="activity-info">
      <div class="info-divider"></div>
      <div class="info-grid">
        <!-- 左欄 -->
        <div class="info-col">
          <div class="info-row">
            <strong>日期與時間</strong>
            <span>{{ activity?.activity_start_date }} ~ <br>{{ activity?.activity_end_date }}</span>
          </div>
          <div class="info-row">
            <strong>地點</strong>
            <span>{{ activity?.location }}</span>
          </div>
          <div class="info-row">
            <strong>揪團人數</strong>
            <span>{{ activity?.current_participant }}/{{ activity?.max_participant }}人</span>
          </div>
        </div>

        <!-- 右欄 -->
        <div class="info-col">
          <div class="info-row">
            <strong>預估費用</strong>
            <span>{{ activity?.fee_notes }}</span>
          </div>
          <div class="info-row">
            <strong>揪團截止日</strong>
            <span>{{ activity?.registration_deadline }}</span>
          </div>
          <div class="info-row">
            <strong>跟團限制</strong>
            <span>{{ activity?.participant_limitation }}</span>
          </div>
        </div>
      </div>

      <!-- 底部橫線裝飾 -->
      <div class="info-divider"></div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.activity-detail-page {
  position: relative;
}

.activity-hero-bg {
  background: url("@/assets/img/activity/activity-detail/bg-blue-triangle.svg") no-repeat center / cover;
  width: 100%;
  height: 400px;

  @include desktop() {
    height: 600px;
  }
}

.activity-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -240px;

  img {
    width: 360px;
    height: 205px;
    object-fit: cover;
    border-radius: 8px;

    @include desktop() {
      width: 1030px;
      height: 660px;
      margin-top: -200px;
    }
  }
}

.activity-title-wrap {
  display: flex;
  justify-content: center;
  margin: 50px auto;

  @include desktop() {
    margin: 32px auto;
  }

  h2 {
    @include mobile() {
      font-size: 22px;
    }
  }
}

.activity-button-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
}

// ✅ 新排版樣式
.activity-info {
  max-width: 1200px;
  margin: 0 auto 100px;
  padding: 32px 20px;

  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: space-between;

    @include desktop() {
      flex-direction: row;
    }
  }

  .info-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;

    @include desktop() {
      width: 48%;
    }
  }

  .info-row {
    display: flex;
    padding-bottom: 8px;

    strong {
      font-weight: bold;
      width: 30%;
    }

    span {
      max-width: 70%;
      line-height: 1.5;
    }
  }

  .info-divider {
    margin: 40px 0;
    height: 1px;
    background-color: #000;
  }
}

.bg-decorate2 {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -1;
  margin-bottom: 240px;
  transform: translateY(20%);

  @include desktop() {
    bottom: -40px;
    left: -80px;
    transform: none;
  }

  @include mobile() {
    margin-left: -40px;
  }


  img {
    width: 180px;
    height: auto;

    @include desktop() {
      width: 380px;
    }
  }
}
</style>
