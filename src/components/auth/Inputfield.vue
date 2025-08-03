<script setup>
    defineProps({
    id: String,
    label: String,
    type: {
        type: String,
        default: 'text'
    },
    modelValue: String,
    error: String,
    placeholder: String
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="form-group">
        <label :for="id">{{ label }}</label>
        <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        />
        <p v-if="error" class="error-text">{{ error }}</p>
    </div>
</template>

<style scoped lang="scss">
    .form-group {
        margin-bottom: 30px;
    }

    label {
        display: block;
        margin-bottom: 8px;
    }

    input {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid black;
        border-radius: 3px;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:focus {
            outline: none;
            border-color: $color-primary;
            box-shadow: 0 0 0 2px rgba($color-primary, 0.3);
        }
        }

    .error-text {
        color: red;
        font-size: 14px;
        margin-top: 4px;
        }
</style>
