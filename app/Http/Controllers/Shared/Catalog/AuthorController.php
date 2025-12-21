<?php

namespace App\Http\Controllers\Shared\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAuthorRequest;
use App\Http\Requests\UpdateAuthorRequest;
use App\Models\Author;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class AuthorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('features/Authors/Pages/Index', [
            'authors' => Author::withCount('catalogItems')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    public function store(StoreAuthorRequest $request): RedirectResponse|JsonResponse
    {
        $author = Author::create($request->validated());

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Author created successfully.',
                'author' => $author
            ]);
        }

        return redirect()
            ->route('admin.authors.index')
            ->with('success', 'Author created successfully.');
    }

    public function show(Author $author): JsonResponse
    {
        return response()->json([
            'author' => $author->loadCount('catalogItems')
        ]);
    }

    public function update(UpdateAuthorRequest $request, Author $author): RedirectResponse
    {
        $author->update($request->validated());

        return redirect()
            ->route('admin.authors.index')
            ->with('success', 'Author updated successfully.');
    }

    public function destroy(Author $author): RedirectResponse
    {
        $author->delete();

        return redirect()
            ->route('admin.authors.index')
            ->with('success', 'Author deleted successfully.');
    }
}
