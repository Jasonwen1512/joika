<script setup>
import { ref } from 'vue'
import Button from "@/components/Button.vue";

const showOptions = ref(false)

function toggleOptions() {
  showOptions.value = !showOptions.value
}

function copyMessage(e){
  const messageText = e.target.closest('.chat-message').querySelector('.bubble')?.innerText;

  if(messageText){
    navigator.clipboard.writeText(messageText)
    .then(() => {
    console.log("複製成功");
    })
    .catch(err => {
    console.error("複製失敗", err);
    });
  }
}
</script>

<template>
  <section class="chat">
    <div class="floating">
      <img src="/src/assets/img/index-img/float.png" alt="浮動圖" />
    </div>
  <!-- 聊天訊息區塊 -->
    <div class="chat-section">
    <!-- 其他人的訊息 -->
      <div class="chat-message other">
        <div class="avatar-section">
          <div class="avatar">
            <img src="/src/assets/img/chat/user-image1.jpg" alt="使用者大頭貼"> 
          </div>
            <span class="name">筠筠</span>
        </div>

        <div class="chat-content-section">
          <div class="chat-content">
            <p class="bubble">傻眼...昨天被阿瑄的團放鳥!!我一定要檢舉他</p>
          </div>
          <div class="more-options">
            <button class="more-btn" @click="toggleOptions">
              <svg width="29" height="7" viewBox="0 0 29 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25.5" cy="3.5" r="3" fill="#FADA7A" stroke="black"/>
              <circle cx="14.5" cy="3.5" r="3" fill="#FADA7A" stroke="black"/>
              <circle cx="3.5" cy="3.5" r="3" fill="#FADA7A" stroke="black"/>
              </svg>
            </button>

            <ul class="options-menu" :class="{ on: showOptions }">
              <li><button @click="copyMessage">複製</button></li>
              <li><button>檢舉</button></li>
            </ul>
          </div>  
        </div>
      </div>

      <div class="chat-message other">
        <div class="avatar-section">
          <div class="avatar">
            <img src="/src/assets/img/chat/user-image2.jpg" alt="使用者大頭貼">
          </div>
          <span class="name">wenwen</span>
        </div>

        <div class="chat-content">
          <p class="bubble">真假?!可是我上次跟阿瑄出去覺得他人還不錯？我幫你問問他？</p>
        </div>
      </div>
    <!-- 推薦卡片訊息 -->
      <div class="chat-message other">
          <div class="avatar-section">
            <div class="avatar">
              <img src="/src/assets/img/chat/user-image3.jpg" alt="使用者大頭貼">
            </div>
            <span class="name">ZZ_zhen</span>
          </div>

          <div class="chat-recommend-card">
            <div class="chat-card">
              <div class="chat-card-content">
                <span>推好團～中壢酒精路跑還差3人快來加入</span>
              </div>
              <div class="chat-card-img">
                <img src="/src/assets/img/index-img/second-section-img.png" alt="聊天是活動推薦卡片裝飾圖">
              </div>
            </div>
            <Button size="md" theme="primary">我要跟團</Button>
          </div>
        </div>

    <!-- 自己訊息 -->
      <div class="chat-message me">
        <div class="avatar-section">
          <div class="avatar">
            <img src="/src/assets/img/chat/user-image4.jpg" alt="使用者大頭貼">
          </div>
          <span class="name">Josh</span>
        </div>
        <div class="my-chat-content">
          <p class="bubble my">奶茶路跑可以嗎？</p>
        </div>
      </div>

    </div>

    <div class="megaphone-box">
      <img src="/src/assets/img/chat/megaphone-man.png" alt="擴音器人物圖" class="person">
      <img src="/src/assets/img/chat/megaphone-line.png" alt="擴音器線條圖" class="lines">
    </div>

  <!-- 輸入框 -->
  <div class="chat-key-in-section">
      <div class="chat-now">
        <input class="chat-box" type="text" placeholder="說點什麼吧">
        <button class="send-btn-mobile">
          <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1566_5695)">
          <path d="M9.59021 17.4098L24 3L9.59021 17.4098ZM24 3L15.4851 26.5797C15.4276 26.7051 15.3354 26.8114 15.2193 26.8859C15.1032 26.9604 14.9681 27 14.8301 27C14.6922 27 14.5571 26.9604 14.441 26.8859C14.3249 26.8114 14.2326 26.7051 14.1751 26.5797L9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3Z" fill="#F5F0CD"/>
          <path d="M9.59021 17.4098L24 3M9.59021 17.4098L14.1751 26.5797C14.2326 26.7051 14.3249 26.8114 14.441 26.8859C14.5571 26.9604 14.6922 27 14.8301 27C14.9681 27 15.1032 26.9604 15.2193 26.8859C15.3354 26.8114 15.4276 26.7051 15.4851 26.5797L24 3M9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
          <clipPath id="clip0_1566_5695">
          <rect width="29" height="30" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        </button>
      </div>
      <div class="chat-now-btns">
        <button>
          <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5 34.5312C27.8015 34.5312 34.5312 27.8015 34.5312 19.5C34.5312 11.1985 27.8015 4.46875 19.5 4.46875C11.1985 4.46875 4.46875 11.1985 4.46875 19.5C4.46875 27.8015 11.1985 34.5312 19.5 34.5312Z" fill="#FADA7A" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14.625 17.4688C15.7468 17.4688 16.6562 16.5593 16.6562 15.4375C16.6562 14.3157 15.7468 13.4062 14.625 13.4062C13.5032 13.4062 12.5938 14.3157 12.5938 15.4375C12.5938 16.5593 13.5032 17.4688 14.625 17.4688Z" fill="black"/>
          <path d="M24.375 17.4688C25.4968 17.4688 26.4062 16.5593 26.4062 15.4375C26.4062 14.3157 25.4968 13.4062 24.375 13.4062C23.2532 13.4062 22.3438 14.3157 22.3438 15.4375C22.3438 16.5593 23.2532 17.4688 24.375 17.4688Z" fill="black"/>
          <path d="M25.1291 23.1562C24.5586 24.1443 23.738 24.9648 22.75 25.5352C21.7619 26.1057 20.641 26.406 19.5001 26.406C18.3592 26.406 17.2383 26.1057 16.2502 25.5352C15.2621 24.9648 14.4416 24.1443 13.8711 23.1562" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button>
          <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.6512 13.7085L15.4291 19.8087C14.8376 20.3937 14.5126 21.1932 14.5256 22.0333C14.5433 22.8832 14.8933 23.6923 15.5006 24.2872C16.1099 24.8901 16.9306 25.2362 17.7804 25.2508C18.1965 25.2596 18.6101 25.185 18.9969 25.0315C19.3837 24.878 19.7358 24.6487 20.0327 24.3571L26.2532 18.2568C26.84 17.6763 27.3028 16.9825 27.6134 16.2177C27.9241 15.4529 28.0761 14.6329 28.0602 13.8076C28.026 12.1077 27.3271 10.4889 26.1134 9.29821C24.8964 8.09385 23.2624 7.40428 21.5504 7.37258C20.7192 7.35599 19.8931 7.50524 19.1202 7.81159C18.3473 8.11795 17.6433 8.57527 17.0492 9.15683L10.8238 15.2587C9.94421 16.13 9.25059 17.1707 8.78496 18.3179C8.31934 19.465 8.09139 20.6947 8.11494 21.9326C8.16726 24.4818 9.21611 26.9091 11.0367 28.6942C12.8613 30.5003 15.3111 31.5349 17.8779 31.5835C19.1252 31.6094 20.3652 31.3863 21.5251 30.927C22.685 30.4677 23.7417 29.7815 24.6331 28.9087L30.8552 22.8052" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="send-btn-desktop">
          <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1566_5695)">
          <path d="M9.59021 17.4098L24 3L9.59021 17.4098ZM24 3L15.4851 26.5797C15.4276 26.7051 15.3354 26.8114 15.2193 26.8859C15.1032 26.9604 14.9681 27 14.8301 27C14.6922 27 14.5571 26.9604 14.441 26.8859C14.3249 26.8114 14.2326 26.7051 14.1751 26.5797L9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3Z" fill="#F5F0CD"/>
          <path d="M9.59021 17.4098L24 3M9.59021 17.4098L14.1751 26.5797C14.2326 26.7051 14.3249 26.8114 14.441 26.8859C14.5571 26.9604 14.6922 27 14.8301 27C14.9681 27 15.1032 26.9604 15.2193 26.8859C15.3354 26.8114 15.4276 26.7051 15.4851 26.5797L24 3M9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
          <clipPath id="clip0_1566_5695">
          <rect width="29" height="30" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/mixin" as *; 
@import "@/assets/scss/_color.scss";

  .chat{
    position: relative;
    background-image: url('/src/assets/img/bg-decorate9.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh; 
  }

//動畫圖設定-start
  .floating img {
    display: block;
    animation: floatXY 5s ease-in-out infinite;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    width: 150px;
    position: absolute;
    right: 30px;
    top:0;
    z-index: 0;
  }

  @keyframes floatXY {
    0% {
      transform: translate(0, 0);
      opacity: 1;
    }
    25% {
      transform: translate(10px, -14px);
      opacity: 0.98;
    }
    50% {
      transform: translate(-10px, -20px);
      opacity: 1;
    }
    75% {
      transform: translate(10px, -12px);
      opacity: 0.99;
    }
    100% {
      transform: translate(0, 0);
      opacity: 1;
    }
  }

  .megaphone-box {
    position: absolute; 
    bottom: 0;
    left: 0;
    z-index: 0;
    }

  .person {
    width: 150px; 
    display: block;
    position: absolute;
    bottom: 12vh;
    left: -3vh;
    z-index: 0;
  }

  .lines {
    position: absolute;
    left: 14vh;
    bottom: 28vh;
    z-index: 0;
    width: 30px;    
    animation: blink 1s infinite;
    transform-origin: left center; 
  }

  @keyframes blink {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1); }
  }
//動畫圖片設定-end

//chat-other-start
  .chat-section{
    display: flex; 
    flex-direction: column;
    min-height: 100vh;
  }
  .chat-message.other{
    display: flex;
    flex-direction: column;
    max-width: 80%;
    width: fit-content;
    gap: 20px;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    z-index: 2;
  }
  .avatar-section{
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .avatar{
    width: 50px;
    height:50px ;
    border: 2px solid black;
    border-radius: 50%;
    overflow: hidden;
    img{
      width: 100%;
    }
  }
  .chat-content-section{
    display: flex;
    gap: 10px;
    button svg{
      display: inline-block;
      vertical-align:baseline;
    }
  }
  .chat-content{
    border: 2px solid black;
    background-color: #fff;
    padding: 10px;
    border-radius: 3px;
    word-wrap: break-word;
  }
  .more-options{
  display: flex;
  align-items: end;
  }
  .options-menu{
    display: none;
  }
  .options-menu.on{
  list-style: none;
  padding: 6px;
  margin: 0;
  position: absolute;
  top: 90%;
  right: -85px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;           
  min-width: 100px;
  z-index: 3;
}
.options-menu li {
  display: block;
}
.options-menu li button {
  display: block;
  width: 100%;
  padding: 5px 10px;
  background: #fff;
  border: 2px solid black;   
  border-radius: 4px;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
}

.chat-recommend-card{
  position: relative;
  border: 2px solid black;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center;
  background-image: url('/src/assets/img/chat/chat-card-bg.png');
  border-radius: 3px;
  width: 120%;
  img{
    width: 80px;
    position: absolute;
    top: -20px;
    right: -20px;
  }
}
.chat-card{
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px; 
  gap: 5px;
}
.chat-card-content{
  display: inline-block;
  width: 15ch; 
  word-break: break-all;
}

//chat-other-end

//chat-me-start
  .chat-message.me {
  display: flex;
  flex-direction: column;
  margin: 30px 30px 0 auto;
  max-width: 80%;
  gap: 8px;
  position: relative; 
  z-index: 2;
  }

  .my-chat-content {
    background-color: $color-highlight;
    border: 2px solid black;
    padding: 10px;
    border-radius: 3px;
  }
  //chat-me-end
  //chat-key-in-start
  .chat-key-in-section{
    position: relative;
    z-index: 1;
    margin: 20px;
    display: flex;
    flex-direction: column;
    order: 1;
    
  }
  .chat-now{
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    min-width: 100%;
    border: 2px solid black;
    padding: 10px;
    margin: auto;
    border-radius: 3px;
    order: 2;
    
  }
  .chat-box{
    width: 80%;     
    padding: 8px 12px;
    font-size: 16px;
  }
  .chat-now-btns {             
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  }
  .chat-now-btns button{
    cursor: pointer;
  }
  .send-btn-desktop{
    display: none;
  }
  .send-btn-mobile{
    display: block;
  }
  @include tablet{
    .person{
      bottom: 13vh;
    }
    .chat-key-in-section{
      margin-bottom: 30px;
    }
  }
  @include desktop {
    .chat-section {
      display: flex;
      flex-direction: column;
      gap: 15px; 
      padding: 0 80px; 
      margin:0 100px ;
    }
    .floating img{
      width: 200px;
    }
    .person{
      width: 180px;
      bottom: 10vh;
    }
    .lines {
      width: 40px;
      left: 19vh;
      bottom: 31vh;
    }
    .chat-recommend-card{
      width: 120%;
      background-size: cover;
    }
    .chat-key-in-section{
      display: flex;
      flex-direction: row;
      margin: auto;
      max-width:100vh;
      margin-bottom: 40px; 
      gap: 10px;
    }
    .chat-now {
      order: 1;              
      flex: 1;                
    }
    .chat-now-btns {
      order: 2;              
      flex-direction: row;
      gap: 10px;
    }
    .send-btn-mobile{
      display: none;
    }
    .send-btn-desktop{
      display: inline-block;
    }
  }

</style>
