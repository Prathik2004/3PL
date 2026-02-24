<?php

namespace App\Modules\User\Services;

use App\Modules\User\Repositories\UserRepository;
use App\Utils\ResponseHelper;
use App\Constants\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private UserRepository $repository
    ) {}

    public function getAll(Request $request): JsonResponse
    {
        $filters   = $request->only(['role', 'search']);
        $perPage   = (int) $request->get('per_page', 20);
        $paginator = $this->repository->getAll($filters, $perPage);

        return ResponseHelper::success(
            'Users retrieved',
            $paginator
        );
    }

    public function update(string $id, array $data, string $authUserId): JsonResponse
    {
        $user = $this->repository->findById($id);

        if (!$user) {
            return ResponseHelper::error('User not found', 404);
        }

        $validator = Validator::make($data, [
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'role'     => 'sometimes|in:' . implode(',', Roles::ALL),
            'password' => 'sometimes|string|min:8',
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error(
                $validator->errors()->toArray(), 422
            );
        }

        $updateData = array_filter([
            'name'     => $data['name']     ?? null,
            'email'    => $data['email']    ?? null,
            'role'     => $data['role']     ?? null,
            'password' => isset($data['password'])
                ? Hash::make($data['password'])
                : null,
        ]);

        $updated = $this->repository->update($user, $updateData);

        return ResponseHelper::success('User updated successfully', [
            'id'    => $updated->id,
            'name'  => $updated->name,
            'email' => $updated->email,
            'role'  => $updated->role,
        ]);
    }

    public function destroy(string $id, string $authUserId): JsonResponse
    {
        if ($id === $authUserId) {
            return ResponseHelper::error(
                'You cannot delete your own account', 400
            );
        }

        $user = $this->repository->findById($id);

        if (!$user) {
            return ResponseHelper::error('User not found', 404);
        }

        $this->repository->delete($user);

        return ResponseHelper::success('User removed successfully');
    }
}