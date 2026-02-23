<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Dashboard\Controllers\DashboardController;

Route::middleware('auth:api')->prefix('dashboard')->group(function () {
    Route::get('/summary',               [DashboardController::class, 'summary']);
    Route::get('/shipments-by-status',   [DashboardController::class, 'shipmentsByStatus']);
    Route::get('/exceptions-by-type',    [DashboardController::class, 'exceptionsByType']);
    Route::get('/carrier-performance',   [DashboardController::class, 'carrierPerformance']);
}); 