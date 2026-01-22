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
    supplier_code: '',
    supplier_name: '',
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

// Watcher untuk memastikan supplier_code selalu uppercase
watch(
    () => form.supplier_code,
    newValue => {
        if (newValue && newValue !== newValue.toUpperCase()) {
            form.supplier_code = newValue.toUpperCase();
        }
    }
);

const open = (supplier = null) => {
    if (supplier) {
        form.id = supplier.id;
        form.created_by = supplier.created_by;
        form.supplier_code = supplier.supplier_code;
        form.supplier_name = supplier.supplier_name;
    } else {
        form.reset();
    }
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

// Function untuk mengubah supplier_code ke huruf besar
const handleSupplierCodeInput = event => {
    form.supplier_code = event.target.value.toUpperCase();
};

const submit = () => {
    // Pastikan supplier_code dalam huruf besar sebelum dikirim
    form.supplier_code = form.supplier_code.toUpperCase();

    const options = {
        onSuccess: () => {
            close();
            emit('saved');
        },
    };

    if (form.id) {
        form.put(route('suppliers.update', form.id), options);
    } else {
        form.post(route('suppliers.store'), options);
    }
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ isEditing ? 'Edit Supplier' : 'Tambah Supplier' }}
                </h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Kode Supplier -->
                    <div class="col-12 mb-3">
                        <InputLabel for="supplier_code" value="Kode Supplier" />
                        <TextInput
                            id="supplier_code"
                            :model-value="form.supplier_code"
                            @input="handleSupplierCodeInput"
                            type="text"
                            class="form-control"
                            required
                            autofocus
                            style="text-transform: uppercase"
                        />
                        <InputError :message="form.errors.supplier_code" class="text-danger mt-1" />
                    </div>
                </div>
                <div class="row">
                    <!-- Nama Supplier -->
                    <div class="col-12 mb-3">
                        <InputLabel for="supplier_name" value="Nama Supplier" />
                        <TextInput
                            id="supplier_name"
                            v-model="form.supplier_name"
                            type="text"
                            class="form-control"
                            required
                        />
                        <InputError :message="form.errors.supplier_name" class="text-danger mt-1" />
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
