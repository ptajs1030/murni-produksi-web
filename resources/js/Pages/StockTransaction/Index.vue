<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head, router } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { ref, watch } from "vue";

const props = defineProps(["transactions", "transactionTypes", "filters"]);

const search = ref(props.filters?.search || "");
const dateFrom = ref(props.filters?.date_from || "");
const dateTo = ref(props.filters?.date_to || "");
const productType = ref(props.filters?.product_type || "");
const transactionTypeId = ref(props.filters?.transaction_type_id || "");

// Apply filters
const applyFilters = () => {
    router.get(
        route("stock-transactions.index"),
        {
            search: search.value,
            date_from: dateFrom.value,
            date_to: dateTo.value,
            product_type: productType.value,
            transaction_type_id: transactionTypeId.value,
        },
        {
            preserveState: true,
            replace: true,
        },
    );
};

// Debounced search
watch(
    search,
    debounce(() => {
        applyFilters();
    }, 300),
);

// Watch filter changes
watch([dateFrom, dateTo, productType, transactionTypeId], () => {
    applyFilters();
});

// Calculate row number based on pagination
const getRowNumber = (index) => {
    const currentPage = props.transactions.current_page || 1;
    const perPage = props.transactions.per_page || 10;
    return (currentPage - 1) * perPage + index + 1;
};

// Format date
const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Reset filters
const resetFilters = () => {
    search.value = "";
    dateFrom.value = "";
    dateTo.value = "";
    productType.value = "";
    transactionTypeId.value = "";
    router.get(
        route("stock-transactions.index"),
        {},
        { preserveState: true, replace: true },
    );
};

// Badge color based on transaction type
const getTypeBadge = (typeName) => {
    if (!typeName) return "bg-secondary";
    switch (typeName.toUpperCase()) {
        case "IN":
            return "bg-success";
        case "OUT":
            return "bg-danger";
        case "PRODUKSI":
            return "bg-info";
        case "REPACK":
            return "bg-warning";
        default:
            return "bg-secondary";
    }
};
</script>

<template>
    <Head title="Riwayat Transaksi" />

    <AuthenticatedLayout title="Riwayat Transaksi">
        <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div class="p-3 text-gray-900">
                <!-- Header & Filters -->
                <div class="mb-3">
                    <div class="row g-2 align-items-end">
                        <!-- Search -->
                        <div class="col-md-4">
                            <label class="form-label small text-muted mb-1"
                                >Cari</label
                            >
                            <TextInput
                                id="search"
                                v-model="search"
                                type="text"
                                class="form-control"
                                placeholder="Nama produk atau notes..."
                            />
                        </div>
                        <!-- Date From -->
                        <div class="col-md-2">
                            <label class="form-label small text-muted mb-1"
                                >Dari Tanggal</label
                            >
                            <input
                                v-model="dateFrom"
                                type="date"
                                class="form-control"
                            />
                        </div>
                        <!-- Date To -->
                        <div class="col-md-2">
                            <label class="form-label small text-muted mb-1"
                                >Sampai Tanggal</label
                            >
                            <input
                                v-model="dateTo"
                                type="date"
                                class="form-control"
                            />
                        </div>
                        <!-- Product Type Filter -->
                        <div class="col-md-2">
                            <label class="form-label small text-muted mb-1"
                                >Tipe Produk</label
                            >
                            <select v-model="productType" class="form-select">
                                <option value="">Semua</option>
                                <option value="Produk Bahan Baku">
                                    Bahan Baku
                                </option>
                                <option value="Produk Jadi">Produk Jadi</option>
                            </select>
                        </div>
                        <!-- Transaction Type Filter -->
                        <div class="col-md-2">
                            <label class="form-label small text-muted mb-1"
                                >Tipe Transaksi</label
                            >
                            <select
                                v-model="transactionTypeId"
                                class="form-select"
                            >
                                <option value="">Semua</option>
                                <option
                                    v-for="t in transactionTypes"
                                    :key="t.id"
                                    :value="t.id"
                                >
                                    {{ t.transaction_type_name }}
                                </option>
                            </select>
                        </div>
                        <!-- Reset -->
                        <div class="col-md-auto">
                            <button
                                @click="resetFilters"
                                class="btn btn-outline-secondary w-100"
                            >
                                <i class="fas fa-undo me-1"></i>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <div
                    v-if="transactions.data.length > 0"
                    class="table-responsive"
                >
                    <table class="table-bordered table-striped table">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 60px">No.</th>
                                <th>Produk</th>
                                <th style="width: 130px">Tipe Transaksi</th>
                                <th style="width: 100px">Qty</th>
                                <th style="width: 180px">Tanggal Transaksi</th>
                                <th>Notes</th>
                                <th style="width: 150px">PIC</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(txn, index) in transactions.data"
                                :key="txn.id"
                            >
                                <td>{{ getRowNumber(index) }}</td>
                                <td>
                                    {{ txn.product?.product_name || "-" }}
                                    <br />
                                    <small class="text-muted">
                                        {{ txn.product?.product_type || "" }}
                                    </small>
                                </td>
                                <td class="text-center">
                                    <span
                                        class="badge"
                                        :class="
                                            getTypeBadge(
                                                txn.transaction_type
                                                    ?.transaction_type_name,
                                            )
                                        "
                                    >
                                        {{
                                            txn.transaction_type
                                                ?.transaction_type_name || "-"
                                        }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <span
                                        v-if="txn.quantity > 0"
                                        class="badge bg-success"
                                    >
                                        {{ txn.quantity }}
                                    </span>
                                    <span v-else class="badge bg-danger">
                                        {{ txn.quantity }}
                                    </span>
                                </td>
                                <td>
                                    {{ formatDate(txn.transaction_date) }}
                                </td>
                                <td>
                                    <small>{{ txn.notes || "-" }}</small>
                                </td>
                                <td>
                                    {{
                                        txn.created_by_user?.name ||
                                        txn.created_by?.name ||
                                        "-"
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    v-if="transactions.data.length === 0"
                    class="py-4 text-center"
                >
                    <p class="text-muted">
                        Tidak ada riwayat transaksi ditemukan.
                    </p>
                </div>

                <Pagination
                    v-if="transactions.links && transactions.data.length > 0"
                    :links="transactions.links"
                />
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style scoped>
.table th {
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
    font-weight: 600;
}

.table td {
    vertical-align: middle;
}

.form-control,
.form-select {
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
}

.form-control:focus,
.form-select:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
