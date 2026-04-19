<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import PackagingSizeFormModal from "@/Pages/MPackagingSizes/PackagingSizeFormModal.vue";
import { Head, router, useForm } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { computed, ref, watch } from "vue";

const props = defineProps([
    "packagingSizes",
    "packagingSizeTypes",
    "packagingSizeLevels",
    "filters",
]);

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

        router.get("/packaging-sizes", params, {
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

    router.get("/packaging-sizes", params, {
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
        "packaging_size_code",
        "packaging_size_name",
        "created_at",
        "updated_at",
    ];
    return sortableFields.includes(field);
};

const openAddPackagingSize = () => {
    modalRef.value.open();
};

const openEditPackagingSize = (packagingSize) => {
    modalRef.value.open(packagingSize);
};

import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const deletePackagingSize = (id) => {
    proxy.$confirmDelete("/packaging-sizes", id);
};

// Clear all filters
const clearFilters = () => {
    search.value = "";
    currentSort.value = "";
    router.get(
        "/packaging-sizes",
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

// Import modal
const showImportModal = ref(false);
const importForm = useForm({ file: null });

const openImportModal = () => {
    showImportModal.value = true;
    importForm.reset();
    importForm.clearErrors();
};

const closeImportModal = () => {
    showImportModal.value = false;
    importForm.reset();
    importForm.clearErrors();
};

const handleFileChange = (e) => {
    importForm.file = e.target.files[0];
};

const submitImport = () => {
    importForm.post(route("packaging-sizes.import"), {
        forceFormData: true,
        onSuccess: () => closeImportModal(),
    });
};
</script>

<template>
    <Head title="Ukuran Kemasan" />
    <AuthenticatedLayout title="Daftar Ukuran Kemasan">
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
                            placeholder="Cari berdasarkan kode atau nama ukuran kemasan..."
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
                    <div class="d-flex gap-2">
                        <button
                            class="btn btn-outline-success"
                            @click="openImportModal"
                        >
                            <i class="fas fa-file-import me-1"></i>
                            Import
                        </button>
                        <button
                            class="btn btn-primary"
                            @click="openAddPackagingSize"
                        >
                            <i class="fas fa-plus me-1"></i>
                            Tambah Ukuran Kemasan
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabel Ukuran Kemasan -->
        <div class="card">
            <div class="table-responsive">
                <table class="table-hover mb-0 table">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 60px">#</th>
                            <th
                                :class="{
                                    sortable: isSortable('packaging_size_code'),
                                }"
                                @click="
                                    isSortable('packaging_size_code') &&
                                    handleSort('packaging_size_code')
                                "
                                style="cursor: pointer"
                            >
                                Kode Ukuran Kemasan
                                <i
                                    v-if="isSortable('packaging_size_code')"
                                    :class="getSortIcon('packaging_size_code')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th
                                :class="{
                                    sortable: isSortable('packaging_size_name'),
                                }"
                                @click="
                                    isSortable('packaging_size_name') &&
                                    handleSort('packaging_size_name')
                                "
                                style="cursor: pointer"
                            >
                                Nama Ukuran Kemasan
                                <i
                                    v-if="isSortable('packaging_size_name')"
                                    :class="getSortIcon('packaging_size_name')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th
                                :class="{
                                    sortable: isSortable('packaging_size_name'),
                                }"
                                @click="
                                    isSortable('packaging_size_name') &&
                                    handleSort('packaging_size_name')
                                "
                                style="cursor: pointer"
                            >
                                Conversion Kemasan
                                <i
                                    v-if="isSortable('unit_conversion_value')"
                                    :class="
                                        getSortIcon('unit_conversion_value')
                                    "
                                    class="ms-1"
                                ></i>
                            </th>
                            <th>Tipe Ukuran</th>
                            <th>Level Ukuran</th>
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
                                packagingSizes.data &&
                                packagingSizes.data.length === 0
                            "
                        >
                            <td colspan="7" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">
                                    Tidak ada data yang sesuai dengan pencarian
                                    "{{ search }}"
                                </div>
                                <div v-else>Belum ada data ukuran kemasan</div>
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="(
                                packagingSize, index
                            ) in packagingSizes.data"
                            :key="packagingSize.id"
                        >
                            <td class="text-muted text-center">
                                {{ packagingSizes.from + index }}
                            </td>
                            <td>
                                <span class="badge bg-secondary">{{
                                    packagingSize.packaging_size_code
                                }}</span>
                            </td>
                            <td class="fw-medium">
                                {{ packagingSize.packaging_size_name }}
                            </td>
                            <td class="text-center">
                                <span class="badge bg-info text-dark">
                                    {{
                                        packagingSize.unit_conversion_value ??
                                        "N/A"
                                    }}
                                </span>
                            </td>
                            <td>
                                <span class="badge bg-info text-dark">
                                    {{
                                        packagingSize.size_type
                                            ?.type_description || "N/A"
                                    }}
                                </span>
                            </td>
                            <td>
                                <span class="badge bg-success">
                                    {{
                                        packagingSize.size_level
                                            ?.level_description || "N/A"
                                    }}
                                </span>
                            </td>
                            <td class="text-muted">
                                {{
                                    new Date(
                                        packagingSize.created_at,
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
                                            openEditPackagingSize(packagingSize)
                                        "
                                        class="btn btn-outline-warning"
                                        title="Edit Ukuran Kemasan"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        @click="
                                            deletePackagingSize(
                                                packagingSize.id,
                                            )
                                        "
                                        class="btn btn-outline-danger"
                                        title="Hapus Ukuran Kemasan"
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
            <Pagination :links="packagingSizes.links" />
        </div>

        <PackagingSizeFormModal
            ref="modalRef"
            :packagingSizeTypes="packagingSizeTypes"
            :packagingSizeLevels="packagingSizeLevels"
            @saved="router.reload()"
        />

        <!-- Import Modal -->
        <div v-if="showImportModal" class="modal-backdrop fade show" @click="closeImportModal"></div>
        <div v-if="showImportModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-file-import me-2"></i>
                            Import Ukuran Kemasan
                        </h5>
                        <button type="button" class="btn-close" @click="closeImportModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info mb-3">
                            <i class="fas fa-info-circle me-1"></i>
                            Download template terlebih dahulu, isi data sesuai format, lalu upload file yang sudah diisi.
                        </div>
                        <div class="mb-3">
                            <a :href="route('packaging-sizes.import-template')" class="btn btn-outline-primary">
                                <i class="fas fa-download me-1"></i>
                                Download Template
                            </a>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-medium">File Excel</label>
                            <input type="file" class="form-control" :class="{ 'is-invalid': importForm.errors.file }" accept=".xlsx,.xls" @change="handleFileChange" />
                            <div v-if="importForm.errors.file" class="invalid-feedback">{{ importForm.errors.file }}</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeImportModal">Batal</button>
                        <button type="button" class="btn btn-success" @click="submitImport" :disabled="importForm.processing || !importForm.file">
                            <span v-if="importForm.processing" class="spinner-border spinner-border-sm me-1"></span>
                            <i v-else class="fas fa-upload me-1"></i>
                            Upload & Import
                        </button>
                    </div>
                </div>
            </div>
        </div>
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
