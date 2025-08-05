<script setup>
import { ref, computed, h, render } from "vue";

import { useRoute, useRouter } from "vue-router";
import { articleList } from "@/assets/data/fake-article";
import Button from "@/components/Button.vue";
import DeleteIcon from "@/assets/img/icon/delete.svg";
import SmEditIcon from "@/assets/img/icon/sm-edit.svg";
import konanImage from "@/assets/img/article/movie_konan.jpg";

import comment from "@/components/article/comment.vue";
//分類顏色
const EventColorMap = {
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
const GetEventColor = (eventName) => {
    return EventColorMap[eventName] || "#adb5bd";
};
const route = useRoute();
const router = useRouter();
const postId = route.params.postid;

const article = articleList.find((item) => item.postid === postId);

function EditArticle() {
    router.push("/article/article-create");
}
</script>

<template>
    <div class="bg"></div>
    <main>
        <!-- ================================== -->
        <!--           文章內容區塊             -->
        <!-- ================================== -->
        <section class="author-information">
            <div
                v-if="article"
                class="avatar"
            >
                <img
                    class="avatar-img"
                    src="/src/assets/img/member/headshot.jpg"
                    alt="Member Headshot"
                />
                <p>{{ article.userid }}</p>
            </div>
            <div class="btn-list">
                <Button
                    @click="EditArticle"
                    :suffixIcon="SmEditIcon"
                    theme="info"
                    size="sm"
                    >編輯</Button
                >
                <Button
                    @click="DeleteCheck"
                    isOutline
                    :suffixIcon="DeleteIcon"
                    theme="secondary"
                    size="sm"
                    >刪除</Button
                >
            </div>
        </section>

        <section class="Content">
            <div
                class="article"
                v-if="article"
            >
                <h3>{{ article.title }}</h3>
                <div class="article-head">
                    <span
                        class="event-label"
                        :style="{ borderColor: GetEventColor(article.event) }"
                        >{{ article.event }}</span
                    >
                    <p>{{ article.date }}</p>
                </div>
                <div class="article-img">
                    <img
                        :src="article.image"
                        alt="文章圖片"
                    />
                </div>
                <p
                    v-html="article.content"
                    alt="內文"
                ></p>
            </div>
            <div v-else>
                <p>找不到這篇文章。</p>
            </div>
        </section>

        <!-- ================================== -->
        <!--           留言系統區塊             -->
        <!-- ================================== -->
        <comment></comment>
    </main>
</template>

<style scoped lang="scss">
body {
    position: relative;
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

main {
    max-width: 1200px;
    margin: 10px auto;
    padding: 20px;
}

.author-information {
    display: flex;
    justify-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: flex-end;
    justify-content: space-between;
    align-items: center;
}

.avatar {
    display: flex;
    gap: 10px;
    align-items: center;
}

.avatar-img,
.comment-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
}
.btn-list {
    display: flex;
    gap: 10px;
}

.article {
    max-width: 1200px;
    margin: 10px auto;

    display: flex;
    flex-direction: column;
    gap: 10px;
}
.article-head {
    display: flex;
    align-items: center;
    padding-block: 5px;
}
.event-label {
    text-align: center;
    padding: 5px;
    margin: 5px;
    border: solid 3px;
    border-radius: 6px;
    width: 80px;
}
.article-img img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
}

.Content {
    margin-bottom: 15vh;
}
.comment-content {
    display: grid;
    gap: 20px;
    margin-block: 30px;
}
.comment-header {
    gap: 10px;
    display: flex;
    align-items: center;
    padding-block: 10px;
}
.timestamp {
    display: block;
    text-align: right;
}
.comment-actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: nowrap;
    gap: 10px;
}

.pagination {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-block: 5vh;
}
.page {
    border: #4f8da8 2px solid;
    border-radius: 6px;
    padding: 5px 10px;
    background: #ffffff;
    cursor: pointer;
    color: #4f8da8;

    &.active {
        background: #81bfda;
        color: #000;
    }
}
.my-comment {
    background-color: #fff;
    width: 100%;
    padding: 8px 12px;
    border-radius: 3px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border: black 1.5px solid;
    @include desktop() {
        border-radius: 6px;
    }
}
main {
    margin-block: 5vh;
}
.comment-input {
    width: 100%;
}
.send-button {
    display: flex;
    text-align: right;
    align-items: center;
}
.action-icon img {
    width: 100%;
}
.like {
    color: #ff8c86;
    display: flex;
    align-items: center;
    gap: 5px;
}
.action-icon.animate img {
    animation: pop 0.3s ease;
}
.send-button.animate {
    animation: pop 0.3s ease;
}
@keyframes pop {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.4);
    }
    100% {
        transform: scale(1);
    }
}
</style>
<style lang="scss">
//刪除燈箱的按鈕
//取消
.my-swal-cancel-button {
    margin-inline: 10px;
    font-size: 16px;
    min-width: 86px;
    min-height: 38px;
    padding: 0 10px;
    border-radius: 6px;
    color: #4f8da8; /* outline-color */
    background-color: #ffffff; /* outline-background-color */
    border: 1px solid #4f8da8; /* outline-border-color */

    /* === Hover 狀態 === */
    &:hover {
        color: #81bfda; /* outline-hover-color */
        background-color: #edf8ff; /* outline-hover-background-color */
        border-color: #81bfda; /* outline-hover-border-color */
    }

    /* === Active 狀態 === */
    &:active {
        color: #4f8da8; /* outline-active-color */
        background-color: #edf8ff; /* outline-active-background-color */
        border-color: #4f8da8; /* outline-active-border-color */
    }

    /* === Disabled 狀態 === */
    &:disabled {
        color: #d0d0d0; /* outline-disabled-color */
        background-color: #ffffff; /* outline-disabled-background-color */
        border-color: #d0d0d0; /* outline-disabled-border-color */
        cursor: not-allowed;
        opacity: 0.6;
    }
}
//確認
.my-swal-confirm-button,
.my-swal-check-button {
    margin-inline: 10px;

    font-size: 16px;
    min-width: 86px;
    min-height: 38px;
    padding: 0 10px;
    border-radius: 6px;
    color: #000;
    background-color: #fada7a;
    border: 1px solid #000;

    &:hover {
        color: #000;
        background-color: #f9ff4d;
    }

    &:active {
        color: #fff;
        background-color: #fdc520;
    }

    &:disabled {
        color: #fff;
        background-color: #d0d0d0;
        cursor: not-allowed;
        opacity: 0.6;
    }
}
</style>
