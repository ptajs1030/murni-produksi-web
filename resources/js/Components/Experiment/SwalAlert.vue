<template>
    <button @click="showAlert">Show Alert</button>
    <button @click="showAlertDelete">Show Alert Delete</button>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const showAlert = () => {
    proxy.$swal.fire('SweetAlert2 is working!');
};
const showAlertDelete = () => {
    proxy.$confirmDelete('/sdf', null);
};
</script>
