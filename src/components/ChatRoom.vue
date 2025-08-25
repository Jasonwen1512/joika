<script setup>
import { ref, onMounted } from 'vue' 
import axios from 'axios' 
import { useChat } from '@/composables/useChat' 
import Swal from 'sweetalert2'
import defaultAvatar from '@/assets/img/chat/avatar-default.jpg'

// 設定 axios 預設傳送 cookie（取得 PHP session）
axios.defaults.withCredentials = true

// 會員資料
const currentUserId = ref('')
const userProfile = ref({})
const userAvatarUrl = ref('')
const isUserReady = ref(false)


// 對話資料與輸入
const inputText = ref('')

// 禁忌詞清單
const bannedWords = [
    "幹", "幹你", "靠北", "媽的", "操", "操你", "王八蛋", "白癡", "智障", "北七",
    "87", "雞掰", "肏", "垃圾", "三小", "屁孩", "賤人", "廢物", "狗娘養的", "臭婊子",
    "賤種", "死全家", "沒腦", "豬頭", "娘砲", "死肥豬", "下賤", "白爛", "去死",
    "fuck", "shit", "bitch", "asshole", "bastard", "dick", "cunt",
    "motherfucker", "fucker", "slut"
]
const containsBannedWords = text => {
    return bannedWords.some(word => text.toLowerCase().includes(word))
}

// 將 useChat 的呼叫移到 setup 的頂層
const { messages, send, boxRef } = useChat(currentUserId)

// 發送訊息
function handleSend() {
    // 在發送前再次檢查狀態，確保邏輯嚴謹
    if (!isUserReady.value) {
        Swal.fire('請稍候', '會員資料尚未載入', 'info')
        return
    }

    const trimmed = inputText.value.trim()
    if (!trimmed) return

    if (containsBannedWords(trimmed)) {
        Swal.fire('請注意', '請勿輸入不當言論', 'warning')
        return
    }

// 傳遞一個完整的物件給 send 函式
    send({
        text: trimmed,
        senderId: currentUserId.value,
        senderName: userProfile.value.MEMBER_NICKNAME,
        senderAvatar: userAvatarUrl.value
    })

    console.log('發送訊息的 senderId：', currentUserId.value)

    inputText.value = ''
}

// 掛載時取得會員資料
onMounted(async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/users/profile-get.php`)
        const data = res.data.data

        if (!data?.MEMBER_ID) throw new Error('未登入')

        currentUserId.value = String(data.MEMBER_ID)
        localStorage.setItem('uid', data.MEMBER_ID)
        userProfile.value = data

        if (data.MEMBER_AVATAR_URL) {
            userAvatarUrl.value = data.MEMBER_AVATAR_URL || defaultAvatar
        }

        isUserReady.value = true
        
    } catch (err) {
        console.error('會員驗證失敗', err)
        Swal.fire('未登入', '請先登入會員才能使用聊天室', 'warning').then(() => {
            window.location.href = `${import.meta.env.BASE_URL}login`
        })
    }
})
</script>

<template>
    <section class="chat">
        <div class="floating">
            <img src="/src/assets/img/index-img/float.png" alt="浮動圖" />
        </div>
        <div class="chat-room">
            <div class="chat-section" ref="boxRef">
                <div v-if="messages.length === 0" class="empty-msg">目前沒有任何訊息</div>
                <div
                    v-for="msg in messages"
                    :key="msg.id"
                    :class="['chat-message', msg.senderId === currentUserId? 'me' : 'other']"
                >
                    <div class="avatar-section">
                        <div class="avatar">
                            <img :src="msg.senderAvatar || defaultAvatar"
                                @error="e => e.target.src = defaultAvatar"
                                alt="使用者大頭貼" />
                        </div>
                        <span class="name">
                            {{ msg.senderId === currentUserId ? '你' : (msg.senderName || msg.senderId) }}
                        </span>
                    </div>

                    <div class="chat-content-section">
                        <div class="chat-content">
                            <p class="bubble">{{ msg.text }}</p>
                            <small v-if="msg.createdAt">
                                {{ new Date(msg.createdAt.seconds * 1000).toLocaleString() }}
                            </small>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
        <div class="megaphone-box">
            <div class="megaphone-wrap">
                <img src="/src/assets/img/chat/megaphone-man.png" alt="擴音器人物圖" class="person" />
                <img src="/src/assets/img/chat/megaphone-line.png" alt="擴音器線條圖" class="lines" />
            </div>
        </div>
        <div class="chat-key-in-section">
            <div class="chat-now">
                <input
                    class="chat-box"
                    type="text"
                    placeholder="說點什麼吧"
                    v-model="inputText"
                    @keyup.enter="handleSend"
                    :disabled="!isUserReady"
                />
                <button
                    class="send-btn-mobile"
                    @click="handleSend"
                    :disabled="!isUserReady"
                >
                    <svg
                        width="29"
                        height="30"
                        viewBox="0 0 29 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clip-path="url(#clip0_1566_5695)">
                            <path
                                d="M9.59021 17.4098L24 3L9.59021 17.4098ZM24 3L15.4851 26.5797C15.4276 26.7051 15.3354 26.8114 15.2193 26.8859C15.1032 26.9604 14.9681 27 14.8301 27C14.6922 27 14.5571 26.9604 14.441 26.8859C14.3249 26.8114 14.2326 26.7051 14.1751 26.5797L9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3Z"
                                fill="#F5F0CD"
                            />
                            <path
                                d="M9.59021 17.4098L24 3M9.59021 17.4098L14.1751 26.5797C14.2326 26.7051 14.3249 26.8114 14.441 26.8859C14.5571 26.9604 14.6922 27 14.8301 27C14.9681 27 15.1032 26.9604 15.2193 26.8859C15.3354 26.8114 15.4276 26.7051 15.4851 26.5797L24 3M9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3"
                                stroke="black"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_1566_5695">
                                <rect width="29" height="30" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>
            <div class="chat-now-btns">
                <button
                    class="send-btn-desktop"
                    @click="handleSend"
                    :disabled="!isUserReady"
                >
                    <svg
                        width="29"
                        height="30"
                        viewBox="0 0 29 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clip-path="url(#clip0_1566_5695)">
                            <path
                                d="M9.59021 17.4098L24 3L9.59021 17.4098ZM24 3L15.4851 26.5797C15.4276 26.7051 15.3354 26.8114 15.2193 26.8859C15.1032 26.9604 14.9681 27 14.8301 27C14.6922 27 14.5571 26.9604 14.441 26.8859C14.3249 26.8114 14.2326 26.7051 14.1751 26.5797L9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3Z"
                                fill="#F5F0CD"
                            />
                            <path
                                d="M9.59021 17.4098L24 3M9.59021 17.4098L14.1751 26.5797C14.2326 26.7051 14.3249 26.8114 14.441 26.8859C14.5571 26.9604 14.6922 27 14.8301 27C14.9681 27 15.1032 26.9604 15.2193 26.8859C15.3354 26.8114 15.4276 26.7051 15.4851 26.5797L24 3M9.59021 17.4098L0.420335 12.8249C0.294915 12.7674 0.188634 12.6751 0.114122 12.559C0.0396097 12.4429 0 12.3078 0 12.1699C0 12.0319 0.0396097 11.8968 0.114122 11.7807C0.188634 11.6646 0.294915 11.5724 0.420335 11.5149L24 3"
                                stroke="black"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_1566_5695">
                                <rect width="29" height="30" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>


<style scoped lang="scss">
    .chat {
    position: relative;
    background-image: url("/src/assets/img/bg-decorate9.png");
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
    top: 0;
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
        position: relative;
        bottom: -80px;
        left: 0;
        width: 150px;
        z-index: 1;
        pointer-events: none;
    }
    .megaphone-wrap {
    position: absolute;
    bottom: 5px;
    left: -10px;
    width: fit-content;
    }

    .person {
    width: 100px;
    display: block;
    }

    .lines {
    position: absolute;
    top: 2px;
    left: 100px;
    width: 20px;
    animation: blink 1s infinite;
    z-index: 1;
    }

    @keyframes blink {
    0%,
    100% {
        opacity: 0;
        transform: scale(0.5);
    }
    50% {
        opacity: 1;
        transform: scale(1);
    }
    }
    //動畫圖片設定-end

    //chat-other-start
    .chat-section {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 50px);
    padding-bottom: 150px; 
    overflow-y: auto;
    border-radius: 3px;
    }
    .chat-message.other {
    display: flex;
    flex-direction: column;
    max-width: 80%;
    width: fit-content;
    gap: 20px;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    }
    .avatar-section {
    display: flex;
    align-items: center;
    gap: 20px;
    width: fit-content;
    }
    .avatar {
    width: 50px;
    height: 50px;
    border: 2px solid black;
    border-radius: 50%;
    overflow: hidden;
    img {
        width: 100%;
    }
    }
    .chat-content-section {
    display: flex;
    gap: 10px;
    button svg {
        display: inline-block;
        vertical-align: baseline;
    }
    }
    .chat-content {
    border: 2px solid black;
    background-color: #fff;
    padding: 10px;
    border-radius: 3px;
    word-wrap: break-word;
    }
    //chat-other-end

    //chat-me-start
    .chat-message.me{
    display: flex;
    flex-direction: column;
    margin: 30px 30px 0 auto;
    max-width: 80%;
    gap: 8px;
    position: relative;
    z-index: 2;
    .chat-content{ 
            background-color:$color-highlight;
        }
    }
    //chat-me-end

    //chat-key-in-start
    .chat-key-in-section {
    position: relative;
    z-index: 10;
    bottom: 0;
    width: 80%;
    padding: 12px 20px;
    margin: auto;
    display: flex;
    flex-direction: column;
    order: 1;
    }
    .chat-now {
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
    .chat-box {
    width: 80%;
    padding: 8px 12px;
    font-size: 16px;
    }
    .chat-now-btns {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    }
    .chat-now-btns button {
    cursor: pointer;
    }
    .send-btn-desktop {
    display: none;
    }
    .send-btn-mobile {
    display: block;
    }
    //chat-key-in-end

    //平板設定
    @include tablet {
    .person {
        bottom: 13vh;
    }
    .chat-key-in-section {
        margin-bottom: 30px;
    }
    }

    //桌機版設定
    @include desktop {
    .chat-section {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding:0 80px 20px 80px;
        margin: 0 200px;
    }
    .floating img {
        width: 200px;
    }
    .megaphone-box{
        margin: 30px auto 0 0;
    }
    .person {
        width: 150px;
    }
    .lines {
        width: 30px;
        left: 145px;
        top: 0;
    }
    .chat-key-in-section {
        display: flex;
        flex-direction: row;
        margin: 30px auto 0 auto;
        width: 80%;
        max-width: 100vh;
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
    .send-btn-mobile {
        display: none;
    }
    .send-btn-desktop {
        display: inline-block;
    }
}
</style>