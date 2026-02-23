<script setup>
import InputLabel from "@/Components/InputLabel.vue";
import TextInput from "@/Components/TextInput.vue";
import Modal from "@/Components/Modal.vue";
import { ref, watch, computed } from "vue";

const props = defineProps({
    show: { type: Boolean, default: false },
    products: { type: Array, default: () => [] },
    initialProductId: { type: [String, Number], default: "" },
    initialQuantity: { type: [String, Number], default: "" },
    isEdit: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "submit"]);

const productId = ref("");
const quantity = ref("");

watch(
    () => props.show,
    (visible) => {
        if (visible) {
            productId.value = props.initialProductId
                ? String(props.initialProductId)
                : "";
            quantity.value = props.initialQuantity
                ? String(props.initialQuantity)
                : "";
        }
    },
);

const canSubmit = computed(() => !!productId.value && !!quantity.value);

const handleSubmit = () => {
    if (!canSubmit.value) return;
    emit("submit", {
        product_id: Number(productId.value),
        quantity: quantity.value,
    });
};

const handleClose = () => emit("close");
</script>

<template>
    <Modal :show="show" maxWidth="md" @close="handleClose">
        <div class="modal-header">
            <h5 class="modal-title">
                <i class="fas fa-mortar-pestle me-2"></i>
                {{ isEdit ? "Edit Bahan" : "Tambah Bahan" }}
            </h5>
            <button
                type="button"
                class="btn-close"
                aria-label="Tutup"
                @click="handleClose"
            ></button>
        </div>
        <div class="modal-body">
            <div class="mb-3">
                <InputLabel for="ingredient-modal-product" value="Bahan Baku" />
                <select
                    id="ingredient-modal-product"
                    v-model="productId"
                    class="form-select"
                >
                    <option value="">-- Pilih Bahan Baku --</option>
                    <option
                        v-for="p in products"
                        :key="p.id"
                        :value="String(p.id)"
                    >
                        {{ p.product_name }}
                    </option>
                </select>
            </div>
            <div class="mb-0">
                <InputLabel
                    for="ingredient-modal-qty"
                    value="Jumlah (Quantity)"
                />
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
        <div class="modal-footer">
            <button
                type="button"
                class="btn btn-secondary"
                @click="handleClose"
            >
                <i class="fas fa-times me-1"></i>
                Batal
            </button>
            <button
                type="button"
                class="btn btn-primary"
                :disabled="!canSubmit"
                @click="handleSubmit"
            >
                <i v-if="!isEdit" class="fas fa-plus me-1"></i>
                <i v-else class="fas fa-save me-1"></i>
                {{ isEdit ? "Simpan" : "Tambah" }}
            </button>
        </div>
    </Modal>
</template>
