<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $roles  Single role or comma-separated list of roles (e.g., "admin" or "admin,staff")
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        // Split roles by pipe to support multiple roles (e.g., "admin|staff")
        $allowedRoles = explode('|', $roles);
        
        if (!$request->user() || !in_array($request->user()->role, $allowedRoles)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
