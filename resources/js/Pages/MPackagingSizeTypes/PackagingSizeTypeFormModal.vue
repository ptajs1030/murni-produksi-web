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
const form = useForm({
    id: null,
    created_by: null,
    type_code: '',
    type_description: '',
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

// Watcher untuk memastikan type_code selalu uppercase
watch(
    () => form.type_code,
    newValue => {
        if (newValue && newValue !== newValue.toUpperCase()) {
            form.type_code = newValue.toUpperCase();
        }
    }
);

const open = (packagingSizeType = null) => {
    if (packagingSizeType) {
        form.id = packagingSizeType.id;
        form.created_by = packagingSizeType.created_by;
        form.type_code = packagingSizeType.type_code;
        form.type_description = packagingSizeType.type_description;
    } else {
        form.reset();
    }
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

// Function untuk mengubah type_code ke huruf besar
const handleTypeCodeInput = event => {
    form.type_code = event.target.value.toUpperCase();
};

const submit = () => {
    // Pastikan type_code dalam huruf besar sebelum dikirim
    form.type_code = form.type_code.toUpperCase();

    const options = {
        onSuccess: () => {
            close();
            emit('saved');
        },
    };

    if (form.id) {
        form.put(route('packaging-size-types.update', form.id), options);
    } else {
        form.post(route('packaging-size-types.store'), options);
    }
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ isEditing ? 'Edit Tipe Ukuran Kemasan' : 'Tambah Tipe Ukuran Kemasan' }}
                </h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Kode Tipe Ukuran Kemasan -->
                    <div class="col-12 mb-3">
                        <InputLabel for="type_code" value="Kode Tipe Ukuran Kemasan" />
                        <TextInput
                            id="type_code"
                            :model-value="form.type_code"
                            @input="handleTypeCodeInput"
                            type="text"
                            class="form-control"
                            required
                            autofocus
                            style="text-transform: uppercase"
                        />
                        <InputError :message="form.errors.type_code" class="text-danger mt-1" />
                    </div>
                </div>
                <div class="row">
                    <!-- Nama Tipe Ukuran Kemasan -->
                    <div class="col-12 mb-3">
                        <InputLabel for="type_description" value="Nama Tipe Ukuran Kemasan" />
                        <TextInput
                            id="type_description"
                            v-model="form.type_description"
                            type="text"
                            class="form-control"
                            required
                        />
                        <InputError :message="form.errors.type_description" class="text-danger mt-1" />
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
