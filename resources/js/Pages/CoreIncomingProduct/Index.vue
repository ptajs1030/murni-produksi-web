<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import IncomingProductModal from "./IncomingProductModal.vue";
import { Head, router, usePage } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { computed, getCurrentInstance, ref, watch } from "vue";

const props = defineProps(["incoming", "products", "filters"]);
const page = usePage();
const { proxy } = getCurrentInstance();

const modalRef = ref(null);
const search = ref(props.filters?.search || "");

const isOwner = computed(() => page.props.auth?.user?.role === "owner");

watch(
    search,
    debounce((value) => {
        const params = {};
        if (value) params.search = value;
        router.get(route("incoming-goods.index"), params, {
            preserveState: true,
            replace: true,
        });
    }, 300),
);

const formatCurrency = (amount) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const statusBadgeClass = (status) => {
    switch (status) {
        case "PENDING":
            return "bg-warning text-dark";
        case "APPROVED":
            return "bg-success";
        case "REJECTED":
            return "bg-danger";
        default:
            return "bg-secondary";
    }
};

const clearFilters = () => {
    search.value = "";
    router.get(
        route("incoming-goods.index"),
        {},
        {
            preserveState: true,
            replace: true,
        },
    );
};

const hasActiveFilters = computed(() => !!search.value);

const openAddModal = () => {
    modalRef.value?.open();
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Update status dengan SweetAlert2 confirmation
const updateStatus = async (id, status, productName) => {
    const isApprove = status === "APPROVED";
    const actionText = isApprove ? "menyetujui" : "menolak";
    const actionTitle = isApprove ? "Setujui Barang?" : "Tolak Barang?";

    const result = await proxy.$swal.fire({
        title: actionTitle,
        html: `Apakah Anda yakin ingin <strong>${actionText}</strong> barang datang:<br><br><strong>${productName}</strong>?`,
        icon: isApprove ? "question" : "warning",
        showCancelButton: true,
        confirmButtonColor: isApprove ? "#28a745" : "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: isApprove
            ? '<i class="fas fa-check me-1"></i> Ya, Setujui'
            : '<i class="fas fa-times me-1"></i> Ya, Tolak',
        cancelButtonText: '<i class="fas fa-arrow-left me-1"></i> Batal',
        reverseButtons: true,
        focusCancel: true,
    });

    if (result.isConfirmed) {
        router.patch(
            route("incoming-goods.update-status", id),
            { status },
            {
                preserveScroll: true,
            },
        );
    }
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
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="openAddModal"
                        >
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
                Menampilkan {{ incoming?.from ?? 0 }} -
                {{ incoming?.to ?? 0 }} dari {{ incoming?.total ?? 0 }} data
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
                            <th class="text-center" style="width: 100px">
                                Qty
                            </th>
                            <th class="text-center" style="width: 140px">
                                Harga
                            </th>
                            <th style="width: 160px">Tanggal Masuk</th>
                            <th class="text-center" style="width: 110px">
                                Status
                            </th>
                            <th
                                v-if="isOwner"
                                class="text-center"
                                style="width: 200px"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!incoming?.data?.length">
                            <td
                                :colspan="isOwner ? 7 : 6"
                                class="text-muted py-4 text-center"
                            >
                                <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                <div v-if="search">
                                    Tidak ada data yang sesuai dengan pencarian
                                    "{{ search }}"
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
                                {{ row.product?.product_name ?? "-" }}
                            </td>
                            <td class="text-center">
                                <span class="badge bg-light text-dark border">
                                    {{ row.packaging_size_input }}
                                </span>
                            </td>
                            <td class="text-center">
                                {{ formatCurrency(row.price) }}
                            </td>
                            <td class="text-muted small">
                                {{ formatDate(row.created_at) }}
                            </td>
                            <td class="text-center">
                                <span
                                    class="badge"
                                    :class="statusBadgeClass(row.status)"
                                >
                                    <i
                                        class="fas me-1"
                                        :class="{
                                            'fa-clock':
                                                row.status === 'PENDING',
                                            'fa-check-circle':
                                                row.status === 'APPROVED',
                                            'fa-times-circle':
                                                row.status === 'REJECTED',
                                        }"
                                    ></i>
                                    {{ row.status }}
                                </span>
                            </td>
                            <!-- Aksi hanya untuk Owner -->
                            <td v-if="isOwner" class="text-center">
                                <div
                                    v-if="row.status === 'PENDING'"
                                    class="d-flex gap-1 justify-content-center"
                                >
                                    <button
                                        type="button"
                                        class="btn btn-success btn-sm"
                                        @click="
                                            updateStatus(
                                                row.id,
                                                'APPROVED',
                                                row.product?.product_name,
                                            )
                                        "
                                    >
                                        <i class="fas fa-check me-1"></i>
                                        Setujui
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-outline-danger btn-sm"
                                        @click="
                                            updateStatus(
                                                row.id,
                                                'REJECTED',
                                                row.product?.product_name,
                                            )
                                        "
                                    >
                                        <i class="fas fa-times me-1"></i>
                                        Tolak
                                    </button>
                                </div>
                                <span v-else class="text-muted small">
                                    <i class="fas fa-check-double me-1"></i>
                                    Selesai
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-3">
            <Pagination :links="incoming?.links ?? []" />
        </div>

        <IncomingProductModal
            ref="modalRef"
            :products="products ?? []"
            @saved="router.reload()"
        />
    </AuthenticatedLayout>
</template>

<style scoped>
.table th {
    font-weight: 600;
    font-size: 0.875rem;
}
.table td {
    vertical-align: middle;
}
.btn-sm {
    padding: 0.35rem 0.65rem;
    font-size: 0.8rem;
}
.gap-1 {
    gap: 0.35rem;
}
</style>
