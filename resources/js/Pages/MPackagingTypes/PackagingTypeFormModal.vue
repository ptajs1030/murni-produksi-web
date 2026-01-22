<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import Modal from '@/Components/Modal.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';

defineProps(['packagingLevels']);
const emit = defineEmits(['saved']);
const show = ref(false);
const form = useForm({
    id: null,
    created_by: null,
    packaging_type_code: '',
    packaging_type_name: '',
    packaging_level_id: '',
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

// Watcher untuk memastikan packaging_type_code selalu uppercase
watch(
    () => form.packaging_type_code,
    newValue => {
        if (newValue && newValue !== newValue.toUpperCase()) {
            form.packaging_type_code = newValue.toUpperCase();
        }
    }
);

const open = (packaging_type = null) => {
    if (packaging_type) {
        form.id = packaging_type.id;
        form.created_by = packaging_type.created_by;
        form.packaging_type_code = packaging_type.packaging_type_code;
        form.packaging_type_name = packaging_type.packaging_type_name;
        form.packaging_level_id = packaging_type.packaging_level_id;
    } else {
        form.reset();
    }
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

// Function untuk mengubah packaging_type_code ke huruf besar
const handlePackagingTypeCodeInput = event => {
    form.packaging_type_code = event.target.value.toUpperCase();
};

const submit = () => {
    // Pastikan packaging_type_code dalam huruf besar sebelum dikirim
    form.packaging_type_code = form.packaging_type_code.toUpperCase();

    const options = {
        onSuccess: () => {
            close();
            emit('saved');
        },
    };

    if (form.id) {
        form.put(route('packaging-types.update', form.id), options);
    } else {
        form.post(route('packaging-types.store'), options);
    }
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ isEditing ? 'Edit Tipe Kemasan' : 'Tambah Tipe Kemasan' }}
                </h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Kode Tipe Kemasan -->
                    <div class="col-12 mb-3">
                        <InputLabel for="packaging_type_code" value="Kode Tipe Kemasan" />
                        <TextInput
                            id="packaging_type_code"
                            :model-value="form.packaging_type_code"
                            @input="handlePackagingTypeCodeInput"
                            type="text"
                            class="form-control"
                            required
                            autofocus
                            style="text-transform: uppercase"
                        />
                        <InputError :message="form.errors.packaging_type_code" class="text-danger mt-1" />
                    </div>
                </div>
                <div class="row">
                    <!-- Nama Tipe Kemasan -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="packaging_type_name" value="Nama Tipe Kemasan" />
                        <TextInput
                            id="packaging_type_name"
                            v-model="form.packaging_type_name"
                            type="text"
                            class="form-control"
                            required
                        />
                        <InputError :message="form.errors.packaging_type_name" class="text-danger mt-1" />
                    </div>
                    <!-- Level Kemasan -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="packaging_level_id" value="Level Kemasan" />
                        <select id="packaging_level_id" v-model="form.packaging_level_id" class="form-select" required>
                            <option value="">Pilih Level Kemasan</option>
                            <option v-for="level in packagingLevels" :key="level.id" :value="level.id">
                                {{ level.level_description }}
                            </option>
                        </select>
                        <InputError :message="form.errors.packaging_level_id" class="text-danger mt-1" />
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
