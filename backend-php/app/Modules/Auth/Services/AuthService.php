<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\Repositories\AuthRepository;
use App\Modules\Auth\Validators\RegisterValidator;
use App\Modules\Auth\Validators\LoginValidator;
use App\Modules\Auth\Validators\UpdatePasswordValidator;
use App\Utils\ResponseHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function __construct(
        private AuthRepository $repository
    ) {}

    public function register(array $data): JsonResponse
    {
        $validator = RegisterValidator::validate($data);

        if ($validator->fails()) {
            return ResponseHelper::error(
                $validator->errors()->toArray(), 422
            );
        }

        $user = $this->repository->createUser($data);
        $token = JWTAuth::fromUser($user);

        return ResponseHelper::success('User registered successfully', [
            'token'      => $token,
            'expires_in' => config('jwt.ttl') * 60,
            'user'       => $this->formatUser($user),
        ], 201);
    }

    public function login(array $data): JsonResponse
    {
        $validator = LoginValidator::validate($data);

        if ($validator->fails()) {
            return ResponseHelper::error(
                $validator->errors()->toArray(), 422
            );
        }

        $user = $this->repository->findByEmail($data['email']);

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return ResponseHelper::error('Invalid email or password', 401);
        }

        $token = JWTAuth::fromUser($user);

        return ResponseHelper::success('Login successful', [
            'token'      => $token,
            'expires_in' => config('jwt.ttl') * 60,
            'user'       => $this->formatUser($user),
        ]);
    }

    public function logout(): JsonResponse
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return ResponseHelper::success('Logged out successfully');
    }

    public function refresh(): JsonResponse
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());
        return ResponseHelper::success('Token refreshed', [
            'token'      => $token,
            'expires_in' => config('jwt.ttl') * 60,
        ]);
    }

    public function me(): JsonResponse
    {
        $user = JWTAuth::parseToken()->authenticate();
        return ResponseHelper::success('OK', $this->formatUser($user));
    }

    private function formatUser($user): array
    {
        return [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => $user->role,
            'created_at' => $user->created_at,
        ];
    }

    public function forgot(array $data): JsonResponse
    {
        $validator = UpdatePasswordValidator::validate($data);

        if ($validator->fails()) {
            return ResponseHelper::error(
                $validator->errors()->toArray(), 422
            );
        }

        // Find user
        $user = $this->repository->findByEmail($data['email']);

        if (!$user) {
            return ResponseHelper::error('No account found with this email.', 404);
        }

        // Save new password
        $user->password = \Illuminate\Support\Facades\Hash::make($data['password']);
        $user->save();

        return ResponseHelper::success('Password updated successfully. Please login with your new password.');
    }   
}