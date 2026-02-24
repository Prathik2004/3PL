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
        mixed $code = 400
    ): JsonResponse {
        if (is_array($message)) {
            $firstError = collect($message)->flatten()->first();
            $message = 'Failed Due to ' . $firstError;
        }

        if (!is_int($code) || $code < 100 || $code > 599) {
            $code = 500;
        }

        return response()->json([
            'status' => false,
            'message' => $message,
        ], $code);
    }
}