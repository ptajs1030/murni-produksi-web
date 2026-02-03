<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import PackagingTypeFormModal from "@/Pages/MPackagingTypes/PackagingTypeFormModal.vue";
import { Head, router } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { computed, ref, watch } from "vue";

const props = defineProps(["packaging_types", "packagingLevels", "filters"]);

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

        router.get("/packaging-types", params, {
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

    router.get("/packaging-types", params, {
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
        "packaging_type_code",
        "packaging_type_name",
        "created_at",
        "updated_at",
    ];
    return sortableFields.includes(field);
};

const openAddPackagingType = () => {
    modalRef.value.open();
};

const openEditPackagingType = (packaging_type) => {
    modalRef.value.open(packaging_type);
};

import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const deletePackagingType = (id) => {
    proxy.$confirmDelete("/packaging-types", id);
};
// Clear all filters
const clearFilters = () => {
    search.value = "";
    currentSort.value = "";
    router.get(
        "/packaging-types",
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
    <Head title="Tipe Kemasan" />
    <AuthenticatedLayout title="Daftar Tipe Kemasan">
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
                            placeholder="Cari berdasarkan kode atau nama tipe kemasan..."
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
                    <button
                        class="btn btn-primary"
                        @click="openAddPackagingType"
                    >
                        <i class="fas fa-plus me-1"></i>
                        Tambah Tipe Kemasan
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabel Tipe Kemasan -->
        <div class="card">
            <div class="table-responsive">
                <table class="table-hover mb-0 table">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 60px">#</th>
                            <th
                                :class="{
                                    sortable: isSortable('packaging_type_code'),
                                }"
                                @click="
                                    isSortable('packaging_type_code') &&
                                    handleSort('packaging_type_code')
                                "
                                style="cursor: pointer"
                            >
                                Kode Tipe Kemasan
                                <i
                                    v-if="isSortable('packaging_type_code')"
                                    :class="getSortIcon('packaging_type_code')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th
                                :class="{
                                    sortable: isSortable('packaging_type_name'),
                                }"
                                @click="
                                    isSortable('packaging_type_name') &&
                                    handleSort('packaging_type_name')
                                "
                                style="cursor: pointer"
                            >
                                Nama Tipe Kemasan
                                <i
                                    v-if="isSortable('packaging_type_name')"
                                    :class="getSortIcon('packaging_type_name')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th>Level Kemasan</th>
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
                            v-if="
                                packaging_types.data &&
                                packaging_types.data.length === 0
                            "
                        >
                            <td colspan="6" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">
                                    Tidak ada data yang sesuai dengan pencarian
                                    "{{ search }}"
                                </div>
                                <div v-else>Belum ada data tipe kemasan</div>
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="(
                                packaging_type, index
                            ) in packaging_types.data"
                            :key="packaging_type.id"
                        >
                            <td class="text-muted text-center">
                                {{ packaging_types.from + index }}
                            </td>
                            <td>
                                <span class="badge bg-secondary">{{
                                    packaging_type.packaging_type_code
                                }}</span>
                            </td>
                            <td class="fw-medium">
                                {{ packaging_type.packaging_type_name }}
                            </td>
                            <td>
                                <span class="badge bg-info">
                                    {{
                                        packaging_type.packaging_level
                                            ?.level_description || "N/A"
                                    }}
                                </span>
                            </td>
                            <td class="text-muted">
                                {{
                                    new Date(
                                        packaging_type.created_at,
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
                                        @click="
                                            openEditPackagingType(
                                                packaging_type,
                                            )
                                        "
                                        class="btn btn-outline-warning"
                                        title="Edit Tipe Kemasan"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        @click="
                                            deletePackagingType(
                                                packaging_type.id,
                                            )
                                        "
                                        class="btn btn-outline-danger"
                                        title="Hapus Tipe Kemasan"
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
            <Pagination :links="packaging_types.links" />
        </div>

        <PackagingTypeFormModal
            ref="modalRef"
            :packagingLevels="packagingLevels"
            @saved="router.reload()"
        />
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
