<script setup>
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import Modal from "@/Components/Modal.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import { formatNumberWithCommas } from "@/utils/numberFormatter";
import { useForm } from "@inertiajs/vue3";
import axios from "axios";
import { computed, getCurrentInstance, ref, watch } from "vue";

const props = defineProps({
    recipes: { type: Array, default: () => [] },
});

const emit = defineEmits(["saved"]);
const { proxy } = getCurrentInstance();

const show = ref(false);
const selectedRecipe = ref(null);
const ingredientsPreview = ref([]);
const isChecked = ref(false);
const isLoading = ref(false);

const form = useForm({
    recipe_id: "",
    quantity: "",
});

watch(
    () => [form.recipe_id, form.quantity],
    () => {
        isChecked.value = false;
        ingredientsPreview.value = [];
    },
);

const getSelectedRecipe = computed(() => {
    if (!form.recipe_id) return null;
    return props.recipes.find((r) => r.id === parseInt(form.recipe_id));
});

const open = () => {
    form.reset();
    selectedRecipe.value = null;
    ingredientsPreview.value = [];
    isChecked.value = false;
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
    selectedRecipe.value = null;
    ingredientsPreview.value = [];
    isChecked.value = false;
};

// Check ingredients
const checkIngredients = async () => {
    if (!form.recipe_id || !form.quantity || form.quantity <= 0) {
        proxy.$swal.fire({
            title: "Error!",
            text: "Pilih resep dan masukkan jumlah yang valid",
            icon: "error",
            confirmButtonText: "OK",
        });
        return;
    }

    isLoading.value = true;

    try {
        const response = await axios.get("/production/ingredients", {
            params: { id: form.recipe_id },
        });

        const recipe = response.data;
        if (recipe && recipe.ingredients) {
            const quantity = parseFloat(form.quantity) || 0;
            ingredientsPreview.value = recipe.ingredients.map((ing) => ({
                product_name: ing.product?.product_name || "Unknown",
                quantity_per_unit: ing.quantity,
                quantity_needed: ing.quantity * quantity,
                product_id: ing.product_id,
                unit: ing.product?.packaging_size?.packaging_size_code || "Pcs",
            }));
            isChecked.value = true;
        }
    } catch (error) {
        proxy.$swal.fire({
            title: "Error!",
            text: "Gagal mengambil data ingredients",
            icon: "error",
            confirmButtonText: "OK",
        });
    } finally {
        isLoading.value = false;
    }
};

// Submit production
const submit = () => {
    if (!isChecked.value) {
        proxy.$swal.fire({
            title: "Error!",
            text: "Silakan cek ingredients terlebih dahulu",
            icon: "error",
            confirmButtonText: "OK",
        });
        return;
    }

    const recipeName =
        getSelectedRecipe.value?.product?.product_name || "Produk";

    proxy.$swal
        .fire({
            title: "Konfirmasi Produksi",
            html: `
                <p>Apakah Anda yakin ingin melakukan produksi?</p>
                <p><strong>Produk:</strong> ${recipeName}</p>
                <p><strong>Jumlah:</strong> ${formatNumberWithCommas(form.quantity)}</p>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Produksi",
            cancelButtonText: "Batal",
        })
        .then((result) => {
            if (result.isConfirmed) {
                form.post("/production", {
                    onSuccess: () => {
                        proxy.$swal.fire({
                            title: "Berhasil!",
                            text: "Produksi berhasil dilakukan",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        close();
                        emit("saved");
                    },
                    onError: (errors) => {
                        let errorMessage = "Gagal melakukan produksi";
                        if (errors.error) {
                            errorMessage = errors.error;
                        }
                        proxy.$swal.fire({
                            title: "Error!",
                            text: errorMessage,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    },
                    preserveScroll: true,
                });
            }
        });
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="xl">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">Menu Produksi</h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body" style="max-height: 70vh; overflow-y: auto">
                <div class="row">
                    <!-- Left Column: Input Form -->
                    <div class="col-md-5">
                        <div class="card mb-3">
                            <div class="card-header bg-primary text-white">
                                <strong>Pilih Produk Master</strong>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <InputLabel
                                        for="recipe-select"
                                        value="Resep"
                                    />
                                    <select
                                        id="recipe-select"
                                        v-model="form.recipe_id"
                                        class="form-select"
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Resep --
                                        </option>
                                        <option
                                            v-for="recipe in recipes"
                                            :key="recipe.id"
                                            :value="recipe.id"
                                        >
                                            {{
                                                recipe.product?.product_name ||
                                                `Resep #${recipe.id}`
                                            }}
                                        </option>
                                    </select>
                                    <InputError
                                        :message="form.errors.recipe_id"
                                        class="text-danger mt-1"
                                    />
                                </div>

                                <div class="mb-3">
                                    <InputLabel for="quantity" value="Jumlah" />
                                    <TextInput
                                        id="quantity"
                                        v-model="form.quantity"
                                        type="number"
                                        class="form-control"
                                        min="1"
                                        step="1"
                                        placeholder="Masukkan jumlah"
                                        required
                                    />
                                    <InputError
                                        :message="form.errors.quantity"
                                        class="text-danger mt-1"
                                    />
                                </div>

                                <div class="d-grid gap-2">
                                    <button
                                        type="button"
                                        class="btn btn-warning"
                                        @click="checkIngredients"
                                        :disabled="
                                            isLoading ||
                                            !form.recipe_id ||
                                            !form.quantity
                                        "
                                    >
                                        <span v-if="isLoading">
                                            <i
                                                class="fas fa-spinner fa-spin me-1"
                                            ></i>
                                            Memuat...
                                        </span>
                                        <span v-else>
                                            <i class="fas fa-search me-1"></i>
                                            Cek
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Ingredients Preview -->
                    <div class="col-md-7">
                        <div class="card h-100">
                            <div class="card-header bg-success text-white">
                                <strong>Resep/Racikan</strong>
                                <small class="d-block">
                                    Preview produk yang terpakai (otomatis
                                    terisi ketika pencet tombol cek)
                                </small>
                            </div>
                            <div class="card-body">
                                <div
                                    v-if="ingredientsPreview.length === 0"
                                    class="text-center text-muted py-4"
                                >
                                    <i
                                        class="fas fa-info-circle fa-2x mb-2"
                                    ></i>
                                    <p>
                                        Pilih resep dan jumlah, lalu klik "Cek"
                                        untuk melihat ingredients yang
                                        diperlukan.
                                    </p>
                                </div>

                                <div v-else>
                                    <div
                                        v-for="(
                                            ingredient, index
                                        ) in ingredientsPreview"
                                        :key="index"
                                        class="row mb-3 align-items-center"
                                    >
                                        <div class="col-md-6">
                                            <InputLabel value="Produk" />
                                            <div class="form-control bg-light">
                                                {{ ingredient.product_name }}
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <InputLabel value="Jumlah" />
                                            <div class="form-control bg-light">
                                                {{
                                                    formatNumberWithCommas(
                                                        ingredient.quantity_needed,
                                                    )
                                                }}
                                                {{ ingredient.unit }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="isChecked"
                    class="alert alert-info mt-3"
                    role="alert"
                >
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Info:</strong> Produksi ini akan menambah stok
                    produk master dan akan mengurangi stok dari produk resepnya.
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
                    :disabled="form.processing || !isChecked"
                    class="btn btn-success"
                >
                    <span v-if="form.processing">
                        <i class="fas fa-spinner fa-spin me-1"></i>
                        Memproses...
                    </span>
                    <span v-else>
                        <i class="fas fa-check me-1"></i>
                        Submit
                    </span>
                </PrimaryButton>
            </div>
        </form>
    </Modal>
</template>

<style scoped>
.card-header {
    padding: 0.75rem 1rem;
}

.card-body {
    padding: 1rem;
}

.bg-light {
    background-color: #f8f9fa !important;
}

.form-control:read-only {
    cursor: default;
}
</style>
