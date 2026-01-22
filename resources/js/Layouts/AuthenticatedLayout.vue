<script setup>
import Navbar from '@/Components/Layout/Navbar.vue';
import Sidebar from '@/Components/Layout/Sidebar.vue';
import ToastNotifications from '@/Components/ToastNotifications.vue';
import { useAppSettings } from '@/Composables/useAppSettings.js';
import { Link } from '@inertiajs/vue3';

defineProps({
    title: {
        type: String,
    },
});

// Use app settings composable
const { appName, appLogo } = useAppSettings();
</script>

<template>
    <aside
        class="sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl fixed-start my-3 ms-3 border-0"
        id="sidenav-main"
    >
        <div class="sidenav-header">
            <i
                class="fas fa-times text-secondary position-absolute d-xl-none end-0 top-0 me-3 cursor-pointer p-3 opacity-5"
                aria-hidden="true"
                id="iconSidenav"
            ></i>
            <Link class="navbar-brand m-0" :href="route('dashboard.index')">
                <img :src="appLogo" class="navbar-brand-img h-100" alt="main_logo" />
                <br />
                <span class="font-weight-bold d-block ms-1 text-center">{{ appName }}</span>
            </Link>
        </div>
        <hr class="horizontal dark mt-0" />
        <Sidebar />
    </aside>
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <Navbar :title="title" />
        <div class="container-fluid bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
            <ToastNotifications />
            <slot />
        </div>
    </main>
</template>
