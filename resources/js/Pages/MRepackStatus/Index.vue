<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import RepackStatusFormModal from "@/Pages/MRepackStatus/RepackStatusFormModal.vue";
import { Head, router, useForm } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { computed, ref, watch } from "vue";

const props = defineProps(["repack_statuses", "filters"]);

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

        router.get("/repack-status", params, {
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

    router.get("/repack-status", params, {
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
        "repack_code",
        "repack_name",
        "created_at",
        "updated_at",
    ];
    return sortableFields.includes(field);
};

const openAddRepackStatus = () => {
    modalRef.value.open();
};

const openEditRepackStatus = (repack_status) => {
    modalRef.value.open(repack_status);
};

import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const deleteRepackStatus = (id) => {
    proxy.$confirmDelete("/repack-status", id);
};

// Clear all filters
const clearFilters = () => {
    search.value = "";
    currentSort.value = "";
    router.get(
        "/repack-status",
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
    importForm.post(route("repack-status.import"), {
        forceFormData: true,
        onSuccess: () => closeImportModal(),
    });
};
</script>

<template>
    <Head title="Status Repack" />
    <AuthenticatedLayout title="Daftar Status Repack">
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
                            placeholder="Cari berdasarkan kode atau nama status repack..."
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
                            @click="openAddRepackStatus"
                        >
                            <i class="fas fa-plus me-1"></i>
                            Tambah Status Repack
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabel Status Repack -->
        <div class="card">
            <div class="table-responsive">
                <table class="table-hover mb-0 table">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 60px">#</th>
                            <th
                                :class="{
                                    sortable: isSortable('repack_code'),
                                }"
                                @click="
                                    isSortable('repack_code') &&
                                    handleSort('repack_code')
                                "
                                style="cursor: pointer"
                            >
                                Kode Status Repack
                                <i
                                    v-if="isSortable('repack_code')"
                                    :class="getSortIcon('repack_code')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th
                                :class="{
                                    sortable: isSortable('repack_name'),
                                }"
                                @click="
                                    isSortable('repack_name') &&
                                    handleSort('repack_name')
                                "
                                style="cursor: pointer"
                            >
                                Nama Status Repack
                                <i
                                    v-if="isSortable('repack_name')"
                                    :class="getSortIcon('repack_name')"
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
                            v-if="
                                repack_statuses.data &&
                                repack_statuses.data.length === 0
                            "
                        >
                            <td colspan="5" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">
                                    Tidak ada data yang sesuai dengan pencarian
                                    "{{ search }}"
                                </div>
                                <div v-else>Belum ada data status repack</div>
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="(
                                repack_status, index
                            ) in repack_statuses.data"
                            :key="repack_status.id"
                        >
                            <td class="text-muted text-center">
                                {{ repack_statuses.from + index }}
                            </td>
                            <td>
                                <span class="badge bg-secondary">{{
                                    repack_status.repack_code
                                }}</span>
                            </td>
                            <td class="fw-medium">
                                {{ repack_status.repack_name }}
                            </td>
                            <td class="text-muted">
                                {{
                                    new Date(
                                        repack_status.created_at,
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
                                            openEditRepackStatus(repack_status)
                                        "
                                        class="btn btn-outline-warning"
                                        title="Edit Status Repack"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        @click="
                                            deleteRepackStatus(repack_status.id)
                                        "
                                        class="btn btn-outline-danger"
                                        title="Hapus Status Repack"
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
            <Pagination :links="repack_statuses.links" />
        </div>

        <RepackStatusFormModal ref="modalRef" @saved="router.reload()" />

        <!-- Import Modal -->
        <div v-if="showImportModal" class="modal-backdrop fade show" @click="closeImportModal"></div>
        <div v-if="showImportModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-file-import me-2"></i>
                            Import Status Repack
                        </h5>
                        <button type="button" class="btn-close" @click="closeImportModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info mb-3">
                            <i class="fas fa-info-circle me-1"></i>
                            Download template terlebih dahulu, isi data sesuai format, lalu upload file yang sudah diisi.
                        </div>
                        <div class="mb-3">
                            <a :href="route('repack-status.import-template')" class="btn btn-outline-primary">
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
