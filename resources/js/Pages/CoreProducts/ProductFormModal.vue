<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import Modal from '@/Components/Modal.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';

const emit = defineEmits(['saved']);
const show = ref(false);
const imagePreview = ref([]);
const fileInputRef = ref(null);
const form = useForm({
    id: null,
    created_by: null,
    product_name: '',
    brand_name: '',
    m_category_id: null,
    m_supplier_id: null,
    description: '',
    target_selling_date: null,
    product_is_pre_order: false,
    product_processing_days: 0,
    m_property_item_id: null,
    m_packaging_size_id: null,
    m_packaging_type_id: null,
    m_repack_status_id: null,
    packaging_size_input: 0,
    product_unit_sku: '',
    product_unit_qty: 0,
    product_unit_price: 0,
    expired_date: null,
    images: [],
    existing_images: [],
    deleted_images: [],
});

defineProps({
    categories: Array,
    suppliers: Array,
    propertyItems: Array,
    packagingSizes: Array,
    packagingTypes: Array,
    repackStatus: Array,
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

// Watcher untuk memastikan product_code selalu uppercase
watch(
    () => form.product_code,
    newValue => {
        if (newValue && newValue !== newValue.toUpperCase()) {
            form.product_code = newValue.toUpperCase();
        }
    }
);

const handleFileUpload = event => {
    const files = Array.from(event.target.files);
    imagePreview.value = [];
    form.images = [];
    files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = e => {
                imagePreview.value.push({
                    url: e.target.result,
                    file: file,
                    index: index,
                });
            };
            reader.readAsDataURL(file);
            form.images.push(file);
        }
    });
};

const removeNewImage = index => {
    imagePreview.value.splice(index, 1);
    form.images.splice(index, 1);
};

const removeExistingImage = (imageId, index) => {
    form.deleted_images.push(imageId);
    form.existing_images.splice(index, 1);
};

const open = (product = null) => {
    if (product) {
        // Debug: log data produk yang diterima
        console.log('Product data received:', product);
        form.id = product.id;
        form.created_by = product.created_by;
        form.product_name = product.product_name;
        form.m_category_id = product.m_category_id;
        form.m_supplier_id = product.m_supplier_id;
        form.brand_name = product.brand_name;
        form.description = product.description;
        form.target_selling_date = product.target_selling_date;
        form.product_is_pre_order = product.product_is_pre_order;
        form.product_processing_days = product.product_processing_days;
        form.m_property_item_id = product.m_property_item_id;
        form.m_packaging_size_id = product.m_packaging_size_id;
        form.m_packaging_type_id = product.m_packaging_type_id;
        form.m_repack_status_id = product.m_repack_status_id;
        form.packaging_size_input = product.packaging_size_input;
        form.product_unit_sku = product.product_unit_sku;
        form.product_unit_qty = product.product_unit_qty;
        form.product_unit_price = product.product_unit_price;
        form.expired_date = product.expired_date;
        form.existing_images = product.product_images || product.productImages || [];
    } else {
        form.reset();
        imagePreview.value = [];
    }
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
    imagePreview.value = [];
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};

const submit = () => {
    const options = {
        onSuccess: () => {
            close();
            emit('saved');
        },
        forceFormData: true,
    };

    if (form.id) {
        // Debug: console log untuk melihat data yang dikirim
        console.log('Form data:', form.data());
        // Untuk update dengan file upload, gunakan POST dengan _method
        form.transform(data => ({
            ...data,
            _method: 'PUT',
        })).post(route('products.update', form.id), options);
    } else {
        // Debug: log URL yang digunakan
        console.log('Store URL:', route('products.store'));
        // Temporary hardcode untuk test
        form.post('/products', options);
    }
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" :closeable="false" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ isEditing ? 'Edit Produk' : 'Tambah Produk' }}
                </h5>
            </div>
            <div class="modal-body" style="max-height: 70vh; overflow-y: auto">
                <div class="row">
                    <!-- All the new fields will be added here -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="product_name" value="Nama Produk" />
                        <TextInput
                            id="product_name"
                            v-model="form.product_name"
                            type="text"
                            class="form-control"
                            required
                        />
                        <InputError :message="form.errors.product_name" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="brand_name" value="Brand" />
                        <TextInput id="brand_name" v-model="form.brand_name" type="text" class="form-control" />
                        <InputError :message="form.errors.brand_name" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="m_category_id" value="Kategori" />
                        <select id="m_category_id" v-model="form.m_category_id" class="form-select" required>
                            <option :value="null" disabled>Pilih Kategori</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.category_name }}
                            </option>
                        </select>
                        <InputError :message="form.errors.m_category_id" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="m_supplier_id" value="Supplier" />
                        <select id="m_supplier_id" v-model="form.m_supplier_id" class="form-select" required>
                            <option :value="null" disabled>Pilih Supplier</option>
                            <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                                {{ supplier.supplier_name }}
                            </option>
                        </select>
                        <InputError :message="form.errors.m_supplier_id" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-12 mb-3">
                        <InputLabel for="description" value="Description" />
                        <textarea id="description" v-model="form.description" class="form-control"></textarea>
                        <InputError :message="form.errors.description" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="target_selling_date" value="Target Selling Date" />
                        <TextInput
                            id="target_selling_date"
                            v-model="form.target_selling_date"
                            type="date"
                            class="form-control"
                        />
                        <InputError :message="form.errors.target_selling_date" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="expired_date" value="Expired Date" />
                        <TextInput id="expired_date" v-model="form.expired_date" type="date" class="form-control" />
                        <InputError :message="form.errors.expired_date" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="form.product_is_pre_order"
                                id="product_is_pre_order"
                            />
                            <label class="form-check-label" for="product_is_pre_order">Pre-order?</label>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="product_processing_days" value="Processing Days" />
                        <TextInput
                            id="product_processing_days"
                            v-model="form.product_processing_days"
                            type="number"
                            class="form-control"
                        />
                        <InputError :message="form.errors.product_processing_days" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="m_property_item_id" value="Property Item" />
                        <select id="m_property_item_id" v-model="form.m_property_item_id" class="form-select">
                            <option :value="null" disabled>Select Property Item</option>
                            <option v-for="item in propertyItems" :key="item.id" :value="item.id">
                                {{ item.property_code }}
                                ({{ item.property_name }})
                            </option>
                        </select>
                        <InputError :message="form.errors.m_property_item_id" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="m_packaging_size_id" value="Packaging Size" />
                        <select id="m_packaging_size_id" v-model="form.m_packaging_size_id" class="form-select">
                            <option :value="null" disabled>Select Packaging Size</option>
                            <option v-for="size in packagingSizes" :key="size.id" :value="size.id">
                                {{ size.packaging_size_code }}
                                ({{ size.packaging_size_name }})
                            </option>
                        </select>
                        <InputError :message="form.errors.m_packaging_size_id" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="m_packaging_type_id" value="Packaging Type" />
                        <select id="m_packaging_type_id" v-model="form.m_packaging_type_id" class="form-select">
                            <option :value="null" disabled>Select Packaging Type</option>
                            <option v-for="type in packagingTypes" :key="type.id" :value="type.id">
                                {{ type.packaging_type_code }}
                                ({{ type.packaging_type_name }})
                            </option>
                        </select>
                        <InputError :message="form.errors.m_packaging_type_id" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="m_repack_status_id" value="Repack Status" />
                        <select id="m_repack_status_id" v-model="form.m_repack_status_id" class="form-select">
                            <option :value="null" disabled>Select Repack Status</option>
                            <option v-for="status in repackStatus" :key="status.id" :value="status.id">
                                {{ status.repack_code }}
                                ({{ status.repack_name }})
                            </option>
                        </select>
                        <InputError :message="form.errors.m_repack_status_id" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="packaging_size_input" value="Packaging Size Input" />
                        <TextInput
                            id="packaging_size_input"
                            v-model="form.packaging_size_input"
                            type="number"
                            class="form-control"
                        />
                        <InputError :message="form.errors.packaging_size_input" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="product_unit_qty" value="Quantity" />
                        <TextInput
                            id="product_unit_qty"
                            v-model="form.product_unit_qty"
                            type="number"
                            class="form-control"
                        />
                        <InputError :message="form.errors.product_unit_qty" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="images" value="Gambar Produk" />
                        <input
                            ref="fileInputRef"
                            type="file"
                            id="images"
                            class="form-control"
                            multiple
                            accept="image/*"
                            @change="handleFileUpload"
                        />
                        <small class="text-muted">Format yang didukung: JPG, PNG, GIF. Maksimal 5MB per file.</small>
                        <InputError :message="form.errors.images" class="text-danger mt-1" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <InputLabel for="product_unit_price" value="Price" />
                        <TextInput
                            id="product_unit_price"
                            v-model="form.product_unit_price"
                            type="number"
                            class="form-control"
                        />
                        <InputError :message="form.errors.product_unit_price" class="text-danger mt-1" />
                    </div>

                    <!-- Preview gambar yang akan diupload -->
                    <div v-if="imagePreview.length > 0">
                        <h6>Preview Gambar Baru:</h6>
                        <div class="row">
                            <div v-for="(image, index) in imagePreview" :key="`preview-${index}`" class="col-md-3 mb-2">
                                <div class="position-relative">
                                    <img
                                        :src="image.url"
                                        alt="Preview"
                                        class="img-thumbnail"
                                        style="width: 100%; height: 120px; object-fit: cover"
                                    />
                                    <button
                                        type="button"
                                        class="btn btn-danger btn-sm position-absolute end-0 top-0"
                                        @click="removeNewImage(index)"
                                        style="z-index: 10"
                                    >
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Preview gambar existing saat edit -->
                    <div v-if="form.existing_images && form.existing_images.length > 0">
                        <h6>Gambar Saat Ini:</h6>
                        <div class="row">
                            <div
                                v-for="(image, index) in form.existing_images"
                                :key="`existing-${image.id}`"
                                class="col-md-3 mb-2"
                            >
                                <div class="position-relative">
                                    <img
                                        :src="image.image_url"
                                        alt="Existing"
                                        class="img-thumbnail"
                                        style="width: 100%; height: 120px; object-fit: cover"
                                    />
                                    <button
                                        type="button"
                                        class="btn btn-danger btn-sm position-absolute end-0 top-0"
                                        @click="removeExistingImage(image.id, index)"
                                        style="z-index: 10"
                                    >
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary me-2" @click="close">
                    <i class="fas fa-times me-1"></i>
                    Batal
                </button>
                <PrimaryButton :disabled="form.processing" class="btn btn-primary">
                    <span v-if="form.processing">
                        <i class="fas fa-spinner fa-spin me-1"></i>
                        Menyimpan...
                    </span>
                    <span v-else>
                        <i class="fas fa-save me-1"></i>
                        {{ isEditing ? 'Update' : 'Simpan' }}
                    </span>
                </PrimaryButton>
            </div>
        </form>
    </Modal>
</template>
