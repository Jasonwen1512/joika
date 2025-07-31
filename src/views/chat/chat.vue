<script setup>
import Button from "@/components/Button.vue";

</script>

<template>
  <section class="chat">
    <div class="floating">
      <img src="/src/assets/img/index-img/float.png" alt="浮動圖" />
    </div>
    
    <div class="chat-section">
      <div class="message-other-user">

        <div class="chat-user-info">
          <div class="chat-user-pic">
            <img src="/src/assets/img/chat/user-image1.jpg" alt="使用者大頭貼"></img>
          </div>
          <span>筠筠</span>
        </div>

        <div class="other-user-message">
          <div class="chat-message-other" data-user="user1">
            <span class="message-text">傻眼...昨天被阿瑄的團放鳥!!我一定要檢舉他</span>
          </div>
        </div>

      </div> 
      <div class="message-other-user">

        <div class="chat-user-info">
          <div class="chat-user-pic">
            <img src="/src/assets/img/chat/user-image2.jpg" alt="使用者大頭貼"></img>
          </div>
          <span>wenwen</span>
        </div>

        <div class="other-user-message">
          <div class="chat-message-other" data-user="user2">
            <span class="message-text">真假?!可是我上次跟阿瑄出去覺得他人還不錯？我幫你問問他？</span>
          </div>
        </div>

      </div> 
      <div class="message-other-user">

        <div class="chat-user-info">
          <div class="chat-user-pic">
            <img src="/src/assets/img/chat/user-image3.jpg" alt="使用者大頭貼"></img>
          </div>
          <span>ZZ_zhen</span>
        </div>

        <div class="chat-card-message">
          <div class="chat-card-message-content" data-user="user3">
            <span class="chat-card-message-text">推好團～中壢酒精路跑還差3人快來加入</span>
          </div>
          <div>
            <img src="/src/assets/img/index-img/second-section-img.png" alt="">
            <Button size="sm" theme="primary">我要跟團</Button>
          </div>
          
        </div>

      </div> 

      <div class="message-me">
        <div class="chat-user-info">
          <div class="chat-user-pic">
            <img src="/src/assets/img/chat/user-image4.jpg" alt="使用者大頭貼"></img>
          </div>
          <span>Josh</span>
        </div>

        <div class="my-message">
          <div class="chat-message-me" data-user="user4">
            <span class="message-text">奶茶路跑可以嗎？</span>
          </div>
        </div>

      </div>

    </div>

    <div class="megaphone-box">
      <img src="/src/assets/img/chat/megaphone-man.png" alt="擴音器人物圖" class="person">
      <img src="/src/assets/img/chat/megaphone-line.png" alt="擴音器線條圖" class="lines">
    </div>

    <div class="chat-now">
      <input class="caht-box" type="text" placeholder="說點什麼吧">
      <button>
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
    bottom: 10vh;
    left: -3vh;
    z-index: 0;
  }

  .lines {
    position: absolute;
    left: 14vh;
    bottom: 26vh;
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
    flex-direction: column
  }
  .message-other-user{
    display: flex;
    flex-direction: column;
    max-width: 80%;
    gap: 20px;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    z-index: 2;
  }
  .chat-user-info{
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .chat-user-pic{
    width: 50px;
    height:50px ;
    border: 2px solid black;
    border-radius: 50%;
    overflow: hidden;
    img{
      width: 100%;
    }
  }
  .chat-message-other{
    border: 2px solid black;
    background-color: #fff;
    padding: 5px;
    border-radius: 3px;
    word-wrap: break-word;
  }
  .other-user-message{
    display: flex;
  }
  .chat-card-message{
    position: relative;
    border: 2px solid black;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center;
    background-image: url('/src/assets/img/chat/chat-card-bg.png');
    img{
      width: 80px;
      position: absolute;
      top:-40px;
      right: 0;
    }
  }
  .chat-card-message-content{
    width: 100%;
    text-align: left;
    margin-bottom: 10px; 
  }
  .chat-card-message-text{
    display: inline-block;
    width: 20ch; 
    word-break: break-all;
  }
//chat-other-end

//chat-me-start
  .message-me {
  display: flex;
  flex-direction: column;
  margin: 30px 30px 0 auto;
  max-width: 80%;
  gap: 8px;
  position: relative; 
  }

  .my-message {
    background-color: $color-highlight;
    border: 2px solid black;
    padding: 10px;
  }
  //chat-me-end
  .chat-now{
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    position: absolute;
    z-index: 2;
    bottom: 0;
    border: 2px solid black;
    padding: 10px;
    margin: 20px;
    width: 80%;
  }
  .send-icon{
    color: black;
  }
  @include desktop {
    .chat-section {
      display: flex;
      flex-direction: column;
      gap: 15px; 
      padding: 0 80px; 
      margin: auto;
    }

    .message-other-user {
      align-self: flex-start;
      max-width: 70%; 
    }

    .message-me {
      align-self: flex-end;
      max-width: 70%;
    }
    .floating img{
      width: 200px;
    }
    .person{
      width: 200px;
    }
    .lines {
      width: 50px;
      left: 22vh;
      bottom: 33vh;
    }
  }
  .chat-now{
    display: flex;
    width: 60%;
  }
</style>
