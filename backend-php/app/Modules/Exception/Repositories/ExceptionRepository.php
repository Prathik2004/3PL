<?php

namespace App\Modules\Exception\Repositories;

use App\Modules\Exception\Models\ShipmentException;
use Illuminate\Pagination\LengthAwarePaginator;

class ExceptionRepository
{
    public function create(array $data): ShipmentException
    {
        return ShipmentException::create($data);
    }

    public function findById(string $id): ?ShipmentException
    {
        return ShipmentException::find($id);
    }

    public function activeExistsForShipment(string $shipmentId, string $type): bool
    {
        return ShipmentException::where('shipment_id', $shipmentId)
            ->where('exception_type', $type)
            ->where('resolved', false)
            ->exists();
    }

    public function getAll(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = ShipmentException::query();

        if (isset($filters['resolved']) && $filters['resolved'] !== '') {
            $query->where('resolved', filter_var($filters['resolved'], FILTER_VALIDATE_BOOLEAN));
        }
        if (!empty($filters['exception_type'])) {
            $query->where('exception_type', $filters['exception_type']);
        }
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->latest()->paginate($perPage);
    }

    public function update(ShipmentException $exception, array $data): ShipmentException
    {
        $exception->update($data);
        return $exception->fresh();
    }
}