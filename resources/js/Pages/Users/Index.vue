<script setup>
import Pagination from "@/Components/Pagination.vue";
import TextInput from "@/Components/TextInput.vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import UserFormModal from "@/Pages/Users/UserFormModal.vue";
import { Head, router } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { ref, watch } from "vue";

const props = defineProps(["users", "filters"]);

const modalRef = ref(null);
const search = ref(props.filters.search || "");
watch(
    search,
    debounce((value) => {
        const params = {};
        if (value) params.search = value;

        // Preserve existing sort
        const urlParams = new URLSearchParams(window.location.search);
        const existingSort = urlParams.get("sort");
        if (existingSort) params.sort = existingSort;

        router.get("/users", params, {
            preserveState: true,
            replace: true,
        });
    }, 300),
);

const refreshPage = () => {
    // location.reload(); // atau bisa pakai router.reload()
    console.log("Page refreshed");
};

const openAddUser = () => {
    modalRef.value.open(); // Tambah
};

const openEditUser = (user) => {
    modalRef.value.open(user); // Edit
};

import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const deleteUser = (id) => {
    proxy.$confirmDelete("/users", id);
};
</script>

<template>
    <Head title="User" />
    <AuthenticatedLayout title="Daftar User">
        <UserFormModal ref="modalRef" :roles="roles" @saved="refreshPage" />
        <div class="d-flex justify-content-between mb-3">
            <TextInput
                v-model="search"
                type="text"
                class="form-control w-25"
                placeholder="Search..."
            />
            <button class="btn btn-primary btn-md" @click="openAddUser">
                <i class="fas fa-plus me-1"></i>
                Tambah User
            </button>
        </div>

        <!-- Tabel User -->
        <div class="table-responsive p-0">
            <table class="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users.data" :key="user.id">
                        <td class="w-2">{{ users.from + index }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td class="align-middle text-sm">
                            <span class="badge bg-gradient-primary">
                                {{ user.role }}
                            </span>
                        </td>
                        <td class="align-middle">
                            <div class="btn-group" role="group">
                                <button
                                    @click="openEditUser(user)"
                                    class="btn btn-outline-warning btn-md"
                                    title="Edit User"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button
                                    @click="deleteUser(user.id)"
                                    class="btn btn-outline-danger btn-md"
                                    title="Hapus User"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Pagination :links="users.links" />

        <!-- Modal Komponen -->
    </AuthenticatedLayout>
</template>
