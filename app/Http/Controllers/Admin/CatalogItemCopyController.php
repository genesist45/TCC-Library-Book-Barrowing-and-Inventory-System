<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CatalogItemCopyController extends Controller
{
    public function store(Request $request, CatalogItem $catalogItem)
    {
        $validator = Validator::make($request->all(), [
            'accession_no' => [
                'required',
                'string',
                'size:7',
                'unique:catalog_item_copies,accession_no',
                'unique:catalog_items,accession_no',
            ],
            'location' => 'nullable|in:Filipianna,Circulation,Theses,Fiction,Reserve',
            'status' => 'required|in:Available,Borrowed,Reserved,Lost,Under Repair',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $copyNo = CatalogItemCopy::getNextCopyNo($catalogItem->id);

        $copy = CatalogItemCopy::create([
            'catalog_item_id' => $catalogItem->id,
            'accession_no' => $request->accession_no,
            'copy_no' => $copyNo,
            'location' => $request->location,
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Copy created successfully',
            'copy' => $copy->load('catalogItem'),
        ]);
    }

    public function storeBulk(Request $request, CatalogItem $catalogItem)
    {
        $validator = Validator::make($request->all(), [
            'number_of_copies' => 'required|integer|min:2|max:50',
            'location' => 'nullable|in:Filipianna,Circulation,Theses,Fiction,Reserve',
            'status' => 'required|in:Available,Borrowed,Reserved,Lost,Under Repair',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $numberOfCopies = $request->number_of_copies;
        $createdCopies = [];

        for ($i = 0; $i < $numberOfCopies; $i++) {
            $accessionNo = CatalogItemCopy::generateAccessionNo();
            $copyNo = CatalogItemCopy::getNextCopyNo($catalogItem->id);

            $copy = CatalogItemCopy::create([
                'catalog_item_id' => $catalogItem->id,
                'accession_no' => $accessionNo,
                'copy_no' => $copyNo,
                'location' => $request->location,
                'status' => $request->status,
            ]);

            $createdCopies[] = $copy;
        }

        return response()->json([
            'success' => true,
            'message' => "Successfully created {$numberOfCopies} copies",
            'copies' => $createdCopies,
        ]);
    }

    public function generateAccessionNo()
    {
        return response()->json([
            'accession_no' => CatalogItemCopy::generateAccessionNo(),
        ]);
    }

    public function validateAccessionNo(Request $request)
    {
        $exists = CatalogItemCopy::where('accession_no', $request->accession_no)->exists() ||
                  CatalogItem::where('accession_no', $request->accession_no)->exists();

        return response()->json([
            'valid' => !$exists,
            'message' => $exists ? 'This accession number is already in use' : 'Accession number is available',
        ]);
    }

    public function update(Request $request, CatalogItemCopy $copy)
    {
        $validator = Validator::make($request->all(), [
            'accession_no' => [
                'required',
                'string',
                'size:7',
                'unique:catalog_item_copies,accession_no,' . $copy->id,
                'unique:catalog_items,accession_no',
            ],
            'location' => 'nullable|in:Filipianna,Circulation,Theses,Fiction,Reserve',
            'status' => 'required|in:Available,Borrowed,Reserved,Lost,Under Repair',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $copy->update($request->only(['accession_no', 'location', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Copy updated successfully',
            'copy' => $copy->load('catalogItem'),
        ]);
    }

    public function destroy(CatalogItemCopy $copy)
    {
        $copy->delete();

        return response()->json([
            'success' => true,
            'message' => 'Copy deleted successfully',
        ]);
    }

    /**
     * Get borrow history for a specific copy.
     */
    public function borrowHistory(CatalogItemCopy $copy)
    {
        // Get borrow history for this specific copy only
        $borrowHistory = \App\Models\BookRequest::where('catalog_item_copy_id', $copy->id)
            ->whereIn('status', ['Approved', 'Returned'])
            ->with(['member', 'bookReturn'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) use ($copy) {
                return [
                    'id' => $request->id,
                    'member_id' => $request->member_id,
                    'member_name' => $request->member->name ?? $request->full_name,
                    'member_no' => $request->member->member_no ?? 'N/A',
                    'member_type' => $request->member->type ?? 'N/A',
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'date_borrowed' => $request->created_at->toDateString(),
                    'due_date' => $request->return_date?->toDateString(),
                    'date_returned' => $request->bookReturn?->return_date?->toDateString(),
                    'status' => $request->status,
                ];
            });

        return response()->json([
            'success' => true,
            'copy' => $copy,
            'records' => $borrowHistory,
        ]);
    }
}
