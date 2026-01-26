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
    repack_code: '',
    repack_name: '',
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

// Watcher untuk memastikan repack_code selalu uppercase
watch(
    () => form.repack_code,
    newValue => {
        if (newValue && newValue !== newValue.toUpperCase()) {
            form.repack_code = newValue.toUpperCase();
        }
    }
);

const open = (repack_status = null) => {
    if (repack_status) {
        form.id = repack_status.id;
        form.created_by = repack_status.created_by;
        form.repack_code = repack_status.repack_code;
        form.repack_name = repack_status.repack_name;
    } else {
        form.reset();
    }
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

// Function untuk mengubah repack_code ke huruf besar
const handleRepackCodeInput = event => {
    form.repack_code = event.target.value.toUpperCase();
};

const submit = () => {
    // Pastikan repack_code dalam huruf besar sebelum dikirim
    form.repack_code = form.repack_code.toUpperCase();

    const options = {
        onSuccess: () => {
            close();
            emit('saved');
        },
    };

    if (form.id) {
        form.put(route('repack-status.update', form.id), options);
    } else {
        form.post(route('repack-status.store'), options);
    }
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ isEditing ? 'Edit Status Repack' : 'Tambah Status Repack' }}
                </h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Kode Status Repack -->
                    <div class="col-12 mb-3">
                        <InputLabel for="repack_code" value="Kode Status Repack" />
                        <TextInput
                            id="repack_code"
                            :model-value="form.repack_code"
                            @input="handleRepackCodeInput"
                            type="text"
                            class="form-control"
                            required
                            autofocus
                            style="text-transform: uppercase"
                        />
                        <InputError :message="form.errors.repack_code" class="text-danger mt-1" />
                    </div>
                </div>
                <div class="row">
                    <!-- Nama Status Repack -->
                    <div class="col-12 mb-3">
                        <InputLabel for="repack_name" value="Nama Status Repack" />
                        <TextInput
                            id="repack_name"
                            v-model="form.repack_name"
                            type="text"
                            class="form-control"
                            required
                        />
                        <InputError :message="form.errors.repack_name" class="text-danger mt-1" />
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
