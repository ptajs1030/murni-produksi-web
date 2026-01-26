<script setup>
import Pagination from '@/Components/Pagination.vue';
import TextInput from '@/Components/TextInput.vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import PackagingSizeTypeFormModal from '@/Pages/MPackagingSizeTypes/PackagingSizeTypeFormModal.vue';
import { Head, router } from '@inertiajs/vue3';
import { debounce } from 'lodash';
import { computed, ref, watch } from 'vue';

const props = defineProps(['packagingSizeTypes', 'filters']);

const modalRef = ref(null);
const search = ref(props.filters.search || '');
const currentSort = ref('');
const sortDirection = ref('');

// Parse current sort from URL
const initializeSort = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sort = urlParams.get('sort');
    if (sort) {
        if (sort.startsWith('-')) {
            currentSort.value = sort.substring(1);
            sortDirection.value = 'desc';
        } else {
            currentSort.value = sort;
            sortDirection.value = 'asc';
        }
    }
};

initializeSort();

// Watch for search changes
watch(
    search,
    debounce(value => {
        const params = {};
        if (value) params.search = value;

        // Preserve existing sort
        const urlParams = new URLSearchParams(window.location.search);
        const existingSort = urlParams.get('sort');
        if (existingSort) params.sort = existingSort;

        router.get('/packaging-size-types', params, {
            preserveState: true,
            replace: true,
        });
    }, 300)
);

// Handle sorting
const handleSort = field => {
    let sortValue = field;

    // Toggle sort direction if clicking the same field
    if (currentSort.value === field) {
        if (sortDirection.value === 'asc') {
            sortValue = `-${field}`;
            sortDirection.value = 'desc';
        } else {
            sortDirection.value = 'asc';
        }
    } else {
        // Default to ascending for new field
        currentSort.value = field;
        sortDirection.value = 'asc';
    }

    const params = { sort: sortValue };
    if (search.value) params.search = search.value;

    router.get('/packaging-size-types', params, {
        preserveState: true,
        replace: true,
    });
};

// Get sort icon for column
const getSortIcon = field => {
    if (currentSort.value !== field) return 'fas fa-sort text-muted';
    return sortDirection.value === 'asc' ? 'fas fa-sort-up text-primary' : 'fas fa-sort-down text-primary';
};

// Check if column is sortable
const isSortable = field => {
    const sortableFields = ['id', 'type_code', 'type_description', 'created_at', 'updated_at'];
    return sortableFields.includes(field);
};

const openAddPackagingSizeType = () => {
    modalRef.value.open();
};

const openEditPackagingSizeType = packagingSizeType => {
    modalRef.value.open(packagingSizeType);
};

import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const deletePackagingSizeType = id => {
    proxy.$confirmDelete('/packaging-size-types', id);
};

// Clear all filters
const clearFilters = () => {
    search.value = '';
    currentSort.value = '';
    router.get(
        '/packaging-size-types',
        {},
        {
            preserveState: true,
            replace: true,
        }
    );
};

// Check if any filters are active
const hasActiveFilters = computed(() => {
    return search.value || currentSort.value;
});
</script>

<template>
    <Head title="Tipe Ukuran Kemasan" />
    <AuthenticatedLayout title="Daftar Tipe Ukuran Kemasan">
        <!-- Filter Section -->
        <div class="card mb-3">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-md-4">
                        <label class="form-label">Pencarian</label>
                        <TextInput
                            v-model="search"
                            type="text"
                            placeholder="Cari berdasarkan kode atau nama tipe ukuran kemasan..."
                        />
                    </div>
                    <div class="col-md-2">
                        <button v-if="hasActiveFilters" @click="clearFilters" class="btn btn-outline-secondary">
                            <i class="fas fa-times me-1"></i>
                            Clear
                        </button>
                    </div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-primary" @click="openAddPackagingSizeType">
                            <i class="fas fa-plus me-1"></i>
                            Tambah Tipe Ukuran Kemasan
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Info -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="text-muted">
                Menampilkan {{ packagingSizeTypes.from || 0 }} - {{ packagingSizeTypes.to || 0 }} dari
                {{ packagingSizeTypes.total || 0 }} data
            </div>
            <div v-if="hasActiveFilters" class="text-muted">
                <i class="fas fa-filter me-1"></i>
                Filter aktif
            </div>
        </div>

        <!-- Tabel Tipe Ukuran Kemasan -->
        <div class="card">
            <div class="table-responsive">
                <table class="table-hover mb-0 table">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 60px">#</th>
                            <th
                                :class="{
                                    sortable: isSortable('type_code'),
                                }"
                                @click="isSortable('type_code') && handleSort('type_code')"
                                style="cursor: pointer"
                            >
                                Kode Tipe Ukuran Kemasan
                                <i v-if="isSortable('type_code')" :class="getSortIcon('type_code')" class="ms-1"></i>
                            </th>
                            <th
                                :class="{
                                    sortable: isSortable('type_description'),
                                }"
                                @click="isSortable('type_description') && handleSort('type_description')"
                                style="cursor: pointer"
                            >
                                Nama Tipe Ukuran Kemasan
                                <i
                                    v-if="isSortable('type_description')"
                                    :class="getSortIcon('type_description')"
                                    class="ms-1"
                                ></i>
                            </th>
                            <th
                                :class="{ sortable: isSortable('created_at') }"
                                @click="isSortable('created_at') && handleSort('created_at')"
                                style="cursor: pointer"
                            >
                                Tanggal Dibuat
                                <i v-if="isSortable('created_at')" :class="getSortIcon('created_at')" class="ms-1"></i>
                            </th>
                            <th class="text-center" style="width: 120px">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="packagingSizeTypes.data && packagingSizeTypes.data.length === 0">
                            <td colspan="5" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">Tidak ada data yang sesuai dengan pencarian "{{ search }}"</div>
                                <div v-else>Belum ada data tipe ukuran kemasan</div>
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="(packagingSizeType, index) in packagingSizeTypes.data"
                            :key="packagingSizeType.id"
                        >
                            <td class="text-muted text-center">
                                {{ packagingSizeTypes.from + index }}
                            </td>
                            <td>
                                <span class="badge bg-secondary">{{ packagingSizeType.type_code }}</span>
                            </td>
                            <td class="fw-medium">
                                {{ packagingSizeType.type_description }}
                            </td>
                            <td class="text-muted">
                                {{
                                    new Date(packagingSizeType.created_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })
                                }}
                            </td>
                            <td class="text-center">
                                <div class="btn-group btn-group-md" role="group">
                                    <button
                                        @click="openEditPackagingSizeType(packagingSizeType)"
                                        class="btn btn-outline-warning"
                                        title="Edit Tipe Ukuran Kemasan"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        @click="deletePackagingSizeType(packagingSizeType.id)"
                                        class="btn btn-outline-danger"
                                        title="Hapus Tipe Ukuran Kemasan"
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
            <Pagination :links="packagingSizeTypes.links" />
        </div>

        <PackagingSizeTypeFormModal ref="modalRef" @saved="router.reload()" />
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
