<script setup>
    import { ref, onMounted, nextTick } from "vue";
    import Button from "@/components/Button.vue";

    const props = defineProps({
    // 外層會傳入兩個函式（注意：函式是 props，不是 emit）
    onSubmit: { type: Function, required: true },
    onCancel: { type: Function, required: true },
    });

    const email = ref("");
    const submitting = ref(false);
    const err = ref("");
    const inputEl = ref(null);

    const validate = () => {
    const v = email.value.trim();
    if (!v) return "請輸入信箱";
    // 簡單 email 檢查（可換更嚴謹）
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "信箱格式不正確";
    return "";
    };

    const handleSubmit = async () => {
    err.value = validate();
    if (err.value) {
        inputEl.value?.focus();
        return;
    }
    submitting.value = true;
    try {
        // 交給外層：返回 Promise，這裡 await 等待（避免重複送出）
        await props.onSubmit(email.value.trim());
    } finally {
        submitting.value = false;
    }
    };

    const buttonSize = ref("lg");
    const handleResize = () => {
        buttonSize.value = window.innerWidth < 768 ? "sm" : "lg";
    };


    onMounted(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        nextTick(() => inputEl.value?.focus());
    });
</script>

<template>
  <div class="fp-wrap" role="dialog" aria-label="密碼重設驗證信">
    <h2>密碼重設驗證信</h2>

    <label for="fp-email">請輸入註冊時的信箱</label>
    <input
        id="fp-email"
        ref="inputEl"
        type="email"
        v-model="email"
        placeholder="you@gmail.com"
        :disabled="submitting"
        @keyup.enter="handleSubmit"
    />
    <p v-if="err" class="err">{{ err }}</p>

    <div class="btn-group">
        <Button isOutline theme="secondary" :size="buttonSize" :disabled="submitting" @click="props.onCancel">
            取消
        </Button>
        <Button theme="primary" :size="buttonSize" :disabled="submitting" @click="handleSubmit">
            {{ submitting ? '送出中…' : '完成' }}
        </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">

@use "@/style.scss" as *;

.fp-wrap {
    display: flex; 
    flex-direction: column; 
    gap:30px;
    min-width: 320px;
    padding: 20px;
}
h2 { font-size: $font-size-h4; font-weight: 600; margin-bottom: 4px; }

input {
    width: 100%;  
    padding: 10px 12px;
    border: 1px solid $black; border-radius: 6px; font-size: $font-size-p;
    &:disabled { opacity: .7; }
}
.err { color: $red; font-size: 14px; }
.btn-group { 
    display: flex;
    justify-content: space-between;
    gap: 15px;
}


@media (min-width: 768px) {
    .button-group {
        display: flex;
        justify-content: center;
        gap: 100px;
    }
}
</style>
