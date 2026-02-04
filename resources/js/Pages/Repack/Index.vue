<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { formatNumberWithCommas } from "@/utils/numberFormatter";
import { Head, router } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { ref, watch } from "vue";
import RepackModal from "./RepackModal.vue";

const props = defineProps(["products", "repackProducts", "filters"]);
const search = ref(props.filters?.search || "");
const repackModal = ref(null);

// Watch for search changes
watch(
    search,
    debounce((value) => {
        router.get(
            "/repack",
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
    const perPage = props.products.per_page || 15;
    return (currentPage - 1) * perPage + index + 1;
};

// Get stock for product
const getStock = (product) => {
    if (!product.stocks || product.stocks.length === 0) return 0;
    return product.stocks[0]?.packaging_size_input || 0;
};

// Open repack modal
const openRepackModal = (product) => {
    repackModal.value?.open(product);
};
</script>

<template>
    <Head title="Repack" />

    <AuthenticatedLayout title="Repack Produk">
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
                            placeholder="Cari SKU atau nama produk..."
                            style="width: 350px"
                        />
                    </div>
                </div>

                <!-- Table -->
                <div v-if="products.data.length > 0" class="table-responsive">
                    <table class="table-bordered table-striped table">
                        <thead class="table-light">
                            <tr>
                                <th>No.</th>
                                <th>SKU</th>
                                <th>Nama Produk</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(product, index) in products.data"
                                :key="product.id"
                            >
                                <td>{{ getRowNumber(index) }}</td>
                                <td>{{ product.product_unit_sku }}</td>
                                <td>{{ product.product_name }}</td>
                                <td>
                                    {{
                                        formatNumberWithCommas(
                                            getStock(product),
                                        )
                                    }}
                                </td>
                                <td>
                                    <button
                                        @click="openRepackModal(product)"
                                        class="btn btn-primary btn-sm"
                                        :disabled="getStock(product) <= 0"
                                        title="Repack"
                                    >
                                        <i class="fas fa-box-open me-1"></i>
                                        Repack
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="products.data.length === 0" class="py-4 text-center">
                    <p class="text-muted">Tidak ada produk ditemukan.</p>
                </div>

                <Pagination
                    v-if="products.links && products.data.length > 0"
                    :links="products.links"
                />
            </div>
        </div>

        <!-- Repack Modal -->
        <RepackModal ref="repackModal" :repack-products="repackProducts" />
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
