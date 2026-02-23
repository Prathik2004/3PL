<?php

namespace App\Modules\Shipment\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shipment\Services\ShipmentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShipmentController extends Controller
{
    public function __construct(
        private ShipmentService $service
    ) {}

    public function store(Request $request): JsonResponse
    {
        return $this->service->create(
            $request->all(),
            auth('api')->id()
        );
    }

    public function index(Request $request): JsonResponse
    {
        return $this->service->getAll($request);
    }

    public function show(string $id): JsonResponse
    {
        return $this->service->getById($id);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        return $this->service->updateStatus(
            $id,
            $request->all(),
            auth('api')->id()
        );
    }

    public function update(Request $request, string $id): JsonResponse
    {
        return $this->service->update($id, $request->all());
    }

    public function destroy(string $id): JsonResponse
    {
        return $this->service->delete($id);
    }
}