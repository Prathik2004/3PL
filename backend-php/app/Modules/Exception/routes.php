<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Exception\Controllers\ExceptionController;

Route::middleware('auth:api')->prefix('exceptions')->group(function () {

    Route::get('/',   [ExceptionController::class, 'index']);
    Route::get('/{id}', [ExceptionController::class, 'show']);

    Route::middleware('role:Admin,Operations')->group(function () {
        Route::patch('/{id}/resolve', [ExceptionController::class, 'resolve']);
    });

    Route::middleware('role:Admin')->group(function () {
        Route::post('/run-engine', [ExceptionController::class, 'runEngine']);
    });
});