<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import girlImg from "@/assets/img/group/group-create/positive-behavior.png";
import boyImg from "@/assets/img/group/group-create/negative-behavior.png";
const preArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13" fill="currentColor">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.29277 5.65703L5.94977 2.67029e-05L7.36377 1.41403L2.41377 6.36403L7.36377 11.314L5.94977 12.728L0.29277 7.07103C0.105299 6.8835 -1.66893e-05 6.62919 -1.66893e-05 6.36403C-1.66893e-05 6.09886 0.105299 5.84455 0.29277 5.65703Z" fill="currentColor"/>
</svg>`;
const nextArrow = ` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="13"
    viewBox="0 0 8 13"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.071 7.071L1.414 12.728L0 11.314L4.95 6.364L0 1.414L1.414 0L7.071 5.657C7.25847 5.84453 7.36379 6.09884 7.36379 6.364C7.36379 6.62916 7.25847 6.88347 7.071 7.071Z"
      fill="currentColor"
    />
  </svg>`;

const emit = defineEmits(['closed'])
let currentPage = 1;
const totalPage = 2;
const mobileContent = () => {
  return currentPage === 1
    ? `<h4>超推的行為</h4>
    <p>資訊清楚講明白：</p>
<p>時間、地點、費用、活動內容交代完整，大家準時到、不踩雷。</p>
<p>互相尊重很可以：</p>
<p>聊天不打擾，拍照會詢問，開團像開趴，一起創造舒服的氣氛。</p>
<p>安全意識有在懂：</p>
<p>不管是爬山還是聚餐，該注意的安全細節都有在顧，讓彼此都安心。</p>
<p>主揪認真回覆讚讚：</p>
<p>有問有答、行前有提醒，參加者都感受到你的用心！</p>
<p>誠實收費＆不亂賺：</p>
<p>攤費該多少就多少，不灌水、不偷偷加價，這樣最乾淨俐落。</p>
<p>活動後互動可愛：</p>
<p>拍照分享、留言推團、認真留評價，大家一起讓社群更活躍！</p> </div>`
    : `<div class"negative-content"><h4>我們不歡迎的行為</h4>
    <p>資訊模糊亂帶人：</p>
<p>說是輕鬆飯局結果變推銷、說是郊遊結果變苦行，會被檢舉喔。</p>
<p>硬推產品或廣告：</p>
<p>聚會是交朋友不是擺攤，請不要私訊賣東西／拉人／打直銷。</p>
<p>收費不透明亂收錢：</p>
<p>沒說清楚就多收、有額外費用不講，這種超容易掉粉。</p>
<p>歧視言論與騷擾行為：</p>
<p>種族性別外貌宗教...請保持尊重，開黃腔或亂摸都是零容忍。</p>
<p>臨時放鳥還不講：</p>
<p>活動前臨時消失、不讀不回、主揪找不到人，會被列黑名單。</p>
<p>假開團真交友（或釣魚）：</p>
<p>請真心想揪，不要把平台當約炮或打廣告用。 </p></div>`;
};

const desktopContent = () => {
  return `
<div class="positive-behavior-border">
    <div class="positive-behavior">
       
      <div class="positive-img"><img src="${girlImg}" alt="girl"></div>
      <div class="positive-content">
        <h4>超推的行為</h4>
    <p>資訊清楚講明白：</p>
<p>時間、地點、費用、活動內容交代完整，大家準時到、不踩雷。</p>
<p>互相尊重很可以：</p>
<p>聊天不打擾，拍照會詢問，開團像開趴，一起創造舒服的氣氛。</p>
<p>安全意識有在懂：</p>
<p>不管是爬山還是聚餐，該注意的安全細節都有在顧，讓彼此都安心。</p>
<p>主揪認真回覆讚讚：</p>
<p>有問有答、行前有提醒，參加者都感受到你的用心！</p>
<p>誠實收費＆不亂賺：</p>
<p>攤費該多少就多少，不灌水、不偷偷加價，這樣最乾淨俐落。</p>
<p>活動後互動可愛：</p>
<p>拍照分享、留言推團、認真留評價，大家一起讓社群更活躍！</p> 
</div>
</div>
</div>
<div class="negative-behavior-border">
<div class="negative-behavior">
  <div class="negative-img"><img src="${boyImg}" alt="girl"></div>

 <div class="negative-content">
<h4>我們不歡迎的行為</h4>
    <p>資訊模糊亂帶人：</p>
<p>說是輕鬆飯局結果變推銷、說是郊遊結果變苦行，會被檢舉喔。</p>
<p>硬推產品或廣告：</p>
<p>聚會是交朋友不是擺攤，請不要私訊賣東西／拉人／打直銷。</p>
<p>收費不透明亂收錢：</p>
<p>沒說清楚就多收、有額外費用不講，這種超容易掉粉。</p>
<p>歧視言論與騷擾行為：</p>
<p>種族性別外貌宗教...請保持尊重，開黃腔或亂摸都是零容忍。</p>
<p>臨時放鳥還不講：</p>
<p>活動前臨時消失、不讀不回、主揪找不到人，會被列黑名單。</p>
<p>假開團真交友（或釣魚）：</p>
<p>請真心想揪，不要把平台當約炮或打廣告用。 </p></div></div></div>`;
};

const showPopup = () => {
  const isMobile = window.innerWidth < 769;
  Swal.fire({
    html: isMobile
      ? `<div class="group-form-popup-content ">${mobileContent()}</div>
    `
      : desktopContent(),
    footer: isMobile
      ? `<div class="group-form-popup-pagination"><button class="group-form-pre-btn" ${
          currentPage === 1 ? "disabled" : ""
        }>    ${preArrow}
    </button>
        <span>${currentPage} / ${totalPage}</span>
        <button class="group-form-next-btn" ${
          currentPage === totalPage ? "disabled" : ""
        }> ${nextArrow}</button>
      </div>`
      : "",
    showCloseButton: true,
    showConfirmButton: false,
    allowOutsideClick: isMobile ? false : true,
    allowEscapeKey: isMobile ? false : true,
    allowEnterKey: isMobile ? false : true,
    customClass: {
      popup: "group-form-custom-popup",
      htmlContainer: isMobile
        ? `group-form-create-popup ${currentPage === 1 ? "page-1" : "page-2"}`
        : "group-form-create-popup desktop",
      closeButton: "group-form-close-btn",
    },
    didOpen: () => {
      if (isMobile) {
        const preBtn = document.querySelector(".group-form-pre-btn");
        const nextBtn = document.querySelector(".group-form-next-btn");

        preBtn.addEventListener("click", () => {
          if (currentPage > 1) {
            currentPage--;
            Swal.close();
            showPopup();
          }
        });

        nextBtn.addEventListener("click", () => {
          if (currentPage < totalPage) {
            currentPage++;
            Swal.close();
            showPopup();
          }
        });
      }
    },
 
  });
};


const onResize = () => {
  Swal.close()
}



onMounted(() => {
  showPopup()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div></div>
</template>

<style lang="scss">
.group-form-custom-popup.swal2-popup {
  position: relative;
  border: 1px solid $black;
  border-radius: 3px;
  padding-top: 10px;
  max-height: 1150px;
  overflow: hidden;

  @include desktop() {
    //1024以上
    width: 900px;
    max-height: 1200px;
  }
  @media screen and (min-width: 1023px) and (max-width: 1199px) {
    //1023-1199
    width: 800px;
    max-height: 1200px;
  }

  .group-form-close-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    margin: 5px;
  }
}
.group-form-create-popup {
  margin: 20px 15px 20px 15px;
  padding: 20px 15px 30px 15px;
  text-align: left;
  overflow: hidden;
  border-radius: 3px;

  h4 {
    padding: 10px 0;
  }
}
.group-form-create-popup.page-1 {
  background-color: $color-highlight;
}
.group-form-create-popup.page-2 {
  background-color: $blue;

  color: $white;
}

.group-form-popup-pagination {
  @include flex-center;
  button {
    padding: 4px;
    &:disabled {
      svg {
        color: $gray-disabled;
      }
    }
  }
  span {
    transform: translateY(-2px);
  }
}

.positive-behavior-border {
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 66%, 0% 100%);
  background: #000; // 邊框顏色
  padding: 1px; // 邊框寬度
}
.positive-behavior {
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  background-color: $color-highlight;
  min-height: 650px;
  clip-path: polygon(0 0, 100% 0, 100% 66%, 0% 100%);
}
.negative-behavior-border {
  position: relative;
  clip-path: polygon(0 34%, 100% 0, 100% 100%, 0% 100%);
  background: #000;
  transform: translateY(-200px);
  padding: 1px;
}
.negative-behavior {
  display: flex;
  min-height: 650px;
  clip-path: polygon(0 34%, 100% 0, 100% 100%, 0% 100%);
  background-color: $blue;
}
.positive-content {
  padding: 30px 10px 10px 20px;

  h4 {
    font-size: $font-size-h2;
  }
  p:nth-child(even) {
    font-size: 20px;
  }
}
.positive-img {
  max-width: 250px;
  padding: 10px 10px 50px 10px;
  transform: translateY(80px);

  img {
    width: 100%;
    overflow: hidden;
  }
}
.negative-img {
  max-width: 250px;
  padding: 50px 10px 10px 10px;
  transform: translateY(280px);
  img {
    width: 100%;
  }
}

.negative-content {
  padding: 180px 10px 10px 20px;
  color: $white;
  h4 {
    padding-bottom: 20px;
    font-size: $font-size-h2;
  }
  p:nth-child(even) {
    font-size: 20px;
  }
}


</style>
