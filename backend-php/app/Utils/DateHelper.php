<?php
namespace App\Utils;

use Carbon\Carbon;

class DateHelper
{
    public static function nowUtc(): Carbon
    {
        return Carbon::now('UTC');
    }

    public static function parseUtc(?string $date): ?Carbon
    {
        if (!$date) return null;
        return Carbon::parse($date)->utc();
    }

    public static function isOverdue(string $expectedDate): bool
    {
        return Carbon::now('UTC')->gt(Carbon::parse($expectedDate)->utc());
    }

    public static function hoursSince(string $date): float
    {
        return Carbon::now('UTC')
            ->diffInHours(Carbon::parse($date)->utc());
    }

    public static function daysBetween(string $from, string $to): float
    {
        return Carbon::parse($from)->utc()
            ->diffInDays(Carbon::parse($to)->utc());
    }
}