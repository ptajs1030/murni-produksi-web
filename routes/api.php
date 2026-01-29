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
    Route::get('/product', [ProductController::class, 'index']);
    Route::post('/logout', [LoginController::class, 'logout']); // Ensure logout is here
    Route::post('/repack', [RepackController::class, 'repack']); // Added this line
    Route::get('/recipes', [RecipeController::class, 'index']);
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::post('/production', [ProductionController::class, 'store']);
    Route::middleware('admin, owner')->group(function () {});
});

Route::post('/login', [LoginController::class, 'login']);
