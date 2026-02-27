<script setup>
import InputError from "@/Components/InputError.vue";
import { Link, useForm, usePage } from "@inertiajs/vue3";

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const user = usePage().props.auth.user;

const form = useForm({
    name: user.name,
    email: user.email,
});
</script>

<template>
    <section>
        <header class="mb-4">
            <h5 class="fw-semibold">Profile Information</h5>
            <p class="text-muted small mb-0">
                Update your account's profile information and email address.
            </p>
        </header>

        <form @submit.prevent="form.patch(route('profile.update'))">
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                    id="name"
                    type="text"
                    class="form-control"
                    v-model="form.name"
                    required
                    autofocus
                    autocomplete="name"
                />
                <InputError class="mt-1" :message="form.errors.name" />
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    id="email"
                    type="email"
                    class="form-control"
                    v-model="form.email"
                    required
                    autocomplete="username"
                />
                <InputError class="mt-1" :message="form.errors.email" />
            </div>

            <div
                v-if="mustVerifyEmail && user.email_verified_at === null"
                class="mb-3"
            >
                <p class="text-muted small">
                    Your email address is unverified.
                    <Link
                        :href="route('verification.send')"
                        method="post"
                        as="button"
                        class="btn btn-link btn-sm p-0"
                    >
                        Click here to re-send the verification email.
                    </Link>
                </p>

                <div
                    v-show="status === 'verification-link-sent'"
                    class="text-success small fw-medium"
                >
                    A new verification link has been sent to your email address.
                </div>
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
