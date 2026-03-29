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
    repackProducts: { type: Array, default: () => [] },
});

const emit = defineEmits(["saved"]);
const { proxy } = getCurrentInstance();

const show = ref(false);
const sourceProduct = ref(null);

const form = useForm({
    source_product_id: "",
    source_quantity: "",
    target_products: [],
});

// Get stock for source product
const sourceStock = computed(() => {
    if (!sourceProduct.value?.stocks || sourceProduct.value.stocks.length === 0)
        return 0;
    return sourceProduct.value.stocks[0]?.packaging_size_input || 0;
});

watch(
    () => show.value,
    (visible) => {
        if (!visible) {
            form.reset();
            sourceProduct.value = null;
        }
    },
);

const open = (product) => {
    form.reset();
    sourceProduct.value = product;
    form.source_product_id = product.id;
    form.target_products = [];
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
    sourceProduct.value = null;
};

// Add target product row
const addTargetProduct = () => {
    form.target_products.push({
        product_id: "",
        quantity: "",
    });
};

// Remove target product row
const removeTargetProduct = (index) => {
    form.target_products.splice(index, 1);
};

// Get available products (exclude already selected)
const getAvailableProducts = (currentIndex) => {
    const selectedIds = form.target_products
        .filter((_, idx) => idx !== currentIndex)
        .map((p) => p.product_id)
        .filter((id) => id);

    return props.repackProducts.filter((p) => !selectedIds.includes(p.id));
};

// Submit repack
const submit = () => {
    if (form.target_products.length === 0) {
        proxy.$swal.fire({
            title: "Error!",
            text: "Tambahkan minimal 1 produk hasil repack",
            icon: "error",
            confirmButtonText: "OK",
        });
        return;
    }

    const invalidProducts = form.target_products.filter(
        (p) => !p.product_id || !p.quantity || p.quantity <= 0,
    );

    if (invalidProducts.length > 0) {
        proxy.$swal.fire({
            title: "Error!",
            text: "Semua produk hasil repack harus memiliki produk dan jumlah yang valid",
            icon: "error",
            confirmButtonText: "OK",
        });
        return;
    }

    proxy.$swal
        .fire({
            title: "Konfirmasi Repack",
            html: `
                <p>Apakah Anda yakin ingin melakukan repack?</p>
                <p><strong>Produk sumber:</strong> ${sourceProduct.value?.product_name}</p>
                <p><strong>Jumlah:</strong> ${formatNumberWithCommas(form.source_quantity)}</p>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Repack",
            cancelButtonText: "Batal",
        })
        .then((result) => {
            if (result.isConfirmed) {
                form.post("/repack", {
                    onSuccess: () => {
                        proxy.$swal.fire({
                            title: "Berhasil!",
                            text: "Repack berhasil dilakukan",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        close();
                        emit("saved");
                    },
                    onError: (errors) => {
                        let errorMessage = "Gagal melakukan repack";
                        if (errors.error) {
                            errorMessage = errors.error;
                        } else if (errors.source_quantity) {
                            errorMessage = errors.source_quantity;
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
    <Modal :show="show" @close="close" maxWidth="xl">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">Repack Produk</h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <!-- Source Product Info -->
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <strong>Produk Sumber (Bahan Baku)</strong>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="mb-1">
                                    <strong>SKU:</strong>
                                    {{ sourceProduct?.product_unit_sku || "-" }}
                                </p>
                                <p class="mb-1">
                                    <strong>Nama:</strong>
                                    {{ sourceProduct?.product_name || "-" }}
                                </p>
                                <p class="mb-0">
                                    <strong>Stock Tersedia:</strong>
                                    <span class="badge bg-info">
                                        {{
                                            formatNumberWithCommas(sourceStock)
                                        }}
                                    </span>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <InputLabel
                                    for="source-quantity"
                                    value="Jumlah yang akan di-Repack"
                                />
                                <TextInput
                                    id="source-quantity"
                                    v-model="form.source_quantity"
                                    type="number"
                                    class="form-control"
                                    min="1"
                                    :max="sourceStock"
                                    step="1"
                                    placeholder="Masukkan jumlah"
                                    required
                                />
                                <InputError
                                    :message="form.errors.source_quantity"
                                    class="text-danger mt-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Target Products -->
                <div class="card">
                    <div
                        class="card-header bg-success text-white d-flex justify-content-between align-items-center"
                    >
                        <strong>Produk Hasil Repack</strong>
                        <button
                            type="button"
                            class="btn btn-light btn-sm"
                            @click="addTargetProduct"
                        >
                            <i class="fas fa-plus me-1"></i>
                            Tambah Produk
                        </button>
                    </div>
                    <div class="card-body">
                        <div
                            v-if="form.target_products.length === 0"
                            class="text-center text-muted py-3"
                        >
                            <p>Belum ada produk hasil repack.</p>
                            <button
                                type="button"
                                class="btn btn-outline-success"
                                @click="addTargetProduct"
                            >
                                <i class="fas fa-plus me-1"></i>
                                Tambah Produk Repack
                            </button>
                        </div>

                        <div
                            v-for="(target, index) in form.target_products"
                            :key="index"
                            class="row mb-3 align-items-end"
                        >
                            <div class="col-md-6">
                                <InputLabel
                                    :for="`target-product-${index}`"
                                    value="Pilih Produk"
                                />
                                <ProductSearchInput
                                    :id="`target-product-${index}`"
                                    v-model="target.product_id"
                                    :items="getAvailableProducts(index)"
                                    display-field="product_name"
                                    secondary-field="product_unit_sku"
                                    placeholder="Ketik untuk mencari produk..."
                                    :required="true"
                                />
                            </div>
                            <div class="col-md-4">
                                <InputLabel
                                    :for="`target-quantity-${index}`"
                                    value="Jumlah"
                                />
                                <TextInput
                                    :id="`target-quantity-${index}`"
                                    v-model="target.quantity"
                                    type="number"
                                    class="form-control"
                                    min="1"
                                    step="1"
                                    placeholder="Jumlah"
                                    required
                                />
                            </div>
                            <div class="col-md-2">
                                <button
                                    type="button"
                                    class="btn btn-outline-danger"
                                    @click="removeTargetProduct(index)"
                                    title="Hapus"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        <InputError
                            :message="form.errors.target_products"
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
                    :disabled="
                        form.processing || form.target_products.length === 0
                    "
                    class="btn btn-primary"
                >
                    <span v-if="form.processing">
                        <i class="fas fa-spinner fa-spin me-1"></i>
                        Memproses...
                    </span>
                    <span v-else>
                        <i class="fas fa-box-open me-1"></i>
                        Proses Repack
                    </span>
                </PrimaryButton>
            </div>
        </form>
    </Modal>
</template>

<style scoped>
.card-header {
    padding: 0.75rem 1rem;
}

.card-body {
    padding: 1rem;
}
</style>
