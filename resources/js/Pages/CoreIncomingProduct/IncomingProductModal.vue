<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import Modal from '@/Components/Modal.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    products: { type: Array, default: () => [] },
});

const emit = defineEmits(['saved']);

const show = ref(false);
const form = useForm({
    product_id: '',
    stock: '',
    price: '',
});

watch(
    () => show.value,
    (visible) => {
        if (visible) form.reset();
    }
);

const open = () => {
    form.reset();
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

const submit = () => {
    form.post(route('incoming-goods.store'), {
        onSuccess: () => {
            close();
            emit('saved');
        },
        preserveScroll: true,
    });
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" maxWidth="md" @close="close">
        <form @submit.prevent="submit">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-semibold">Tambah Barang Datang</h5>
                <button
                    type="button"
                    class="btn-close"
                    aria-label="Tutup"
                    @click="close"
                ></button>
            </div>
            <div class="modal-body pt-2">
                <div class="mb-3">
                    <InputLabel for="incoming-product" value="Nama Produk" />
                    <select
                        id="incoming-product"
                        v-model="form.product_id"
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
                    <InputError class="mt-1" :message="form.errors.product_id" />
                </div>
                <div class="mb-0">
                    <InputLabel for="incoming-stock" value="Quantity" />
                    <TextInput
                        id="incoming-stock"
                        v-model="form.stock"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Masukkan jumlah"
                    />
                    <InputError class="mt-1" :message="form.errors.stock" />
                </div>
                <div class="mb-0">
                    <InputLabel for="incoming-price" value="Harga" />
                    <TextInput
                        id="incoming-price"
                        v-model="form.price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Masukkan harga"
                    />
                    <InputError class="mt-1" :message="form.errors.price" />
                </div>
            </div>
            <div class="modal-footer border-0 pt-0">
                <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="close"
                >
                    Batal
                </button>
                <PrimaryButton :disabled="form.processing" class="btn btn-primary">
                    <span v-if="form.processing">
                        <i class="fas fa-spinner fa-spin me-1"></i>
                        Menyimpan...
                    </span>
                    <span v-else>
                        <i class="fas fa-plus me-1"></i>
                        Tambah
                    </span>
                </PrimaryButton>
            </div>
        </form>
    </Modal>
</template>
