<?php

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
    });
});

require __DIR__.'/auth.php';
