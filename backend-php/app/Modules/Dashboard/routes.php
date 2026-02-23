<?php

use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    Route::get('test', fn() => response()->json(['module' => 'Dashboard OK']));
});