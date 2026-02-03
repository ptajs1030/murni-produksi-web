<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import Modal from '@/Components/Modal.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';

defineProps(['packagingSizeTypes', 'packagingSizeLevels']);
const emit = defineEmits(['saved']);
const show = ref(false);
const form = useForm({
    id: null,
    created_by: null,
    packaging_size_code: '',
    packaging_size_name: '',
    packaging_size_type_id: '',
    packaging_level_id: '',
    unit_conversion_value: '',
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

// Watcher untuk memastikan packaging_size_code selalu uppercase
watch(
    () => form.packaging_size_code,
    newValue => {
        if (newValue && newValue !== newValue.toUpperCase()) {
            form.packaging_size_code = newValue.toUpperCase();
        }
    }
);

const open = (packagingSize = null) => {
    if (packagingSize) {
        form.id = packagingSize.id;
        form.created_by = packagingSize.created_by;
        form.packaging_size_code = packagingSize.packaging_size_code;
        form.packaging_size_name = packagingSize.packaging_size_name;
        form.packaging_size_type_id = packagingSize.packaging_size_type_id;
        form.packaging_level_id = packagingSize.packaging_level_id;
        form.unit_conversion_value = packagingSize.unit_conversion_value;
    } else {
        form.reset();
    }
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

// Function untuk mengubah packaging_size_code ke huruf besar
const handlePackagingSizeCodeInput = event => {
    form.packaging_size_code = event.target.value.toUpperCase();
};

const submit = () => {
    // Pastikan packaging_size_code dalam huruf besar sebelum dikirim
    form.packaging_size_code = form.packaging_size_code.toUpperCase();

    const options = {
        onSuccess: () => {
            close();
            emit('saved');
        },
    };

    if (form.id) {
        form.put(route('packaging-sizes.update', form.id), options);
    } else {
        form.post(route('packaging-sizes.store'), options);
    }
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ isEditing ? 'Edit Ukuran Kemasan' : 'Tambah Ukuran Kemasan' }}
                </h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Kode Ukuran Kemasan -->
                    <div class="col-12 mb-3">
                        <InputLabel for="packaging_size_code" value="Kode Ukuran Kemasan" />
                        <TextInput
                            id="packaging_size_code"
                            :model-value="form.packaging_size_code"
                            @input="handlePackagingSizeCodeInput"
                            type="text"
                            class="form-control"
                            required
                            autofocus
                            style="text-transform: uppercase"
                        />
                        <InputError :message="form.errors.packaging_size_code" class="text-danger mt-1" />
                    </div>
                </div>
                <div class="row">
                    <!-- Nama Ukuran Kemasan -->
                    <div class="col-12 mb-3">
                        <InputLabel for="packaging_size_name" value="Nama Ukuran Kemasan" />
                        <TextInput
                            id="packaging_size_name"
                            v-model="form.packaging_size_name"
                            type="text"
                            class="form-control"
                            required
                        />
                        <InputError :message="form.errors.packaging_size_name" class="text-danger mt-1" />
                    </div>
                </div>
                <div class="row">
                    <!-- Tipe Ukuran Kemasan -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="packaging_size_type_id" value="Tipe Ukuran Kemasan" />
                        <select
                            id="packaging_size_type_id"
                            v-model="form.packaging_size_type_id"
                            class="form-select"
                            required
                        >
                            <option value="">Pilih Tipe Ukuran</option>
                            <option v-for="type in packagingSizeTypes" :key="type.id" :value="type.id">
                                {{ type.type_description }}
                            </option>
                        </select>
                        <InputError :message="form.errors.packaging_size_type_id" class="text-danger mt-1" />
                    </div>
                    <!-- Level Ukuran Kemasan -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="packaging_level_id" value="Level Ukuran Kemasan" />
                        <select id="packaging_level_id" v-model="form.packaging_level_id" class="form-select" required>
                            <option value="">Pilih Level Ukuran</option>
                            <option v-for="level in packagingSizeLevels" :key="level.id" :value="level.id">
                                {{ level.level_description }}
                            </option>
                        </select>
                        <InputError :message="form.errors.packaging_level_id" class="text-danger mt-1" />
                    </div>
                    <div class="row">
                        <div class="col-12 mb-3">
                            <InputLabel for="unit_conversion_value" value="Conversion Kemasan" />
                            <TextInput
                                id="unit_conversion_value"
                                v-model="form.unit_conversion_value"
                                type="number"
                                min="1"
                                class="form-control"
                                required
                            />
                            <InputError :message="form.errors.unit_conversion_value" class="text-danger mt-1" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary me-2" @click="close">Batal</button>
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
