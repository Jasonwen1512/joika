  <script setup>
  import ActivityTag from "@/components/member/activity-status-tag.vue";
  import Button from "@/components/Button.vue";
  const props = defineProps({
    item: Object,
    status: String,
  });
  </script>

  <template>
    <div v-if="item" class="member-activity-card">
      <div class="img">
        <img :src="item.activity_img" :alt="item.activity_name" />
        <ActivityTag :activity_status="item.activity_status" />
      </div>
      <h3 class="activity-name">{{ item.activity_name }}</h3>
      <p class="activity-description">{{ item.activity_description }}</p>
      <div class="button-group">
        <Button theme="info" size="sm">團員列表</Button>
      </div>
    </div>
  </template>

  <style lang="scss" scoped>
  .member-activity-card {
    width: 284px;
    height: 390px;
    justify-self: center;
    gap: 25px;
    margin: 20px;
  }
  .img {
    width: 264px;
    height: 200px;
    position: relative;
  }
  .img img {
    width: 100%;
    height: 100%;
  }

  .activity-name {
    max-width: 264px;
    font-size: $font-size-h4;
    padding: 14px 0 0px;
    line-height: 1.7;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: unset;
    letter-spacing: 0.5px;
  }

  .activity-description {
    color: $black;
    font-size: $font-size-p;
    padding: 10px 0 0;
    line-height: 1.7;
    max-width: 264px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  .button-group {
    display: flex;
    justify-content: right;

    padding-top: 10px;
    max-width: 264px;
  }
  </style>
