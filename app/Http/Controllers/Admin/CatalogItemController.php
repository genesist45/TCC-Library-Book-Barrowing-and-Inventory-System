<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCatalogItemRequest;
use App\Http\Requests\UpdateCatalogItemRequest;
use App\Models\CatalogItem;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\Author;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class CatalogItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/CatalogItems', [
            'catalogItems' => CatalogItem::with(['category', 'publisher', 'authors'])
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/catalog-items/Add', [
            'categories' => Category::where('is_published', true)->orderBy('name')->get(['id', 'name']),
            'publishers' => Publisher::where('is_published', true)->orderBy('name')->get(['id', 'name']),
            'authors' => Author::where('is_published', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreCatalogItemRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('catalog_covers', 'public');
        }

        $authorIds = $data['author_ids'] ?? [];
        unset($data['author_ids']);

        $catalogItem = CatalogItem::create($data);
        
        if (!empty($authorIds)) {
            $catalogItem->authors()->attach($authorIds);
        }

        return redirect()
            ->route('admin.catalog-items.index')
            ->with('success', 'Catalog item created successfully.');
    }

    public function show(CatalogItem $catalogItem): Response
    {
        return Inertia::render('admin/catalog-items/View', [
            'catalogItem' => $catalogItem->load(['category', 'publisher', 'authors'])
        ]);
    }

    public function edit(CatalogItem $catalogItem): Response
    {
        return Inertia::render('admin/catalog-items/Edit', [
            'catalogItem' => $catalogItem->load('authors'),
            'categories' => Category::where('is_published', true)->orderBy('name')->get(['id', 'name']),
            'publishers' => Publisher::where('is_published', true)->orderBy('name')->get(['id', 'name']),
            'authors' => Author::where('is_published', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateCatalogItemRequest $request, CatalogItem $catalogItem): RedirectResponse
    {
        $data = $request->validated();
        
        if ($request->hasFile('cover_image')) {
            if ($catalogItem->cover_image) {
                Storage::disk('public')->delete($catalogItem->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('catalog_covers', 'public');
        } else {
            unset($data['cover_image']);
        }

        $authorIds = $data['author_ids'] ?? [];
        unset($data['author_ids']);

        $catalogItem->update($data);
        
        if (isset($authorIds)) {
            $catalogItem->authors()->sync($authorIds);
        }

        return redirect()
            ->route('admin.catalog-items.index')
            ->with('success', 'Catalog item updated successfully.');
    }

    public function destroy(CatalogItem $catalogItem): RedirectResponse
    {
        if ($catalogItem->cover_image) {
            Storage::disk('public')->delete($catalogItem->cover_image);
        }

        $catalogItem->delete();

        return redirect()
            ->route('admin.catalog-items.index')
            ->with('success', 'Catalog item deleted successfully.');
    }

    public function bookCatalog(): Response
    {
        return Inertia::render('admin/BookCatalog', [
            'catalogItems' => CatalogItem::with(['category', 'publisher', 'authors'])
                ->where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }
}
