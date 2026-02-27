<script setup>
import Pagination from "@/Components/Pagination.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head, Link, router } from "@inertiajs/vue3";
import { ref } from "vue";

const props = defineProps(["stockOpnames", "filters"]);
const startDate = ref(props.filters.date_from || "");
const endDate = ref(props.filters.date_to || "");

const handleDateFilter = () => {
    const params = {};
    if (startDate.value) params.date_from = startDate.value;
    if (endDate.value) params.date_to = endDate.value;
    router.get("/stock-opnames", params, {
        preserveState: true,
        replace: true,
    });
};

const deleteStockOpname = (stockOpname) => {
    if (confirm("Are you sure you want to delete this stock opname?")) {
        router.delete(`/stock-opnames/${stockOpname.id}`);
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID");
};

const getRowNumber = (index) => {
    const currentPage = props.stockOpnames.current_page || 1;
    const perPage = props.stockOpnames.per_page || 10;
    return (currentPage - 1) * perPage + index + 1;
};

const createStockOpname = () => {
    router.post("/stock-opnames");
};
</script>

<template>
    <Head title="Stock Opnames" />

    <AuthenticatedLayout title="Stock Opnames">
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Stock Opnames
            </h2>
        </template>

        <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div class="p-3 text-gray-900">
                <div
                    class="d-flex justify-content-between align-items-center mb-3"
                >
                    <div class="d-flex align-items-center gap-3">
                        <input
                            v-model="startDate"
                            type="date"
                            @change="handleDateFilter"
                            class="form-control"
                            style="width: 150px"
                        />
                        <input
                            v-model="endDate"
                            type="date"
                            @change="handleDateFilter"
                            class="form-control"
                            style="width: 150px"
                        />
                    </div>
                    <button @click="createStockOpname" class="btn btn-primary">
                        <i class="fas fa-plus me-1"></i> Buat Stock Opname
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table-bordered table-striped table">
                        <thead class="table-light">
                            <tr>
                                <th>No.</th>
                                <th>Date</th>
                                <th>Total Request</th>
                                <th>Products Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(
                                    stockOpname, index
                                ) in stockOpnames.data"
                                :key="stockOpname.id"
                            >
                                <td>{{ getRowNumber(index) }}</td>
                                <td>
                                    {{ formatDate(stockOpname.date_request) }}
                                </td>
                                <td>{{ stockOpname.total_request || "-" }}</td>
                                <td>
                                    <span class="badge bg-info">
                                        {{
                                            stockOpname.stock_opname_products
                                                ?.length || 0
                                        }}
                                        items
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <Link
                                            :href="`/stock-opnames/${stockOpname.id}/products`"
                                            class="btn btn-outline-info btn-md"
                                            title="View Details"
                                        >
                                            <i class="fas fa-eye"></i>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    v-if="stockOpnames.data.length === 0"
                    class="py-4 text-center"
                >
                    <p class="text-muted">No stock opnames found.</p>
                </div>

                <Pagination
                    v-if="stockOpnames.links && stockOpnames.data.length > 0"
                    :links="stockOpnames.links"
                />
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style scoped>
.badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.375rem;
}
</style>
