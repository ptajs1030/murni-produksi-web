<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import PropertyItemFormModal from "@/Pages/MPropertyItems/PropertyItemFormModal.vue";
import { Head, router, useForm } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { computed, ref, watch } from "vue";

const props = defineProps(["propertyItems", "filters"]);

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

        router.get("/property-items", params, {
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

    router.get("/property-items", params, {
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
        "property_code",
        "property_name",
        "created_at",
        "updated_at",
    ];
    return sortableFields.includes(field);
};

const openAddPropertyItem = () => {
    modalRef.value.open();
};

const openEditPropertyItem = (propertyItem) => {
    modalRef.value.open(propertyItem);
};

import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const deletePropertyItem = (id) => {
    proxy.$confirmDelete("/property-items", id);
};

// Clear all filters
const clearFilters = () => {
    search.value = "";
    currentSort.value = "";
    router.get(
        "/property-items",
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
    importForm.post(route("property-items.import"), {
        forceFormData: true,
        onSuccess: () => closeImportModal(),
    });
};
</script>

<template>
    <Head title="Property Items" />
    <AuthenticatedLayout title="Daftar Property Item">
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
                            placeholder="Cari berdasarkan kode atau nama property..."
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
                            class="btn btn-outline-success"
                            @click="openImportModal"
                        >
                            <i class="fas fa-file-import me-1"></i>
                            Import
                        </button>
                        <button
                            class="btn btn-primary"
                            @click="openAddPropertyItem"
                        >
                            <i class="fas fa-plus me-1"></i>
                            Tambah Property Item
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabel Property Item -->
        <div class="card">
            <div class="table-responsive">
                <table class="table-hover mb-0 table">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 60px">#</th>
                            <th
                                :class="{
                                    sortable: isSortable('property_code'),
                                }"
                                @click="
                                    isSortable('property_code') &&
                                    handleSort('property_code')
                                "
                                style="cursor: pointer"
                            >
                                Kode Property
                                <i
                                    v-if="isSortable('property_code')"
                                    :class="getSortIcon('property_code')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th
                                :class="{
                                    sortable: isSortable('property_name'),
                                }"
                                @click="
                                    isSortable('property_name') &&
                                    handleSort('property_name')
                                "
                                style="cursor: pointer"
                            >
                                Nama Property
                                <i
                                    v-if="isSortable('property_name')"
                                    :class="getSortIcon('property_name')"
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
                                propertyItems.data &&
                                propertyItems.data.length === 0
                            "
                        >
                            <td colspan="5" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">
                                    Tidak ada data yang sesuai dengan pencarian
                                    "{{ search }}"
                                </div>
                                <div v-else>Belum ada data property item</div>
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="(propertyItem, index) in propertyItems.data"
                            :key="propertyItem.id"
                        >
                            <td class="text-muted text-center">
                                {{ propertyItems.from + index }}
                            </td>
                            <td>
                                <span class="badge bg-secondary">{{
                                    propertyItem.property_code
                                }}</span>
                            </td>
                            <td class="fw-medium">
                                {{ propertyItem.property_name }}
                            </td>
                            <td class="text-muted">
                                {{
                                    new Date(
                                        propertyItem.created_at,
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
                                            openEditPropertyItem(propertyItem)
                                        "
                                        class="btn btn-outline-warning"
                                        title="Edit Property Item"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        @click="
                                            deletePropertyItem(propertyItem.id)
                                        "
                                        class="btn btn-outline-danger"
                                        title="Hapus Property Item"
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
            <Pagination :links="propertyItems.links" />
        </div>

        <PropertyItemFormModal ref="modalRef" @saved="router.reload()" />

        <!-- Import Modal -->
        <div v-if="showImportModal" class="modal-backdrop fade show" @click="closeImportModal"></div>
        <div v-if="showImportModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-file-import me-2"></i>
                            Import Sifat Benda
                        </h5>
                        <button type="button" class="btn-close" @click="closeImportModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info mb-3">
                            <i class="fas fa-info-circle me-1"></i>
                            Download template terlebih dahulu, isi data sesuai format, lalu upload file yang sudah diisi.
                        </div>
                        <div class="mb-3">
                            <a :href="route('property-items.import-template')" class="btn btn-outline-primary">
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
