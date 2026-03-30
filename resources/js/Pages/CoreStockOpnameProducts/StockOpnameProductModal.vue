<script setup>
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import Modal from "@/Components/Modal.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import ProductSearchInput from "@/Components/ProductSearchInput.vue";
import TextInput from "@/Components/TextInput.vue";
import { formatNumberWithCommas } from "@/utils/numberFormatter";
import { useForm } from "@inertiajs/vue3";
import { computed, getCurrentInstance, ref, watch } from "vue";

const props = defineProps({
    stockOpnameId: { type: [Number, String], required: true },
    products: { type: Array, default: () => [] },
});

const emit = defineEmits(["saved"]);
const { proxy } = getCurrentInstance();

const show = ref(false);
const form = useForm({
    product_id: "",
    real_quantity: "",
    expired_quantity: "",
    description: "",
});

// Get selected product info
const selectedProduct = computed(() => {
    if (!form.product_id) return null;
    return props.products.find((p) => p.id == form.product_id);
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
    proxy.$swal
        .fire({
            title: "Konfirmasi",
            text: "Apakah Anda yakin ingin menambahkan product ini ke stock opname?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Tambahkan",
            cancelButtonText: "Batal",
        })
        .then((result) => {
            if (result.isConfirmed) {
                form.post(`/stock-opnames/${props.stockOpnameId}/products`, {
                    onSuccess: () => {
                        proxy.$swal.fire({
                            title: "Berhasil!",
                            text: "Product berhasil ditambahkan ke stock opname",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        close();
                        emit("saved");
                    },
                    onError: (errors) => {
                        let errorMessage = "Gagal menambahkan product";
                        if (errors.product_id) {
                            errorMessage = errors.product_id;
                        } else if (errors.error) {
                            errorMessage = errors.error;
                        }
                        proxy.$swal.fire({
                            title: "Error!",
                            text: errorMessage,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    },
                    preserveScroll: true,
                });
            }
        });
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">Tambah Product Stock Opname</h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Nama Produk -->
                    <div class="col-12 mb-3">
                        <InputLabel
                            for="product-select"
                            value="Pilih Product"
                        />
                        <ProductSearchInput
                            id="product-select"
                            v-model="form.product_id"
                            :items="products"
                            display-field="product_name"
                            secondary-field="product_unit_sku"
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
                    <!-- Real Quantity -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="real-quantity" value="Real Quantity" />
                        <TextInput
                            id="real-quantity"
                            v-model="form.real_quantity"
                            type="number"
                            class="form-control"
                            min="0"
                            step="1"
                            placeholder="Jumlah stock real"
                            required
                        />
                        <InputError
                            :message="form.errors.real_quantity"
                            class="text-danger mt-1"
                        />
                    </div>
                    <!-- Expired Quantity -->
                    <div class="col-md-6 mb-3">
                        <InputLabel
                            for="expired-quantity"
                            value="Expired Quantity"
                        />
                        <TextInput
                            id="expired-quantity"
                            v-model="form.expired_quantity"
                            type="number"
                            class="form-control"
                            min="0"
                            step="1"
                            placeholder="Jumlah stock expired"
                            required
                        />
                        <InputError
                            :message="form.errors.expired_quantity"
                            class="text-danger mt-1"
                        />
                    </div>
                </div>
                <div class="row">
                    <!-- Description -->
                    <div class="col-12 mb-3">
                        <InputLabel
                            for="description"
                            value="Deskripsi (Opsional)"
                        />
                        <textarea
                            id="description"
                            v-model="form.description"
                            class="form-control"
                            rows="3"
                            placeholder="Masukkan deskripsi atau catatan..."
                            maxlength="1000"
                        ></textarea>
                        <InputError
                            :message="form.errors.description"
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
