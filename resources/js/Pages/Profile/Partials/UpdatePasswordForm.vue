<script setup>
import InputError from "@/Components/InputError.vue";
import { useForm } from "@inertiajs/vue3";
import { ref } from "vue";

const passwordInput = ref(null);
const currentPasswordInput = ref(null);

const form = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
});

const updatePassword = () => {
    form.put(route("password.update"), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => {
            if (form.errors.password) {
                form.reset("password", "password_confirmation");
                passwordInput.value.focus();
            }
            if (form.errors.current_password) {
                form.reset("current_password");
                currentPasswordInput.value.focus();
            }
        },
    });
};
</script>

<template>
    <section>
        <header class="mb-4">
            <h5 class="fw-semibold">Update Password</h5>
            <p class="text-muted small mb-0">
                Ensure your account is using a long, random password to stay
                secure.
            </p>
        </header>

        <form @submit.prevent="updatePassword">
            <div class="mb-3">
                <label for="current_password" class="form-label"
                    >Current Password</label
                >
                <input
                    id="current_password"
                    ref="currentPasswordInput"
                    v-model="form.current_password"
                    type="password"
                    class="form-control"
                    autocomplete="current-password"
                />
                <InputError
                    :message="form.errors.current_password"
                    class="mt-1"
                />
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">New Password</label>
                <input
                    id="password"
                    ref="passwordInput"
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    autocomplete="new-password"
                />
                <InputError :message="form.errors.password" class="mt-1" />
            </div>

            <div class="mb-3">
                <label for="password_confirmation" class="form-label"
                    >Confirm Password</label
                >
                <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    class="form-control"
                    autocomplete="new-password"
                />
                <InputError
                    :message="form.errors.password_confirmation"
                    class="mt-1"
                />
            </div>

            <div class="d-flex align-items-center gap-3">
                <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="form.processing"
                >
                    Save
                </button>

                <Transition
                    enter-active-class="transition ease-in-out"
                    enter-from-class="opacity-0"
                    leave-active-class="transition ease-in-out"
                    leave-to-class="opacity-0"
                >
                    <span
                        v-if="form.recentlySuccessful"
                        class="text-success small"
                    >
                        Saved.
                    </span>
                </Transition>
            </div>
        </form>
    </section>
</template>
