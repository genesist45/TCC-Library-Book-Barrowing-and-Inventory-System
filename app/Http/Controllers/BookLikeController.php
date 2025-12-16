<?php

namespace App\Http\Controllers;

use App\Models\CatalogItem;
use App\Models\CatalogItemLike;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookLikeController extends Controller
{
    /**
     * Toggle like for a book.
     */
    public function toggle(Request $request, CatalogItem $catalogItem): JsonResponse
    {
        $sessionId = $request->session()->getId();

        // Check if already liked
        $existingLike = CatalogItemLike::where('catalog_item_id', $catalogItem->id)
            ->where('session_id', $sessionId)
            ->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $catalogItem->decrement('likes_count');
            $liked = false;
        } else {
            // Like
            CatalogItemLike::create([
                'catalog_item_id' => $catalogItem->id,
                'session_id' => $sessionId,
                'ip_address' => $request->ip(),
            ]);
            $catalogItem->increment('likes_count');
            $liked = true;
        }

        return response()->json([
            'success' => true,
            'liked' => $liked,
            'likes_count' => $catalogItem->fresh()->likes_count,
        ]);
    }

    /**
     * Check if the current user has liked the book.
     */
    public function status(Request $request, CatalogItem $catalogItem): JsonResponse
    {
        $sessionId = $request->session()->getId();

        $liked = CatalogItemLike::where('catalog_item_id', $catalogItem->id)
            ->where('session_id', $sessionId)
            ->exists();

        return response()->json([
            'liked' => $liked,
            'likes_count' => $catalogItem->likes_count,
        ]);
    }
}
