<?php

use Illuminate\Support\Facades\Route;

Route::prefix('users')->group(function () {
    Route::get('test', fn() => response()->json(['module' => 'User OK']));
});