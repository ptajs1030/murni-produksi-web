<script setup>
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import IngredientModal from "./IngredientModal.vue";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { ref } from "vue";

const props = defineProps({
    recipe: Object,
    products: Array,
    ingredients: Array,
});

const form = useForm({
    product_id: props.recipe.product_id,
    ingredients: [...props.recipe.ingredients],
});

const showIngredientModal = ref(false);
const isEditIngredient = ref(false);
const editIndex = ref(null);
const editingIngredient = ref(null);

const openAddModal = () => {
    isEditIngredient.value = false;
    editIndex.value = null;
    editingIngredient.value = null;
    showIngredientModal.value = true;
};

const openEditModal = (ingredient, index) => {
    isEditIngredient.value = true;
    editIndex.value = index;
    editingIngredient.value = { ...ingredient };
    showIngredientModal.value = true;
};

const saveIngredient = ({ product_id, quantity }) => {
    const product = props.ingredients.find((p) => p.id === product_id);
    if (!product) return;

    if (isEditIngredient.value) {
        form.ingredients[editIndex.value] = {
            product_id: product.id,
            product_name: product.product_name,
            quantity,
        };
    } else {
        const exists = form.ingredients.some(
            (i) => i.product_id === product.id,
        );
        if (exists) {
            alert("Bahan sudah ada");
            return;
        }
        form.ingredients.push({
            product_id: product.id,
            product_name: product.product_name,
            quantity,
        });
    }
    showIngredientModal.value = false;
};

const removeIngredient = (index) => {
    form.ingredients.splice(index, 1);
};

const submit = () => {
    form.put(route("recipes.update", props.recipe.id));
};
</script>

<template>
    <Head title="Edit Resep" />

    <AuthenticatedLayout title="Edit Resep">
        <template #header>
            <div
                class="d-flex flex-wrap align-items-center justify-content-between gap-2"
            >
                <h2 class="mb-0 h5 text-dark fw-bold">Edit Resep</h2>
                <Link
                    :href="route('recipes.index')"
                    class="btn btn-sm btn-outline-secondary"
                >
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
                                v-for="p in products"
                                :key="p.id"
                                :value="p.id"
                            >
                                {{ p.product_name }}
                            </option>
                        </select>
                        <InputError
                            class="mt-1"
                            :message="form.errors.product_id"
                        />
                    </div>

                    <!-- Bahan-bahan -->
                    <div class="mb-4">
                        <InputLabel value="Bahan-bahan" />
                        <div
                            class="d-flex flex-wrap gap-2 align-items-center mb-2"
                        >
                            <button
                                type="button"
                                class="btn btn-outline-primary btn-sm"
                                @click="openAddModal"
                            >
                                <i class="fas fa-plus me-1"></i>
                                Tambah Bahan
                            </button>
                        </div>

                        <ul
                            v-if="form.ingredients.length"
                            class="list-group list-group-flush rounded"
                        >
                            <li
                                v-for="(ingredient, index) in form.ingredients"
                                :key="`${ingredient.product_id}-${index}`"
                                class="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>{{
                                        ingredient.product_name
                                    }}</strong>
                                    <div class="text-muted small">
                                        Qty: {{ ingredient.quantity }}
                                    </div>
                                </div>
                                <div class="btn-group btn-group-sm">
                                    <button
                                        type="button"
                                        class="btn btn-outline-warning"
                                        title="Edit"
                                        @click="
                                            openEditModal(ingredient, index)
                                        "
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-outline-danger"
                                        title="Hapus"
                                        @click="removeIngredient(index)"
                                    >
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </li>
                        </ul>

                        <div v-else class="text-muted fst-italic py-3">
                            Belum ada bahan.
                        </div>

                        <InputError
                            class="mt-1"
                            :message="form.errors.ingredients"
                        />
                    </div>

                    <hr class="my-4" />

                    <div class="d-flex flex-wrap gap-2">
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
                                Update Resep
                            </span>
                        </PrimaryButton>
                        <Link
                            :href="route('recipes.index')"
                            class="btn btn-outline-secondary"
                        >
                            <i class="fas fa-times me-1"></i>
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>

        <IngredientModal
            :show="showIngredientModal"
            :products="ingredients"
            :initial-product-id="editingIngredient?.product_id ?? ''"
            :initial-quantity="editingIngredient?.quantity ?? ''"
            :is-edit="isEditIngredient"
            @close="showIngredientModal = false"
            @submit="saveIngredient"
        />
    </AuthenticatedLayout>
</template>
