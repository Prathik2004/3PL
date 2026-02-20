<?php

use Illuminate\Support\Facades\Route;

Route::prefix('csv')->group(function () {
    Route::get('test', fn() => response()->json(['module' => 'CsvUpload OK']));
});