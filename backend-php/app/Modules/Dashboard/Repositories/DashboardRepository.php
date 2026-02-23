<?php

namespace App\Modules\Dashboard\Repositories;

use Illuminate\Support\Facades\DB;
use App\Constants\ShipmentStatus;
use App\Utils\DateHelper;

class DashboardRepository
{
    public function getSummary(array $filters = []): array
    {
        $base = DB::table('shipments')->whereNull('deleted_at');

        if (!empty($filters['client_name'])) {
            $base->where('client_name', 'like', '%' . $filters['client_name'] . '%');
        }
        if (!empty($filters['carrier_name'])) {
            $base->where('carrier_name', $filters['carrier_name']);
        }
        if (!empty($filters['date_from'])) {
            $base->whereDate('dispatch_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $base->whereDate('dispatch_date', '<=', $filters['date_to']);
        }

        $active = (clone $base)->whereIn('status', [
            ShipmentStatus::CREATED,
            ShipmentStatus::DISPATCHED,
            ShipmentStatus::IN_TRANSIT,
            ShipmentStatus::OUT_FOR_DELIVERY,
        ])->count();

        $deliveredToday = (clone $base)
            ->where('status', ShipmentStatus::DELIVERED)
            ->whereDate('delivered_date', DateHelper::nowUtc()->toDateString())
            ->count();

        $delayed = (clone $base)
            ->where('status', '!=', ShipmentStatus::DELIVERED)
            ->where('expected_delivery_date', '<', DateHelper::nowUtc())
            ->count();

        $activeExceptions = DB::table('exceptions')
            ->where('resolved', false)
            ->count();

        $totalDelivered = (clone $base)
            ->where('status', ShipmentStatus::DELIVERED)
            ->count();

        $onTimeDelivered = (clone $base)
            ->where('status', ShipmentStatus::DELIVERED)
            ->whereColumn('delivered_date', '<=', 'expected_delivery_date')
            ->count();

        $onTimePercent = $totalDelivered > 0
            ? round(($onTimeDelivered / $totalDelivered) * 100, 1)
            : 0;

        $avgTransit = (clone $base)
            ->where('status', ShipmentStatus::DELIVERED)
            ->whereNotNull('delivered_date')
            ->selectRaw('AVG(DATEDIFF(delivered_date, dispatch_date)) as avg_days')
            ->value('avg_days');

        $total     = (clone $base)->where('status', '!=', ShipmentStatus::CANCELLED)->count();
        $cancelled = (clone $base)->where('status', ShipmentStatus::CANCELLED)->count();

        return [
            'active_shipments'         => $active,
            'delivered_today'          => $deliveredToday,
            'delayed'                  => $delayed,
            'active_exceptions'        => $activeExceptions,
            'on_time_delivery_percent' => $onTimePercent,
            'average_transit_days'     => $avgTransit ? round($avgTransit, 1) : 0,
            'total_shipments'          => $total,
            'cancelled'                => $cancelled,
        ];
    }

    public function getShipmentsByStatus(): array
    {
        return DB::table('shipments')
            ->whereNull('deleted_at')
            ->where('status', '!=', ShipmentStatus::CANCELLED)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->toArray();
    }

    public function getExceptionsByType(): array
    {
        return DB::table('exceptions')
            ->where('resolved', false)
            ->select('exception_type', DB::raw('count(*) as count'))
            ->groupBy('exception_type')
            ->get()
            ->toArray();
    }

    public function getCarrierPerformance(array $filters = []): array
    {
        $query = DB::table('shipments')
            ->whereNull('deleted_at')
            ->where('status', ShipmentStatus::DELIVERED);

        if (!empty($filters['date_from'])) {
            $query->whereDate('dispatch_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('dispatch_date', '<=', $filters['date_to']);
        }

        $carriers = $query->select('carrier_name',
            DB::raw('count(*) as total_delivered'),
            DB::raw('SUM(CASE WHEN delivered_date <= expected_delivery_date THEN 1 ELSE 0 END) as on_time')
        )
        ->groupBy('carrier_name')
        ->get();

        return $carriers->map(function ($c) {
            return [
                'carrier_name'     => $c->carrier_name,
                'total_delivered'  => $c->total_delivered,
                'on_time'          => $c->on_time,
                'on_time_percent'  => $c->total_delivered > 0
                    ? round(($c->on_time / $c->total_delivered) * 100, 1)
                    : 0,
            ];
        })->toArray();
    }
}