<?php

namespace App\Utils;

use Illuminate\Http\JsonResponse;

class ResponseHelper
{
    public static function success(
        string $message = 'OK',
        mixed $data = null,
        int $code = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    public static function created(
        string $message = 'Created successfully',
        mixed $data = null
    ): JsonResponse {
        return self::success($message, $data, 201);
    }

    public static function error(
        string $message = 'Something went wrong',
        array $errors = [],
        int $code = 400
    ): JsonResponse {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $code);
    }

    public static function validationError(array $errors): JsonResponse
    {
        return self::error('Validation failed', $errors, 422);
    }

    public static function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return self::error($message, [], 404);
    }

    public static function unauthorized(string $message = 'Unauthenticated'): JsonResponse
    {
        return self::error($message, [], 401);
    }

    public static function forbidden(string $message = 'You do not have permission'): JsonResponse
    {
        return self::error($message, [], 403);
    }

    public static function paginated(
        string $message,
        $paginator,
        array $items
    ): JsonResponse {
        return response()->json([
            'success'  => true,
            'message'  => $message,
            'data'     => [
                'total'     => $paginator->total(),
                'page'      => $paginator->currentPage(),
                'per_page'  => $paginator->perPage(),
                'last_page' => $paginator->lastPage(),
                'items'     => $items,
            ],
        ], 200);
    }
}