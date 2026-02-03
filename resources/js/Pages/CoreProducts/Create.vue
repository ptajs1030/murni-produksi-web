<script setup>
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { computed, ref, watch } from "vue";
import uploadDefaultImg from "~/img/upload_default.png";

defineProps({
    categories: Array,
    suppliers: Array,
    propertyItems: Array,
    packagingSizes: Array,
    packagingTypes: Array,
    repackStatus: Array,
});

const imagePreview = ref([]);
const fileInputRef = ref(null);
const targetSellingDays = ref(null);

const form = useForm({
    product_name: "",
    brand_name: "",
    product_type: "",
    m_category_id: null,
    m_supplier_id: null,
    description: "",
    target_selling_date: null,
    m_property_item_id: null,
    m_packaging_size_id: null,
    m_packaging_type_id: null,
    m_repack_status_id: null,
    packaging_size_input: 0,
    product_unit_sku: "",
    product_unit_qty: 0,
    product_unit_price: 0,
    expired_date: null,
    images: [],
});

const formProductType = [
    { name: "Produk Bahan Baku" },
    { name: "Produk Jadi" },
];

// Computed property to calculate target selling date
const calculatedTargetDate = computed(() => {
    if (!targetSellingDays.value) return "";
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + parseInt(targetSellingDays.value));
    return targetDate.toISOString().split("T")[0];
});

// Watch for changes in targetSellingDays and update form.target_selling_date
watch(targetSellingDays, (newDays) => {
    if (newDays) {
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + parseInt(newDays));
        form.target_selling_date = targetDate.toISOString().split("T")[0];
    } else {
        form.target_selling_date = null;
    }
});

const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    imagePreview.value = [];
    form.images = [];
    files.forEach((file, index) => {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
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

const removeNewImage = (index) => {
    imagePreview.value.splice(index, 1);
    form.images.splice(index, 1);
};

const submit = () => {
    form.post(route("products.store"), {
        forceFormData: true,
    });
};
</script>

<template>
    <Head title="Tambah Produk" />

    <AuthenticatedLayout title="Tambah Produk">
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold leading-tight text-gray-800">
                    Tambah Produk
                </h2>
                <Link :href="route('products.index')" class="btn btn-secondary">
                    <i class="fas fa-arrow-left me-1"></i>
                    Kembali
                </Link>
            </div>
        </template>

        <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div class="m-3 text-gray-900">
                <form @submit.prevent="submit">
                    <div class="row">
                        <!-- Form Section -->
                        <div class="col-md-8">
                            <div class="mb-3">
                                <InputLabel
                                    for="product_name"
                                    value="Nama Produk"
                                />
                                <TextInput
                                    id="product_name"
                                    v-model="form.product_name"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                                <InputError
                                    :message="form.errors.product_name"
                                    class="text-danger mt-1"
                                />
                            </div>

                            <div class="mb-3">
                                <InputLabel for="brand_name" value="Brand" />
                                <TextInput
                                    id="brand_name"
                                    v-model="form.brand_name"
                                    type="text"
                                    class="form-control"
                                />
                                <InputError
                                    :message="form.errors.brand_name"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <div class="mb-3">
                                <InputLabel
                                    for="product_type"
                                    value="Tipe Produk"
                                />
                                <select
                                    name="product_type"
                                    id="product_type"
                                    class="form-select"
                                    v-model="form.product_type"
                                    required
                                >
                                    <option :value="null" disabled>
                                        Pilih Tipe Produk
                                    </option>
                                    <option
                                        v-for="(type, index) in formProductType"
                                        :key="index"
                                        :value="type.name"
                                    >
                                        {{ type.name }}
                                    </option>
                                </select>
                                <InputError
                                    :message="form.errors.product_type"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <div class="mb-3">
                                <InputLabel
                                    for="m_category_id"
                                    value="Kategori"
                                />
                                <select
                                    id="m_category_id"
                                    v-model="form.m_category_id"
                                    class="form-select"
                                    required
                                >
                                    <option :value="null" disabled>
                                        Pilih Kategori
                                    </option>
                                    <option
                                        v-for="category in categories"
                                        :key="category.id"
                                        :value="category.id"
                                    >
                                        {{ category.category_name }}
                                    </option>
                                </select>
                                <InputError
                                    :message="form.errors.m_category_id"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <div class="mb-3">
                                <InputLabel
                                    for="m_supplier_id"
                                    value="Supplier"
                                />
                                <select
                                    id="m_supplier_id"
                                    v-model="form.m_supplier_id"
                                    class="form-select"
                                    required
                                >
                                    <option :value="null" disabled>
                                        Pilih Supplier
                                    </option>
                                    <option
                                        v-for="supplier in suppliers"
                                        :key="supplier.id"
                                        :value="supplier.id"
                                    >
                                        {{ supplier.supplier_name }}
                                    </option>
                                </select>
                                <InputError
                                    :message="form.errors.m_supplier_id"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <div class="mb-3">
                                <InputLabel
                                    for="target_selling_date"
                                    value="Target Selling Date (days)"
                                />
                                <TextInput
                                    id="target_selling_date"
                                    v-model="targetSellingDays"
                                    type="number"
                                    min="1"
                                    class="form-control"
                                    placeholder="Enter days from today"
                                />
                                <InputError
                                    :message="form.errors.target_selling_date"
                                    class="text-danger mt-1"
                                />
                                <small class="text-muted"
                                    >Calculated date:
                                    {{ calculatedTargetDate }}</small
                                >
                            </div>
                            <div class="mb-3">
                                <InputLabel
                                    for="expired_date"
                                    value="Expired Date"
                                />
                                <TextInput
                                    id="expired_date"
                                    v-model="form.expired_date"
                                    type="date"
                                    class="form-control"
                                    required
                                />
                                <InputError
                                    :message="form.errors.expired_date"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <div class="mb-3">
                                <InputLabel
                                    for="m_property_item_id"
                                    value="Property Item"
                                />
                                <select
                                    id="m_property_item_id"
                                    v-model="form.m_property_item_id"
                                    class="form-select"
                                    required
                                >
                                    <option :value="null" disabled>
                                        Select Property Item
                                    </option>
                                    <option
                                        v-for="item in propertyItems"
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{ item.property_code }}
                                        ({{ item.property_name }})
                                    </option>
                                </select>
                                <InputError
                                    :message="form.errors.m_property_item_id"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <div class="mb-3">
                                <InputLabel
                                    for="m_packaging_size_id"
                                    value="Packaging Size"
                                />
                                <select
                                    id="m_packaging_size_id"
                                    v-model="form.m_packaging_size_id"
                                    class="form-select"
                                    required
                                >
                                    <option :value="null" disabled>
                                        Select Packaging Size
                                    </option>
                                    <option
                                        v-for="size in packagingSizes"
                                        :key="size.id"
                                        :value="size.id"
                                    >
                                        {{ size.packaging_size_code }}
                                        ({{ size.packaging_size_name }})
                                    </option>
                                </select>
                                <InputError
                                    :message="form.errors.m_packaging_size_id"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <div class="mb-3">
                                <InputLabel
                                    for="m_packaging_type_id"
                                    value="Packaging Type"
                                />
                                <select
                                    id="m_packaging_type_id"
                                    v-model="form.m_packaging_type_id"
                                    class="form-select"
                                    required
                                >
                                    <option :value="null" disabled>
                                        Select Packaging Type
                                    </option>
                                    <option
                                        v-for="type in packagingTypes"
                                        :key="type.id"
                                        :value="type.id"
                                    >
                                        {{ type.packaging_type_code }}
                                        ({{ type.packaging_type_name }})
                                    </option>
                                </select>
                                <InputError
                                    :message="form.errors.m_packaging_type_id"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <div class="mb-3">
                                <InputLabel
                                    for="m_repack_status_id"
                                    value="Repack Status"
                                />
                                <select
                                    id="m_repack_status_id"
                                    v-model="form.m_repack_status_id"
                                    class="form-select"
                                    required
                                >
                                    <option :value="null" disabled>
                                        Select Repack Status
                                    </option>
                                    <option
                                        v-for="status in repackStatus"
                                        :key="status.id"
                                        :value="status.id"
                                    >
                                        {{ status.repack_code }}
                                        ({{ status.repack_name }})
                                    </option>
                                </select>
                                <InputError
                                    :message="form.errors.m_repack_status_id"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <!-- <div class="mb-3">
                                <InputLabel for="packaging_size_input" value="Packaging Size Input" />
                                <TextInput
                                    id="packaging_size_input"
                                    v-model="form.packaging_size_input"
                                    type="number"
                                    class="form-control"
                                    required
                                />
                                <InputError :message="form.errors.packaging_size_input" class="text-danger mt-1" />
                            </div> -->
                            <div class="mb-3">
                                <InputLabel
                                    for="product_unit_sku"
                                    value="SKU"
                                />
                                <TextInput
                                    id="product_unit_sku"
                                    v-model="form.product_unit_sku"
                                    type="text"
                                    class="form-control"
                                    readonly
                                />
                                <InputError
                                    :message="form.errors.product_unit_sku"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <!-- <div class="mb-3">
                                <InputLabel for="product_unit_qty" value="Quantity" />
                                <TextInput
                                    id="product_unit_qty"
                                    v-model="form.product_unit_qty"
                                    type="number"
                                    class="form-control"
                                    required
                                />
                                <InputError :message="form.errors.product_unit_qty" class="text-danger mt-1" />
                            </div> -->
                            <!-- <div class="mb-3">
                                <InputLabel for="product_unit_price" value="Price" />
                                <TextInput
                                    id="product_unit_price"
                                    v-model="form.product_unit_price"
                                    type="number"
                                    class="form-control"
                                />
                                <InputError :message="form.errors.product_unit_price" class="text-danger mt-1" />
                            </div> -->
                            <div class="mb-3">
                                <InputLabel
                                    for="description"
                                    value="Description"
                                />
                                <textarea
                                    id="description"
                                    v-model="form.description"
                                    class="form-control"
                                ></textarea>
                                <InputError
                                    :message="form.errors.description"
                                    class="text-danger mt-1"
                                />
                            </div>
                        </div>

                        <!-- Image Section -->
                        <div class="col-md-4">
                            <div class="mb-3">
                                <InputLabel
                                    for="images"
                                    value="Gambar Produk"
                                />
                                <div
                                    class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400"
                                    @click="() => fileInputRef.click()"
                                >
                                    <img
                                        :src="uploadDefaultImg"
                                        alt="Upload"
                                        class="mx-auto mb-2"
                                        style="
                                            width: 64px;
                                            height: 64px;
                                            opacity: 0.6;
                                        "
                                    />
                                    <p class="mb-0 text-gray-500">
                                        Klik untuk memilih gambar
                                    </p>
                                    <small class="text-muted">
                                        Format yang didukung: JPG, PNG, GIF.
                                        Maksimal 5MB per file.
                                    </small>
                                </div>
                                <input
                                    ref="fileInputRef"
                                    type="file"
                                    id="images"
                                    class="d-none"
                                    multiple
                                    accept="image/*"
                                    @change="handleFileUpload"
                                />
                                <InputError
                                    :message="form.errors.images"
                                    class="text-danger mt-1"
                                />
                            </div>
                            <!-- Preview gambar yang akan diupload -->
                            <div v-if="imagePreview.length > 0" class="mb-3">
                                <h6>Preview Gambar:</h6>
                                <div class="row">
                                    <div
                                        v-for="(image, index) in imagePreview"
                                        :key="`preview-${index}`"
                                        class="col-md-6 mb-2"
                                    >
                                        <div class="position-relative">
                                            <img
                                                :src="image.url"
                                                alt="Preview"
                                                class="img-thumbnail"
                                                style="
                                                    width: 100%;
                                                    height: 120px;
                                                    object-fit: cover;
                                                "
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
                        </div>
                    </div>

                    <div class="d-flex justify-content-start mt-4 gap-2">
                        <PrimaryButton
                            :disabled="form.processing"
                            class="btn btn-primary"
                        >
                            <span v-if="form.processing">
                                <i class="fas fa-spinner fa-spin me-1"></i>
                                Menyimpan...
                            </span>
                            <span v-else>
                                <i class="fas fa-save me-1"></i>
                                Simpan
                            </span>
                        </PrimaryButton>
                        <Link
                            :href="route('products.index')"
                            class="btn btn-secondary"
                        >
                            <i class="fas fa-times me-1"></i>
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
