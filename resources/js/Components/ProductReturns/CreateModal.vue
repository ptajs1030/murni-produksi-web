<template>
    <div class="modal fade" :class="{ show: show, 'd-block': show }" tabindex="-1" v-if="show">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form @submit.prevent="submitForm">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Product Return</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">
                                    Product
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" v-model="form.product_id" required>
                                    <option value="">Select Product</option>
                                    <option v-for="product in products" :key="product.id" :value="product.id">
                                        {{ product.product_name }} ({{ product.product_unit_sku }})
                                    </option>
                                </select>
                                <div v-if="form.errors.product_id" class="text-danger small">
                                    {{ form.errors.product_id }}
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">
                                    Warehouse
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" v-model="form.warehouse_id" required>
                                    <option value="">Select Warehouse</option>
                                    <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                                        {{ warehouse.warehouse_name }}
                                    </option>
                                </select>
                                <div v-if="form.errors.warehouse_id" class="text-danger small">
                                    {{ form.errors.warehouse_id }}
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">
                                    Out Type
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" v-model="form.out_type_id" required>
                                    <option value="">Select Out Type</option>
                                    <option v-for="outType in outTypes" :key="outType.id" :value="outType.id">
                                        {{ outType.out_type_name }}
                                    </option>
                                </select>
                                <div v-if="form.errors.out_type_id" class="text-danger small">
                                    {{ form.errors.out_type_id }}
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">
                                    Quantity
                                    <span class="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    class="form-control"
                                    v-model="form.packaging_size_input"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                                <div v-if="form.errors.quantity" class="text-danger small">
                                    {{ form.errors.quantity }}
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Notes</label>
                            <textarea
                                class="form-control"
                                v-model="form.notes"
                                rows="3"
                                placeholder="Optional notes about this return"
                            ></textarea>
                            <div v-if="form.errors.notes" class="text-danger small">
                                {{ form.errors.notes }}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                        <button type="submit" class="btn btn-primary" :disabled="form.processing">
                            <i class="fas fa-spinner fa-spin me-2" v-if="form.processing"></i>
                            Save Return
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3';
import { watch } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    products: {
        type: Array,
        default: () => [],
    },
    warehouses: {
        type: Array,
        default: () => [],
    },
    outTypes: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['close', 'success']);

const form = useForm({
    product_id: '',
    warehouse_id: '',
    out_type_id: '',
    packaging_size_input: '',
    notes: '',
});

const submitForm = () => {
    form.post('/product-returns', {
        onSuccess: () => {
            form.reset();
            emit('success');
            emit('close');
        },
    });
};

const closeModal = () => {
    form.reset();
    form.clearErrors();
    emit('close');
};

// Reset form when modal closes
watch(
    () => props.show,
    newValue => {
        if (!newValue) {
            form.reset();
            form.clearErrors();
        }
    }
);
</script>