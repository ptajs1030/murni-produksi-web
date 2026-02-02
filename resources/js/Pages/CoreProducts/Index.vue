<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import ProductStockDetail from "@/Pages/CoreProducts/ProductStockDetail.vue";
import { Head, router } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { computed, ref, watch } from "vue";

const props = defineProps(["products", "filters"]);
const search = ref(props.filters.search || "");
const currentSort = ref("");
const sortDirection = ref("");
const stockDetailModalRef = ref(null);

// Parse current sort from URL
const initializeSort = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sort = urlParams.get("sort");
    if (sort) {
        if (sort.startsWith("-")) {
            currentSort.value = sort.substring(1);
            sortDirection.value = "desc";
        } else {
            currentSort.value = sort;
            sortDirection.value = "asc";
        }
    }
};

initializeSort();

// Watch for search changes
watch(
    search,
    debounce((value) => {
        const params = {};
        if (value) params.search = value;

        // Preserve existing sort
        const urlParams = new URLSearchParams(window.location.search);
        const existingSort = urlParams.get("sort");
        if (existingSort) params.sort = existingSort;

        router.get("/products", params, {
            preserveState: true,
            replace: true,
        });
    }, 300),
);

// Handle sorting
const handleSort = (field) => {
    let sortValue = field;

    // Toggle sort direction if clicking the same field
    if (currentSort.value === field) {
        if (sortDirection.value === "asc") {
            sortValue = `-${field}`;
            sortDirection.value = "desc";
        } else {
            sortDirection.value = "asc";
        }
    } else {
        // Default to ascending for new field
        currentSort.value = field;
        sortDirection.value = "asc";
    }

    const params = { sort: sortValue };
    if (search.value) params.search = search.value;

    router.get("/products", params, {
        preserveState: true,
        replace: true,
    });
};

// Get sort icon for column
const getSortIcon = (field) => {
    if (currentSort.value !== field) return "fas fa-sort text-muted";
    return sortDirection.value === "asc"
        ? "fas fa-sort-up text-primary"
        : "fas fa-sort-down text-primary";
};

// Check if column is sortable
const isSortable = (field) => {
    const sortableFields = [
        "id",
        "product_name",
        "brand_name",
        "category_name",
        "supplier_name",
        "product_unit_price",
        "product_unit_qty",
        "expired_date",
        "created_at",
        "updated_at",
    ];
    return sortableFields.includes(field);
};

const openAddProduct = () => {
    router.visit(route("products.create"));
};

const openEditProduct = (product) => {
    router.visit(route("products.edit", product.id));
};

import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const deleteProduct = (id) => {
    proxy.$confirmDelete("/products", id);
};

const openStockDetail = (product) => {
    stockDetailModalRef.value.open(product.id);
};

// Clear all filters
const clearFilters = () => {
    search.value = "";
    currentSort.value = "";
    router.get(
        "/products",
        {},
        {
            preserveState: true,
            replace: true,
        },
    );
};

// Check if any filters are active
const hasActiveFilters = computed(() => {
    return search.value || currentSort.value;
});
</script>

<template>
    <Head title="Produk" />
    <AuthenticatedLayout title="Daftar Produk">
        <!-- Header -->
        <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div class="p-3 text-gray-900">
                <div
                    class="d-flex justify-content-between align-items-center mb-3"
                >
                    <div class="d-flex align-items-center gap-3">
                        <TextInput
                            id="search"
                            v-model="search"
                            type="text"
                            class="form-control"
                            placeholder="Cari berdasarkan kode, nama produk, kategori, atau brand..."
                            style="width: 400px"
                        />
                        <button
                            v-if="hasActiveFilters"
                            @click="clearFilters"
                            class="btn btn-outline-secondary"
                        >
                            <i class="fas fa-times me-1"></i>
                            Clear
                        </button>
                    </div>
                    <button class="btn btn-primary" @click="openAddProduct">
                        <i class="fas fa-plus me-1"></i>
                        Tambah Produk
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabel Produk -->
        <div class="card">
            <div class="table-responsive">
                <table class="table-hover mb-0 table">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 60px">#</th>
                            <th>SKU</th>
                            <th
                                :class="{
                                    sortable: isSortable('product_name'),
                                }"
                                @click="
                                    isSortable('product_name') &&
                                    handleSort('product_name')
                                "
                                style="cursor: pointer"
                            >
                                Nama Produk
                                <i
                                    v-if="isSortable('product_name')"
                                    :class="getSortIcon('product_name')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th
                                :class="{
                                    sortable: isSortable('category_name'),
                                }"
                                @click="
                                    isSortable('category_name') &&
                                    handleSort('category_name')
                                "
                                style="cursor: pointer"
                            >
                                Kategori
                                <i
                                    v-if="isSortable('category_name')"
                                    :class="getSortIcon('category_name')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th class="text-center" style="width: 140px">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="products.data && products.data.length === 0">
                            <td colspan="5" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">
                                    Tidak ada data yang sesuai dengan pencarian
                                    "{{ search }}"
                                </div>
                                <div v-else>Belum ada data produk</div>
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="(product, index) in products.data"
                            :key="product.id"
                        >
                            <td class="text-muted text-center">
                                {{ products.from + index }}
                            </td>
                            <td>
                                <span class="badge bg-secondary">{{
                                    product.product_unit_sku
                                }}</span>
                            </td>
                            <td class="fw-medium">
                                {{ product.product_name }}
                            </td>
                            <td>
                                {{
                                    product.category
                                        ? product.category.category_name
                                        : "-"
                                }}
                            </td>
                            <td class="text-center">
                                <div
                                    class="btn-group btn-group-sm"
                                    role="group"
                                >
                                    <button
                                        @click="openStockDetail(product)"
                                        class="btn btn-outline-info"
                                        title="Detail Stock"
                                    >
                                        <i class="fas fa-boxes"></i>
                                    </button>
                                    <button
                                        @click="openEditProduct(product)"
                                        class="btn btn-outline-warning"
                                        title="Edit Produk"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        @click="deleteProduct(product.id)"
                                        class="btn btn-outline-danger"
                                        title="Hapus Produk"
                                    >
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div class="mt-3">
            <Pagination :links="products.links" />
        </div>

        <!-- Stock Detail Modal -->
        <ProductStockDetail ref="stockDetailModalRef" />
    </AuthenticatedLayout>
</template>

<style scoped>
.sortable:hover {
    background-color: var(--bs-gray-100);
}

.table th.sortable {
    user-select: none;
}

.badge {
    font-size: 0.875em;
    font-weight: 500;
}
</style>
