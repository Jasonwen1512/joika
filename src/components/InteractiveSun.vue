<template>
    <div class="sun-wrapper">
        <!-- 
      我們在主要的 SVG 元素上加上 @click 事件。
      這樣使用者點擊太陽的任何部位，都能觸發表情變換。
      同時加上 cursor: pointer 的樣式，提示使用者這裡是可點擊的。
    -->
        <svg
            width="255"
            height="255"
            viewBox="0 0 255 255"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="cycleEmotion"
            style="cursor: pointer"
        >
            <!-- 旋轉的陽光 -->
            <path
                id="sunshine"
                d="M126.741 1.8839C127.14 1.41904 127.86 1.41904 128.259 1.8839L152.887 30.5737C153.156 30.8865 153.588 31.0024 153.977 30.8658L189.651 18.3339C190.229 18.1308 190.852 18.4905 190.965 19.0927L197.949 56.2529C198.025 56.658 198.342 56.9749 198.747 57.051L235.907 64.0348C236.509 64.148 236.869 64.7711 236.666 65.3491L224.134 101.023C223.998 101.412 224.114 101.844 224.426 102.113L253.116 126.741C253.581 127.14 253.581 127.86 253.116 128.259L224.426 152.887C224.114 153.156 223.998 153.588 224.134 153.977L236.666 189.651C236.869 190.229 236.509 190.852 235.907 190.965L198.747 197.949C198.342 198.025 198.025 198.342 197.949 198.747L190.965 235.907C190.852 236.509 190.229 236.869 189.651 236.666L153.977 224.134C153.588 223.998 153.156 224.114 152.887 224.426L128.259 253.116C127.86 253.581 127.14 253.581 126.741 253.116L102.113 224.426C101.844 224.114 101.412 223.998 101.023 224.134L65.3491 236.666C64.7711 236.869 64.148 236.509 64.0348 235.907L57.051 198.747C56.9749 198.342 56.658 198.025 56.2529 197.949L19.0927 190.965C18.4905 190.852 18.1308 190.229 18.3339 189.651L30.8658 153.977C31.0024 153.588 30.8865 153.156 30.5737 152.887L1.8839 128.259C1.41904 127.86 1.41904 127.14 1.8839 126.741L30.5737 102.113C30.8865 101.844 31.0024 101.412 30.8658 101.023L18.3339 65.3491C18.1308 64.7711 18.4905 64.148 19.0927 64.0348L56.2529 57.051C56.658 56.9749 56.9749 56.658 57.051 56.2529L64.0348 19.0927C64.148 18.4905 64.7711 18.1308 65.3491 18.3339L101.023 30.8658C101.412 31.0024 101.844 30.8865 102.113 30.5737L126.741 1.8839Z"
                fill="#FF6655"
                stroke="black"
                stroke-width="3"
                stroke-linejoin="round"
            />
            <!-- 太陽的臉 -->
            <circle
                ref="sunFace"
                cx="128"
                cy="128"
                r="91"
                fill="#FADA7A"
            />

            <!-- 表情容器，用 :style 來做眼球追蹤 -->
            <!-- 這裡的 v-if / v-else-if 邏輯完全不需要改變 -->
            <g
                id="facial-expression"
                :style="facialExpressionStyle"
            >
                <!-- 正常 / 開心 -->
                <g v-if="emotion === 'normal'">
                    <circle
                        cx="90"
                        cy="118"
                        r="10"
                        fill="black"
                    />
                    <circle
                        cx="160"
                        cy="118"
                        r="10"
                        fill="black"
                    />
                    <path
                        d="M103 159C104.961 163.667 112.632 173 127.632 173C142.632 173 150.794 163.667 153 159"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                </g>

                <!-- 眨眼 -->
                <g v-else-if="emotion === 'wink'">
                    <path
                        d="M80 119L99.5 129L80 136.5"
                        stroke="black"
                        stroke-width="5"
                        stroke-linecap="round"
                    />
                    <path
                        d="M175.5 118L156 128L175.5 135.5"
                        stroke="black"
                        stroke-width="5"
                        stroke-linecap="round"
                    />
                    <path
                        d="M103 159C104.961 163.667 112.632 173 127.632 173C142.632 173 150.794 163.667 153 159"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                </g>

                <!-- 嘟嘴 -->
                <g v-else-if="emotion === 'pout'">
                    <path
                        d="M110.911 150C108.248 152.667 111.636 158 118.294 158C124.952 158 126.446 154.741 128 152.667"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                    <path
                        d="M145.089 150C147.752 152.667 144.364 158 137.706 158C131.048 158 129.554 154.741 128 152.667"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                    <path
                        d="M115.878 158C115.184 163.547 123.643 167.986 127.942 166.045"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                    <path
                        d="M112 86.1718C101.5 77.6718 88.4713 82.3182 83 98.6719"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                    <path
                        d="M143 88.5C153.5 79.9999 166.529 84.6463 172 101"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                    <circle
                        cx="97"
                        cy="129"
                        r="10"
                        fill="black"
                    />
                    <circle
                        cx="160"
                        cy="129"
                        r="10"
                        fill="black"
                    />
                </g>

                <!-- 難過 -->
                <g v-else-if="emotion === 'sad'">
                    <path
                        d="M92 118C89.7647 119.5 84.2353 122.8 80 124"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                    <path
                        d="M163 118C165.235 119.5 170.765 122.8 175 124"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                    <circle
                        cx="90"
                        cy="139"
                        r="10"
                        fill="black"
                    />
                    <circle
                        cx="160"
                        cy="139"
                        r="10"
                        fill="black"
                    />
                    <path
                        d="M164.913 152C163.913 155 162.213 161.2 163.413 162C164.913 163 166.913 166.5 169.913 163.5C172.313 161.1 170.913 156.833 169.913 155"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M103 179C104.961 174.333 112.632 165 127.632 165C142.632 165 150.794 174.333 153 179"
                        stroke="black"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                </g>

                <!-- 大哭 -->
                <g v-else-if="emotion === 'crying'">
                    <path
                        d="M105.5 74C103 75.3333 96.5 78.2 90.5 79"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M95.5 90C101.1 90.4 102.833 92.8334 103 94C98.5 95.5 97.5 94 92.5 94C87.5 94 77.5 96.5 78 96C78.5 95.5 88.5 89.5 95.5 90Z"
                        fill="black"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M73 100.5C73 103 74.1 107.7 78.5 106.5C82.9 105.3 83.3333 111.333 83 114.5C82.5 119 82.6 127.8 87 127C92.5 126 90.5 112.5 91.5 110C92.5 107.5 94.5 105 96 104.5C97.2 104.1 98.1667 101 98.5 99.5"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M82.4999 133.5C81.8332 135.833 81.2999 140.7 84.4999 141.5C87.6999 142.3 89.4999 138.167 89.9999 136"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M160.667 79.5C162.667 80.4333 168.067 82.54 173.667 83.5"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M174.218 96.0426C170.643 94.4628 162.467 94.3969 158.825 94.5615C155.846 96.0426 159.322 97.5238 161.308 97.0301C163.294 96.5364 167.763 99.0049 170.246 99.9924C172.729 100.98 181.667 104.93 181.667 102.955C181.667 100.98 178.687 98.0175 174.218 96.0426Z"
                        fill="black"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M167.667 102.5C167.667 104.345 168.267 108.496 170.667 110.34C173.667 112.646 174.167 114.03 174.167 117.719C174.167 121.409 174.667 129.71 176.667 130.172C178.667 130.633 183.167 131.555 182.667 125.099C182.267 119.933 182.5 116.49 182.667 115.413C183.333 114.184 184.667 111.263 184.667 109.418"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M130.048 120.09C131.627 119.766 132.945 120.374 133.966 121.123...Z"
                        fill="black"
                    />
                </g>
            </g>
        </svg>
        <p>點擊太陽來看看不同的表情！</p>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";

// --- 狀態管理 ---
// 建立一個包含所有表情的陣列，方便循環
const emotionCycle = ["normal", "wink", "pout", "sad", "crying"];
// 用一個 ref 來追蹤當前表情在陣列中的索引
const currentEmotionIndex = ref(0);
// 使用 computed 屬性，根據索引自動得到當前的表情字串
const emotion = computed(() => emotionCycle[currentEmotionIndex.value]);

const sunFace = ref(null);
let animationFrameId = null;

// --- 眼球追蹤邏輯 (這部分完全不變) ---
const mouseTarget = reactive({ x: 0, y: 0 });
const mouseCurrent = reactive({ x: 0, y: 0 });

const facialExpressionStyle = computed(() => {
    return {
        transform: `translate(${mouseCurrent.x}px, ${mouseCurrent.y}px)`,
    };
});

const handleMouseMove = (e) => {
    if (!sunFace.value) return;
    const rect = sunFace.value.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angle = Math.atan2(dy, dx);
    const r = 10;
    mouseTarget.x = Math.cos(angle) * r;
    mouseTarget.y = Math.sin(angle) * r;
};

const animate = () => {
    const ease = 0.1;
    mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * ease;
    mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * ease;
    animationFrameId = requestAnimationFrame(animate);
};

// --- 新的點擊事件處理函式 ---
const cycleEmotion = () => {
    // 將索引值 +1
    const nextIndex = currentEmotionIndex.value + 1;
    // 如果索引超出了陣列範圍，就回到開頭 (0)，否則就使用新的索引
    // 使用 % (模數) 運算子可以更簡潔地完成循環
    currentEmotionIndex.value = nextIndex % emotionCycle.length;
};

// --- 生命週期 (這部分完全不變) ---
onMounted(() => {
    document.addEventListener("mousemove", handleMouseMove);
    animate();
});

onUnmounted(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
</script>

<style scoped>
.sun-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

#sunshine {
    animation: rotateSun 8s linear infinite;
    transform-origin: center center;
}

@keyframes rotateSun {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

p {
    font-size: 1.2rem;
    color: #555;
    font-weight: bold;
}
</style>
