<script setup>
import { Link } from '@inertiajs/vue3';
import { onMounted } from 'vue';

defineProps({
    title: {
        type: String,
    },
});

onMounted(() => {
    // Clean up any residual backdrop on page load
    const cleanupSidebar = () => {
        const sidebar = document.getElementById('sidenav-main');
        const body = document.body;

        if (sidebar) {
            sidebar.classList.remove('show-mobile');
        }
        if (body) {
            body.classList.remove('sidebar-open');
        }
    };

    // Clean up immediately
    cleanupSidebar();

    // Wait for DOM to be fully loaded
    setTimeout(() => {
        // Toggle sidebar functionality
        const toggleSidenav = e => {
            e.preventDefault();
            const sidebar = document.getElementById('sidenav-main');
            const body = document.body;

            if (sidebar) {
                if (sidebar.classList.contains('show-mobile')) {
                    sidebar.classList.remove('show-mobile');
                    body.classList.remove('sidebar-open');
                } else {
                    sidebar.classList.add('show-mobile');
                    body.classList.add('sidebar-open');
                }
            }
        };

        // Add event listener to hamburger menu
        const hamburgerToggle = document.getElementById('iconNavbarSidenav');
        if (hamburgerToggle) {
            hamburgerToggle.addEventListener('click', toggleSidenav);
        }

        // Add event listener to close icon
        const closeSidenav = document.getElementById('iconSidenav');
        if (closeSidenav) {
            closeSidenav.addEventListener('click', toggleSidenav);
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', e => {
            const sidebar = document.getElementById('sidenav-main');
            const hamburger = document.getElementById('iconNavbarSidenav');
            const closeIcon = document.getElementById('iconSidenav');

            if (sidebar && sidebar.classList.contains('show-mobile')) {
                if (
                    !sidebar.contains(e.target) &&
                    e.target !== hamburger &&
                    !hamburger.contains(e.target) &&
                    e.target !== closeIcon
                ) {
                    sidebar.classList.remove('show-mobile');
                    document.body.classList.remove('sidebar-open');
                }
            }
        });
    }, 100);
});
</script>

<template>
    <nav
        class="navbar navbar-main navbar-expand-lg border-radius-xl px-0 shadow-none"
        id="navbarBlur"
        navbar-scroll="true"
    >
        <div class="container-fluid px-3 py-1">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb me-sm-6 mb-0 me-5 bg-transparent px-0 pb-0 pt-1">
                    <li class="breadcrumb-item text-sm">
                        <a class="text-dark opacity-5" href="#">Pages</a>
                    </li>
                    <li class="breadcrumb-item text-dark active text-sm" aria-current="page">
                        {{ title }}
                    </li>
                </ol>
            </nav>

            <div class="navbar-collapse mt-sm-0 me-md-0 me-sm-4 collapse mt-2" id="navbar">
                <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                    <div class="input-group">
                        <span class="input-group-text text-body">
                            <i class="fas fa-search" aria-hidden="true"></i>
                        </span>
                        <input type="text" class="form-control" placeholder="Type here..." />
                    </div>
                </div>

                <ul class="navbar-nav justify-content-end">
                    <!-- Toggle sidenav -->
                    <li class="nav-item d-xl-none d-flex align-items-center ps-3">
                        <a href="javascript:;" class="nav-link text-body p-0" id="iconNavbarSidenav">
                            <div class="sidenav-toggler-inner">
                                <i class="sidenav-toggler-line"></i>
                                <i class="sidenav-toggler-line"></i>
                                <i class="sidenav-toggler-line"></i>
                            </div>
                        </a>
                    </li>

                    <!-- User dropdown -->
                    <li class="nav-item dropdown">
                        <a
                            href="#"
                            class="nav-link dropdown-toggle d-flex align-items-center text-body px-3"
                            id="userDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i class="fa fa-user me-2"></i>
                            <span class="d-none d-md-inline">{{ $page.props.auth.user.name }}</span>
                        </a>

                        <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                            <li>
                                <Link :href="route('profile.edit')" class="dropdown-item d-flex align-items-center">
                                    <i class="fa fa-cog text-muted me-2"></i>
                                    Profile Settings
                                </Link>
                            </li>

                            <li><hr class="dropdown-divider" /></li>

                            <li>
                                <Link
                                    :href="route('logout')"
                                    method="post"
                                    as="button"
                                    class="dropdown-item d-flex align-items-center text-danger w-100 border-0 bg-transparent text-start"
                                >
                                    <i class="fa fa-sign-out-alt me-2"></i>
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
