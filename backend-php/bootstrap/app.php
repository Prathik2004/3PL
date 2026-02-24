<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use App\Utils\ResponseHelper;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (\Throwable $e, $request) {

            // Only format API routes
            if ($request->is('api/*') || $request->expectsJson()) {

                // Validation Errors
                if ($e instanceof ValidationException) {
                    return ResponseHelper::validationError($e->errors());
                }

                // 404
                if ($e instanceof NotFoundHttpException) {
                    return ResponseHelper::notFound('API route not found');
                }

                // 401
                if ($e instanceof UnauthorizedHttpException) {
                    return ResponseHelper::unauthorized();
                }

                // Default 500
                return ResponseHelper::error(
                    config('app.debug')
                        ? $e->getMessage()
                        : 'Internal Server Error',
                    [],
                    500
                );
            }

            return null;
        });
    })
    ->create();