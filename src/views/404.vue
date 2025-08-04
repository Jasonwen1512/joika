<script setup>
import InteractiveSun from "./InteractiveSun.vue";
</script>

<template>
    <div class="page404">
        <!-- 背景層 -->
        <div class="bg">
            <p class="bgtxt">OOPS!</p>
        </div>

        <!-- 主要內容區 -->
        <main>
            <!-- 左側 404 文字 -->
            <div class="text">
                <p>404</p>
                <p>Page</p>
                <p>Not</p>
                <p>Found</p>
            </div>

            <!-- 右側太陽與對話框 -->
            <div class="sun-item">
                <div class="box">
                    <!-- 
            對話框的背景圖。這通常會是一個 SVG 或 PNG。
            同樣，請替換成您的實際圖片路徑。
          -->

                    <div class="speech-bubble">
                        <p>
                            The page you requested does not exist or has been
                            moved.<br />
                            回到首頁，看看其他內容吧
                        </p>
                        <!-- 您的 Logo -->
                        <img
                            src="/path/to/your-logo.png"
                            class="logo"
                            alt="logo"
                        />
                    </div>
                </div>
                <div class="sun">
                    <!-- 
            這裡是整合的關鍵！
            我們直接使用之前做好的 InteractiveSun 元件。
          -->
                    <InteractiveSun />
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* 
  使用 'scoped' 是一個好習慣，
  它可以確保這裡的 CSS 只會應用於這個元件，不會影響到專案的其他部分。
*/
* {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box; /* 建議加上，可以避免 padding 和 border 影響寬高計算 */
}

.page404 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw; /* 確保容器佔滿整個視窗 */
    position: relative;
    overflow: hidden; /* 避免巨大文字造成滾動條 */
    font-family: Arial, Helvetica, sans-serif; /* 建議指定一個字體 */
}

.bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1200px;
    background-image: url("@/assets/img/support/bg.svg");
    background-size: cover;
    background-position: center;
    z-index: -1;
    pointer-events: none;
}

.bgtxt {
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40vw;
    font-weight: bold;
    width: 100%;
    color: rgba(250, 235, 215, 0.5);
    z-index: -1;
    pointer-events: none;
}

main {
    margin: auto;
    width: 90%;
    max-width: 1200px;
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;
    gap: 20px;
}

.text {
    display: flex;
    flex-direction: column;
    line-height: 0.8;
}

.text p {
    font-size: clamp(60px, 12vw, 147px); /* RWD 字體大小，最小60px，最大147px */
    font-weight: bold;
}

.text p:nth-child(1) {
    color: #c7c7c7;
}
.text p:nth-child(2) {
    color: #f75a5a;
}
.text p:nth-child(3) {
    color: #fada7a;
}
.text p:nth-child(4) {
    color: #81bfda;
}

.sun-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.box {
    position: relative;
    width: 350px; /* 給予一個參考寬度 */
    padding: 30px;
    text-align: center;
}

.speech-bubble-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.speech-bubble {
    background: #fff;
    border: 2px solid #000;
    border-radius: 20px;
    padding: 15px 20px;
    margin-right: -20px; /* 讓泡泡和太陽稍微重疊 */
    margin-bottom: 80px;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    white-space: nowrap; /* 避免文字換行 */
}

.speech-bubble:after {
    /* 畫出對話框的箭頭 */
    content: "";
    position: absolute;
    bottom: -12px;
    right: 40px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-right: 2px solid #000;
    border-bottom: 2px solid #000;
    transform: rotate(45deg);
}

.speech-bubble p {
    font-size: 1rem;
    line-height: 1.5;
    color: #4f8da8;
    z-index: 2;
}

.logo {
    width: 100px; /* 範例大小 */
    height: auto;
}

.sun {
    margin-top: -20px; /* 讓太陽和對話框稍微重疊 */
}
</style>
