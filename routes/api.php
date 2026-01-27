<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', \App\Http\Controllers\Api\LoginController::class);
Route::middleware('auth')->group(function () {
    Route::middleware('admin, owner')->group(function () {

    });

});