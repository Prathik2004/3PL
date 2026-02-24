<?php

namespace App\Modules\Shipment\Services;

use App\Modules\Shipment\Repositories\ShipmentRepository;
use App\Modules\Shipment\Validators\CreateShipmentValidator;
use App\Modules\Shipment\Validators\UpdateStatusValidator;
use App\Utils\ResponseHelper;
use App\Utils\DateHelper;
use App\Constants\ShipmentStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ShipmentService
{
    public function __construct(
        private ShipmentRepository $repository
    ) {}

    public function create(array $data, string $userId): JsonResponse
    {
        $validator = CreateShipmentValidator::validate($data);

        if ($validator->fails()) {
            return ResponseHelper::validationError(
                $validator->errors()->toArray()
            );
        }

        // assigned_to = specific user if provided, else null (visible to all Admin/Operations)
        $assignedTo = $data['assign_to'] ?? null;

        $shipment = $this->repository->create([
            'shipment_id'            => $data['shipment_id'],
            'client_name'            => $data['client_name'],
            'origin'                 => $data['origin'],
            'destination'            => $data['destination'],
            'dispatch_date'          => $data['dispatch_date'],
            'expected_delivery_date' => $data['expected_delivery_date'],
            'carrier_name'           => $data['carrier_name'],
            'pod_received'           => $data['pod_received'] ?? false,
            'status'                 => ShipmentStatus::CREATED,
            'last_status_update'     => DateHelper::nowUtc(),
            'assigned_to'            => $assignedTo,
        ]);

        $this->logStatus($shipment->shipment_id, null, ShipmentStatus::CREATED, $userId);

        return ResponseHelper::created('Shipment created successfully', [
            'id'          => $shipment->id,
            'shipment_id' => $shipment->shipment_id,
            'status'      => $shipment->status,
            'assigned_to' => $assignedTo,
            'created_at'  => $shipment->created_at,
        ]);
    }

    public function getAll(Request $request): JsonResponse
    {
        $user    = auth('api')->user();
        $filters = $request->only([
            'status', 'client_name', 'carrier_name',
            'date_from', 'date_to', 'search', 'include_cancelled',
        ]);
        $perPage  = (int) $request->get('per_page', 20);
        $paginator = $this->repository->getAll($filters, $perPage);

        return ResponseHelper::paginated(
            'Shipments retrieved',
            $paginator,
            $paginator->items()
        );
    }

    public function getById(string $id): JsonResponse
    {
        $user     = auth('api')->user();
        $shipment = $this->repository->findById($id);

        if (!$shipment) {
            return ResponseHelper::notFound('Shipment not found');
        }

        $logs = DB::table('shipment_logs')
            ->where('shipment_id', $shipment->shipment_id)
            ->orderBy('created_at')
            ->get();

        $exceptions = DB::table('exceptions')
            ->where('shipment_id', $shipment->shipment_id)
            ->get();

        $data                   = $shipment->toArray();
        $data['status_history'] = $logs;
        $data['exceptions']     = $exceptions;

        return ResponseHelper::success('Shipment retrieved', $data);
    }

    public function updateStatus(string $id, array $data, string $userId): JsonResponse
    {
        $shipment = $this->repository->findById($id);

        if (!$shipment) {
            return ResponseHelper::notFound('Shipment not found');
        }

        $validator = UpdateStatusValidator::validate($data, $shipment->dispatch_date);

        if ($validator->fails()) {
            return ResponseHelper::validationError(
                $validator->errors()->toArray()
            );
        }

        $oldStatus = $shipment->status;
        $newStatus = $data['status'];

        $updateData = [
            'status'             => $newStatus,
            'last_status_update' => DateHelper::nowUtc(),
        ];

        if ($newStatus === ShipmentStatus::DELIVERED) {
            $updateData['delivered_date'] = $data['delivered_date'];
            $updateData['pod_received']   = $data['pod_received'] ?? false;
        }

        if ($newStatus === ShipmentStatus::CANCELLED) {
            $shipment->update($updateData);
            $shipment->delete();
        } else {
            $this->repository->update($shipment, $updateData);
        }

        $this->logStatus($shipment->shipment_id, $oldStatus, $newStatus, $userId);

        return ResponseHelper::success('Status updated successfully', [
            'id'             => $shipment->id,
            'status'         => $newStatus,
            'delivered_date' => $data['delivered_date'] ?? null,
        ]);
    }

    public function update(string $id, array $data): JsonResponse
    {
        $shipment = $this->repository->findById($id);

        if (!$shipment) {
            return ResponseHelper::notFound('Shipment not found');
        }

        $allowed = [
            'client_name', 'origin', 'destination',
            'carrier_name', 'expected_delivery_date', 'pod_received',
        ];

        $updateData = array_intersect_key($data, array_flip($allowed));
        $this->repository->update($shipment, $updateData);

        return ResponseHelper::success('Shipment updated', $shipment->fresh());
    }

    public function delete(string $id): JsonResponse
    {
        $shipment = $this->repository->findById($id);

        if (!$shipment) {
            return ResponseHelper::notFound('Shipment not found');
        }

        $shipment->update(['status' => ShipmentStatus::CANCELLED]);
        $shipment->delete();

        return ResponseHelper::success('Shipment cancelled successfully');
    }

    private function logStatus(
        string $shipmentId,
        ?string $oldStatus,
        string $newStatus,
        string $userId
    ): void {
        DB::table('shipment_logs')->insert([
            'id'          => (string) Str::uuid(),
            'shipment_id' => $shipmentId,
            'old_status'  => $oldStatus,
            'new_status'  => $newStatus,
            'changed_by'  => $userId,
            'created_at'  => DateHelper::nowUtc(),
            'updated_at'  => DateHelper::nowUtc(),
        ]);
    }
}