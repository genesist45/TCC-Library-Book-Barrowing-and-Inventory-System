<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureUserHasRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle 404 Not Found errors
        $exceptions->render(function (NotFoundHttpException $e, $request) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Not Found'], 404);
            }

            return Inertia::render('NotFoundPage', [
                'status' => 404,
                'message' => 'The page you\'re looking for doesn\'t exist or has been moved.',
            ])->toResponse($request)->setStatusCode(404);
        });

        // Handle 403 Forbidden/Unauthorized errors
        $exceptions->render(function (HttpException $e, $request) {
            if ($e->getStatusCode() === 403) {
                if ($request->wantsJson()) {
                    return response()->json(['message' => 'Unauthorized'], 403);
                }

                return Inertia::render('UnauthorizedPage', [
                    'status' => 403,
                    'message' => $e->getMessage() ?: 'You don\'t have permission to access this resource.',
                ])->toResponse($request)->setStatusCode(403);
            }
        });
    })->create();
