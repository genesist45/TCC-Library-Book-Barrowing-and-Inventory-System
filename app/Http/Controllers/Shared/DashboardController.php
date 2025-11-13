<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the appropriate dashboard based on user role.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Render different dashboard views based on role
        if ($user->role === 'admin') {
            return Inertia::render('admin/Dashboard');
        }

        // Default to staff dashboard
        return Inertia::render('staff/Dashboard');
    }
}
