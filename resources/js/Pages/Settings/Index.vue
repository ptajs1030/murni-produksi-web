<script setup>
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head, useForm } from "@inertiajs/vue3";
import { ref, computed } from "vue";

const props = defineProps(["settings"]);

const form = useForm({
    app_name: props.settings.app_name || "",
    app_logo: null,
});

const previewUrl = ref(props.settings.app_logo || null);

const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.app_logo = file;
        previewUrl.value = URL.createObjectURL(file);
    }
};

const removeLogo = () => {
    form.app_logo = null;
    previewUrl.value = null;
};

const submitForm = () => {
    form.post(route("settings.update"), {
        forceFormData: true,
        preserveScroll: true,
    });
};
</script>

<template>
    <Head title="Settings" />

    <AuthenticatedLayout title="Pengaturan Aplikasi">
        <div class="row">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">
                            <i class="fas fa-cog me-2"></i>
                            Pengaturan Aplikasi
                        </h5>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="submitForm">
                            <!-- App Name -->
                            <div class="mb-4">
                                <label
                                    for="app_name"
                                    class="form-label fw-medium"
                                >
                                    Nama Aplikasi
                                </label>
                                <input
                                    id="app_name"
                                    type="text"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': form.errors.app_name,
                                    }"
                                    v-model="form.app_name"
                                    placeholder="Masukkan nama aplikasi"
                                />
                                <div
                                    v-if="form.errors.app_name"
                                    class="invalid-feedback"
                                >
                                    {{ form.errors.app_name }}
                                </div>
                            </div>

                            <!-- Logo Upload -->
                            <div class="mb-4">
                                <label class="form-label fw-medium">
                                    Logo Aplikasi
                                </label>

                                <!-- Preview -->
                                <div v-if="previewUrl" class="mb-3">
                                    <div
                                        class="border rounded p-3 d-inline-block bg-light"
                                    >
                                        <img
                                            :src="previewUrl"
                                            alt="Logo Preview"
                                            class="img-fluid"
                                            style="
                                                max-height: 120px;
                                                max-width: 300px;
                                            "
                                        />
                                    </div>
                                    <div class="mt-2">
                                        <button
                                            type="button"
                                            class="btn btn-outline-danger btn-sm"
                                            @click="removeLogo"
                                        >
                                            <i class="fas fa-trash me-1"></i>
                                            Hapus Logo
                                        </button>
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': form.errors.app_logo,
                                    }"
                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                                    @change="handleLogoChange"
                                />
                                <div class="form-text">
                                    Format: JPEG, PNG, GIF, SVG, WebP. Maksimal
                                    2MB.
                                </div>
                                <div
                                    v-if="form.errors.app_logo"
                                    class="invalid-feedback"
                                >
                                    {{ form.errors.app_logo }}
                                </div>
                            </div>

                            <!-- Submit -->
                            <div class="d-flex align-items-center gap-3">
                                <button
                                    type="submit"
                                    class="btn btn-primary"
                                    :disabled="form.processing"
                                >
                                    <span
                                        v-if="form.processing"
                                        class="spinner-border spinner-border-sm me-1"
                                    ></span>
                                    <i v-else class="fas fa-save me-1"></i>
                                    Simpan Pengaturan
                                </button>

                                <span
                                    v-if="form.recentlySuccessful"
                                    class="text-success small"
                                >
                                    <i class="fas fa-check me-1"></i>
                                    Tersimpan.
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Info Panel -->
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">
                            <i class="fas fa-info-circle me-2"></i>
                            Informasi
                        </h6>
                    </div>
                    <div class="card-body">
                        <p class="text-muted small mb-2">
                            <strong>Nama Aplikasi:</strong> Ditampilkan di
                            sidebar dan judul halaman.
                        </p>
                        <p class="text-muted small mb-0">
                            <strong>Logo:</strong> Ditampilkan di bagian atas
                            sidebar. Gunakan gambar dengan rasio yang sesuai
                            untuk hasil terbaik.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
