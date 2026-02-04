<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { formatRupiahInput, isValidCurrencyAmount, parseRupiahToNumber } from '@/Utils/currencyFormatter.js';
import { Head, router } from '@inertiajs/vue3';
import { getCurrentInstance, ref } from 'vue';

const props = defineProps(['productIncome', 'incomeProduct', 'poProductDetails', 'statusOptions']);

const { proxy } = getCurrentInstance();

const showPOList = ref(!!props.poProductDetails);
const isLoading = ref(false);
const inputQuantities = ref({});
const remainingStock = ref(props.incomeProduct.stock || 0);
const statusSelections = ref({});
const qtyApprovedInputs = ref({});
const qtyShortageInputs = ref({});
const qtyOverInputs = ref({});
const changedRows = ref(new Set());
const originalData = ref({});
const priceInput = ref(props.incomeProduct.price || 0);
const priceInputFormatted = ref(formatRupiahInput(props.incomeProduct.price || 0));
const originalPrice = ref(props.incomeProduct.price || 0);
const priceChanged = ref(false);
const priceError = ref('');

// Initialize input quantities with detail.stock values and calculate remaining stock
if (props.poProductDetails) {
    let totalAllocated = 0;
    props.poProductDetails.forEach(detail => {
        const key = `${detail.product_request_id}-${detail.product_id}`;
        const quantity = detail.stock || 0;
        inputQuantities.value[key] = quantity;
        totalAllocated += quantity;

        // Initialize other inputs
        statusSelections.value[key] = detail.status_id || null;
        qtyApprovedInputs.value[key] = detail.qty_approved || 0;
        qtyShortageInputs.value[key] = detail.qty_shortage || 0;
        qtyOverInputs.value[key] = detail.qty_over || 0;

        // Store original data for comparison
        originalData.value[key] = {
            income_id: props.productIncome.id,
            status_id: detail.status_id || null,
            qty_approved: detail.qty_approved || 0,
            qty_shortage: detail.qty_shortage || 0,
            qty_over: detail.qty_over || 0,
            qty_input: quantity,
        };
    });

    // Calculate remaining stock
    let remaining = (props.incomeProduct.stock || 0) - totalAllocated;

    // If there's remaining stock, add it to the last input
    if (remaining > 0 && props.poProductDetails.length > 0) {
        const lastDetail = props.poProductDetails[props.poProductDetails.length - 1];
        const lastKey = `${lastDetail.product_request_id}-${lastDetail.product_id}`;
        inputQuantities.value[lastKey] = (inputQuantities.value[lastKey] || 0) + remaining;
        remaining = 0;
    }

    remainingStock.value = remaining;
}

const formatDate = date => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatDateTime = datetime => {
    if (!datetime) return '-';
    return new Date(datetime).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getStatusBadgeClass = status => {
    if (!status) return 'badge bg-secondary';

    const statusName = status.status_name?.toLowerCase();
    if (statusName?.includes('active')) return 'badge bg-success';
    if (statusName?.includes('inactive')) return 'badge bg-danger';
    if (statusName?.includes('pending')) return 'badge bg-warning';

    return 'badge bg-secondary';
};

const formatPrice = price => {
    if (!price) return 'Rp 0';
    return `Rp ${Number(price).toLocaleString('id-ID')}`;
};

const updateQuantity = (key, newValue, oldValue) => {
    const numericValue = parseInt(newValue) || 0;
    const numericOldValue = parseInt(oldValue) || 0;
    const difference = numericValue - numericOldValue;

    // Update remaining stock
    remainingStock.value = remainingStock.value - difference;

    // Update input quantity
    inputQuantities.value[key] = numericValue;

    // Track changes
    trackRowChange(key);
};

const trackRowChange = key => {
    const current = {
        status_id: statusSelections.value[key],
        qty_approved: qtyApprovedInputs.value[key] || 0,
        qty_shortage: qtyShortageInputs.value[key] || 0,
        qty_over: qtyOverInputs.value[key] || 0,
        qty_input: inputQuantities.value[key] || 0,
    };

    const original = originalData.value[key];

    // Check if any field has changed
    const hasChanged =
        current.status_id !== original.status_id ||
        current.qty_approved !== original.qty_approved ||
        current.qty_shortage !== original.qty_shortage ||
        current.qty_over !== original.qty_over ||
        current.qty_input !== original.qty_input;

    if (hasChanged) {
        changedRows.value.add(key);
    } else {
        changedRows.value.delete(key);
    }
};

const getChangedData = () => {
    const changedData = [];

    changedRows.value.forEach(key => {
        const [product_request_id, product_id] = key.split('-');
        changedData.push({
            product_request_id: parseInt(product_request_id),
            product_id: parseInt(product_id),
            income_id: props.productIncome.id,
            status_id: statusSelections.value[key],
            qty_approved: qtyApprovedInputs.value[key] || 0,
            qty_shortage: qtyShortageInputs.value[key] || 0,
            qty_over: qtyOverInputs.value[key] || 0,
            qty_input: inputQuantities.value[key] || 0,
        });
    });

    return changedData;
};

const saveChanges = () => {
    // Validate price if it has changed
    if (!isValidCurrencyAmount(priceInput.value)) {
        priceError.value = 'Harga harus diisi dan lebih dari 0';
        proxy.$swal.fire({
            icon: 'error',
            title: 'Validasi Error',
            text: 'Harga harus diisi dan lebih dari 0',
        });
        return;
    }

    priceError.value = '';

    const changedData = getChangedData();
    if (changedData.length === 0 && !priceChanged.value) {
        // alert('Tidak ada perubahan untuk disimpan');
        proxy.$swal.fire({
            icon: 'info',
            title: 'Tidak ada perubahan',
            text: 'Tidak ada perubahan untuk disimpan',
        });
        return;
    }

    isLoading.value = true;

    // Prepare data to send
    const dataToSend = {
        data: changedData,
    };

    // Add price data if changed
    if (priceChanged.value) {
        dataToSend.price_data = {
            product_income_id: props.productIncome.id,
            product_id: props.incomeProduct.product_id,
            warehouse_id: props.productIncome.warehouse_id,
            price: parseFloat(priceInput.value || 0),
        };
    }

    router.post('/product-incomes/update-product-request-data', dataToSend, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: page => {
            // Check if response contains success data
            if (page.props.flash?.success) {
                // alert(`Berhasil! ${page.props.flash.success}`);
            } else {
                // alert('Data berhasil disimpan!');
            }

            // Clear changed rows after successful save
            changedRows.value.clear();

            // Update original data with current values
            changedData.forEach(item => {
                const key = `${item.product_request_id}-${item.product_id}`;
                originalData.value[key] = {
                    income_id: props.productIncome.id,
                    status_id: item.status_id,
                    qty_approved: item.qty_approved,
                    qty_shortage: item.qty_shortage,
                    qty_over: item.qty_over,
                    qty_input: item.qty_input,
                };
            });

            // Reset price change tracking if price was updated
            if (priceChanged.value) {
                originalPrice.value = priceInput.value;
                priceChanged.value = false;
            }

            isLoading.value = false;
        },
        onError: errors => {
            console.error('Validation errors:', errors);
            let errorMessage = 'Terjadi kesalahan validasi:\n';
            Object.keys(errors).forEach(key => {
                errorMessage += `- ${errors[key]}\n`;
            });
            // alert(errorMessage);
            isLoading.value = false;
        },
        onFinish: () => {
            isLoading.value = false;
        },
    });
};

const scanPO = () => {
    // Validate price before scanning
    if (!isValidCurrencyAmount(priceInput.value)) {
        priceError.value = 'Harga harus diisi dan lebih dari 0';
        return;
    }

    priceError.value = '';
    isLoading.value = true;

    router.visit(
        `/product-incomes/${props.productIncome.id}/products/${props.incomeProduct.product_id}?scan_po=1&status_id=10`,
        {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                showPOList.value = true;
                isLoading.value = false;

                // Re-initialize input quantities and remaining stock after successful scan
                if (props.poProductDetails) {
                    let totalAllocated = 0;
                    props.poProductDetails.forEach(detail => {
                        const key = `${detail.product_request_id}-${detail.product_id}`;
                        const quantity = detail.stock || 0;
                        inputQuantities.value[key] = quantity;
                        totalAllocated += quantity;

                        // Re-initialize other inputs
                        statusSelections.value[key] = detail.status_id || null;
                        qtyApprovedInputs.value[key] = detail.qty_approved || 0;
                        qtyShortageInputs.value[key] = detail.qty_shortage || 0;
                        qtyOverInputs.value[key] = detail.qty_over || 0;

                        // Re-store original data for comparison
                        originalData.value[key] = {
                            status_id: detail.status_id || null,
                            qty_approved: detail.qty_approved || 0,
                            qty_shortage: detail.qty_shortage || 0,
                            qty_over: detail.qty_over || 0,
                            qty_input: quantity,
                        };
                    });

                    // Calculate remaining stock
                    let remaining = (props.incomeProduct.stock || 0) - totalAllocated;

                    // If there's remaining stock, add it to the last input
                    if (remaining > 0 && props.poProductDetails.length > 0) {
                        const lastDetail = props.poProductDetails[props.poProductDetails.length - 1];
                        const lastKey = `${lastDetail.product_request_id}-${lastDetail.product_id}`;
                        inputQuantities.value[lastKey] = (inputQuantities.value[lastKey] || 0) + remaining;
                        remaining = 0;
                    }

                    remainingStock.value = remaining;
                } else {
                    remainingStock.value = props.incomeProduct.stock || 0;
                }
            },
            onError: () => {
                isLoading.value = false;
            },
        }
    );
};

const goBack = () => {
    // window.history.back();
    router.visit('/product-incomes/' + props.productIncome.id + '/products');
};

const handlePriceInput = event => {
    const inputValue = event.target.value;

    // Parse the input to get numeric value
    const numericValue = parseRupiahToNumber(inputValue);

    // Update both the raw value and formatted display
    priceInput.value = numericValue;
    priceInputFormatted.value = formatRupiahInput(inputValue);

    // Track changes
    trackPriceChange();
};

const trackPriceChange = () => {
    priceChanged.value = parseFloat(priceInput.value || 0) !== parseFloat(originalPrice.value || 0);
    // Clear price error when user starts typing
    if (priceError.value) {
        priceError.value = '';
    }
};

const autoFillQuantities = () => {
    if (!props.poProductDetails || props.poProductDetails.length === 0) {
        return;
    }

    props.poProductDetails.forEach(detail => {
        const key = `${detail.product_request_id}-${detail.product_id}`;
        const inputQty = inputQuantities.value[key] || 0;
        const orderedQty = detail.stock || 0;

        // Calculate values based on input quantity vs ordered quantity
        if (inputQty >= orderedQty) {
            // If input >= ordered: sudah_diterima = ordered, kurang = 0, qty_over = difference
            qtyApprovedInputs.value[key] = orderedQty;
            qtyShortageInputs.value[key] = 0;
            qtyOverInputs.value[key] = inputQty - orderedQty;
        } else {
            // If input < ordered: sudah_diterima = input, kurang = difference, qty_over = 0
            qtyApprovedInputs.value[key] = inputQty;
            qtyShortageInputs.value[key] = orderedQty - inputQty;
            qtyOverInputs.value[key] = 0;
        }

        // Track changes for each row
        trackRowChange(key);
    });
};
</script>

<template>
    <Head :title="`Product Detail - ${incomeProduct.products?.product_name}`" />

    <AuthenticatedLayout title="Product Detail">
        <template #header>
            <div>
                <h2 class="text-xl font-semibold leading-tight text-gray-800">Product Income Detail</h2>
                <p class="text-muted">
                    {{ incomeProduct.products?.product_name }} - {{ formatDate(productIncome.date_sending) }}
                </p>
            </div>
        </template>

        <div class="p-3 text-gray-900">
            <!-- Back Button -->
            <div class="d-flex justify-content-end mb-3">
                <button @click="goBack()" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left me-2"></i>
                    Kembali
                </button>
            </div>

            <!-- Product Detail -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-box me-2"></i>
                                    Detail Barang
                                </h5>

                                <!-- Status Display -->
                                <div v-if="incomeProduct.status">
                                    <span :class="getStatusBadgeClass(incomeProduct.status)">
                                        <i
                                            class="fas fa-check-circle me-1"
                                            v-if="incomeProduct.status.status_name?.toLowerCase().includes('lengkap')"
                                        ></i>
                                        {{ incomeProduct.status.status_name }}
                                    </span>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold">Nama Produk:</label>
                                <p class="fw-bold fs-5 text-primary mb-0">
                                    {{ incomeProduct.products?.product_name || '-' }}
                                </p>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold">SKU:</label>
                                <p class="mb-0">
                                    <code class="fs-6">{{ incomeProduct.products?.product_unit_sku || '-' }}</code>
                                </p>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold">Jumlah Total:</label>
                                <p class="mb-0">
                                    <span class="badge bg-primary fs-6">{{ incomeProduct.stock || 0 }}</span>
                                </p>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold">Sisa Stock:</label>
                                <p class="mb-0">
                                    <span class="badge fs-6" :class="remainingStock >= 0 ? 'bg-success' : 'bg-danger'">
                                        {{ remainingStock }}
                                    </span>
                                </p>
                            </div>

                            <div class="mb-4">
                                <label for="price" class="form-label fw-semibold">Harga:</label>
                                <div class="input-group" :class="{ 'has-validation': priceError }">
                                    <span class="input-group-text">Rp</span>
                                    <input
                                        type="text"
                                        id="price"
                                        class="form-control"
                                        :class="{ 'is-invalid': priceError }"
                                        :value="priceInputFormatted"
                                        @input="handlePriceInput"
                                        placeholder="0"
                                        :readonly="
                                            poProductDetails &&
                                            poProductDetails.every(detail => detail.status_id === 12)
                                        "
                                    />
                                    <div v-if="priceError" class="invalid-feedback">
                                        {{ priceError }}
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-warning" @click="scanPO" :disabled="isLoading">
                                    <i class="fas fa-recycle me-2" :class="{ 'fa-spin': isLoading }"></i>
                                    {{ isLoading ? 'Scanning...' : 'Scaning PO' }}
                                </button>

                                <button
                                    v-if="showPOList && poProductDetails && poProductDetails.length > 0"
                                    class="btn btn-outline-success"
                                    @click="autoFillQuantities"
                                    :disabled="isLoading"
                                    title="Otomatis mengisi kolom sudah diterima, kurang, dan qty over"
                                >
                                    <i class="fas fa-magic me-2"></i>
                                    Auto Fill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Details Table -->
            <div v-if="showPOList" class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-4">
                                <i class="fas fa-clipboard-list me-2"></i>
                                Detail Barang PO (SKU: {{ incomeProduct.products?.product_unit_sku || '-' }})
                            </h5>

                            <div
                                v-if="!poProductDetails || poProductDetails.length === 0"
                                class="text-muted py-4 text-center"
                            >
                                <i class="fas fa-inbox fa-3x mb-3"></i>
                                <p>Tidak ada PO untuk SKU {{ incomeProduct.products?.product_unit_sku || 'ini' }}</p>
                            </div>

                            <div v-else class="table-responsive">
                                <table class="table-striped table-hover table">
                                    <thead class="table-light">
                                        <tr>
                                            <th>No Tiket</th>
                                            <th>Nama Barang</th>
                                            <th>Status</th>
                                            <th class="text-center">Jumlah Pesanan</th>
                                            <th class="text-center">Sudah Diterima</th>
                                            <th class="text-center">Kurang</th>
                                            <th class="text-center">Qty Over</th>
                                            <th class="text-center">Input Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="detail in poProductDetails"
                                            :key="`${detail.product_request_id}-${detail.product_id}`"
                                        >
                                            <td>
                                                <strong>{{ detail.product_request?.no_tiket || '-' }}</strong>
                                            </td>
                                            <td>
                                                <span class="text-primary fw-medium">
                                                    {{ detail.product?.product_name || '-' }}
                                                </span>
                                            </td>
                                            <td class="text-center">
                                                <select
                                                    class="form-control form-control-sm"
                                                    style="width: 120px; margin: 0 auto"
                                                    v-model="
                                                        statusSelections[
                                                            `${detail.product_request_id}-${detail.product_id}`
                                                        ]
                                                    "
                                                    @change="
                                                        trackRowChange(
                                                            `${detail.product_request_id}-${detail.product_id}`
                                                        )
                                                    "
                                                    :disabled="detail.status_id === 12"
                                                >
                                                    <option :value="null">- Pilih Status -</option>
                                                    <option
                                                        v-for="status in statusOptions"
                                                        :key="status.id"
                                                        :value="status.id"
                                                    >
                                                        {{ status.status_name }}
                                                    </option>
                                                </select>
                                            </td>
                                            <td class="text-center">
                                                <span class="badge bg-info">{{ detail.stock || 0 }}</span>
                                            </td>
                                            <td class="text-center">
                                                <input
                                                    type="number"
                                                    class="form-control form-control-sm no-spinner"
                                                    style="width: 60px; margin: 0 auto"
                                                    v-model="
                                                        qtyApprovedInputs[
                                                            `${detail.product_request_id}-${detail.product_id}`
                                                        ]
                                                    "
                                                    @input="
                                                        trackRowChange(
                                                            `${detail.product_request_id}-${detail.product_id}`
                                                        )
                                                    "
                                                    min="0"
                                                    placeholder="0"
                                                    :readonly="detail.status_id === 12"
                                                />
                                            </td>
                                            <td class="text-center">
                                                <input
                                                    type="number"
                                                    class="form-control form-control-sm no-spinner"
                                                    style="width: 60px; margin: 0 auto"
                                                    v-model="
                                                        qtyShortageInputs[
                                                            `${detail.product_request_id}-${detail.product_id}`
                                                        ]
                                                    "
                                                    @input="
                                                        trackRowChange(
                                                            `${detail.product_request_id}-${detail.product_id}`
                                                        )
                                                    "
                                                    min="0"
                                                    placeholder="0"
                                                    :readonly="detail.status_id === 12"
                                                />
                                            </td>
                                            <td class="text-center">
                                                <input
                                                    type="number"
                                                    class="form-control form-control-sm no-spinner"
                                                    style="width: 60px; margin: 0 auto"
                                                    v-model="
                                                        qtyOverInputs[
                                                            `${detail.product_request_id}-${detail.product_id}`
                                                        ]
                                                    "
                                                    @input="
                                                        trackRowChange(
                                                            `${detail.product_request_id}-${detail.product_id}`
                                                        )
                                                    "
                                                    min="0"
                                                    placeholder="0"
                                                    :readonly="detail.status_id === 12"
                                                />
                                            </td>
                                            <td class="text-center">
                                                <input
                                                    type="number"
                                                    class="form-control form-control-sm no-spinner"
                                                    style="width: 40px; margin: 0 auto"
                                                    :value="
                                                        inputQuantities[
                                                            `${detail.product_request_id}-${detail.product_id}`
                                                        ] || 0
                                                    "
                                                    @input="
                                                        updateQuantity(
                                                            `${detail.product_request_id}-${detail.product_id}`,
                                                            $event.target.value,
                                                            inputQuantities[
                                                                `${detail.product_request_id}-${detail.product_id}`
                                                            ] || 0
                                                        )
                                                    "
                                                    min="0"
                                                    placeholder="0"
                                                    :readonly="detail.status_id === 12"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div
                                v-if="poProductDetails && poProductDetails.length > 0"
                                class="d-flex justify-content-between align-items-center mt-3"
                            >
                                <div class="text-muted">
                                    <small>
                                        {{ changedRows.size }} baris diubah
                                        <span v-if="priceChanged">, harga diubah</span>
                                    </small>
                                </div>
                                <button
                                    class="btn btn-primary"
                                    @click="saveChanges"
                                    :disabled="(changedRows.size === 0 && !priceChanged) || isLoading"
                                >
                                    <i class="fas fa-save me-2" :class="{ 'fa-spin': isLoading }"></i>
                                    {{
                                        isLoading
                                            ? 'Menyimpan...'
                                            : `Simpan Perubahan (${changedRows.size + (priceChanged ? 1 : 0)})`
                                    }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

/* Hide increment/decrement arrows for number inputs */
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-spinner[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;
}
</style>
