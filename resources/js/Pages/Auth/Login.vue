<script setup>
import Checkbox from '@/Components/Checkbox.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

defineProps({
    canResetPassword: Boolean,
    status: String,
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const showPassword = ref(false);
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};

// Get app settings from page props
const page = usePage();
const appLogo = computed(() => page.props.appSettings?.logo || '/resources/img/logo.png');
const appName = computed(() => page.props.appSettings?.name || 'Laravel');
const appLoginImage = computed(() => page.props.appSettings?.img_login || '/resources/img/lingkaran.png');
</script>

<template>
    <GuestLayout>
        <Head title="Log in" />

        <div class="row g-0 min-vh-100">
            <!-- Left Column - Image/Logo Section -->
            <div class="col-6 d-flex align-items-center justify-content-center bg-light">
                <div class="text-center">
                    <img
                        :src="appLoginImage"
                        alt="Login Background Image"
                        class="img-fluid mb-4"
                        style="max-width: 300px; max-height: 300px; object-fit: contain"
                    />
                    <h3 class="text-muted">{{ appName }}</h3>
                    <p class="text-muted">Warehouse Management System</p>
                </div>
            </div>

            <!-- Right Column - Login Form Section -->
            <div class="col-6 d-flex align-items-center justify-content-center">
                <div class="w-100" style="max-width: 600px; padding: 2rem">
                    <div class="mb-4 text-center">
                        <img
                            :src="appLogo"
                            :alt="appName + ' Logo'"
                            class="img-fluid mb-3"
                            style="max-width: 120px; max-height: 120px; object-fit: contain"
                        />
                        <h4 class="mb-1">Selamat Datang!</h4>
                        <p class="text-muted">Sign in to your account</p>
                    </div>

                    <div v-if="status" class="alert alert-success small mb-4">
                        {{ status }}
                    </div>

                    <form @submit.prevent="submit" class="needs-validation">
                        <div class="mb-3">
                            <InputLabel for="email" value="Email or Phone Number" />
                            <TextInput
                                id="email"
                                type="text"
                                class="form-control"
                                v-model="form.email"
                                required
                                autofocus
                                autocomplete="username"
                            />
                            <InputError class="invalid-feedback d-block" :message="form.errors.email" />
                        </div>

                        <!-- Password input -->
                        <div class="mb-3">
                            <InputLabel for="password" value="Password" />
                            <div class="position-relative">
                                <input
                                    id="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    class="form-control pe-5"
                                    v-model="form.password"
                                    required
                                    autocomplete="current-password"
                                />
                                <!-- Ikon mata Font Awesome -->
                                <span
                                    class="position-absolute top-50 translate-middle-y end-0 me-3"
                                    style="cursor: pointer"
                                    @click="togglePasswordVisibility"
                                >
                                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                </span>
                            </div>
                            <InputError class="invalid-feedback d-block" :message="form.errors.password" />
                        </div>

                        <div class="d-flex justify-content-start align-items-top mb-3">
                            <Checkbox name="remember" v-model:checked="form.remember" id="remember" />
                            <label class="form-check-label small" for="remember">Remember me</label>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <Link
                                v-if="canResetPassword"
                                :href="route('password.request')"
                                class="text-decoration-none small"
                            >
                                Forgot your password?
                            </Link>

                            <PrimaryButton
                                class="btn btn-primary ms-2"
                                :class="{ disabled: form.processing }"
                                :disabled="form.processing"
                            >
                                Log in
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>
