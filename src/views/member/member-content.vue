<script setup>
import StarRating from "@/components/StarRating.vue";
import Button from "@/components/Button.vue";
import EditIcon from "@/assets/img/icon/edit.svg";
import NotifyIcon from "@/assets/img/icon/notification.svg";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import FullCalendar from "@/components/member/member-content/FullCalendar.vue";
import { articleList } from "@/assets/data/fake-article"; //引入文章假資料
import MemberActivityCard from "@/components/member/member-activity-card.vue";
import { FakeActivity } from "@/assets/data/fake-activity";

//靜態資料 活動類別與標籤顏色
const activities = ["水上活動", "露營", "登山"];

const eventColorMap = {
  //分類顏色

  登山: "#6DE1D2",
  水上活動: "#77BEF0",
  運動: "#FFD63A",
  露營: "#FF8C86",
  唱歌: "#FFA955",
  展覽: "#6DE1D2",
  聚餐: "#77BEF0",
  桌遊: "#FFD63A",
  電影: "#FF8C86",
  手作: "#FFA955",
  文化體驗: "#6DE1D2",
  演出表演: "#77BEF0",
  其他: "#969696",
};

//靜態資料 留言 之後要串
const comments = ref([
  {
    userid: "M0001",
    author: "SunnyDive",
    avatar: "https://i.pravatar.cc/150?u=sunnydive", // 假頭像，每次刷新會變
    timestamp: "2025/07/07 18:45",
    content: "我們那天也在那欸哈哈～真的超美！Joika平台揪團越來越專業了！",
  },
  {
    userid: "M0002",
    author: "kelly_travel",
    avatar: "https://i.pravatar.cc/150?u=kellytravel",
    timestamp: "2025/07/07 20:13",
    content: "哇我也有看到這團但沒報名到 QAQ 希望下次還有類似的！",
  },
  {
    userid: "M0003",
    author: "ocean_rookie",
    avatar: "https://i.pravatar.cc/150?u=oceanrookie",
    timestamp: "2025/07/08 09:07",
    content: "我是這團的其中一員！很開心認識大家～謝謝你分享這段回憶❤️",
  },
  {
    userid: "M0004",
    author: "sandy_test",
    avatar: "https://i.pravatar.cc/150?u=sandy_test",
    timestamp: "2025/07/07 09:30",
    content: "有誰也有跟過嗎?好奇其他人的想法?",
  },
]);

//抓顏色
const GetEventColor = (eventName) => {
  return eventColorMap[eventName] || "#adb5bd";
};
const currentTab = ref("group");
// 後續抓會員ID用  用於抓到該會員的揪團與文章
// 現在先假設是M0001
const route = useRoute();
// const currentUserId = route.params.userid;
const currentUserId = "M0001";

const FilteredArticles = computed(() => {
  // 依照該會員的 userid 篩選
  const filtered = articleList.filter((a) => a.userid === currentUserId);

  // 排序：由新到舊
  return filtered.slice().sort((a, b) => {
    const ReformatDate = (dateString) => {
      const parts = dateString.trim().split(" ");
      const timeStr = parts[1];
      const indicator = timeStr.substring(0, 2); // AM / PM
      const time = timeStr.substring(2);
      const standardFormat = `${parts[0]} ${time} ${indicator}`;
      return new Date(standardFormat);
    };

    return ReformatDate(b.date) - ReformatDate(a.date);
  });
});
const visibleCount = ref(2); // 預設電腦是 2 張

const handleResize = () => {
  visibleCount.value = window.innerWidth < 768 ? 1 : 2;
};

onMounted(() => {
  handleResize(); // 初次判斷
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const openActivities = computed(() => {
  return FakeActivity.filter((a) => a.activity_status === "開團中");
});

const visibleActivities = computed(() => {
  return openActivities.value.slice(0, visibleCount.value);
});
</script>

<template>
  <div class="member-content">
    <div class="member-header">
      <div class="member-details">
        <div class="member-image">
          <img
            src="/src/assets/img/member/headshot.jpg"
            alt="Member Headshot"
          />
        </div>
        <div class="member-info">
          <p class="user-name">Amooo.___.</p>
          <StarRating
            :score="5.0"
            :count="3"
            color="yellow"
            showScore
            class="score"
          />
          <StarRating
            :score="4.0"
            :count="1"
            color="blue"
            showScore
            class="score"
          />
          <p class="user-demographics">基隆市 | 29歲 | 社畜</p>
          <div class="tags">
            <div
              v-for="(activity, index) in activities"
              :key="index"
              class="tag"
              :style="{ backgroundColor: GetEventColor(activity) }"
            >
              {{ activity }}
            </div>
          </div>
        </div>
      </div>
      <div class="button-group">
        <RouterLink :to="`member-notify`"
          ><Button :prefixIcon="NotifyIcon" size="lg" theme="primary"
            >通知訊息</Button
          ></RouterLink
        >
        <Button :prefixIcon="EditIcon" size="lg" theme="info">編輯檔案</Button>
      </div>
    </div>

    <div class="member-body">
      <div class="tab-bar">
        <button
          :class="{ active: currentTab === 'group' }"
          @click="currentTab = 'group'"
        >
          揪團
        </button>
        <button
          :class="{ active: currentTab === 'calendar' }"
          @click="currentTab = 'calendar'"
        >
          行事曆
        </button>
        <button
          :class="{ active: currentTab === 'post' }"
          @click="currentTab = 'post'"
        >
          貼文
        </button>
        <button
          :class="{ active: currentTab === 'comment' }"
          @click="currentTab = 'comment'"
        >
          評論
        </button>
      </div>
      <div class="tab-content">
        <div v-if="currentTab === 'group'">
          <div class="member-activity-section">
            <ul class="member-activity-btns">
              <li>
                <button
                  :class="{ active: currentSubTab === 'my-activity' }"
                  @click="currentSubTab = 'my-activity'"
                >
                  我開的揪團
                </button>
              </li>
              <li>
                <button
                  :class="{ active: currentSubTab === 'my-follow-activity' }"
                  @click="currentSubTab = 'my-follow-activity'"
                >
                  參與的揪團
                </button>
              </li>
              <li>
                <button
                  :class="{
                    active: currentSubTab === 'my-activity-collection',
                  }"
                  @click="currentSubTab = 'my-activity-collection'"
                >
                  我的收藏
                </button>
              </li>
            </ul>
            <div class="member-activity-card-section">
              <MemberActivityCard
                v-for="activity in FakeActivity.slice(0,6)"
                :key="activity.id"
                :item="activity"
              />
            </div>
          </div>
        </div>
        <div v-else-if="currentTab === 'calendar'">
          <div class="activity-card-groups">
            <p class="section-title">下一個揪團</p>
            <div class="activity-card-list">
              <MemberActivityCard
                v-for="activity in visibleActivities"
                :key="activity.id"
                :item="activity"
              />
            </div>
          </div>
          <div class="calerdar">
            <FullCalendar />
          </div>
        </div>
        <div v-else-if="currentTab === 'post'">
          <!-- //我發表的文章-->

          <section class="article-list">
            <div
              v-for="(article, index) in FilteredArticles"
              :key="article.postid"
              class="article-item"
            >
              <div class="article-img">
                <img :src="article.image" :alt="article.title" />
              </div>
              <router-link
                :to="`/article/${article.postid}`"
                class="article-text-link"
              >
                <div class="article-text">
                  <div class="articleHeader">
                    <div class="article-date">
                      <span
                        class="event-label"
                        :style="{ borderColor: GetEventColor(article.event) }"
                      >
                        {{ article.event }}
                      </span>
                      <p>{{ article.date }}</p>
                    </div>
                    <div class="article-title">
                      <h3>{{ article.title }}</h3>
                    </div>
                  </div>
                  <div class="article-body">
                    <p v-html="article.content"></p>
                  </div>
                </div>
              </router-link>
              <hr />
            </div>
            <div v-if="FilteredArticles.length === 0">
              <p>這位會員目前尚未發表文章。</p>
            </div>
          </section>
          <!-- 到這邊結束 -->
        </div>
        <div v-else-if="currentTab === 'comment'">
          <!-- //我發表的留言-->
          <!-- 這邊資料串接有問題 因為留言資料裡面沒有對應的文章ID 無法抓取 ，之後要做修正-->

          <section class="article-list">
            <div
              v-for="(article, index) in FilteredArticles"
              :key="article.postid"
              class="article-item"
            >
              <div class="article-img">
                <img :src="article.image" :alt="article.title" />
              </div>
              <router-link
                :to="`/article/${article.postid}`"
                class="article-text-link"
              >
                <div class="article-text">
                  <div class="articleHeader">
                    <div class="article-date">
                      <span
                        class="event-label"
                        :style="{ borderColor: GetEventColor(article.event) }"
                      >
                        {{ article.event }}
                      </span>
                      <p>{{ article.date }}</p>
                    </div>
                    <div class="article-title">
                      <h3>{{ article.title }}</h3>
                    </div>
                  </div>
                  <div class="article-body">
                    <p v-html="article.content"></p>
                  </div>
                </div>
              </router-link>
              <hr />
            </div>
            <div v-if="FilteredArticles.length === 0">
              <p>這位會員目前尚未發表留言。</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.member-content {
  padding: 50px 0;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.9)
    ),
    url("/src/assets/img/group/group-explore/group-explore-taiwan/bgc.svg");
  background-size: contain;
}
.member-header {
  border: 2px solid $black;
  border-radius: 3px;
  padding: 20px;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;

  .member-image {
    display: flex;
    justify-content: center;
    margin: 0;
  }

  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  .user-name {
    font-size: $font-size-h3;
    margin-bottom: 10px;
  }

  .score {
    margin-bottom: 10px;
  }

  .user-demographics {
    font-size: $font-size-h3;
    margin-bottom: 10px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 10px;

    .tag {
      text-align: center;
      padding: 5px;
      color: $black;
      border: 1px solid $black;
      border-radius: 3px;
      width: 80px;
    }
  }

  .button-group {
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
  position: relative; /* 為了 z-index */
  z-index: 1; /* 確保頁籤在內容區塊之上 */
  margin-bottom: -2px; /* 向下移動 1px，蓋住下方邊框 */

  button {
    background-color: $color-secondary;
    border-radius: 3px 3px 0 0;
    border: 2px solid $black;
    padding: 10px;
    width: 80px;
    cursor: pointer;
    &.active {
      background-color: $blue;
      color: $white;
      border-bottom-color: $blue;
    }
  }
}

.tab-content {
  border: 2px solid $black;
  border-radius: 3px;
  padding: 15px;
}
//揪團卡片頁籤-start
.member-activity-btns {
  display: flex;
  gap: 30px;
  margin-left: 20px;
  margin-bottom: 20px;

  button {
    border: 1px solid black;
    padding: 10px;
    cursor: pointer;
    background-color: #b1f0f7;
    color: black;
    transition: all 0.3s;

    &.active {
      background-color: #4f8da8;
      color: white;
    }
  }
}
.member-activity-card-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
//揪團卡片頁籤-end

//行事曆
.activity-card-groups {
  .section-title {
    font-size: $font-size-h3;
  }
}

//這邊開始是文章樣式
.article-item {
  display: flex;
  justify-items: start;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.article-date {
  display: flex;
  gap: 10px;
  align-items: center;
}
.article-img {
  display: flex;
  width: 100%;
  height: auto;
  overflow: hidden;
  // max-width: 285px;
  // max-height: 190px;
  flex-direction: column;
}
// .article-img img{
//   width: 100%;

// }
//文章只顯示2行
.article-body p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;

  -webkit-box-orient: vertical;
}

.article-text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 20px;
}
.event-label {
  text-align: center;
  padding: 2px;
  margin: 2px;
  border: solid 3px;
  border-radius: 6px;
  width: 80px;
}
.article-title {
  padding-block: 5px;
}
//取消 router預設的click樣式
.router-link-active,
.router-link-exact-active,
.article-text-link {
  text-decoration: none;
  color: inherit;
}
@media (min-width: 768px) {
  .member-header {
    width: 100%;
    max-width: 1200px;
    border-radius: 6px;
    margin: 0 auto 100px;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    padding: 50px;

    .member-details {
      display: flex;
      align-items: center;
      gap: 60px;
    }

    .button-group {
      flex-direction: column;
      gap: 15px;
      align-items: flex-end;
      background-color: $white;
    }
  }

  .tab-bar {
    justify-content: center;
    gap: 10px;

    button {
      border-radius: 6px 6px 0 0;
      padding: 10px 15px;
      width: 250px;
    }
  }

  .tab-content {
    width: 100%;
    max-width: 1200px;
    margin: auto;
    padding: 50px;
  }

  .activity-card-groups {
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    .activity-card-list {
      display: flex;
    }
  }

  .article-img {
    display: flex;
    width: 100%;
    height: auto;
    overflow: hidden;
    max-width: 285px;
    max-height: 190px;
    flex-direction: column;
  }

  .article-item[data-v-4ead1c86] {
    gap: 20px;
    display: flex;
    justify-items: start;
    flex-direction: row;
    align-items: center;
  }
}
</style>
