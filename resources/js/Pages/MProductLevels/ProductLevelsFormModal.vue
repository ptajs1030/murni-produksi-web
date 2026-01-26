<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import Modal from '@/Components/Modal.vue';
import NumberInput from '@/Components/NumberInput.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

const emit = defineEmits(['saved']);
const show = ref(false);
const form = useForm({
    id: null,
    created_by: null,
    level_code: 0,
    level_description: '',
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

const open = (warehouse = null) => {
    if (warehouse) {
        form.id = warehouse.id;
        form.created_by = warehouse.created_by;
        form.level_code = warehouse.level_code;
        form.level_description = warehouse.level_description;
    } else {
        form.reset();
    }
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

const submit = () => {
    const options = {
        onSuccess: () => {
            close();
            emit('saved');
        },
    };

    if (form.id) {
        form.put(route('packaging-size-levels.update', form.id), options);
    } else {
        form.post(route('packaging-size-levels.store'), options);
    }
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ isEditing ? 'Edit Product Level' : 'Tambah Product Level' }}
                </h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12 mb-3">
                        <InputLabel for="level_code" value="Level Code" />
                        <NumberInput
                            id="level_code"
                            v-model="form.level_code"
                            type="text"
                            class="form-control"
                            required
                            autofocus
                        />
                        <InputError :message="form.errors.level_code" class="text-danger mt-1" />
                    </div>
                </div>
                <div class="row">
                    <!-- Level Level -->
                    <div class="col-12 mb-3">
                        <InputLabel for="level_description" value="Description" />
                        <TextInput
                            id="level_description"
                            v-model="form.level_description"
                            class="form-control"
                            required
                        />
                        <InputError :message="form.errors.level_description" class="text-danger mt-1" />
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
