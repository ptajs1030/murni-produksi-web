<script setup>
import Pagination from '@/Components/Pagination.vue';
import TextInput from '@/Components/TextInput.vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import OutgoingProductModal from './OutgoingProductModal.vue';
import { Head, router } from '@inertiajs/vue3';
import { debounce } from 'lodash';
import { computed, ref, watch } from 'vue';

const props = defineProps(['outgoing', 'products', 'outTypes', 'filters']);

const modalRef = ref(null);
const search = ref(props.filters?.search || '');

watch(
    search,
    debounce((value) => {
        const params = {};
        if (value) params.search = value;
        router.get(route('outgoing-goods.index'), params, {
            preserveState: true,
            replace: true,
        });
    }, 300)
);

const clearFilters = () => {
    search.value = '';
    router.get(route('outgoing-goods.index'), {}, {
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
    <Head title="Barang Keluar" />

    <AuthenticatedLayout title="Barang Keluar">
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
                            Tambah Barang Keluar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results info -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="text-muted">
                Menampilkan {{ outgoing?.from ?? 0 }} - {{ outgoing?.to ?? 0 }} dari {{ outgoing?.total ?? 0 }} data
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
                            <th style="width: 140px">Tipe Keluar</th>
                            <th style="width: 180px">Kapan Barang Keluar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!outgoing?.data?.length">
                            <td colspan="5" class="text-muted py-4 text-center">
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">
                                    Tidak ada data yang sesuai dengan pencarian "{{ search }}"
                                </div>
                                <div v-else>Belum ada data barang keluar</div>
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="(row, index) in outgoing.data"
                            :key="row.id"
                        >
                            <td class="text-muted text-center">
                                {{ (outgoing.from ?? 0) + index }}
                            </td>
                            <td class="fw-medium">
                                {{ row.product?.product_name ?? '-' }}
                            </td>
                            <td class="text-center">
                                {{ row.packaging_size_input }}
                            </td>
                            <td>
                                <span class="badge bg-secondary">{{ row.out_type?.out_type_name ?? '-' }}</span>
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
            <Pagination :links="outgoing?.links ?? []" />
        </div>

        <OutgoingProductModal
            ref="modalRef"
            :products="products ?? []"
            :out-types="outTypes ?? []"
            @saved="router.reload()"
        />
    </AuthenticatedLayout>
</template>

<style scoped>
.table th {
    font-weight: 600;
}
</style>
