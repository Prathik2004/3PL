<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Utils\ResponseHelper;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return ResponseHelper::error('User not found.', 401);
            }

            if (!in_array($user->role, $roles)) {
                return ResponseHelper::error('Access denied', 403);
            }

            return $next($request);

        } catch (TokenExpiredException $e) {
            return ResponseHelper::error('Token expired. Please login again.', 401);
        } catch (TokenInvalidException $e) {
            return ResponseHelper::error('Token invalid. Please login again.', 401);
        } catch (JWTException $e) {
            return ResponseHelper::error('Token missing. Please login again.', 401);
        }
    }
}