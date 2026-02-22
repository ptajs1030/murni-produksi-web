<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductionController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\RepackController; // Added this line

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/logout', [LoginController::class, 'logout']); // Ensure logout is here
    Route::post('/production/store', [ProductionController::class, 'store']);
    Route::get('/production/product', [ProductionController::class, 'index']);
    Route::get('/production', [ProductionController::class, 'production']);
    Route::post('/production/check', [ProductionController::class, 'check']);
    Route::post('/repack', [RepackController::class, 'store']);
    Route::get('/repack', [RepackController::class, 'index']);
    Route::get('/repack/bahan-baku', [RepackController::class, 'getBahanBaku']);
});

Route::post('/login', [LoginController::class, 'login']);
