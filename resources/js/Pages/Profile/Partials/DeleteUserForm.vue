<script setup>
import InputError from "@/Components/InputError.vue";
import { useForm } from "@inertiajs/vue3";
import { ref } from "vue";

const confirmingUserDeletion = ref(false);
const passwordInput = ref(null);

const form = useForm({
    password: "",
});

const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;
};

const deleteUser = () => {
    form.delete(route("profile.destroy"), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    confirmingUserDeletion.value = false;
    form.clearErrors();
    form.reset();
};
</script>

<template>
    <section>
        <header class="mb-4">
            <h5 class="fw-semibold">Delete Account</h5>
            <p class="text-muted small mb-0">
                Once your account is deleted, all of its resources and data will
                be permanently deleted. Before deleting your account, please
                download any data or information that you wish to retain.
            </p>
        </header>

        <button class="btn btn-danger" @click="confirmUserDeletion">
            Delete Account
        </button>

        <!-- Delete Confirmation Modal -->
        <div
            v-if="confirmingUserDeletion"
            class="modal-backdrop fade show"
            @click="closeModal"
        ></div>
        <div
            v-if="confirmingUserDeletion"
            class="modal fade show d-block"
            tabindex="-1"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i
                                class="fas fa-exclamation-triangle me-2 text-danger"
                            ></i>
                            Delete Account
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="closeModal"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <p>
                            Are you sure you want to delete your account? Once
                            your account is deleted, all of its resources and
                            data will be permanently deleted.
                        </p>

                        <div class="mb-3">
                            <label for="delete_password" class="form-label"
                                >Password</label
                            >
                            <input
                                id="delete_password"
                                ref="passwordInput"
                                v-model="form.password"
                                type="password"
                                class="form-control"
                                placeholder="Enter your password to confirm"
                                @keyup.enter="deleteUser"
                            />
                            <InputError
                                :message="form.errors.password"
                                class="mt-1"
                            />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="closeModal"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-danger"
                            :disabled="form.processing"
                            @click="deleteUser"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.modal {
    z-index: 9999;
}
</style>
