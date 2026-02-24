<?php

namespace App\Modules\Exception\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Exception\Services\ExceptionEngineService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExceptionController extends Controller
{
    public function __construct(
        private ExceptionEngineService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        return $this->service->getAll($request);
    }

    public function show(string $id): JsonResponse
    {
        return $this->service->getById($id);
    }

    public function resolve(Request $request, string $id): JsonResponse
    {
        return $this->service->resolve($id, $request->all(), auth('api')->id());
    }

    public function runEngine(): JsonResponse
    {
        return $this->service->runEngine();
    }
}