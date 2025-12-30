<?php

namespace App\Http\Controllers\Shared\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLocationRequest;
use App\Http\Requests\UpdateLocationRequest;
use App\Models\Location;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('features/Locations/Pages/Index', [
            'locations' => Location::withCount('catalogItems')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    /**
     * Return all locations as JSON for AJAX requests
     */
    public function list(): JsonResponse
    {
        $locations = Location::where('is_published', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'locations' => $locations
        ]);
    }

    public function store(StoreLocationRequest $request): RedirectResponse|JsonResponse
    {
        $location = Location::create($request->validated());

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Location created successfully.',
                'location' => $location
            ]);
        }

        return redirect()
            ->route('admin.locations.index')
            ->with('success', 'Location created successfully.');
    }

    public function show(Location $location): JsonResponse
    {
        return response()->json([
            'location' => $location->loadCount('catalogItems')
        ]);
    }

    public function update(UpdateLocationRequest $request, Location $location): RedirectResponse
    {
        $location->update($request->validated());

        return redirect()
            ->route('admin.locations.index')
            ->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location): RedirectResponse
    {
        $location->delete();

        return redirect()
            ->route('admin.locations.index')
            ->with('success', 'Location deleted successfully.');
    }
}
