<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private UserService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        return $this->service->getAll($request);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        return $this->service->update(
            $id,
            $request->all(),
            auth('api')->id()
        );
    }

    public function destroy(string $id): JsonResponse
    {
        return $this->service->destroy($id, auth('api')->id());
    }
}