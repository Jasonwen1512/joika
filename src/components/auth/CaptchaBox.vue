<script setup>
import { ref, onMounted, nextTick } from 'vue'

const emit = defineEmits(['updateIdentifyCode'])
const props = defineProps({
  contentWidth:  { type: Number, default: 110 },
  contentHeight: { type: Number, default: 36 },
  fontSizeMin:   { type: Number, default: 18 },
  fontSizeMax:   { type: Number, default: 24 },
})

const canvasRef = ref(null)
const code = ref('')

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randColor(min, max) {
  const r = rand(min, max), g = rand(min, max), b = rand(min, max)
  return `rgb(${r},${g},${b})`
}
function genCode(len = 4) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < len; i++) s += chars[rand(0, chars.length - 1)]
  return s
}

function draw() {
  const c = canvasRef.value
  const ctx = c?.getContext?.('2d')
  if (!c || !ctx) return

  c.width  = props.contentWidth
  c.height = props.contentHeight
  const w = c.width, h = c.height

  // 背景
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = randColor(235, 250)
  ctx.fillRect(0, 0, w, h)

  // 字
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const step = w / (code.value.length + 1)
  for (let i = 0; i < code.value.length; i++) {
    ctx.save()
    const x = step * (i + 1)
    const y = h / 2
    ctx.translate(x, y)
    ctx.rotate((Math.random() - 0.5) * 0.4)
    ctx.font = `${rand(props.fontSizeMin, props.fontSizeMax)}px sans-serif`
    ctx.fillStyle = randColor(40, 140)
    ctx.fillText(code.value[i], 0, 0)
    ctx.restore()
  }

  // 干擾線
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = randColor(80, 180)
    ctx.beginPath()
    ctx.moveTo(rand(0, w), rand(0, h))
    ctx.lineTo(rand(0, w), rand(0, h))
    ctx.stroke()
  }
  // 雜點
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = randColor(0, 255)
    ctx.fillRect(rand(0, w), rand(0, h), 1, 1)
  }
}

function refreshCode() {
  code.value = genCode(4)
  emit('updateIdentifyCode', code.value)  // ★ 先生碼→回傳父層
  draw()                                  // ★ 再畫圖
}

onMounted(async () => {
  await nextTick()
  refreshCode()
})

defineExpose({ refreshCode })
</script>

<template>
  <!-- 直接給固定尺寸，避免被父層 100% 壓扁 -->
  <canvas ref="canvasRef" style="display:block;width:110px;height:36px;border-radius:8px;"></canvas>
</template>
