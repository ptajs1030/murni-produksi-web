<script setup>
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import Modal from "@/Components/Modal.vue"; // Import komponen Modal
import PrimaryButton from "@/Components/PrimaryButton.vue";
import RoleSelect from "@/Components/RoleSelect.vue";
import TextInput from "@/Components/TextInput.vue";
import { useForm } from "@inertiajs/vue3";
import { computed, ref } from "vue";

defineProps({
    roles: Array,
});

const emit = defineEmits(["saved"]);

const showModal = ref(false);

const form = useForm({
    id: null, // ✅ Tambahkan id
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
});

// Computed property untuk menentukan apakah sedang editing
const isEditing = computed(() => form.id !== null);

function open(user = null) {
    showModal.value = true;
    if (user) {
        form.id = user.id;
        form.name = user.name;
        form.email = user.email;
        form.password = "";
        form.password_confirmation = "";
        form.role = user.role;
    } else {
        form.reset();
    }
}

function close() {
    showModal.value = false;
    form.clearErrors();
}

function submit() {
    if (isEditing.value) {
        form.put(route("users.update", form.id), {
            onSuccess: () => {
                emit("saved");
                close();
            },
        });
    } else {
        form.post(route("users.store"), {
            onSuccess: () => {
                emit("saved");
                close();
            },
        });
    }
}

defineExpose({ open, close });
// $(document).ready(function () {
//     $('.js-example-basic-single').select2();
// });
</script>

<template>
    <Modal :show="showModal" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header bg-light border-bottom">
                <h5 class="modal-title fw-semibold">
                    <i class="fas fa-user me-2 text-primary"></i>
                    {{ isEditing ? "Edit User" : "Tambah User" }}
                </h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>

            <div class="modal-body">
                <div class="row">
                    <!-- Nama -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="name" value="Nama Lengkap" />
                        <TextInput
                            id="name"
                            v-model="form.name"
                            type="text"
                            class="form-control"
                            required
                            autofocus
                        />
                        <InputError
                            :message="form.errors.name"
                            class="text-danger mt-1"
                        />
                    </div>

                    <!-- Email -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="email" value="Email" />
                        <TextInput
                            id="email"
                            v-model="form.email"
                            type="email"
                            class="form-control"
                            required
                        />
                        <InputError
                            :message="form.errors.email"
                            class="text-danger mt-1"
                        />
                    </div>

                    <!-- Role -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="role" value="Role" />
                        <RoleSelect
                            v-model="form.role"
                            :roles="['admin',  'petugas']"
                            placeholder="Pilih role"
                        />

                        <InputError
                            :message="form.errors.role_id"
                            class="text-danger mt-1"
                        />
                    </div>

                    <!-- Password -->
                    <div class="col-md-6 mb-3">
                        <InputLabel
                            for="password"
                            :value="
                                isEditing ? 'Password (opsional)' : 'Password'
                            "
                        />
                        <TextInput
                            id="password"
                            v-model="form.password"
                            type="password"
                            class="form-control"
                            :required="!isEditing"
                        />
                        <InputError
                            :message="form.errors.password"
                            class="text-danger mt-1"
                        />
                    </div>

                    <!-- Konfirmasi Password -->
                    <div class="col-md-6 mb-3">
                        <InputLabel
                            for="password_confirmation"
                            value="Konfirmasi Password"
                        />
                        <TextInput
                            id="password_confirmation"
                            v-model="form.password_confirmation"
                            type="password"
                            class="form-control"
                            :required="!isEditing"
                        />
                        <InputError
                            :message="form.errors.password_confirmation"
                            class="text-danger mt-1"
                        />
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary me-2"
                    @click="close"
                >
                    Batal
                </button>
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
                        {{ isEditing ? "Update" : "Simpan" }}
                    </span>
                </PrimaryButton>
            </div>
        </form>
    </Modal>
</template>
