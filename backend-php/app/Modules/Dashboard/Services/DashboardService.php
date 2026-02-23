<?php

namespace App\Modules\Dashboard\Services;

use App\Modules\Dashboard\Repositories\DashboardRepository;
use App\Utils\ResponseHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardService
{
    public function __construct(
        private DashboardRepository $repository
    ) {}

    public function summary(Request $request): JsonResponse
    {
        $filters = $request->only(['client_name', 'carrier_name', 'date_from', 'date_to']);
        $data    = $this->repository->getSummary($filters);
        return ResponseHelper::success('Dashboard summary retrieved', $data);
    }

    public function shipmentsByStatus(): JsonResponse
    {
        $data = $this->repository->getShipmentsByStatus();
        return ResponseHelper::success('Shipments by status retrieved', $data);
    }

    public function exceptionsByType(): JsonResponse
    {
        $data = $this->repository->getExceptionsByType();
        return ResponseHelper::success('Exceptions by type retrieved', $data);
    }

    public function carrierPerformance(Request $request): JsonResponse
    {
        $filters = $request->only(['date_from', 'date_to']);
        $data    = $this->repository->getCarrierPerformance($filters);
        return ResponseHelper::success('Carrier performance retrieved', $data);
    }
}