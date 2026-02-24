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
            'status'  => true,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    public static function error(
        string|array $message = 'Something went wrong',
        int $code = 400
    ): JsonResponse {
        if (is_array($message)) {
            $firstError = collect($message)->flatten()->first();
            $message = 'Validation Failed Due to ' . $firstError;
        }

        return response()->json([
            'status' => false,
            'message' => $message,
        ], $code);
    }
}