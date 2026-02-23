<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Controllers\UserController;

Route::middleware(['auth:api', 'role:Admin'])->prefix('users')->group(function () {
    Route::get('/',        [UserController::class, 'index']);
    Route::put('/{id}',    [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});