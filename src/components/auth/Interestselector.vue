<script setup>
import { computed, ref } from 'vue'
import { ActivityCategories } from '@/assets/data/fake-activity-category.js'

// Props 接收 v-model 與錯誤訊息
    const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    error: String,
    max: {
        type: Number,
        default: 5 // ⬅ 預設最多 5 個
    }
    })
    const emit = defineEmits(['update:modelValue'])

    const overLimit = ref(false) // 狀態：是否超過限制

    // 檢查是否已選
    const isSelected = (id) => props.modelValue.includes(id)

    // 切換選取狀態
    const toggle = (id) => {
    const updated = [...props.modelValue]
    const index = updated.indexOf(id)

    if (index > -1) {
        // 已選 → 取消
        updated.splice(index, 1)
        emit('update:modelValue', updated)
    } else {
        // 尚未選 → 要判斷上限
        if (props.modelValue.length >= props.max) {
        overLimit.value = true
        setTimeout(() => (overLimit.value = false), 1000)
        return
        }
        updated.push(id)
        emit('update:modelValue', updated)
    }
    }

    // 組合興趣顯示資料
    const categoryList = computed(() =>
    ActivityCategories
        .filter(cat => cat.name !== '全部') // ⬅ 過濾掉這個
        .map((cat) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color
        }))
    )
    </script>

    <template>
    <div class="form-group">
        <label>興趣 <span class="limit">(最多 {{ max }} 項)</span></label>

        <div class="selected-box">
        <span v-if="modelValue.length === 0" class="placeholder">請選擇興趣</span>
        <span v-else class="selected-tag" v-for="id in modelValue" :key="id">
            {{ categoryList.find(cat => cat.id === id)?.name }}
        </span>
        </div>

        <div class="tag-grid">
        <div
            v-for="tag in categoryList"
            :key="tag.id"
            class="tag"
            :class="{ active: isSelected(tag.id), shake: overLimit && !isSelected(tag.id) }"
            :style="{ backgroundColor: tag.color }"
            @click="toggle(tag.id)"
        >
            {{ tag.name }}
        </div>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>
    </div>
    </template>

    <style scoped lang="scss">
    .form-group {
    margin-bottom: 30px;
    }

    label {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .limit {
        font-size: 13px;
        margin-left: 10px;
        color: #999;
    }
    }

    .selected-box {
    display: flex;
    flex-wrap: wrap;
    min-height: 44px;
    border: 1px solid black;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 15px;
    background-color: #fff;

    .placeholder {
        color: #aaa;
    }

    .selected-tag {
        background-color: #eee;
        padding: 5px 10px;
        margin: 2px;
        border-radius: 3px;
        font-size: 14px;
    }
    }

    .tag-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    }

    .tag {
    padding: 13px 20px;
    min-width: 82px;
    text-align: center;
    border: 1px solid black;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    color: black;
    transition: all 0.2s;

    &.active {
        box-shadow: 0 0 0 2px black inset;
    }

    &.shake {
        animation: shake 0.3s ease;
    }
    }

    @keyframes shake {
    0% { transform: translateX(0px); }
    25% { transform: translateX(-4px); }
    50% { transform: translateX(4px); }
    75% { transform: translateX(-4px); }
    100% { transform: translateX(0px); }
    }

    .error-text {
    color: red;
    font-size: 14px;
    margin-top: 4px;
    }
</style>
