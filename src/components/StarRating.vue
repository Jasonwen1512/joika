<script setup>
const props = defineProps({
  score: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: 'blue', // 'blue' | 'yellow'
  },
  showScore: {
    type: Boolean,
    default: true,
  },
});

const starColor = props.color === 'yellow' ? '#f5c542' : '#4db2e1';

// 判斷顯示狀態：full / half / empty
function getStarType(i, score) {
  if (i <= Math.floor(score)) return "full";
  if (i === Math.ceil(score) && score % 1 !== 0) return "half";
  return "empty";
}
</script>

<template>
  <div class="star-rating">
    <template v-if="score > 0">
      <svg
        v-for="i in 5"
        :key="i"
        viewBox="0 0 640 640"
        class="star"
      >
        <!-- 背景灰色星星 -->
        <path
          fill="#ccc"
          d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"
        />

        <!-- 前景星星（依 full / half 決定遮罩） -->
        <path
          v-if="getStarType(i, score) === 'full'"
          :fill="starColor"
          d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"
        />
        <path
          v-else-if="getStarType(i, score) === 'half'"
          :fill="starColor"
          d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"
          clip-path="inset(0 50% 0 0)"
        />
      </svg>

      <span class="score" v-if="showScore">
        {{ score.toFixed(1) }} <span class="count">({{ count }})</span>
      </span>
    </template>

    <template v-else>
      <span class="no-score">目前無評分</span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.star-rating {
  display: flex;
  align-items: center;

  .star {
    width: 25px;
    height: 25px;
    margin-right: 4px;
  }

  .score {
    margin-left: 8px;
    color: #444;

    .count {
      margin-left: 4px;
      color: #777;
      font-size: 0.9em;
    }
  }

  .no-score {
    color: #999;
    font-style: italic;
  }
}
</style>
