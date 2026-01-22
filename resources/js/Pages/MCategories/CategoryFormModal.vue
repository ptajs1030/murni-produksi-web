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
    category_code: '',
    category_name: '',
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

// Watcher untuk memastikan category_code selalu uppercase
watch(
    () => form.category_code,
    newValue => {
        if (newValue && newValue !== newValue.toUpperCase()) {
            form.category_code = newValue.toUpperCase();
        }
    }
);

const open = (category = null) => {
    if (category) {
        form.id = category.id;
        form.created_by = category.created_by;
        form.category_code = category.category_code;
        form.category_name = category.category_name;
    } else {
        form.reset();
    }
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

// Function untuk mengubah category_code ke huruf besar
const handleCategoryCodeInput = event => {
    form.category_code = event.target.value.toUpperCase();
};

const submit = () => {
    // Pastikan category_code dalam huruf besar sebelum dikirim
    form.category_code = form.category_code.toUpperCase();

    const options = {
        onSuccess: () => {
            close();
            emit('saved');
        },
    };

    if (form.id) {
        form.put(route('categories.update', form.id), options);
    } else {
        form.post(route('categories.store'), options);
    }
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ isEditing ? 'Edit Category' : 'Tambah Category' }}
                </h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Kode Kategori -->
                    <div class="col-12 mb-3">
                        <InputLabel for="category_code" value="Kode Kategori" />
                        <TextInput
                            id="category_code"
                            :model-value="form.category_code"
                            @input="handleCategoryCodeInput"
                            type="text"
                            class="form-control"
                            required
                            autofocus
                            style="text-transform: uppercase"
                        />
                        <InputError :message="form.errors.category_code" class="text-danger mt-1" />
                    </div>
                </div>
                <div class="row">
                    <!-- Nama Kategori -->
                    <div class="col-12 mb-3">
                        <InputLabel for="category_name" value="Nama Kategori" />
                        <TextInput
                            id="category_name"
                            v-model="form.category_name"
                            type="text"
                            class="form-control"
                            required
                        />
                        <InputError :message="form.errors.category_name" class="text-danger mt-1" />
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
