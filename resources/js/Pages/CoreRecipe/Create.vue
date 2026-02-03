<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import IngredientModal from './IngredientModal.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    products: Array,
});

const form = useForm({
    product_id: '',
    ingredients: [],
});

const showIngredientModal = ref(false);

const addIngredient = ({ product_id, quantity }) => {
    const product = props.products.find(p => p.id === product_id);
    if (!product) return;

    const exists = form.ingredients.some(i => i.product_id === product.id);
    if (exists) {
        alert('Bahan sudah ditambahkan');
        return;
    }

    form.ingredients.push({
        product_id: product.id,
        product_name: product.product_name,
        quantity,
    });
    showIngredientModal.value = false;
};

const removeIngredient = index => {
    form.ingredients.splice(index, 1);
};

const submit = () => {
    form.post(route('recipes.store'));
};
</script>

<template>
    <Head title="Tambah Resep" />

    <AuthenticatedLayout title="Tambah Resep">
        <template #header>
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                <h2 class="mb-0 h5 text-dark fw-bold">Tambah Resep</h2>
                <Link :href="route('recipes.index')" class="btn btn-sm btn-outline-secondary">
                    <i class="fas fa-arrow-left me-1"></i>
                    Kembali
                </Link>
            </div>
        </template>

        <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
                <form @submit.prevent="submit">
                    <!-- Produk Hasil Resep -->
                    <div class="mb-4">
                        <InputLabel for="product_id" value="Produk Hasil" />
                        <select
                            id="product_id"
                            v-model="form.product_id"
                            class="form-select"
                        >
                            <option value="">-- Pilih Produk --</option>
                            <option
                                v-for="product in products"
                                :key="product.id"
                                :value="product.id"
                            >
                                {{ product.product_name }}
                            </option>
                        </select>
                        <InputError class="mt-1" :message="form.errors.product_id" />
                    </div>

                    <!-- Bahan-bahan -->
                    <div class="mb-4">
                        <InputLabel value="Bahan-bahan" />
                        <div class="d-flex flex-wrap gap-2 align-items-center mb-2">
                            <button
                                type="button"
                                class="btn btn-outline-primary btn-sm"
                                @click="showIngredientModal = true"
                            >
                                <i class="fas fa-plus me-1"></i>
                                Tambah Bahan
                            </button>
                        </div>

                        <ul v-if="form.ingredients.length" class="list-group list-group-flush rounded">
                            <li
                                v-for="(ingredient, index) in form.ingredients"
                                :key="ingredient.product_id"
                                class="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>{{ ingredient.product_name }}</strong>
                                    <div class="text-muted small">
                                        Qty: {{ ingredient.quantity }}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-danger"
                                    @click="removeIngredient(index)"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </li>
                        </ul>

                        <div v-else class="text-muted fst-italic py-3">
                            Belum ada bahan ditambahkan.
                        </div>

                        <InputError class="mt-1" :message="form.errors.ingredients" />
                    </div>

                    <hr class="my-4" />

                    <div class="d-flex flex-wrap gap-2">
                        <PrimaryButton :disabled="form.processing" class="btn btn-primary">
                            <span v-if="form.processing">
                                <i class="fas fa-spinner fa-spin me-1"></i>
                                Menyimpan...
                            </span>
                            <span v-else>
                                <i class="fas fa-save me-1"></i>
                                Simpan Resep
                            </span>
                        </PrimaryButton>
                        <Link :href="route('recipes.index')" class="btn btn-outline-secondary">
                            <i class="fas fa-times me-1"></i>
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>

        <IngredientModal
            :show="showIngredientModal"
            :products="products"
            @close="showIngredientModal = false"
            @submit="addIngredient"
        />
    </AuthenticatedLayout>
</template>
