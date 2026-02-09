<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { formatNumberWithCommas } from "@/utils/numberFormatter";
import { Head, Link, router, usePage } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { computed, getCurrentInstance, ref, watch } from "vue";
import StockOpnameProductModal from "./StockOpnameProductModal.vue";

const props = defineProps([
    "stockOpname",
    "stockOpnameProducts",
    "availableProducts",
    "filters",
]);
const search = ref(props.filters.search || "");

const { proxy } = getCurrentInstance();
const page = usePage();
const productModal = ref(null);

// Check if user is owner
const isOwner = computed(() => page.props.auth?.user?.role === "owner");

// Check if stock opname is submitted
const isSubmitted = computed(() => props.stockOpname?.is_submitted === true);

// Watch for search changes
watch(
    search,
    debounce((value) => {
        router.get(
            `/stock-opnames/${props.stockOpname.id}/products`,
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
    const currentPage = props.stockOpnameProducts.current_page || 1;
    const perPage = props.stockOpnameProducts.per_page || 10;
    return (currentPage - 1) * perPage + index + 1;
};

// Check if there's stock discrepancy
const hasStockDiscrepancy = (product) => {
    const systemStock = product.stock?.packaging_size_input || 0;
    const realQuantity = product.real_quantity || 0;
    return systemStock !== realQuantity;
};

// Get stock difference
const getStockDifference = (product) => {
    const systemStock = product.stock?.packaging_size_input || 0;
    const realQuantity = product.real_quantity || 0;
    return realQuantity - systemStock;
};

// Open add product modal
const openAddModal = () => {
    productModal.value?.open();
};

// Delete product
const deleteProduct = (product) => {
    proxy.$swal
        .fire({
            title: "Hapus Product?",
            text: `Apakah Anda yakin ingin menghapus ${product.product?.product_name || "product ini"} dari stock opname?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        })
        .then((result) => {
            if (result.isConfirmed) {
                router.delete(
                    `/stock-opnames/${props.stockOpname.id}/products/${product.product_id}`,
                    {
                        onSuccess: () => {
                            proxy.$swal.fire({
                                title: "Berhasil!",
                                text: "Product berhasil dihapus dari stock opname",
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false,
                            });
                        },
                        onError: (errors) => {
                            proxy.$swal.fire({
                                title: "Error!",
                                text: errors.error || "Gagal menghapus product",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                        },
                    },
                );
            }
        });
};

// Submit stock opname
const submitStockOpname = () => {
    proxy.$swal
        .fire({
            title: "Submit Stock Opname?",
            html: `
                <p>Apakah Anda yakin ingin submit stock opname ini?</p>
                <p class="text-danger mt-2"><strong>Perhatian:</strong> Setelah submit, Anda tidak dapat menambah, mengedit, atau menghapus product dari stock opname ini.</p>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Submit",
            cancelButtonText: "Batal",
        })
        .then((result) => {
            if (result.isConfirmed) {
                router.post(
                    `/stock-opnames/${props.stockOpname.id}/submit`,
                    {},
                    {
                        onSuccess: () => {
                            proxy.$swal.fire({
                                title: "Berhasil!",
                                text: "Stock opname berhasil disubmit",
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false,
                            });
                        },
                        onError: (errors) => {
                            proxy.$swal.fire({
                                title: "Error!",
                                text:
                                    errors.error || "Gagal submit stock opname",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                        },
                    },
                );
            }
        });
};

// Owner action - update stock or ignore
const ownerAction = (product, action) => {
    const actionText =
        action === "update_stock"
            ? "Update Stock ke System"
            : "Abaikan Perbedaan";
    const confirmText =
        action === "update_stock"
            ? "Stock di system akan diupdate sesuai input admin. Apakah Anda yakin?"
            : "Perbedaan stock akan diabaikan. Apakah Anda yakin?";

    proxy.$swal
        .fire({
            title: actionText,
            text: confirmText,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor:
                action === "update_stock" ? "#28a745" : "#ffc107",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Lanjutkan",
            cancelButtonText: "Batal",
        })
        .then((result) => {
            if (result.isConfirmed) {
                router.put(
                    `/stock-opnames/${props.stockOpname.id}/products/${product.product_id}/owner-action`,
                    { action },
                    {
                        onSuccess: () => {
                            proxy.$swal.fire({
                                title: "Berhasil!",
                                text:
                                    action === "update_stock"
                                        ? "Stock berhasil diupdate sesuai input admin"
                                        : "Perbedaan stock berhasil diabaikan",
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false,
                            });
                        },
                        onError: (errors) => {
                            proxy.$swal.fire({
                                title: "Error!",
                                text: errors.error || "Gagal memproses aksi",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                        },
                    },
                );
            }
        });
};

// Get status badge class and text
const getStatusBadge = (status) => {
    switch (status) {
        case "APPROVED":
            return { class: "badge bg-success", text: "Approved" };
        case "REJECTED":
            return { class: "badge bg-secondary", text: "Diabaikan" };
        case "PENDING":
        default:
            return { class: "badge bg-warning text-dark", text: "Pending" };
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID");
};

// Function to truncate note for display
const truncateText = (text, maxLength = 50) => {
    if (!text) return "-";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

// Function to show full note in modal
const showFullNote = (title, note) => {
    proxy.$swal.fire({
        title: title,
        text: note,
        icon: "info",
        confirmButtonText: "Close",
    });
};

// Export function
const exportExcel = () => {
    const params = {};

    // Include search filter if exists
    if (search.value) {
        params.search = search.value;
    }

    // Include sort if exists
    const urlParams = new URLSearchParams(window.location.search);
    const existingSort = urlParams.get("sort");
    if (existingSort) {
        params.sort = existingSort;
    }

    // Build query string
    const queryString = new URLSearchParams(params).toString();
    // Download file
    window.location.href =
        route("stock-opnames.products.export", props.stockOpname.id) +
        (queryString ? "?" + queryString : "");
};
</script>

<template>
    <Head title="Stock Opname Products" />

    <AuthenticatedLayout title="Stock Opname Products">
        <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div class="p-3 text-gray-900">
                <!-- Header Info -->
                <div
                    class="alert mb-3"
                    :class="isSubmitted ? 'alert-success' : 'alert-info'"
                >
                    <div
                        class="d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>Stock Opname:</strong> #{{
                                stockOpname.id
                            }}
                            | <strong>Tanggal:</strong>
                            {{ formatDate(stockOpname.date_request) }} |
                            <strong>Status:</strong>
                            <span
                                :class="
                                    isSubmitted
                                        ? 'badge bg-success'
                                        : 'badge bg-warning text-dark'
                                "
                            >
                                {{ isSubmitted ? "Submitted" : "Draft" }}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    class="d-flex justify-content-between align-items-center mb-3"
                >
                    <div class="d-flex align-items-center gap-3">
                        <TextInput
                            id="search"
                            v-model="search"
                            type="text"
                            class="form-control"
                            placeholder="Search products..."
                            style="width: 300px"
                        />
                    </div>

                    <div class="d-flex gap-2">
                        <button
                            v-if="!isSubmitted"
                            @click="openAddModal"
                            class="btn btn-primary"
                        >
                            <i class="fas fa-plus me-1"></i>
                            Tambah Product
                        </button>
                        <button @click="exportExcel" class="btn btn-success">
                            <i class="fas fa-file-excel me-2"></i>
                            Export Excel
                        </button>
                        <Link
                            :href="`/stock-opnames`"
                            class="btn btn-outline-secondary"
                        >
                            <i class="fas fa-arrow-left me-2"></i>
                            Back to Stock Opnames
                        </Link>
                    </div>
                </div>

                <div
                    v-if="stockOpnameProducts.data.length > 0"
                    class="table-responsive"
                >
                    <table class="table-bordered table-striped table">
                        <thead class="table-light">
                            <tr>
                                <th>No.</th>
                                <th>Product SKU</th>
                                <th>Product Name</th>
                                <th v-if="isOwner">Stock System</th>
                                <th>Real Quantity</th>
                                <th>Expired Quantity</th>
                                <th v-if="isOwner">Selisih</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(
                                    product, index
                                ) in stockOpnameProducts.data"
                                :key="`${product.stock_opname_id}-${product.product_id}`"
                                :class="{
                                    'table-warning':
                                        hasStockDiscrepancy(product) &&
                                        isSubmitted &&
                                        product.status === 'PENDING',
                                }"
                            >
                                <td>{{ getRowNumber(index) }}</td>
                                <td>
                                    {{
                                        product.product?.product_unit_sku || "-"
                                    }}
                                </td>
                                <td>
                                    {{ product.product?.product_name || "-" }}
                                </td>
                                <td v-if="isOwner">
                                    {{
                                        formatNumberWithCommas(
                                            product.stock
                                                ?.packaging_size_input || 0,
                                        )
                                    }}
                                </td>
                                <td>
                                    {{
                                        formatNumberWithCommas(
                                            product.real_quantity || 0,
                                        )
                                    }}
                                </td>
                                <td>
                                    {{
                                        formatNumberWithCommas(
                                            product.expired_quantity || 0,
                                        )
                                    }}
                                </td>
                                <td v-if="isOwner">
                                    <span
                                        :class="
                                            getStockDifference(product) === 0
                                                ? 'text-success'
                                                : 'text-danger fw-bold'
                                        "
                                    >
                                        {{
                                            getStockDifference(product) > 0
                                                ? "+"
                                                : ""
                                        }}{{
                                            formatNumberWithCommas(
                                                getStockDifference(product),
                                            )
                                        }}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        :class="
                                            getStatusBadge(product.status).class
                                        "
                                    >
                                        {{
                                            getStatusBadge(product.status).text
                                        }}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        v-if="product.description"
                                        class="text-truncate cursor-pointer"
                                        style="cursor: pointer"
                                        @click="
                                            showFullNote(
                                                'Deskripsi',
                                                product.description,
                                            )
                                        "
                                        :title="product.description"
                                    >
                                        {{ truncateText(product.description) }}
                                    </span>
                                    <span v-else class="text-muted">-</span>
                                </td>
                                <td>
                                    <!-- Before submit: show delete button -->
                                    <div
                                        v-if="!isSubmitted"
                                        class="btn-group btn-group-sm"
                                    >
                                        <button
                                            @click="deleteProduct(product)"
                                            class="btn btn-outline-danger btn-sm"
                                            title="Hapus Product"
                                        >
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>

                                    <!-- After submit: show owner actions for discrepancies -->
                                    <div
                                        v-else-if="
                                            isOwner &&
                                            hasStockDiscrepancy(product) &&
                                            product.status === 'PENDING'
                                        "
                                        class="btn-group btn-group-sm"
                                    >
                                        <button
                                            @click="
                                                ownerAction(
                                                    product,
                                                    'update_stock',
                                                )
                                            "
                                            class="btn btn-success btn-sm"
                                            title="Update Stock ke System"
                                        >
                                            <i class="fas fa-sync-alt me-1"></i>
                                            Update
                                        </button>
                                        <button
                                            @click="
                                                ownerAction(product, 'ignore')
                                            "
                                            class="btn btn-warning btn-sm"
                                            title="Abaikan Perbedaan"
                                        >
                                            <i class="fas fa-times me-1"></i>
                                            Abaikan
                                        </button>
                                    </div>

                                    <!-- No actions available -->
                                    <span v-else class="text-muted">-</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    v-if="stockOpnameProducts.data.length === 0"
                    class="py-4 text-center"
                >
                    <p class="text-muted">No stock opname products found.</p>
                </div>

                <Pagination
                    v-if="
                        stockOpnameProducts.links &&
                        stockOpnameProducts.data.length > 0
                    "
                    :links="stockOpnameProducts.links"
                />

                <!-- Submit Button -->
                <div
                    v-if="!isSubmitted && stockOpnameProducts.data.length > 0"
                    class="mt-4 text-center"
                >
                    <button
                        @click="submitStockOpname"
                        class="btn btn-lg btn-success"
                    >
                        <i class="fas fa-lock me-2"></i>
                        Submit Stock Opname
                    </button>
                    <p class="text-muted mt-2">
                        <small
                            >Setelah submit, Anda tidak dapat menambah atau
                            menghapus product.</small
                        >
                    </p>
                </div>
            </div>
        </div>

        <!-- Add Product Modal -->
        <StockOpnameProductModal
            ref="productModal"
            :stock-opname-id="stockOpname.id"
            :products="availableProducts"
        />
    </AuthenticatedLayout>
</template>

<style scoped>
.badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
}

.btn-group-sm > .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    line-height: 1.5;
    border-radius: 0.2rem;
}

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

.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer:hover {
    text-decoration: underline;
}
</style>
