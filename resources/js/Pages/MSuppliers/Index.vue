<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import SupplierFormModal from "@/Pages/MSuppliers/SupplierFormModal.vue";
import { Head, router } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { computed, ref, watch } from "vue";

const props = defineProps(["suppliers", "filters"]);

const modalRef = ref(null);
const search = ref(props.filters.search || "");
const currentSort = ref("");
const sortDirection = ref("");

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

        router.get("/suppliers", params, {
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

    router.get("/suppliers", params, {
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
        "supplier_code",
        "supplier_name",
        "created_at",
        "updated_at",
    ];
    return sortableFields.includes(field);
};

const openAddSupplier = () => {
    modalRef.value.open();
};

const openEditSupplier = (supplier) => {
    modalRef.value.open(supplier);
};

import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const deleteSupplier = (id) => {
    proxy.$confirmDelete("/suppliers", id);
};

// Clear all filters
const clearFilters = () => {
    search.value = "";
    currentSort.value = "";
    router.get(
        "/suppliers",
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

// Export function
const exportExcel = () => {
    const params = {};

    // Include search filter if exists
    if (search.value) {
        params.search = search.value;
    }

    // Include sort if exists
    const urlParams = new URLSearchParams(window.location.search);
    const existingSort = urlParams.get("sort");
    if (existingSort) {
        params.sort = existingSort;
    }

    // Build query string
    const queryString = new URLSearchParams(params).toString();
    const url =
        route("suppliers.export") + (queryString ? "?" + queryString : "");

    // Download file
    window.location.href = url;
};
</script>

<template>
    <Head title="Suppliers" />
    <AuthenticatedLayout title="Daftar Supplier">
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
                            placeholder="Cari berdasarkan kode atau nama supplier..."
                            style="width: 350px"
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
                    <div class="d-flex gap-2">
                        <button
                            class="btn btn-primary"
                            @click="openAddSupplier"
                        >
                            <i class="fas fa-plus me-1"></i>
                            Tambah Supplier
                        </button>
                        <button class="btn btn-success" @click="exportExcel">
                            Export Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabel Supplier -->
        <div class="card">
            <div class="table-responsive">
                <table class="table-hover mb-0 table">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 60px">#</th>
                            <th
                                :class="{
                                    sortable: isSortable('supplier_code'),
                                }"
                                @click="
                                    isSortable('supplier_code') &&
                                    handleSort('supplier_code')
                                "
                                style="cursor: pointer"
                            >
                                Kode Supplier
                                <i
                                    v-if="isSortable('supplier_code')"
                                    :class="getSortIcon('supplier_code')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th
                                :class="{
                                    sortable: isSortable('supplier_name'),
                                }"
                                @click="
                                    isSortable('supplier_name') &&
                                    handleSort('supplier_name')
                                "
                                style="cursor: pointer"
                            >
                                Nama Supplier
                                <i
                                    v-if="isSortable('supplier_name')"
                                    :class="getSortIcon('supplier_name')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th
                                :class="{ sortable: isSortable('created_at') }"
                                @click="
                                    isSortable('created_at') &&
                                    handleSort('created_at')
                                "
                                style="cursor: pointer"
                            >
                                Tanggal Dibuat
                                <i
                                    v-if="isSortable('created_at')"
                                    :class="getSortIcon('created_at')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th class="text-center" style="width: 120px">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-if="suppliers.data && suppliers.data.length === 0"
                        >
                            <td colspan="5" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">
                                    Tidak ada data yang sesuai dengan pencarian
                                    "{{ search }}"
                                </div>
                                <div v-else>Belum ada data supplier</div>
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="(supplier, index) in suppliers.data"
                            :key="supplier.id"
                        >
                            <td class="text-muted text-center">
                                {{ suppliers.from + index }}
                            </td>
                            <td>
                                <span class="badge bg-secondary">{{
                                    supplier.supplier_code
                                }}</span>
                            </td>
                            <td class="fw-medium">
                                {{ supplier.supplier_name }}
                            </td>
                            <td class="text-muted">
                                {{
                                    new Date(
                                        supplier.created_at,
                                    ).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            </td>
                            <td class="text-center">
                                <div
                                    class="btn-group btn-group-md"
                                    role="group"
                                >
                                    <button
                                        @click="openEditSupplier(supplier)"
                                        class="btn btn-outline-warning"
                                        title="Edit Supplier"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        @click="deleteSupplier(supplier.id)"
                                        class="btn btn-outline-danger"
                                        title="Hapus Supplier"
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
            <Pagination :links="suppliers.links" />
        </div>

        <SupplierFormModal ref="modalRef" @saved="router.reload()" />
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
