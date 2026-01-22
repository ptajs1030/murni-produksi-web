<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    roles: {
        type: Array,
        required: true,
    },
    placeholder: {
        type: String,
        default: "Pilih role...",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue", "change"]);

const handleChange = (event) => {
    const value = event.target.value;
    emit("update:modelValue", value);
    emit("change", value);
};
</script>

<template>
    <select
        :disabled="disabled"
        class="form-select"
        :value="modelValue"
        @change="handleChange"
    >
        <option disabled value="">{{ placeholder }}</option>
        <option v-for="role in roles" :key="role" :value="role">
            {{ role }}
        </option>
    </select>
</template>

<style scoped>
.form-select:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
}
</style>