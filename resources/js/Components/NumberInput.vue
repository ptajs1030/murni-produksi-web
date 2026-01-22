<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    max: {
        type: Number,
        default: null,
    },
    min: {
        type: Number,
        default: null,
    },
    step: {
        type: [Number, String],
        default: null,
    },
    placeholder: {
        type: String,
        default: null,
    },
});

const model = defineModel({
    type: Number,
    required: true,
});

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <input
        v-model="model"
        ref="input"
        class="form-control"
        type="number"
        :max="max"
        :min="min"
        :step="step"
        :placeholder="placeholder"
    />
</template>
