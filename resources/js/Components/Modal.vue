<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    maxWidth: {
        type: String,
        default: 'lg', // default untuk Bootstrap
    },
    closeable: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['close']);
const showSlot = ref(props.show);

const close = () => {
    if (props.closeable) {
        emit('close');
    }
};

const closeOnEscape = e => {
    if (e.key === 'Escape' && props.show) {
        e.preventDefault();
        close();
    }
};

onMounted(() => document.addEventListener('keydown', closeOnEscape));
onUnmounted(() => {
    document.removeEventListener('keydown', closeOnEscape);
    document.body.style.overflow = '';
});

watch(
    () => props.show,
    () => {
        if (props.show) {
            document.body.style.overflow = 'hidden';
            showSlot.value = true;
        } else {
            document.body.style.overflow = '';
            setTimeout(() => (showSlot.value = false), 200);
        }
    }
);

const maxWidthClass = computed(() => {
    return (
        {
            sm: 'modal-sm',
            md: '', // default Bootstrap modal
            lg: 'modal-lg',
            xl: 'modal-xl',
        }[props.maxWidth] || ''
    );
});
</script>

<template>
    <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        style="display: block"
        :class="{ show: props.show }"
        v-show="props.show"
        @click.self="close"
    >
        <div class="modal-dialog modal-dialog-scrollable" :class="maxWidthClass" role="document">
            <div class="modal-content">
                <slot v-if="showSlot" />
            </div>
        </div>
    </div>

    <!-- Overlay (backdrop) -->
    <div v-if="props.show" class="modal-backdrop fade show"></div>
</template>
