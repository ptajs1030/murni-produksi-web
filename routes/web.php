<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CoreIncomingProductController;
use App\Http\Controllers\CoreOutgoingProductController;
use App\Http\Controllers\CoreProductController;
use App\Http\Controllers\CoreRecipeController;
use App\Http\Controllers\CoreStockOpnameController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MCategoryController;
use App\Http\Controllers\MPackagingSizeController;
use App\Http\Controllers\MPackagingSizeLevelController;
use App\Http\Controllers\MPackagingSizeTypeController;
use App\Http\Controllers\MPackagingTypeController;
use App\Http\Controllers\MPropertyItemController;
use App\Http\Controllers\MRepackStatusController;
use App\Http\Controllers\MSupplierController;
use App\Http\Controllers\ProductExpiredController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StockTransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/', fn() => Inertia::render('Auth/Login'));
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::middleware('role:owner,admin')->group(function () {
        // Profile Routes
        Route::controller(ProfileController::class)->prefix('profile')->name('profile.')->group(function () {
            Route::get('/', 'edit')->name('edit');
            Route::patch('/', 'update')->name('update');
            Route::delete('/', 'destroy')->name('destroy');
        });

        // User Management
        Route::resource('users', UserController::class);

        // Export Routes for Master Data (must be before resources to avoid route conflict)
        Route::get('categories/export', [MCategoryController::class, 'export'])->name('categories.export');
        Route::get('suppliers/export', [MSupplierController::class, 'export'])->name('suppliers.export');

        // Master Data Routes
        Route::resources([
            'categories'            => MCategoryController::class,
            'suppliers'             => MSupplierController::class,
            'property-items'        => MPropertyItemController::class,
            'packaging-size-levels' => MPackagingSizeLevelController::class,
            'packaging-size-types'  => MPackagingSizeTypeController::class,
            'packaging-types'       => MPackagingTypeController::class,
            'repack-status'            => MRepackStatusController::class,
            'packaging-sizes'       => MPackagingSizeController::class,
        ]);

        // Product Routes
        Route::resource('products', CoreProductController::class);
        Route::get('products/{product}/stock-details', [CoreProductController::class, 'stockDetails'])->name('products.stock-details');

        // Recipe Routes
        Route::resource('recipes', CoreRecipeController::class);

        // Inventory Transaction Routes
        Route::controller(CoreIncomingProductController::class)->prefix('incoming-goods')->name('incoming-goods.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::patch('/{incomingProduct}/status', 'updateStatus')->name('update-status')->middleware('role:owner');
        });

        Route::controller(CoreOutgoingProductController::class)->prefix('outgoing-goods')->name('outgoing-goods.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
        });

        Route::controller(CoreStockOpnameController::class)->prefix('stock-opnames')->name('stock-opnames.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('/{id}/products', 'show')->name('show');
            Route::post('/{id}/products', 'storeProduct')->name('products.store');
            Route::delete('/{id}/products/{productId}', 'deleteProduct')->name('products.delete');
            Route::post('/{id}/submit', 'submit')->name('submit');
            Route::put('/{id}/products/{productId}/owner-action', 'ownerAction')->name('products.owner-action')->middleware('role:owner');
            Route::get('/{id}/products/export', 'export')->name('products.export');
        });

        // Repack Routes
        Route::controller(\App\Http\Controllers\RepackController::class)->prefix('repack')->name('repack.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
        });

        Route::controller(ProductExpiredController::class)->prefix('product-expired')->name('product-expired.')->group(function () {
            Route::get('/', 'index')->name('index');
        });

        // Production Routes
        Route::controller(ProductionController::class)->prefix('production')->name('production.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('/ingredients', 'getIngredients')->name('ingredients');
        });

        // Stock Transaction Routes
        Route::get('/stock-transactions', [StockTransactionController::class, 'index'])->name('stock-transactions.index');
    });
});

require __DIR__ . '/auth.php';
