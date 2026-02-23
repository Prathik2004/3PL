<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Shipment\Controllers\ShipmentController;
use App\Modules\CsvUpload\Controllers\CsvUploadController;

Route::middleware('auth:api')->prefix('shipments')->group(function () {
    Route::get('/',          [ShipmentController::class, 'index']);
    Route::get('/{id}',      [ShipmentController::class, 'show']);

    Route::middleware('role:Admin,Operations')->group(function () {
        Route::post('/',              [ShipmentController::class, 'store']);
        Route::put('/{id}',           [ShipmentController::class, 'update']);
        Route::put('/{id}/status',    [ShipmentController::class, 'updateStatus']);
        Route::post('/csv/upload',    [CsvUploadController::class, 'upload']);
        Route::get('/csv/logs',       [CsvUploadController::class, 'logs']);
    });

    Route::middleware('role:Admin')->group(function () {
        Route::delete('/{id}', [ShipmentController::class, 'destroy']);
    });
});