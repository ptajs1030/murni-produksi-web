<script setup>
import Modal from "@/Components/Modal.vue";
import { formatNumberWithCommas } from "@/utils/numberFormatter";
import axios from "axios";
import { computed, ref } from "vue";

const emit = defineEmits(["close"]);
const show = ref(false);
const loading = ref(false);
const productData = ref(null);
const stockDetails = ref([]);

const isLoading = computed(() => loading.value);
const hasStockData = computed(
    () => stockDetails.value && stockDetails.value.length > 0,
);

const open = async (productId) => {
    if (!productId) return;

    show.value = true;
    loading.value = true;

    try {
        const response = await axios.get(
            `/products/${productId}/stock-details`,
        );
        productData.value = response.data.product;
        stockDetails.value = response.data.stock_details;
    } catch (error) {
        console.error("Error fetching stock details:", error);
        // Handle error - maybe show toast notification
    } finally {
        loading.value = false;
    }
};

const close = () => {
    show.value = false;
    productData.value = null;
    stockDetails.value = [];
    emit("close");
};

const formatCurrency = (amount) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const getStockStatus = (stock) => {
    if (!stock.track_stock)
        return { class: "text-muted", text: "Tidak Dipantau" };
    if (stock.stock_alert) return { class: "text-danger", text: "Stok Rendah" };
    if (stock.real_quantity_smallest_unit > 0)
        return { class: "text-success", text: "Tersedia" };
    return { class: "text-warning", text: "Kosong" };
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" :closeable="true" maxWidth="xl" @close="close">
        <div class="modal-header">
            <h5 class="modal-title">
                <i class="fas fa-boxes me-2"></i>
                Detail Stock
            </h5>
            <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body" style="max-height: 70vh; overflow-y: auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="py-5 text-center">
                <div class="spinner-border text-primary me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="text-muted">Memuat detail stock...</div>
            </div>

            <!-- Product Information -->
            <div v-else-if="productData" class="mb-4">
                <div class="card bg-light border-0">
                    <div class="card-body">
                        <h6 class="card-title mb-3">
                            <i class="fas fa-cube text-primary me-2"></i>
                            Informasi Produk
                        </h6>
                        <div class="row">
                            <div class="col-md-6">
                                <dl class="row mb-0">
                                    <dt class="col-sm-4">Kode:</dt>
                                    <dd class="col-sm-8">
                                        <span class="badge bg-secondary">{{
                                            productData.product_code
                                        }}</span>
                                    </dd>
                                    <dt class="col-sm-4">Nama:</dt>
                                    <dd class="col-sm-8 fw-medium">
                                        {{ productData.product_name }}
                                    </dd>
                                </dl>
                            </div>
                            <div class="col-md-6">
                                <dl class="row mb-0">
                                    <dt class="col-sm-5">Packaging Size:</dt>
                                    <dd class="col-sm-7">
                                        <span class="badge bg-info">{{
                                            productData.packaging_size || "-"
                                        }}</span>
                                    </dd>
                                    <dt class="col-sm-5">Packaging Type:</dt>
                                    <dd class="col-sm-7">
                                        <span class="badge bg-success">{{
                                            productData.packaging_type || "-"
                                        }}</span>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stock Details Table -->
            <div v-if="!isLoading">
                <h6 class="mb-3">
                    <i class="fas fa-warehouse text-success me-2"></i>
                    Stock Product
                </h6>

                <!-- No Stock Data -->
                <div v-if="!hasStockData" class="alert alert-info text-center">
                    <i class="fas fa-info-circle me-2"></i>
                    Tidak ada data stock untuk produk ini
                </div>

                <!-- Stock Data Table -->
                <div v-else class="table-responsive">
                    <table class="table-hover table">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 60px">#</th>
                                <th class="text-center">Stock Utama</th>
                                <!-- <th class="text-center">Stock Input</th>  -->
                                <!-- <th class="text-center">Total (Unit Terkecil)</th> -->
                                <!-- <th class="text-center">Display</th> -->
                                <th class="text-center">Cost</th>
                                <th class="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in stockDetails">
                                <td class="text-muted">{{ index + 1 }}</td>
                                <td class="text-center">
                                    <span class="badge bg-primary fs-6">
                                        {{
                                            formatNumberWithCommas(
                                                item.stock.packaging_size_input,
                                            )
                                        }}
                                    </span>
                                </td>
                                <!-- <td class="text-center"> -->
                                <!-- <span class="badge bg-secondary fs-6">{{ item.stock.packaging_size_input }}</span> -->
                                <!-- </td> -->
                                <!-- <td class="text-center"> -->
                                <!-- <span class="badge bg-dark fs-6">{{ item.stock.real_quantity_smallest_unit }}</span> -->
                                <!-- </td> -->
                                <!-- <td class="text-center">
                                    <span class="text-muted">{{ item.stock.formatted_quantity }}</span>
                                </td> -->
                                <td class="text-center">
                                    <span
                                        v-if="item.stock.cost_amount"
                                        class="fw-medium"
                                    >
                                        {{
                                            formatCurrency(
                                                item.stock.cost_amount,
                                            )
                                        }}
                                    </span>
                                    <span v-else class="text-muted">-</span>
                                </td>
                                <td class="text-center">
                                    <span
                                        :class="
                                            getStockStatus(item.stock).class
                                        "
                                    >
                                        <i
                                            class="fas fa-circle me-1"
                                            style="font-size: 0.5rem"
                                        ></i>
                                        {{ getStockStatus(item.stock).text }}
                                    </span>
                                    <div
                                        v-if="item.stock.track_alert"
                                        class="mt-1"
                                    >
                                        <i
                                            class="fas fa-bell text-warning"
                                            title="Alert aktif"
                                        ></i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Summary Information -->
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">
                <i class="fas fa-times me-1"></i>
                Tutup
            </button>
        </div>
    </Modal>
</template>

<style scoped>
.table th {
    border-top: none;
    font-weight: 600;
    font-size: 0.875rem;
}

.table td {
    vertical-align: middle;
}

.badge {
    font-size: 0.75rem;
}

.modal-body {
    background-color: #f8f9fa;
}

.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

dl.row dt {
    font-weight: 600;
    color: #6c757d;
    font-size: 0.875rem;
}

dl.row dd {
    font-size: 0.875rem;
}
</style>
