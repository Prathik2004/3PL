<?php

use Illuminate\Support\Facades\Schedule;
use App\Modules\Exception\Services\ExceptionEngineService;

// Run exception engine every hour automatically
Schedule::call(function () {
    app(ExceptionEngineService::class)->detectExceptions();
})->hourly()->name('exception-engine')->withoutOverlapping();

// Send daily summary email every day at 8:00 AM UTC
Schedule::call(function () {
    app(ExceptionEngineService::class)->sendDailySummary();
})->dailyAt('08:00')->name('daily-summary-email')->withoutOverlapping();