<?php

namespace App\Modules\Exception\Services;

use App\Modules\Exception\Repositories\ExceptionRepository;
use App\Modules\Shipment\Models\Shipment;
use App\Utils\ResponseHelper;
use App\Utils\DateHelper;
use App\Constants\ShipmentStatus;
use App\Constants\ExceptionTypes;
use App\Mail\ExceptionDetectedMail;
use App\Mail\DailySummaryMail;
use App\Modules\Exception\Models\ShipmentException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class ExceptionEngineService
{
    public function __construct(
        private ExceptionRepository $repository
    ) {}

    public function getAll(Request $request): JsonResponse
    {
        $filters   = $request->only(['resolved', 'exception_type', 'date_from', 'date_to']);
        $perPage   = (int) $request->get('per_page', 20);
        $paginator = $this->repository->getAll($filters, $perPage);

        $items = collect($paginator->items())->map(function ($exception) {
            $shipment        = Shipment::where('shipment_id', $exception->shipment_id)->first();
            $data            = $exception->toArray();
            $data['shipment'] = $shipment ? [
                'client_name'  => $shipment->client_name,
                'carrier_name' => $shipment->carrier_name,
                'status'       => $shipment->status,
            ] : null;
            return $data;
        })->toArray();

        return ResponseHelper::paginated('Exceptions retrieved', $paginator, $items);
    }

    public function getById(string $id): JsonResponse
    {
        $exception = $this->repository->findById($id);

        if (!$exception) {
            return ResponseHelper::notFound('Exception not found');
        }

        $shipment         = Shipment::where('shipment_id', $exception->shipment_id)->first();
        $data             = $exception->toArray();
        $data['shipment'] = $shipment;

        return ResponseHelper::success('Exception retrieved', $data);
    }

    public function resolve(string $id, array $data, string $userId): JsonResponse
    {
        $exception = $this->repository->findById($id);

        if (!$exception) {
            return ResponseHelper::notFound('Exception not found');
        }

        if ($exception->resolved) {
            return ResponseHelper::error('Exception is already resolved', [], 400);
        }

        $updated = $this->repository->update($exception, [
            'resolved'        => true,
            'resolved_at'     => DateHelper::nowUtc(),
            'resolved_by'     => $userId,
            'resolution_note' => $data['resolution_note'] ?? null,
        ]);

        return ResponseHelper::success('Exception resolved', $updated);
    }

    public function runEngine(): JsonResponse
    {
        $result = $this->detectExceptions();
        return ResponseHelper::success('Exception engine completed', $result);
    }

    public function detectExceptions(): array
    {
        $newExceptions = 0;
        $alreadyActive = 0;
        $totalChecked  = 0;

        $shipments = Shipment::whereNotIn('status', [
            ShipmentStatus::DELIVERED,
            ShipmentStatus::CANCELLED,
        ])->get();

        foreach ($shipments as $shipment) {
            $totalChecked++;

            // Rule 1 — Delay
            if (DateHelper::isOverdue($shipment->expected_delivery_date)) {
                if (!$this->repository->activeExistsForShipment($shipment->shipment_id, ExceptionTypes::DELAY)) {
                    $this->createException($shipment, ExceptionTypes::DELAY,
                        "Your Order {$shipment->shipment_id} is {$shipment->status}, we will make sure to do better next time."
                    );
                    $newExceptions++;
                } else {
                    $alreadyActive++;
                }
            }

            // Rule 2 — No Update
            if (
                $shipment->last_status_update &&
                DateHelper::hoursSince($shipment->last_status_update) > 24
            ) {
                if (!$this->repository->activeExistsForShipment($shipment->shipment_id, ExceptionTypes::NO_UPDATE)) {
                    $this->createException($shipment, ExceptionTypes::NO_UPDATE,
                        "Your Order {$shipment->shipment_id} is {$shipment->status}, we will make sure to do better next time."
                    );
                    $newExceptions++;
                } else {
                    $alreadyActive++;
                }
            }

            // Rule 4 — Not Dispatched
            if (
                $shipment->status === ShipmentStatus::CREATED &&
                DateHelper::hoursSince($shipment->created_at) > 48
            ) {
                if (!$this->repository->activeExistsForShipment($shipment->shipment_id, ExceptionTypes::NOT_DISPATCHED)) {
                    $this->createException($shipment, ExceptionTypes::NOT_DISPATCHED,
                        "Your Order {$shipment->shipment_id} is {$shipment->status}, we will make sure to do better next time."
                    );
                    $newExceptions++;
                } else {
                    $alreadyActive++;
                }
            }
        }

        // Rule 3 — Missing POD
        $delivered = Shipment::where('status', ShipmentStatus::DELIVERED)
            ->where('pod_received', false)
            ->get();

        foreach ($delivered as $shipment) {
            $totalChecked++;
            if (!$this->repository->activeExistsForShipment($shipment->shipment_id, ExceptionTypes::MISSING_POD)) {
                $this->createException($shipment, ExceptionTypes::MISSING_POD,
                    "Your Order {$shipment->shipment_id} is {$shipment->status}, we will make sure to do better next time."
                );
                $newExceptions++;
            } else {
                $alreadyActive++;
            }
        }

        return [
            'new_exceptions' => $newExceptions,
            'already_active' => $alreadyActive,
            'total_checked'  => $totalChecked,
        ];
    }

    private function createException(Shipment $shipment, string $type, string $reason): void
    {
        $this->repository->create([
            'id'             => (string) Str::uuid(),
            'shipment_id'    => $shipment->shipment_id,
            'exception_type' => $type,
            'status'         => $shipment->status,
            'reason'         => $reason,
            'resolved'       => false,
        ]);

        // Send email alert
        $alertEmail = config('mail.alert_email', env('ALERT_EMAIL'));
        if ($alertEmail) {
            Mail::to($alertEmail)->send(
                new ExceptionDetectedMail(
                    $shipment->shipment_id,
                    $type,
                    $reason,
                    $shipment->status
                )
            );
        }
    }

    public function sendDailySummary(): void
    {
        $exceptions = ShipmentException::where('resolved', false)
            ->orderBy('created_at', 'desc')
            ->get();

        $alertEmail = config('mail.alert_email', env('ALERT_EMAIL'));

        if ($alertEmail && $exceptions->count() > 0) {
            Mail::to($alertEmail)->send(
                new DailySummaryMail(
                    $exceptions->toArray(),
                    $exceptions->count()
                )
            );
        }
    }
}