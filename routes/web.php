<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CoreIncomingProductController;
use App\Http\Controllers\CoreOutgoingProductController;
use App\Http\Controllers\CoreProductController;
use App\Http\Controllers\CoreRecipeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MCategoryController;
use App\Http\Controllers\MPackagingSizeLevelController;
use App\Http\Controllers\MPackagingSizeTypeController;
use App\Http\Controllers\MPackagingTypeController;
use App\Http\Controllers\MPropertyItemController;
use App\Http\Controllers\MRepackStatusController;
use App\Http\Controllers\MSupplierController;
use App\Http\Controllers\ProfileController;
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

        // Master Data Routes
        Route::resources([
            'categories'            => MCategoryController::class,
            'suppliers'             => MSupplierController::class,
            'property-items'        => MPropertyItemController::class,
            'packaging-size-levels' => MPackagingSizeLevelController::class,
            'packaging-size-types'  => MPackagingSizeTypeController::class,
            'packaging-types'       => MPackagingTypeController::class,
            'repack-status'            => MRepackStatusController::class,
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
    });
});

require __DIR__ . '/auth.php';
