<?php

namespace App\Http\Controllers\Shared\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePublisherRequest;
use App\Http\Requests\UpdatePublisherRequest;
use App\Models\Publisher;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class PublisherController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('features/Publishers/Pages/Index', [
            'publishers' => Publisher::withCount('catalogItems')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    public function store(StorePublisherRequest $request): RedirectResponse|JsonResponse
    {
        $publisher = Publisher::create($request->validated());

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Publisher created successfully.',
                'publisher' => $publisher
            ]);
        }

        return redirect()
            ->route('admin.publishers.index')
            ->with('success', 'Publisher created successfully.');
    }

    public function show(Publisher $publisher): JsonResponse
    {
        return response()->json([
            'publisher' => $publisher->loadCount('catalogItems')
        ]);
    }

    public function update(UpdatePublisherRequest $request, Publisher $publisher): RedirectResponse
    {
        $publisher->update($request->validated());

        return redirect()
            ->route('admin.publishers.index')
            ->with('success', 'Publisher updated successfully.');
    }

    public function destroy(Publisher $publisher): RedirectResponse
    {
        $publisher->delete();

        return redirect()
            ->route('admin.publishers.index')
            ->with('success', 'Publisher deleted successfully.');
    }
}
