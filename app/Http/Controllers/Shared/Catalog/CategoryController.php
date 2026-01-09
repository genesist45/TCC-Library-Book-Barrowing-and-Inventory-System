<?php

namespace App\Http\Controllers\Shared\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('features/Categories/Pages/Index', [
            'categories' => Category::withCount('catalogItems')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse|JsonResponse
    {
        $category = Category::create($request->validated());

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Category created successfully.',
                'category' => $category
            ]);
        }

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Store multiple categories in storage.
     */
    public function storeBulk(): JsonResponse
    {
        $request = request();
        $validated = $request->validate([
            'count' => 'required|integer|min:1|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $categories = [];
        $count = $validated['count'];

        for ($i = 1; $i <= $count; $i++) {
            $name = $count > 1 ? "{$validated['name']} {$i}" : $validated['name'];
            $categories[] = Category::create([
                'name' => $name,
                'slug' => \Illuminate\Support\Str::slug($name),
                'description' => $validated['description'] ?? null,
                'is_published' => $validated['is_published'] ?? true,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "{$count} category(ies) created successfully.",
            'categories' => $categories
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'category' => $category->loadCount('catalogItems')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
