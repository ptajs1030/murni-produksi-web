<script setup>
import { Link, usePage } from "@inertiajs/vue3";
import { computed, ref } from "vue";
import { MENUS } from "@/Config/menus";

const page = usePage();

const userRole = computed(() => page.props.auth?.user?.role);

const openDropdowns = ref({});
const showOptimizeConfirm = ref(false);
const isOptimizing = ref(false);
const optimizeStatus = ref(null);

const menus = computed(() => {
    if (!userRole.value) return [];

    return MENUS.filter((menu) => {
        if (!menu.roles) return true;
        return menu.roles.includes(userRole.value);
    })
        .map((menu) => {
            if (!menu.children) return menu;

            return {
                ...menu,
                children: menu.children.filter(
                    (child) =>
                        !child.roles || child.roles.includes(userRole.value),
                ),
            };
        })
        .filter((menu) => !menu.children || menu.children.length > 0);
});

// Get current URL for active state detection
const currentUrl = computed(() => page.url);

const toggleDropdown = (index) => {
    openDropdowns.value[index] = !openDropdowns.value[index];
};

// Check if menu item is active - now accepts route names
const isActive = (routeName) => {
    if (!routeName) return false;

    try {
        const currentPath = currentUrl.value.split("?")[0];
        const targetUrl = route(routeName);

        // Extract path from full URL (remove domain part)
        const targetPath = new URL(targetUrl).pathname;

        // Check for exact match or prefix match for nested routes
        const isMatch =
            currentPath === targetPath ||
            currentPath.startsWith(targetPath + "/");

        // console.log(
        //     `Route: ${routeName}, Current: ${currentPath}, Target: ${targetPath}, Active: ${isMatch}`,
        // );
        return isMatch;
    } catch (error) {
        console.warn(`Route "${routeName}" not found:`, error);
        return false;
    }
};

// Check if parent menu has active child
const hasActiveChild = (children) => {
    return children.some((child) => isActive(child.route));
};

// Auto-open dropdown if it has active child
const shouldOpenDropdown = (index, children) => {
    if (hasActiveChild(children)) {
        openDropdowns.value[index] = true;
        return true;
    }
    return openDropdowns.value[index];
};

// Helper function to safely generate route URL
const getRouteUrl = (routeName) => {
    if (!routeName) return "#";

    try {
        return route(routeName);
    } catch (error) {
        console.warn(`Route "${routeName}" not found:`, error);
        return "#";
    }
};

// Check if user is authenticated (all authenticated users can optimize)
const canOptimize = computed(() => {
    return page.props.auth?.user !== null;
});

// Optimize system functions
const checkOptimizeStatus = async () => {
    try {
        const response = await axios.get(route("system.optimize.status"));
        optimizeStatus.value = response.data;
    } catch (error) {
        console.error("Failed to check optimize status:", error);
    }
};

const confirmOptimize = () => {
    showOptimizeConfirm.value = true;
    checkOptimizeStatus();
};

const cancelOptimize = () => {
    showOptimizeConfirm.value = false;
};

const executeOptimize = async () => {
    if (!canOptimize.value) return;

    isOptimizing.value = true;
    showOptimizeConfirm.value = false;

    try {
        const response = await axios.post(route("system.optimize.execute"), {
            confirm: true,
        });

        const data = response.data;

        if (data.success) {
            page.props.flash.toasts = [
                {
                    type: "success",
                    message: data.message || "System optimized successfully!",
                },
            ];

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            page.props.flash.toasts = [
                {
                    type: "error",
                    message: data.message || "System optimization failed",
                },
            ];
        }
    } catch (error) {
        console.error("Optimize error:", error);

        let errorMessage = "An error occurred during system optimization";

        if (error.response?.status === 419) {
            errorMessage =
                "Session expired. The page will reload automatically.";
            setTimeout(() => window.location.reload(), 1500);
        } else if (error.message?.includes("Network Error")) {
            errorMessage =
                "Network error. Please check your connection and try again.";
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        page.props.flash.toasts = [
            {
                type: "error",
                message: errorMessage,
            },
        ];
    } finally {
        isOptimizing.value = false;
    }
};

// Initialize optimize status on component mount
if (canOptimize.value) {
    checkOptimizeStatus();
}
</script>

<template>
    <ul class="navbar-nav">
        <template v-for="(menu, index) in menus" :key="index">
            <li v-if="menu.type === 'divider'" class="nav-item mt-3">
                <h6
                    class="text-uppercase font-weight-bolder opacity-6 ms-2 ps-4 text-xs"
                >
                    {{ menu.name }}
                </h6>
            </li>

            <!-- Dropdown Menu -->
            <li
                v-else-if="menu.children && menu.children.length > 0"
                class="nav-item"
            >
                <a
                    href="javascript:void(0)"
                    :class="[
                        'nav-link d-flex align-items-center',
                        {
                            'active bg-gradient-primary text-white':
                                hasActiveChild(menu.children),
                            'text-dark': !hasActiveChild(menu.children),
                        },
                    ]"
                    @click="toggleDropdown(index)"
                >
                    <div
                        :class="[
                            'icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow',
                            {
                                'bg-white': !hasActiveChild(menu.children),
                                'bg-gradient-light': hasActiveChild(
                                    menu.children,
                                ),
                            },
                        ]"
                    >
                        <i
                            :class="[
                                menu.icon,
                                {
                                    'text-dark': !hasActiveChild(menu.children),
                                    'text-white': hasActiveChild(menu.children),
                                },
                            ]"
                        ></i>
                    </div>
                    <span class="nav-link-text grow-1 ms-1">
                        {{ menu.name }}
                    </span>
                    <i
                        :class="[
                            'fas fa-chevron-down ms-auto size-4 transition-transform duration-200',
                            {
                                'rotate-180': shouldOpenDropdown(
                                    index,
                                    menu.children,
                                ),
                            },
                        ]"
                    ></i>
                </a>

                <!-- Dropdown Items -->
                <div
                    :class="[
                        'collapse',
                        {
                            show: shouldOpenDropdown(index, menu.children),
                        },
                    ]"
                >
                    <ul style="list-style: none" class="flex-column ms-3 mt-1">
                        <li
                            v-for="(child, cIndex) in menu.children"
                            :key="cIndex"
                            class="nav-item"
                        >
                            <Link
                                :href="getRouteUrl(child.route)"
                                :class="[
                                    'nav-link d-flex align-items-center py-2',
                                    {
                                        'active btn-outline-primary-bottom text-primary':
                                            isActive(child.route),
                                        'text-dark': !isActive(child.route),
                                    },
                                ]"
                            >
                                <div
                                    :class="[
                                        'icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow',
                                        {
                                            'bg-white': !isActive(child.route),
                                            'bg-gradient-light': isActive(
                                                child.route,
                                            ),
                                        },
                                    ]"
                                    style="width: 28px; height: 28px"
                                >
                                    <i
                                        :class="[
                                            child.icon,
                                            {
                                                'text-dark': !isActive(
                                                    child.route,
                                                ),
                                                'text-white': isActive(
                                                    child.route,
                                                ),
                                            },
                                        ]"
                                    ></i>
                                </div>
                                <span class="nav-link-text ms-1">
                                    {{ child.name }}
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </li>

            <!-- Normal Menu -->
            <li v-else class="nav-item">
                <Link
                    :href="getRouteUrl(menu.route)"
                    :class="[
                        'nav-link d-flex align-items-center',
                        {
                            'active bg-gradient-primary text-white': isActive(
                                menu.route,
                            ),
                            'text-dark': !isActive(menu.route),
                        },
                    ]"
                >
                    <div
                        :class="[
                            'icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow',
                            {
                                'bg-white': !isActive(menu.route),
                                'bg-gradient-light': isActive(menu.route),
                            },
                        ]"
                    >
                        <i
                            :class="[
                                menu.icon,
                                {
                                    'text-dark': !isActive(menu.route),
                                    'text-white': isActive(menu.route),
                                },
                            ]"
                        ></i>
                    </div>
                    <span class="nav-link-text ms-1">{{ menu.name }}</span>
                </Link>
            </li>
        </template>

        <!-- System Optimize Button (for all authenticated users) -->
        <li v-if="canOptimize" class="nav-item mt-4">
            <button
                @click="confirmOptimize"
                :disabled="isOptimizing"
                :class="[
                    'nav-link d-flex align-items-center w-100',
                    {
                        'cursor-not-allowed opacity-50': isOptimizing,
                        'text-dark': !isOptimizing,
                    },
                ]"
                style="border: none; background: transparent; text-align: left"
            >
                <div
                    :class="[
                        'icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow',
                        {
                            'bg-white': !isOptimizing,
                            'bg-gradient-light': isOptimizing,
                        },
                    ]"
                >
                    <i
                        :class="[
                            isOptimizing
                                ? 'fas fa-spinner fa-spin'
                                : 'fas fa-sync-alt',
                            {
                                'text-dark': !isOptimizing,
                                'text-white': isOptimizing,
                            },
                        ]"
                    ></i>
                </div>
                <span class="nav-link-text ms-1">
                    {{ isOptimizing ? "Optimizing..." : "Refresh Halaman" }}
                </span>
            </button>
        </li>
    </ul>

    <!-- Optimize Confirmation Modal -->
    <div
        v-if="showOptimizeConfirm"
        class="modal fade show d-block"
        style="background-color: rgba(0, 0, 0, 0.5)"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-sync-alt me-2"></i>
                        Konfirmasi Refresh Halaman
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        @click="cancelOptimize"
                    ></button>
                </div>
                <div class="modal-body">
                    <p>Apakah Anda yakin ingin menjalankan optimasi sistem?</p>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Informasi:</strong>
                        <ul class="mb-0 mt-2">
                            <li>
                                Proses ini akan menjalankan
                                <code>php artisan optimize</code>
                            </li>
                            <li>
                                Halaman akan otomatis refresh setelah optimasi
                                selesai
                            </li>
                            <li>
                                Mungkin memerlukan beberapa detik untuk
                                menyelesaikan
                            </li>
                        </ul>
                    </div>
                    <div v-if="optimizeStatus" class="mt-3">
                        <small class="text-muted">
                            <strong>Rate Limit:</strong>
                            {{ optimizeStatus.rate_limit_remaining }} dari 3
                            percobaan tersisa
                        </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="cancelOptimize"
                    >
                        <i class="fas fa-times me-2"></i>
                        Batal
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="executeOptimize"
                    >
                        <i class="fas fa-sync-alt me-2"></i>
                        Ya, Refresh Sekarang
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Reset default list styles */
ul,
li {
    list-style: none;
    list-style-type: none;
    margin: 0;
    padding: 0;
}

/* Custom CSS untuk smooth transitions */
.nav-link {
    transition: all 0.3s ease;
    border-radius: 0 !important;
    margin: 0.125rem 0;
}

.nav-link:hover {
    transform: translateX(-10px);
}

.nav-link.active {
    box-shadow:
        0 4px 25px 0 rgba(0, 0, 0, 0.14),
        0 4px 8px 0 rgba(0, 0, 0, 0.1);
}

.icon {
    transition: all 0.3s ease;
}

.collapse {
    transition: all 0.3s ease;
}

.rotate-180 {
    transform: rotate(180deg);
}

/* Hover effects */
.nav-link:not(.active):hover {
    background-color: rgba(0, 123, 255, 0.1);
    color: #007bff !important;
}

.nav-link:not(.active):hover .icon {
    background: linear-gradient(135deg, #0057e6 0%, #7931dc 100%);
}

.nav-link:not(.active):hover .icon i {
    color: white !important;
}

/* Active dropdown parent styling */
.nav-link.active .icon {
    background: linear-gradient(135deg, #0057e6 0%, #7931dc 100%);
}

/* Optimize button specific styles */
.nav-item:last-child .nav-link {
    border-top: 1px solid #e9ecef;
    padding-top: 0.75rem;
    margin-top: 0.5rem;
}

/* Modal z-index fix */
.modal {
    z-index: 9999;
}

.modal-content {
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    border-bottom: 1px solid #e9ecef;
    background: linear-gradient(135deg, #0057e6 0%, #7931dc 100%);
    color: white;
}

.modal-header .btn-close {
    filter: invert(1);
}

/* Loading spinner animation */
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.fa-spin {
    animation: spin 1s linear infinite;
}
</style>
