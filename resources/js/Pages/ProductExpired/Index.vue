<script setup>
import Pagination from "@/Components/Pagination.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head, router } from "@inertiajs/vue3";
import { computed, ref } from "vue";

const props = defineProps([
    "products",
    "filters",
    "categories",
    "suppliers",
    "statistics",
    "defaultDateRange",
]);

const search = ref(props.filters.search || "");
const categoryFilter = ref(props.filters.category_id || "");
const supplierFilter = ref(props.filters.supplier_id || "");
const dateFrom = ref(props.filters.date_from || "");
const dateTo = ref(props.filters.date_to || "");

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatPrice = (price) => {
    if (!price) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const formatQuantity = (quantity) => {
    if (!quantity) return "0";
    return Number(quantity).toLocaleString("id-ID");
};

const getDaysExpired = (expiredDate) => {
    if (!expiredDate) return null;
    const today = new Date();
    const expiry = new Date(expiredDate);
    const diffTime = today - expiry;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const getExpiryStatusClass = (expiredDate) => {
    const days = getDaysExpired(expiredDate);
    if (days <= 0) return "danger";
    if (days <= 7) return "warning";
    return "secondary";
};

const getExpiryStatusText = (expiredDate) => {
    const days = getDaysExpired(expiredDate);
    if (days <= 0) return "Expired hari ini";
    if (days === 1) return "Expired kemarin";
    return `Expired ${days} hari lalu`;
};

const getTotalStock = (stocks) => {
    if (!stocks || !stocks.length) return 0;
    return stocks.reduce(
        (total, stock) => total + parseFloat(stock.packaging_size_input || 0),
        0,
    );
};

const searchData = () => {
    router.get(
        route("product-expired.index"),
        {
            search: search.value,
            category_id: categoryFilter.value,
            supplier_id: supplierFilter.value,
            date_from: dateFrom.value,
            date_to: dateTo.value,
        },
        {
            preserveState: true,
            preserveScroll: true,
        },
    );
};

const resetFilters = () => {
    search.value = "";
    categoryFilter.value = "";
    supplierFilter.value = "";
    dateFrom.value = "";
    dateTo.value = "";
    searchData();
};

const setDefaultDateRange = () => {
    if (props.defaultDateRange) {
        dateFrom.value = props.defaultDateRange.from;
        dateTo.value = props.defaultDateRange.to;
        searchData();
    }
};

const totalRecords = computed(() => {
    return props.products.total || 0;
});
</script>

<template>
    <Head title="Product Expired" />

    <AuthenticatedLayout>
        <template #header>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2
                        class="text-xl font-semibold leading-tight text-gray-800"
                    >
                        Product Expired
                    </h2>
                    <p class="text-muted">
                        Monitoring produk yang sudah expired
                    </p>
                </div>
            </div>
        </template>

        <div class="p-3 text-gray-900">
            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h5 class="card-title mb-0">
                                        Total Filtered
                                    </h5>
                                    <h2 class="mb-0">
                                        {{ statistics.total_filtered }}
                                    </h2>
                                </div>
                                <i class="fas fa-filter fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-danger text-white">
                        <div class="card-body">
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h5 class="card-title mb-0">
                                        Sudah Expired
                                    </h5>
                                    <h2 class="mb-0">
                                        {{ statistics.expired_already }}
                                    </h2>
                                </div>
                                <i
                                    class="fas fa-exclamation-triangle fa-2x"
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h5 class="card-title mb-0">
                                        Akan Expired (30 Hari)
                                    </h5>
                                    <h2 class="mb-0">
                                        {{ statistics.expiring_soon }}
                                    </h2>
                                </div>
                                <i class="fas fa-calendar-times fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search and Filter Section -->
            <div class="card mb-4">
                <div class="card-body">
                    <!-- Date Range Filter Section -->
                    <div class="row g-3 mb-3">
                        <div class="col-12">
                            <h6 class="mb-2">Filter Tanggal Expired</h6>
                            <div class="alert alert-info py-2">
                                <small>
                                    <i class="fas fa-info-circle me-1"></i>
                                    Default: Produk yang expired dari H+10 hari
                                    sampai H-2 bulan dari hari ini
                                </small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Dari Tanggal</label>
                            <input
                                type="date"
                                class="form-control"
                                v-model="dateFrom"
                                placeholder="Dari tanggal"
                            />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Sampai Tanggal</label>
                            <input
                                type="date"
                                class="form-control"
                                v-model="dateTo"
                                placeholder="Sampai tanggal"
                            />
                        </div>
                        <div class="col-md-6 d-flex align-items-end">
                            <div class="btn-group">
                                <button
                                    class="btn btn-outline-primary btn-sm"
                                    @click="setDefaultDateRange"
                                >
                                    <i class="fas fa-calendar-alt"></i>
                                    Set Default Range
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr class="my-3" />

                    <!-- Other Filters -->
                    <div class="row g-3">
                        <!-- Search -->
                        <div class="col-md-3">
                            <label class="form-label">Search</label>
                            <input
                                type="text"
                                class="form-control"
                                v-model="search"
                                @keyup.enter="searchData"
                                placeholder="Cari produk, SKU, brand..."
                            />
                        </div>

                        <!-- Category Filter -->
                        <div class="col-md-2">
                            <label class="form-label">Category</label>
                            <select
                                class="form-select"
                                v-model="categoryFilter"
                            >
                                <option value="">Semua Category</option>
                                <option
                                    v-for="category in categories"
                                    :key="category.id"
                                    :value="category.id"
                                >
                                    {{ category.category_name }}
                                </option>
                            </select>
                        </div>

                        <!-- Supplier Filter -->
                        <div class="col-md-2">
                            <label class="form-label">Supplier</label>
                            <select
                                class="form-select"
                                v-model="supplierFilter"
                            >
                                <option value="">Semua Supplier</option>
                                <option
                                    v-for="supplier in suppliers"
                                    :key="supplier.id"
                                    :value="supplier.id"
                                >
                                    {{ supplier.supplier_name }}
                                </option>
                            </select>
                        </div>

                        <!-- Action Buttons -->
                        <div class="col-md-3 d-flex align-items-end">
                            <div class="btn-group w-100">
                                <button
                                    class="btn btn-primary btn-sm"
                                    @click="searchData"
                                >
                                    <i class="fas fa-search"></i>
                                    Search
                                </button>
                                <button
                                    class="btn btn-secondary btn-sm"
                                    @click="resetFilters"
                                >
                                    <i class="fas fa-undo"></i>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Summary -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="alert alert-primary">
                        <i class="fas fa-filter me-2"></i>
                        Menampilkan
                        <strong>{{ products.data.length }}</strong>
                        dari
                        <strong>{{ totalRecords }}</strong>
                        produk berdasarkan filter tanggal expired
                        <span v-if="dateFrom || dateTo" class="ms-2">
                            <span v-if="dateFrom && dateTo">
                                (Dari {{ formatDate(dateFrom) }} sampai
                                {{ formatDate(dateTo) }})
                            </span>
                            <span v-else-if="dateFrom"
                                >(Sampai dengan
                                {{ formatDate(dateFrom) }})</span
                            >
                            <span v-else-if="dateTo"
                                >(Mulai dari {{ formatDate(dateTo) }})</span
                            >
                        </span>
                        <span v-else class="ms-2"
                            >(Default: H+10 hari sampai H-2 bulan)</span
                        >
                    </div>
                </div>
            </div>

            <!-- Data Table -->
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table-striped table-hover table">
                            <thead class="table-light">
                                <tr>
                                    <th>Produk</th>
                                    <th>SKU</th>
                                    <th>Brand</th>
                                    <th>Category</th>
                                    <th>Supplier</th>
                                    <th class="text-center">Stock</th>
                                    <th class="text-center">Harga</th>
                                    <th class="text-center">Expired Date</th>
                                    <th class="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="product in products.data"
                                    :key="product.id"
                                >
                                    <td>
                                        <div class="fw-medium text-primary">
                                            {{ product.product_name }}
                                        </div>
                                        <small
                                            class="text-muted"
                                            v-if="product.description"
                                        >
                                            {{ product.description }}
                                        </small>
                                    </td>
                                    <td>
                                        <code class="text-dark">{{
                                            product.product_unit_sku
                                        }}</code>
                                    </td>
                                    <td>
                                        <span class="badge bg-secondary">
                                            {{ product.brand_name || "-" }}
                                        </span>
                                        <div
                                            v-if="product.property_item"
                                            class="mt-1"
                                        >
                                            <small class="text-muted">{{
                                                product.property_item
                                                    ?.property_name
                                            }}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge bg-info">
                                            {{
                                                product.category
                                                    ?.category_name || "-"
                                            }}
                                        </span>
                                        <div
                                            v-if="
                                                product.packaging_size ||
                                                product.packaging_type
                                            "
                                            class="mt-1"
                                        >
                                            <small class="text-muted">
                                                {{
                                                    product.packaging_size
                                                        ?.packaging_size_name
                                                }}
                                                {{
                                                    product.packaging_type
                                                        ?.packaging_type_name
                                                }}
                                            </small>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge bg-success">
                                            {{
                                                product.supplier
                                                    ?.supplier_name || "-"
                                            }}
                                        </span>
                                        <div
                                            v-if="product.repack_status"
                                            class="mt-1"
                                        >
                                            <small class="text-muted">{{
                                                product.repack_status
                                                    ?.repack_name
                                            }}</small>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <strong>{{
                                            formatQuantity(
                                                getTotalStock(product.stocks),
                                            )
                                        }}</strong>
                                    </td>
                                    <td class="text-center">
                                        <strong>{{
                                            formatPrice(
                                                product.product_unit_price,
                                            )
                                        }}</strong>
                                    </td>
                                    <td class="text-center">
                                        <div class="fw-medium">
                                            {{
                                                formatDate(product.expired_date)
                                            }}
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <span
                                            :class="`badge bg-${getExpiryStatusClass(product.expired_date)}`"
                                            class="fs-6"
                                        >
                                            {{
                                                getExpiryStatusText(
                                                    product.expired_date,
                                                )
                                            }}
                                        </span>
                                    </td>
                                </tr>

                                <!-- Empty State -->
                                <tr v-if="products.data.length === 0">
                                    <td colspan="9" class="py-4 text-center">
                                        <div class="text-muted">
                                            <i
                                                class="fas fa-check-circle fa-3x text-success mb-3"
                                            ></i>
                                            <p>Tidak ada produk yang expired</p>
                                            <small
                                                >Semua produk masih dalam
                                                kondisi baik</small
                                            >
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="products.data.length > 0" class="mt-4">
                <Pagination :links="products.links" />
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style scoped>
.badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
}

code {
    font-size: 0.875rem;
}

.table th {
    font-weight: 600;
    border-bottom: 2px solid #dee2e6;
}

.bg-primary {
    background-color: #0d6efd !important;
}

.bg-danger {
    background-color: #dc3545 !important;
}

.bg-warning {
    background-color: #ffc107 !important;
}

.bg-secondary {
    background-color: #6c757d !important;
}

.bg-info {
    background-color: #0dcaf0 !important;
}

.bg-success {
    background-color: #198754 !important;
}

.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.alert-primary {
    background-color: #cfe2ff;
    border-color: #b6d4fe;
    color: #084298;
}

.alert-danger {
    background-color: #f8d7da;
    border-color: #f5c2c7;
    color: #842029;
}
</style>
