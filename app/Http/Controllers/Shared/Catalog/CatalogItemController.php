<?php

namespace App\Http\Controllers\Shared\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCatalogItemRequest;
use App\Http\Requests\UpdateCatalogItemRequest;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\Author;
use App\Models\BookRequest;
use App\Models\Branch;
use App\Models\Location;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class CatalogItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render("features/CatalogItems/Pages/Index", [
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
            // Filter options for the header
            "authors" => Author::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "publishers" => Publisher::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "categories" => Category::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render("features/CatalogItems/Pages/Create", [
            "categories" => Category::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "publishers" => Publisher::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "authors" => Author::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "branches" => Branch::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name", "address", "description"]),
            "locations" => Location::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
        ]);
    }

    /**
     * Validate catalog item data before showing review page.
     * Uses the same validation rules as store but returns JSON.
     */
    public function validateForReview(
        StoreCatalogItemRequest $request,
    ): JsonResponse {
        // If we reach here, validation passed (Laravel auto-validates via FormRequest)
        return response()->json([
            "success" => true,
            "message" => "Validation passed",
        ]);
    }

    public function store(StoreCatalogItemRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile("cover_image")) {
            $data["cover_image"] = $request
                ->file("cover_image")
                ->store("catalog_covers", "public");
        }

        $authorIds = $data["author_ids"] ?? [];
        unset($data["author_ids"]);

        // Remove copies from validated data (they're handled separately)
        $copiesData = $request->input("copies", []);
        unset($data["copies"]);

        $catalogItem = CatalogItem::create($data);

        if (!empty($authorIds)) {
            $catalogItem->authors()->attach($authorIds);
        }

        // Create copies if provided
        if (!empty($copiesData)) {
            foreach ($copiesData as $index => $copyData) {
                CatalogItemCopy::create([
                    "catalog_item_id" => $catalogItem->id,
                    "accession_no" => !empty($copyData["accession_no"])
                        ? $copyData["accession_no"]
                        : CatalogItemCopy::generateAccessionNo(),
                    "copy_no" => $index + 1,
                    "branch" => $copyData["branch"] ?? null,
                    "location" => $copyData["location"] ?? null,
                    "status" => "Available",
                ]);
            }
        }

        return response()->json(
            [
                "success" => true,
                "message" => "Catalog item created successfully.",
                "catalogItem" => $catalogItem->load([
                    "authors",
                    "copies.reservedByMember",
                ]),
            ],
            201,
        );
    }

    public function show(CatalogItem $catalogItem): Response
    {
        // Get borrow history for this catalog item
        $borrowHistory = BookRequest::where("catalog_item_id", $catalogItem->id)
            ->whereIn("status", ["Approved", "Returned"])
            ->with(["member", "bookReturn", "catalogItemCopy", "catalogItem"])
            ->orderBy("created_at", "desc")
            ->get()
            ->map(function ($request) {
                // Get the actual return status from book_return if available
                $bookReturn = $request->bookReturn;
                $returnStatus = $bookReturn?->status ?? null;

                // Determine display status: use book_return status if available, else book_request status
                $displayStatus = $returnStatus ?? $request->status;

                return [
                    "id" => $request->id,
                    "member_id" => $request->member_id,
                    "member_name" =>
                        $request->member->name ?? $request->full_name,
                    "member_no" => $request->member->member_no ?? "N/A",
                    "member_type" => $request->member->type ?? "N/A",
                    "email" => $request->email,
                    "phone" => $request->phone,
                    "address" => $request->address,
                    "date_borrowed" => $request->created_at->toDateString(),
                    "due_date" => $request->return_date?->toDateString(),
                    "date_returned" => $bookReturn?->return_date,
                    "status" => $displayStatus,
                    "book_title" => $request->catalogItem?->title ?? null,
                    "accession_no" =>
                        $request->catalogItemCopy?->accession_no ?? null,
                    "copy_no" => $request->catalogItemCopy?->copy_no ?? null,
                    // Book return specific fields
                    "condition_on_return" => $bookReturn?->condition_on_return,
                    "penalty_amount" => $bookReturn?->penalty_amount,
                    "return_status" => $returnStatus,
                    "remarks" => $bookReturn?->remarks,
                ];
            });

        return Inertia::render("features/CatalogItems/Pages/Show", [
            "catalogItem" => $catalogItem->load([
                "category",
                "publisher",
                "authors",
                "copies.reservedByMember",
            ]),
            "borrowHistory" => $borrowHistory,
        ]);
    }

    public function edit(CatalogItem $catalogItem): Response
    {
        // Get borrow history for this catalog item
        $borrowHistory = BookRequest::where("catalog_item_id", $catalogItem->id)
            ->whereIn("status", ["Approved", "Returned"])
            ->with(["member", "bookReturn", "catalogItemCopy", "catalogItem"])
            ->orderBy("created_at", "desc")
            ->get()
            ->map(function ($request) {
                // Get the actual return status from book_return if available
                $bookReturn = $request->bookReturn;
                $returnStatus = $bookReturn?->status ?? null;

                // Determine display status: use book_return status if available, else book_request status
                $displayStatus = $returnStatus ?? $request->status;

                return [
                    "id" => $request->id,
                    "member_id" => $request->member_id,
                    "member_name" =>
                        $request->member->name ?? $request->full_name,
                    "member_no" => $request->member->member_no ?? "N/A",
                    "member_type" => $request->member->type ?? "N/A",
                    "email" => $request->email,
                    "phone" => $request->phone,
                    "address" => $request->address,
                    "date_borrowed" => $request->created_at->toDateString(),
                    "due_date" => $request->return_date?->toDateString(),
                    "date_returned" => $bookReturn?->return_date,
                    "status" => $displayStatus,
                    "book_title" => $request->catalogItem?->title ?? null,
                    "accession_no" =>
                        $request->catalogItemCopy?->accession_no ?? null,
                    "copy_no" => $request->catalogItemCopy?->copy_no ?? null,
                    // Book return specific fields
                    "condition_on_return" => $bookReturn?->condition_on_return,
                    "penalty_amount" => $bookReturn?->penalty_amount,
                    "return_status" => $returnStatus,
                    "remarks" => $bookReturn?->remarks,
                ];
            });

        return Inertia::render("features/CatalogItems/Pages/Edit", [
            "catalogItem" => $catalogItem->load([
                "authors",
                "copies.reservedByMember",
            ]),
            "categories" => Category::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "publishers" => Publisher::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "authors" => Author::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name"]),
            "branches" => Branch::where("is_published", true)
                ->orderBy("name")
                ->get(["id", "name", "address", "description"]),
            "locations" => Location::where("is_published", true)
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
