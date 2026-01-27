<script setup>
import Pagination from '@/Components/Pagination.vue';
import TextInput from '@/Components/TextInput.vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import IncomingProductModal from './IncomingProductModal.vue';
import { Head, router } from '@inertiajs/vue3';
import { debounce } from 'lodash';
import { computed, ref, watch } from 'vue';

const props = defineProps(['incoming', 'products', 'filters']);

const modalRef = ref(null);
const search = ref(props.filters?.search || '');

watch(
    search,
    debounce((value) => {
        const params = {};
        if (value) params.search = value;
        router.get(route('incoming-goods.index'), params, {
            preserveState: true,
            replace: true,
        });
    }, 300)
);

const clearFilters = () => {
    search.value = '';
    router.get(route('incoming-goods.index'), {}, {
        preserveState: true,
        replace: true,
    });
};

const hasActiveFilters = computed(() => !!search.value);

const openAddModal = () => {
    modalRef.value?.open();
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
</script>

<template>
    <Head title="Barang Datang" />

    <AuthenticatedLayout title="Barang Datang">
        <!-- Filter -->
        <div class="card mb-3">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-md-4">
                        <label class="form-label">Pencarian</label>
                        <TextInput
                            v-model="search"
                            type="text"
                            placeholder="Cari berdasarkan nama produk..."
                        />
                    </div>
                    <div class="col-md-2">
                        <button
                            v-if="hasActiveFilters"
                            type="button"
                            class="btn btn-outline-secondary"
                            @click="clearFilters"
                        >
                            <i class="fas fa-times me-1"></i>
                            Clear
                        </button>
                    </div>
                    <div class="col-md-6 text-end">
                        <button type="button" class="btn btn-primary" @click="openAddModal">
                            <i class="fas fa-plus me-1"></i>
                            Tambah Barang Datang
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results info -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="text-muted">
                Menampilkan {{ incoming?.from ?? 0 }} - {{ incoming?.to ?? 0 }} dari {{ incoming?.total ?? 0 }} data
            </div>
            <div v-if="hasActiveFilters" class="text-muted">
                <i class="fas fa-filter me-1"></i>
                Filter aktif
            </div>
        </div>

        <!-- Table -->
        <div class="card">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 60px">No</th>
                            <th>Nama Produk</th>
                            <th class="text-center" style="width: 120px">Quantity</th>
                            <th style="width: 180px">Kapan Barang Datang</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!incoming?.data?.length">
                            <td colspan="4" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">
                                    Tidak ada data yang sesuai dengan pencarian "{{ search }}"
                                </div>
                                <div v-else>Belum ada data barang datang</div>
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="(row, index) in incoming.data"
                            :key="row.id"
                        >
                            <td class="text-muted text-center">
                                {{ (incoming.from ?? 0) + index }}
                            </td>
                            <td class="fw-medium">
                                {{ row.product?.product_name ?? '-' }}
                            </td>
                            <td class="text-center">
                                {{ row.stock }}
                            </td>
                            <td class="text-muted">
                                {{ formatDate(row.created_at) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-3">
            <Pagination :links="incoming?.links ?? []" />
        </div>

        <IncomingProductModal ref="modalRef" :products="products ?? []" @saved="router.reload()" />
    </AuthenticatedLayout>
</template>

<style scoped>
.table th {
    font-weight: 600;
}
</style>
