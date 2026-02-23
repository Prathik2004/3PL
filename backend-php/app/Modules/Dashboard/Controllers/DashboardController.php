<?php

namespace App\Modules\Dashboard\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Dashboard\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $service
    ) {}

    public function summary(Request $request): JsonResponse
    {
        return $this->service->summary($request);
    }

    public function shipmentsByStatus(): JsonResponse
    {
        return $this->service->shipmentsByStatus();
    }

    public function exceptionsByType(): JsonResponse
    {
        return $this->service->exceptionsByType();
    }

    public function carrierPerformance(Request $request): JsonResponse
    {
        return $this->service->carrierPerformance($request);
    }
}