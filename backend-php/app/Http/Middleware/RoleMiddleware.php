<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Utils\ResponseHelper;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        $user = auth('api')->user();

        if (!$user) {
            return ResponseHelper::unauthorized();
        }

        if (!in_array($user->role, $roles)) {
            return ResponseHelper::forbidden();
        }

        return $next($request);
    }
}