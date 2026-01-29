<script setup>
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import Modal from "@/Components/Modal.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import { useForm } from "@inertiajs/vue3";
import { ref, watch } from "vue";

const props = defineProps({
    products: { type: Array, default: () => [] },
    outTypes: { type: Array, default: () => [] },
});

const emit = defineEmits(["saved"]);

const show = ref(false);
const form = useForm({
    product_id: "",
    out_type_id: "",
    quantity: "",
});

watch(
    () => show.value,
    (visible) => {
        if (visible) form.reset();
    },
);

const open = () => {
    form.reset();
    show.value = true;
};

const close = () => {
    show.value = false;
    form.reset();
};

const submit = () => {
    form.post(route("outgoing-goods.store"), {
        onSuccess: () => {
            close();
            emit("saved");
        },
        preserveScroll: true,
    });
};

defineExpose({ open, close });
</script>

<template>
    <Modal :show="show" @close="close" maxWidth="lg">
        <form @submit.prevent="submit">
            <div class="modal-header">
                <h5 class="modal-title">Tambah Barang Keluar</h5>
                <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- Nama Produk -->
                    <div class="col-12 mb-3">
                        <InputLabel
                            for="outgoing-product"
                            value="Nama Produk"
                        />
                        <select
                            id="outgoing-product"
                            v-model="form.product_id"
                            class="form-select"
                            required
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
                            :message="form.errors.product_id"
                            class="text-danger mt-1"
                        />
                    </div>
                </div>
                <div class="row">
                    <!-- Tipe Keluar -->
                    <div class="col-md-6 mb-3">
                        <InputLabel
                            for="outgoing-out-type"
                            value="Tipe Keluar"
                        />
                        <select
                            id="outgoing-out-type"
                            v-model="form.out_type_id"
                            class="form-select"
                            required
                        >
                            <option value="">-- Pilih Tipe --</option>
                            <option
                                v-for="t in outTypes"
                                :key="t.id"
                                :value="t.id"
                            >
                                {{ t.out_type_name }}
                            </option>
                        </select>
                        <InputError
                            :message="form.errors.out_type_id"
                            class="text-danger mt-1"
                        />
                    </div>
                    <!-- Quantity -->
                    <div class="col-md-6 mb-3">
                        <InputLabel for="outgoing-quantity" value="Quantity" />
                        <TextInput
                            id="outgoing-quantity"
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
                        Simpan
                    </span>
                </PrimaryButton>
            </div>
        </form>
    </Modal>
</template>
