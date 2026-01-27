<script setup>
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import Modal from '@/Components/Modal.vue';
import { ref, watch } from 'vue';

const props = defineProps({
    show: { type: Boolean, default: false },
    products: { type: Array, default: () => [] },
    initialProductId: { type: [String, Number], default: '' },
    initialQuantity: { type: [String, Number], default: '' },
    isEdit: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'submit']);

const productId = ref('');
const quantity = ref('');

watch(
    () => props.show,
    (visible) => {
        if (visible) {
            productId.value = props.initialProductId ? String(props.initialProductId) : '';
            quantity.value = props.initialQuantity ? String(props.initialQuantity) : '';
        }
    }
);

const canSubmit = () => !!productId.value && !!quantity.value;

const handleSubmit = () => {
    if (!canSubmit()) return;
    emit('submit', {
        product_id: productId.value,
        quantity: quantity.value,
    });
};

const handleClose = () => emit('close');
</script>

<template>
    <Modal :show="show" maxWidth="md" @close="handleClose">
        <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-semibold">
                {{ isEdit ? 'Edit Bahan' : 'Tambah Bahan' }}
            </h5>
            <button
                type="button"
                class="btn-close"
                aria-label="Tutup"
                @click="handleClose"
            ></button>
        </div>
        <div class="modal-body pt-2">
            <div class="mb-3">
                <InputLabel for="ingredient-modal-product" value="Produk" />
                <select
                    id="ingredient-modal-product"
                    v-model="productId"
                    class="form-select"
                >
                    <option value="">-- Pilih Produk --</option>
                    <option
                        v-for="p in products"
                        :key="p.id"
                        :value="p.id"
                    >
                        {{ p.product_name }}
                    </option>
                </select>
            </div>
            <div class="mb-0">
                <InputLabel for="ingredient-modal-qty" value="Jumlah (Quantity)" />
                <TextInput
                    id="ingredient-modal-qty"
                    type="number"
                    step="0.01"
                    min="0"
                    v-model="quantity"
                    placeholder="Masukkan jumlah"
                />
            </div>
        </div>
        <div class="modal-footer border-0 pt-0">
            <button
                type="button"
                class="btn btn-outline-secondary"
                @click="handleClose"
            >
                Batal
            </button>
            <button
                type="button"
                class="btn btn-primary"
                :disabled="!canSubmit()"
                @click="handleSubmit"
            >
                <i v-if="!isEdit" class="fas fa-plus me-1"></i>
                {{ isEdit ? 'Simpan' : 'Tambah' }}
            </button>
        </div>
    </Modal>
</template>
