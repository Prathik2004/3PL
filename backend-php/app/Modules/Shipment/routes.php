<?php

use Illuminate\Support\Facades\Route;

Route::prefix('shipments')->group(function () {
    Route::get('test', fn() => response()->json(['module' => 'Shipment OK']));
});