<script setup>
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import Modal from "@/Components/Modal.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import ProductSearchInput from "@/Components/ProductSearchInput.vue";
import TextInput from "@/Components/TextInput.vue";
import { useForm } from "@inertiajs/vue3";
import { ref, watch } from "vue";

const props = defineProps({
    products: { type: Array, default: () => [] },
});

const emit = defineEmits(["saved"]);

const show = ref(false);
const form = useForm({
    product_id: "",
    stock: "",
    price: "",
    note: "",
});

watch(
    () => show.value,
    (visible) => {
        if (visible) form.reset();
    },
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
    form.post(route("incoming-goods.store"), {
        onSuccess: () => {
            close();
            emit("saved");
        },
        preserveScroll: true,
    });
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">Tambah Barang Datang</h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Nama Produk -->
                    <div class="col-12 mb-3">
                        <InputLabel
                            for="incoming-product"
                            value="Nama Produk"
                        />
                        <ProductSearchInput
                            id="incoming-product"
                            v-model="form.product_id"
                            :items="products"
                            display-field="product_name"
                            placeholder="Ketik untuk mencari produk..."
                            :required="true"
                        />
                        <InputError
                            :message="form.errors.product_id"
                            class="text-danger mt-1"
                        />
                    </div>
                </div>
                <div class="row">
                    <!-- Quantity -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="incoming-stock" value="Quantity" />
                        <TextInput
                            id="incoming-stock"
                            v-model="form.stock"
                            type="number"
                            class="form-control"
                            min="1"
                            step="1"
                            placeholder="Masukkan jumlah"
                            required
                        />
                        <InputError
                            :message="form.errors.stock"
                            class="text-danger mt-1"
                        />
                    </div>
                    <!-- Harga -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="incoming-price" value="Harga" />
                        <TextInput
                            id="incoming-price"
                            v-model="form.price"
                            type="number"
                            class="form-control"
                            min="0"
                            step="1"
                            placeholder="Masukkan harga"
                        />
                        <InputError
                            :message="form.errors.price"
                            class="text-danger mt-1"
                        />
                    </div>
                </div>
                <div class="row">
                    <!-- Catatan -->
                    <div class="col-12 mb-3">
                        <InputLabel for="incoming-note" value="Catatan" />
                        <TextInput
                            id="incoming-note"
                            v-model="form.note"
                            type="text"
                            class="form-control"
                            placeholder="Masukkan catatan"
                        />
                        <InputError
                            :message="form.errors.note"
                            class="text-danger mt-1"
                        />
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary me-2"
                    @click="close"
                >
                    Batal
                </button>
                <PrimaryButton
                    :disabled="form.processing"
                    class="btn btn-primary"
                >
                    <span v-if="form.processing">
                        <i class="fas fa-spinner fa-spin me-1"></i>
                        Menyimpan...
                    </span>
                    <span v-else>
                        <i class="fas fa-save me-1"></i>
                        Simpan
                    </span>
                </PrimaryButton>
            </div>
        </form>
    </Modal>
</template>
