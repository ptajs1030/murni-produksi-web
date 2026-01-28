<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;

Route::middleware('auth')->group(function () {
    Route::middleware('admin, owner')->group(function () {

    });

});
Route::post('/login', [LoginController::class, 'login']);
Route::get('/dashboard', [DashboardController::class,'index']);
Route::get('/product', [ProductController::class,'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
});
