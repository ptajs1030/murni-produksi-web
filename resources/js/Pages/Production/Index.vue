<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head, router } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { ref, watch } from "vue";
import ProductionModal from "./ProductionModal.vue";

const props = defineProps(["products", "recipes", "filters"]);
const search = ref(props.filters?.search || "");
const productionModal = ref(null);

// Watch for search changes
watch(
    search,
    debounce((value) => {
        router.get(
            "/production",
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    }, 300),
);

// Calculate row number based on pagination
const getRowNumber = (index) => {
    const currentPage = props.products.current_page || 1;
    const perPage = props.products.per_page || 10;
    return (currentPage - 1) * perPage + index + 1;
};

// Format description (array of ingredients)
const formatDescription = (description) => {
    if (!description) return "-";
    if (Array.isArray(description)) {
        return description.join(", ");
    }
    return description;
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

// Open production modal
const openProductionModal = () => {
    productionModal.value?.open();
};
</script>

<template>
    <Head title="Produksi" />

    <AuthenticatedLayout title="Produksi">
        <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div class="p-3 text-gray-900">
                <!-- Header -->
                <div
                    class="d-flex justify-content-between align-items-center mb-3"
                >
                    <div class="d-flex align-items-center gap-3">
                        <TextInput
                            id="search"
                            v-model="search"
                            type="text"
                            class="form-control"
                            placeholder="Cari nama produk atau PIC..."
                            style="width: 350px"
                        />
                    </div>
                    <button
                        @click="openProductionModal"
                        class="btn btn-primary"
                    >
                        <i class="fas fa-plus me-1"></i>
                        Produksi
                    </button>
                </div>
                
                <!-- Table -->
                <div v-if="products.data.length > 0" class="table-responsive">
                    <table class="table-bordered table-striped table">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 60px">No.</th>
                                <th>Nama Produk</th>
                                <th>Deskripsi (Bahan Baku)</th>
                                <th style="width: 120px">Qty</th>
                                <th style="width: 150px">PIC</th>
                                <th style="width: 180px">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(log, index) in products.data"
                                :key="log.id"
                            >
                                <td>{{ getRowNumber(index) }}</td>
                                <td>
                                    {{ log.product?.product_name || "-" }}
                                </td>
                                <td>
                                    <small class="text-muted">
                                        {{ formatDescription(log.description) }}
                                    </small>
                                </td>
                                <td class="text-center">
                                    <span class="badge bg-info">
                                        {{ log.quantity }}
                                    </span>
                                </td>
                                <td>
                                    {{ log.created_by?.name || "-" }}
                                </td>
                                <td>
                                    {{ formatDate(log.created_at) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="products.data.length === 0" class="py-4 text-center">
                    <p class="text-muted">Tidak ada log produksi ditemukan.</p>
                </div>

                <Pagination
                    v-if="products.links && products.data.length > 0"
                    :links="products.links"
                />
            </div>
        </div>

        <!-- Production Modal -->
        <ProductionModal ref="productionModal" :recipes="recipes" />
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

.form-control {
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
}

.form-control:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
