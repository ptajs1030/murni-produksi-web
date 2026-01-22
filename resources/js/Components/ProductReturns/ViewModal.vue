<template>
    <div class="modal fade" :class="{ show: show, 'd-block': show }" tabindex="-1" v-if="show && item">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Product Return Details</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted">Product</label>
                            <div class="fw-medium">{{ item.product?.product_name || '-' }}</div>
                            <small class="text-muted">SKU: {{ item.product?.product_unit_sku || '-' }}</small>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted">Warehouse</label>
                            <div class="fw-medium">{{ item.warehouse?.warehouse_name || '-' }}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted">Out Type</label>
                            <div>
                                <span class="badge bg-warning text-dark">
                                    {{ item.out_type?.out_type_name || '-' }}
                                </span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted">Quantity</label>
                            <div class="fw-medium text-danger">-{{ formatQuantity(item.packaging_size_input) }}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted">Created At</label>
                            <div class="fw-medium">{{ formatDate(item.created_at) }}</div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted">Created By</label>
                            <div class="fw-medium">{{ item.created_by?.name || '-' }}</div>
                        </div>
                    </div>
                    <div class="mb-3" v-if="item.notes">
                        <label class="form-label text-muted">Notes</label>
                        <div class="fw-medium">{{ item.notes }}</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    item: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['close']);

const formatDate = date => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatQuantity = quantity => {
    if (!quantity) return '0';
    return Number(quantity).toLocaleString('id-ID');
};

const closeModal = () => {
    emit('close');
};
</script>
