<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $service
    ) {}

    public function register(Request $request): JsonResponse
    {
        return $this->service->register($request->all());
    }

    public function login(Request $request): JsonResponse
    {
        return $this->service->login($request->all());
    }

    public function logout(): JsonResponse
    {
        return $this->service->logout();
    }

    public function refresh(): JsonResponse
    {
        return $this->service->refresh();
    }

    public function me(): JsonResponse
    {
        return $this->service->me();
    }

    public function forgot(Request $request): JsonResponse
    {
        return $this->service->forgot($request->all());
    }
}