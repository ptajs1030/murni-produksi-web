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
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SystemOptimizeController;
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

        // Export & Import Routes for Master Data (must be before resources to avoid route conflict)
        Route::get('categories/export', [MCategoryController::class, 'export'])->name('categories.export');
        Route::get('categories/import-template', [MCategoryController::class, 'downloadTemplate'])->name('categories.import-template');
        Route::post('categories/import', [MCategoryController::class, 'import'])->name('categories.import');

        Route::get('suppliers/export', [MSupplierController::class, 'export'])->name('suppliers.export');
        Route::get('suppliers/import-template', [MSupplierController::class, 'downloadTemplate'])->name('suppliers.import-template');
        Route::post('suppliers/import', [MSupplierController::class, 'import'])->name('suppliers.import');

        Route::get('packaging-size-levels/import-template', [MPackagingSizeLevelController::class, 'downloadTemplate'])->name('packaging-size-levels.import-template');
        Route::post('packaging-size-levels/import', [MPackagingSizeLevelController::class, 'import'])->name('packaging-size-levels.import');

        Route::get('packaging-size-types/import-template', [MPackagingSizeTypeController::class, 'downloadTemplate'])->name('packaging-size-types.import-template');
        Route::post('packaging-size-types/import', [MPackagingSizeTypeController::class, 'import'])->name('packaging-size-types.import');

        Route::get('packaging-types/import-template', [MPackagingTypeController::class, 'downloadTemplate'])->name('packaging-types.import-template');
        Route::post('packaging-types/import', [MPackagingTypeController::class, 'import'])->name('packaging-types.import');

        Route::get('property-items/import-template', [MPropertyItemController::class, 'downloadTemplate'])->name('property-items.import-template');
        Route::post('property-items/import', [MPropertyItemController::class, 'import'])->name('property-items.import');

        Route::get('repack-status/import-template', [MRepackStatusController::class, 'downloadTemplate'])->name('repack-status.import-template');
        Route::post('repack-status/import', [MRepackStatusController::class, 'import'])->name('repack-status.import');

        Route::get('packaging-sizes/import-template', [MPackagingSizeController::class, 'downloadTemplate'])->name('packaging-sizes.import-template');
        Route::post('packaging-sizes/import', [MPackagingSizeController::class, 'import'])->name('packaging-sizes.import');

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
        Route::get('products/import-template', [CoreProductController::class, 'downloadTemplate'])->name('products.import-template');
        Route::post('products/import', [CoreProductController::class, 'import'])->name('products.import');
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

        // Settings Routes
        Route::middleware('role:owner,admin')->group(function () {
            Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
            Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
        });

        // System Optimize Routes
        Route::get('/system/optimize/status', [SystemOptimizeController::class, 'status'])->name('system.optimize.status');
        Route::post('/system/optimize', [SystemOptimizeController::class, 'optimize'])->name('system.optimize.execute');
    });
});

require __DIR__ . '/auth.php';
