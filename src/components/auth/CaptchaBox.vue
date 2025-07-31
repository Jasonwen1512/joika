<script setup>
import { ref, onMounted, watch } from "vue"

    // 當前產生的驗證碼
    const curIdentifyCode = ref("")

    // 父層可傳入的參數
    const props = defineProps({
    identifyCode: {
        type: String,
        default: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    },
    fontSizeMin: { type: Number, default: 16 },
    fontSizeMax: { type: Number, default: 40 },
    backgroundColorMin: { type: Number, default: 180 },
    backgroundColorMax: { type: Number, default: 240 },
    colorMin: { type: Number, default: 50 },
    colorMax: { type: Number, default: 160 },
    lineColorMin: { type: Number, default: 40 },
    lineColorMax: { type: Number, default: 180 },
    dotColorMin: { type: Number, default: 0 },
    dotColorMax: { type: Number, default: 255 },
    contentWidth: { type: Number, default: 112 },
    contentHeight: { type: Number, default: 38 }
    })

    // 發送驗證碼給父元件
    const emit = defineEmits(["updateIdentifyCode"])

    // 當驗證碼變動時，重畫畫面
    watch(curIdentifyCode, () => {
    drawPic()
    })

    /* ---------- 驗證碼核心邏輯 ---------- */

    // 隨機數
    const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
    }

    // 隨機顏色
    const randomColor = (min, max) => {
    let r = randomNum(min, max)
    let g = randomNum(min, max)
    let b = randomNum(min, max)
    return `rgb(${r},${g},${b})`
    }

    // 繪製整體驗證碼畫面
    const drawPic = () => {
    const canvas = document.getElementById("s-canvas")
    const ctx = canvas.getContext("2d")
    ctx.textBaseline = "bottom"

    // 背景色
    ctx.fillStyle = randomColor(props.backgroundColorMin, props.backgroundColorMax)
    ctx.fillRect(0, 0, props.contentWidth, props.contentHeight)

    // 畫驗證碼字元
    for (let i = 0; i < curIdentifyCode.value.length; i++) {
        drawText(ctx, curIdentifyCode.value[i], i)
    }

    drawLine(ctx)
    drawDot(ctx)
    }

    // 畫每個字
    const drawText = (ctx, txt, i) => {
    ctx.fillStyle = randomColor(props.colorMin, props.colorMax)
    ctx.font = randomNum(props.fontSizeMin, props.fontSizeMax) + "px SimHei"

    const x = (i + 1) * (props.contentWidth / (curIdentifyCode.value.length + 1))
    const y = randomNum(props.fontSizeMax, props.contentHeight - 10)
    const deg = randomNum(-45, 45)

    ctx.translate(x, y)
    ctx.rotate((deg * Math.PI) / 180)
    ctx.fillText(txt, 0, 0)
    ctx.rotate((-deg * Math.PI) / 180)
    ctx.translate(-x, -y)
    }

    // 畫干擾線
    const drawLine = (ctx) => {
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = randomColor(props.lineColorMin, props.lineColorMax)
        ctx.beginPath()
        ctx.moveTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight))
        ctx.lineTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight))
        ctx.stroke()
    }
    }

    // 畫干擾點
    const drawDot = (ctx) => {
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = randomColor(props.dotColorMin, props.dotColorMax)
        ctx.beginPath()
        ctx.arc(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
    }
    }

    // 重新產生驗證碼（供點擊與父層調用）
    const refreshCode = () => {
    curIdentifyCode.value = ""
    makeCode(props.identifyCode, 4)
    }

    // 組成驗證碼字串
    const makeCode = (sourceStr, length) => {
    for (let i = 0; i < length; i++) {
        curIdentifyCode.value += sourceStr[randomNum(0, sourceStr.length)]
    }
    emit("updateIdentifyCode", curIdentifyCode.value)
    }

    // 元件掛載後自動產生驗證碼
    onMounted(() => {
    drawPic()
    refreshCode()
    })

    // 讓父元件可以透過 ref 使用 refreshCode()
    defineExpose({
    refreshCode
    })
</script>

<template>
    <!-- 外層容器：點擊可重新產生驗證碼 -->
    <div class="s-canvas" @click="refreshCode">
        <canvas
        id="s-canvas"
        :width="contentWidth"
        :height="contentHeight"
        ></canvas>
    </div>
</template>

<style scoped>
    .s-canvas {
    width: fit-content;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    }
</style>
