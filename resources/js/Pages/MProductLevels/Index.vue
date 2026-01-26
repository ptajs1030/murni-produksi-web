<script setup>
import Pagination from '@/Components/Pagination.vue';
import TextInput from '@/Components/TextInput.vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { debounce } from 'lodash';
import { computed, ref, watch } from 'vue';
import ProductLevelsFormModal from './ProductLevelsFormModal.vue';

const props = defineProps(['productLevels', 'filters']);

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

        router.get('/packaging-size-levels', params, {
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

    router.get('/packaging-size-levels', params, {
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
    const sortableFields = ['id', 'level_code', 'level_description', 'created_at', 'updated_at'];
    return sortableFields.includes(field);
};

const openAddWarehouse = () => {
    modalRef.value.open();
};

const openEditWarehouse = level => {
    modalRef.value.open(level);
};

import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const deleteWarehouse = id => {
    proxy.$confirmDelete('/packaging-size-levels', id);
};

// Clear all filters
const clearFilters = () => {
    search.value = '';
    currentSort.value = '';
    router.get(
        '/packaging-size-levels',
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
    <Head title="Product Level" />
    <AuthenticatedLayout title="Daftar Product Level">
        <!-- Filter Section -->
        <div class="card mb-3">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-md-4">
                        <label class="form-label">Pencarian</label>
                        <TextInput v-model="search" type="text" placeholder="Cari berdasarkan nama product level..." />
                    </div>
                    <div class="col-md-2">
                        <button v-if="hasActiveFilters" @click="clearFilters" class="btn btn-outline-secondary">
                            <i class="fas fa-times me-1"></i>
                            Clear
                        </button>
                    </div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-primary" @click="openAddWarehouse">
                            <i class="fas fa-plus me-1"></i>
                            Tambah Product Level
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Info -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="text-muted">
                Menampilkan {{ productLevels.from || 0 }} - {{ productLevels.to || 0 }} dari
                {{ productLevels.total || 0 }} data
            </div>
            <div v-if="hasActiveFilters" class="text-muted">
                <i class="fas fa-filter me-1"></i>
                Filter aktif
            </div>
        </div>

        <!-- Tabel Level -->
        <div class="card">
            <div class="table-responsive">
                <table class="table-hover mb-0 table">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 60px">#</th>
                            <th
                                :class="{
                                    sortable: isSortable('level_code'),
                                }"
                                @click="isSortable('level_code') && handleSort('level_code')"
                                style="cursor: pointer"
                            >
                                Level Code
                                <i v-if="isSortable('level_code')" :class="getSortIcon('level_code')" class="ms-1"></i>
                            </th>
                            <th
                                :class="{
                                    sortable: isSortable('level_description'),
                                }"
                                @click="isSortable('level_description') && handleSort('level_description')"
                                style="cursor: pointer"
                            >
                                Description
                                <i
                                    v-if="isSortable('level_description')"
                                    :class="getSortIcon('level_description')"
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
                        <tr v-if="productLevels.data && productLevels.data.length === 0">
                            <td colspan="5" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">Tidak ada data yang sesuai dengan pencarian "{{ search }}"</div>
                                <div v-else>Belum ada data product level</div>
                            </td>
                        </tr>
                        <tr v-else v-for="(productLevel, index) in productLevels.data" :key="productLevel.id">
                            <td class="text-muted text-center">
                                {{ productLevels.from + index }}
                            </td>
                            <td class="fw-medium">
                                {{ productLevel.level_code }}
                            </td>
                            <td class="fw-medium">
                                {{ productLevel.level_description }}
                            </td>
                            <td class="text-muted">
                                {{
                                    new Date(productLevel.created_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })
                                }}
                            </td>
                            <td class="text-center">
                                <div class="btn-group btn-group-md" role="group">
                                    <button
                                        @click="openEditWarehouse(productLevel)"
                                        class="btn btn-outline-warning"
                                        title="Edit Product Level"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        @click="deleteWarehouse(productLevel.id)"
                                        class="btn btn-outline-danger"
                                        title="Hapus Product Level"
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
            <Pagination :links="productLevels.links" />
        </div>

        <ProductLevelsFormModal ref="modalRef" @saved="router.reload()" />
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
