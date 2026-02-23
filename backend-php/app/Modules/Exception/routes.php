<?php

use Illuminate\Support\Facades\Route;

Route::prefix('exceptions')->group(function () {
    Route::get('test', fn() => response()->json(['module' => 'Exception OK']));
});