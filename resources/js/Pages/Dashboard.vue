<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';

const props = defineProps(['stats', 'recentProducts']);

const formatNumber = number => {
    return new Intl.NumberFormat('id-ID').format(number);
};

const formatDate = date => {
    return new Date(date).toLocaleDateString('id-ID');
};
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout title="Dashboard">
        <!-- Stats Cards Row -->
        <div class="row mb-4">
            <!-- Total Products Card -->
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary h-100 py-2 shadow">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="font-weight-bold text-primary text-uppercase mb-1 text-xs">
                                    Total Products
                                </div>
                                <div class="h5 font-weight-bold mb-0 text-gray-800">
                                    {{ formatNumber(stats.totalProducts) }}
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-boxes fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Expired Products Card -->
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-danger h-100 py-2 shadow">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="font-weight-bold text-danger text-uppercase mb-1 text-xs">
                                    Expired Products
                                </div>
                                <div class="h5 font-weight-bold mb-0 text-gray-800">
                                    {{ formatNumber(stats.totalExpiredProducts) }}
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Total Sales Card -->
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success h-100 py-2 shadow">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="font-weight-bold text-success text-uppercase mb-1 text-xs">Total Sales</div>
                                <div class="h5 font-weight-bold mb-0 text-gray-800">
                                    {{ formatNumber(stats.totalSales) }}
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-shopping-cart fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Total Purchases Card -->
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-info h-100 py-2 shadow">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="font-weight-bold text-info text-uppercase mb-1 text-xs">
                                    Total Purchases
                                </div>
                                <div class="h5 font-weight-bold mb-0 text-gray-800">
                                    {{ formatNumber(stats.totalPurchases) }}
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-truck fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Stats Row -->
        <div class="row mb-4">
            <!-- Low Stock Card -->
            <div class="col-xl-6 col-md-6 mb-4">
                <div class="card border-left-warning h-100 py-2 shadow">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="font-weight-bold text-warning text-uppercase mb-1 text-xs">
                                    Low Stock Products (≤10)
                                </div>
                                <div class="h5 font-weight-bold mb-0 text-gray-800">
                                    {{ formatNumber(stats.lowStockProducts) }}
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-exclamation fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Products Card -->
            <div class="col-xl-6 col-md-6 mb-4">
                <div class="card h-100 shadow">
                    <div class="card-header py-3">
                        <h6 class="font-weight-bold text-primary m-0">Recent Products</h6>
                    </div>
                    <div class="card-body">
                        <div v-if="recentProducts && recentProducts.length > 0">
                            <div v-for="product in recentProducts" :key="product.id" class="mb-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="font-weight-bold text-sm">{{ product.product_name }}</span>
                                    <small class="text-muted">{{ formatDate(product.created_at) }}</small>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-muted text-center">No recent products found</div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style scoped>
.card {
    border: 1px solid #e3e6f0;
    border-radius: 0.35rem;
}

.card-body {
    padding: 1.25rem;
}

.border-left-primary {
    border-left: 0.25rem solid #4e73df !important;
}

.border-left-danger {
    border-left: 0.25rem solid #e74a3b !important;
}

.border-left-success {
    border-left: 0.25rem solid #1cc88a !important;
}

.border-left-info {
    border-left: 0.25rem solid #36b9cc !important;
}

.border-left-warning {
    border-left: 0.25rem solid #f6c23e !important;
}

.text-primary {
    color: #4e73df !important;
}
.text-danger {
    color: #e74a3b !important;
}
.text-success {
    color: #1cc88a !important;
}
.text-info {
    color: #36b9cc !important;
}
.text-warning {
    color: #f6c23e !important;
}

.shadow {
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important;
}

.h-100 {
    height: 100% !important;
}

.text-xs {
    font-size: 0.7rem;
}

.font-weight-bold {
    font-weight: 700;
}

.text-uppercase {
    text-transform: uppercase;
}

.text-gray-800 {
    color: #5a5c69 !important;
}

.text-gray-300 {
    color: #dddfeb !important;
}

.no-gutters {
    margin-right: 0;
    margin-left: 0;
}

.no-gutters > .col,
.no-gutters > [class*='col-'] {
    padding-right: 0;
    padding-left: 0;
}
</style>
