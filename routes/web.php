<?php

use App\Http\Controllers\CoreIncomingProductController;
use App\Http\Controllers\CoreOutgoingProductController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::group(['middleware' => 'guest'], function () {
    Route::get('/', function () {
        return Inertia::render('Auth/Login');
    });
    Route::post('/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store'])->name('login');
});




Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::middleware('role:admin,user')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::resource('users', \App\Http\Controllers\UserController::class);
        Route::resource('categories', \App\Http\Controllers\MCategoryController::class);
        Route::resource('suppliers', \App\Http\Controllers\MSupplierController::class);
        Route::resource('property-items', \App\Http\Controllers\MPropertyItemController::class);
        Route::resource('packaging-size-levels', \App\Http\Controllers\MPackagingSizeLevelController::class);
        Route::resource('packaging-size-types', \App\Http\Controllers\MPackagingSizeTypeController::class);
        Route::resource('packaging-types', \App\Http\Controllers\MPackagingTypeController::class);
        Route::resource('repack-status', \App\Http\Controllers\MRepackStatusController::class);
        Route::resource('products', \App\Http\Controllers\CoreProductController::class);
        Route::resource('recipes', \App\Http\Controllers\CoreRecipeController::class);
        Route::get('incoming-goods', [CoreIncomingProductController::class, 'index'])->name('incoming-goods.index');
        Route::post('incoming-goods', [CoreIncomingProductController::class, 'store'])->name('incoming-goods.store');
        Route::get('outgoing-goods', [CoreOutgoingProductController::class, 'index'])->name('outgoing-goods.index');
        Route::post('outgoing-goods', [CoreOutgoingProductController::class, 'store'])->name('outgoing-goods.store');
    });
});

require __DIR__.'/auth.php';
