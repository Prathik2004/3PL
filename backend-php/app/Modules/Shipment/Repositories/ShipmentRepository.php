<?php

namespace App\Modules\Shipment\Repositories;

use App\Modules\Shipment\Models\Shipment;
use Illuminate\Pagination\LengthAwarePaginator;

class ShipmentRepository
{
    public function create(array $data): Shipment
    {
        return Shipment::create($data);
    }

    public function findById(string $id): ?Shipment
    {
        return Shipment::find($id);
    }

    public function findByShipmentId(string $shipmentId): ?Shipment
    {
        return Shipment::where('shipment_id', $shipmentId)->first();
    }

    public function update(Shipment $shipment, array $data): Shipment
    {
        $shipment->update($data);
        return $shipment->fresh();
    }

    public function getAll(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Shipment::query();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['client_name'])) {
            $query->where('client_name', 'like', '%' . $filters['client_name'] . '%');
        }
        if (!empty($filters['carrier_name'])) {
            $query->where('carrier_name', $filters['carrier_name']);
        }
        if (!empty($filters['date_from'])) {
            $query->whereDate('dispatch_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('dispatch_date', '<=', $filters['date_to']);
        }
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('shipment_id', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('client_name', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (empty($filters['include_cancelled'])) {
            $query->where('status', '!=', 'Cancelled');
        }

        return $query->latest()->paginate($perPage);
    }

    public function insertMany(array $rows): void
    {
        foreach ($rows as $row) {
            Shipment::create($row);
        }
    }
}