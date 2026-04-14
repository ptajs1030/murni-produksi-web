<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductionController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\RepackController; // Added this line
use App\Http\Controllers\Api\OutgoingProductController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/me', [LoginController::class, 'user']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/production', [ProductionController::class, 'index']);
    Route::post('/production/check', [ProductionController::class, 'check']);
    Route::post('/production/store', [ProductionController::class, 'store']);
    Route::get('/production/products', [ProductionController::class, 'getProducts']);
    Route::post('/repack', [RepackController::class, 'store']);
    Route::get('/repack', [RepackController::class, 'index']);
    Route::get('/repack/bahan-baku', [RepackController::class, 'getBahanBaku']);
    
    // Outgoing Products
    Route::get('/outgoing-products', [OutgoingProductController::class, 'index']);
    Route::get('/outgoing-products/options', [OutgoingProductController::class, 'getFormOptions']);
    Route::post('/outgoing-products', [OutgoingProductController::class, 'store']);
});

Route::post('/login', [LoginController::class, 'login']);
