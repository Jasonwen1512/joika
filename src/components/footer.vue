<script setup></script>

<template>
  <footer class="footer">
    <div class="company">
      <span>公司資訊</span>
      <div class="company-address">公司地址：桃園市中壢區中山東路5號</div>
      <div class="company-business">營業時間：9:00~17:00</div>
      <div class="company-telephone">聯絡電話：03-976-9760</div>
    </div>
    <div class="norm_and_member-services">
      <div class="member-services">
        <span>會員服務</span>
        <div class="member-services-contents">
          <a href="">會員制度</a>
          <a href="">會員中心</a>
          <a href="">點數中心</a>
        </div>
      </div>
      <div class="norm">
        <span>平台規範</span>
        <div class="norm-contents">
          <a href="">活動發起規範</a>
          <a href="">活動參與規範</a>
          <a href="">平台服務條款</a>
          <a href="">隱私權政策</a>
        </div>
      </div>
    </div>
    <div class="follow-me">
      <span>追蹤我們</span>
      <div class="icons">
        <a href="">
          <img src="@/assets/img/icon/facebook.svg" alt="" />
        </a>
        <a href="">
          <img src="@/assets/img/icon/line.svg" alt="" />
        </a>
        <a href="">
          <img src="@/assets/img/icon/instagram.svg" alt="" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 10px 10px 10px 10px;
  margin-bottom: 0;
  justify-content: center;
  background-color: $footer-bgc;
  color: $footer-text-color;
  // 四大區塊title字的大小
  span {
    font-size: 24px;
  }
  @include desktop() {
    flex-direction: row;
    gap: 10vw;
  }
}
.norm_and_member-services {
  display: flex;
  gap: 50px;
  @include desktop() {
    gap: 10vw;
  }
}
.company,
.member-services,
.member-services-contents,
.norm,
.norm-contents {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 20px;
  a {
    color: inherit;
  }
}
.member-services-contents,
.norm-contents {
  display: flex;
  flex-direction: column;
}
.follow-me .icons {
  margin-top: 20px;
}
</style>
