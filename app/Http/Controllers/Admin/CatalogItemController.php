<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCatalogItemRequest;
use App\Http\Requests\UpdateCatalogItemRequest;
use App\Models\CatalogItem;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\Author;
use App\Models\BookRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class CatalogItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render("admin/CatalogItems", [
            "catalogItems" => CatalogItem::with([
                "category",
                "publisher",
                "authors",
            ])
                ->withCount("copies")
                ->withCount([
                    "copies as available_copies_count" => function ($query) {
                        $query->where("status", "Available");
                    },
                ])
                ->orderBy("created_at", "desc")
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render("admin/catalog-items/Add", [
            "categories" => Category::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "publishers" => Publisher::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "authors" => Author::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
        ]);
    }

    /**
     * Validate catalog item data before showing review page.
     * Uses the same validation rules as store but returns JSON.
     */
    public function validateForReview(StoreCatalogItemRequest $request): JsonResponse
    {
        // If we reach here, validation passed (Laravel auto-validates via FormRequest)
        return response()->json(['success' => true, 'message' => 'Validation passed']);
    }

    public function store(StoreCatalogItemRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile("cover_image")) {
            $data["cover_image"] = $request
                ->file("cover_image")
                ->store("catalog_covers", "public");
        }

        $authorIds = $data["author_ids"] ?? [];
        unset($data["author_ids"]);

        $catalogItem = CatalogItem::create($data);

        if (!empty($authorIds)) {
            $catalogItem->authors()->attach($authorIds);
        }

        return redirect()
            ->route("admin.catalog-items.index")
            ->with("success", "Catalog item created successfully.");
    }

    public function show(CatalogItem $catalogItem): Response
    {
        // Get borrow history for this catalog item
        $borrowHistory = BookRequest::where("catalog_item_id", $catalogItem->id)
            ->whereIn("status", ["Approved", "Returned"])
            ->with(["member", "bookReturn", "catalogItemCopy"])
            ->orderBy("created_at", "desc")
            ->get()
            ->map(function ($request) {
                return [
                    "id" => $request->id,
                    "member_id" => $request->member_id,
                    "member_name" =>
                        $request->member->name ?? $request->full_name,
                    "member_no" => $request->member->member_no ?? "N/A",
                    "member_type" => $request->member->type ?? "N/A",
                    "email" => $request->email,
                    "phone" => $request->phone,
                    "date_borrowed" => $request->created_at->toDateString(),
                    "due_date" => $request->return_date?->toDateString(),
                    "date_returned" => $request->bookReturn?->return_date?->toDateString(),
                    "status" => $request->status,
                    "accession_no" =>
                        $request->catalogItemCopy?->accession_no ?? null,
                    "copy_no" => $request->catalogItemCopy?->copy_no ?? null,
                ];
            });

        return Inertia::render("admin/catalog-items/View", [
            "catalogItem" => $catalogItem->load([
                "category",
                "publisher",
                "authors",
                "copies",
            ]),
            "borrowHistory" => $borrowHistory,
        ]);
    }

    public function edit(CatalogItem $catalogItem): Response
    {
        // Get borrow history for this catalog item
        $borrowHistory = BookRequest::where("catalog_item_id", $catalogItem->id)
            ->whereIn("status", ["Approved", "Returned"])
            ->with(["member", "bookReturn", "catalogItemCopy"])
            ->orderBy("created_at", "desc")
            ->get()
            ->map(function ($request) {
                return [
                    "id" => $request->id,
                    "member_id" => $request->member_id,
                    "member_name" =>
                        $request->member->name ?? $request->full_name,
                    "member_no" => $request->member->member_no ?? "N/A",
                    "member_type" => $request->member->type ?? "N/A",
                    "email" => $request->email,
                    "phone" => $request->phone,
                    "date_borrowed" => $request->created_at->toDateString(),
                    "due_date" => $request->return_date?->toDateString(),
                    "date_returned" => $request->bookReturn?->return_date?->toDateString(),
                    "status" => $request->status,
                    "accession_no" =>
                        $request->catalogItemCopy?->accession_no ?? null,
                    "copy_no" => $request->catalogItemCopy?->copy_no ?? null,
                ];
            });

        return Inertia::render("admin/catalog-items/Edit", [
            "catalogItem" => $catalogItem->load(["authors", "copies"]),
            "categories" => Category::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "publishers" => Publisher::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "authors" => Author::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "borrowHistory" => $borrowHistory,
        ]);
    }

    public function update(
        UpdateCatalogItemRequest $request,
        CatalogItem $catalogItem,
    ): RedirectResponse {
        $data = $request->validated();

        if ($request->hasFile("cover_image")) {
            if ($catalogItem->cover_image) {
                Storage::disk("public")->delete($catalogItem->cover_image);
            }
            $data["cover_image"] = $request
                ->file("cover_image")
                ->store("catalog_covers", "public");
        } else {
            unset($data["cover_image"]);
        }

        $authorIds = $data["author_ids"] ?? [];
        unset($data["author_ids"]);

        $catalogItem->update($data);

        if (isset($authorIds)) {
            $catalogItem->authors()->sync($authorIds);
        }

        return redirect()
            ->route("admin.catalog-items.index")
            ->with("success", "Catalog item updated successfully.");
    }

    public function destroy(CatalogItem $catalogItem): RedirectResponse
    {
        if ($catalogItem->cover_image) {
            Storage::disk("public")->delete($catalogItem->cover_image);
        }

        $catalogItem->delete();

        return redirect()
            ->route("admin.catalog-items.index")
            ->with("success", "Catalog item deleted successfully.");
    }
}
