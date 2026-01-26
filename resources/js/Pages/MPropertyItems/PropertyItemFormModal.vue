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
    property_code: '',
    property_name: '',
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

// Watcher untuk memastikan property_code selalu uppercase
watch(
    () => form.property_code,
    newValue => {
        if (newValue && newValue !== newValue.toUpperCase()) {
            form.property_code = newValue.toUpperCase();
        }
    }
);

const open = (propertyItem = null) => {
    if (propertyItem) {
        form.id = propertyItem.id;
        form.created_by = propertyItem.created_by;
        form.property_code = propertyItem.property_code;
        form.property_name = propertyItem.property_name;
    } else {
        form.reset();
    }
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

// Function untuk mengubah property_code ke huruf besar
const handlePropertyCodeInput = event => {
    form.property_code = event.target.value.toUpperCase();
};

const submit = () => {
    // Pastikan property_code dalam huruf besar sebelum dikirim
    form.property_code = form.property_code.toUpperCase();

    const options = {
        onSuccess: () => {
            close();
            emit('saved');
        },
    };

    if (form.id) {
        form.put(route('property-items.update', form.id), options);
    } else {
        form.post(route('property-items.store'), options);
    }
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ isEditing ? 'Edit Property Item' : 'Tambah Property Item' }}
                </h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Kode Property -->
                    <div class="col-12 mb-3">
                        <InputLabel for="property_code" value="Kode Property" />
                        <TextInput
                            id="property_code"
                            :model-value="form.property_code"
                            @input="handlePropertyCodeInput"
                            type="text"
                            class="form-control"
                            required
                            autofocus
                            style="text-transform: uppercase"
                        />
                        <InputError :message="form.errors.property_code" class="text-danger mt-1" />
                    </div>
                </div>
                <div class="row">
                    <!-- Nama Property -->
                    <div class="col-12 mb-3">
                        <InputLabel for="property_name" value="Nama Property" />
                        <TextInput
                            id="property_name"
                            v-model="form.property_name"
                            type="text"
                            class="form-control"
                            required
                        />
                        <InputError :message="form.errors.property_name" class="text-danger mt-1" />
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
