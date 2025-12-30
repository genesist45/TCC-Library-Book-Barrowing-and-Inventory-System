<?php

namespace App\Http\Controllers\Shared\Catalog;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CatalogItemCopyController extends Controller
{
    public function store(Request $request, CatalogItem $catalogItem)
    {
        // Convert empty strings to null
        $data = $request->all();
        if (empty($data['location'])) {
            $data['location'] = null;
        }
        if (empty($data['branch'])) {
            $data['branch'] = null;
        }

        $rules = [
            'accession_no' => [
                'required',
                'string',
                'size:7',
                'unique:catalog_item_copies,accession_no',
                'unique:catalog_items,accession_no',
            ],
            'branch' => 'nullable|string|max:255',
            'location' => 'nullable|string',
            'status' => 'required|in:Available,Borrowed,Reserved,Lost,Under Repair',
        ];

        // Only validate location exists if it's provided
        if (!empty($data['location'])) {
            $rules['location'] = 'nullable|string|exists:locations,name';
        }

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $copyNo = CatalogItemCopy::getNextCopyNo($catalogItem->id);

        $copy = CatalogItemCopy::create([
            'catalog_item_id' => $catalogItem->id,
            'accession_no' => $data['accession_no'],
            'copy_no' => $copyNo,
            'branch' => $data['branch'],
            'location' => $data['location'],
            'status' => $data['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Copy created successfully',
            'copy' => $copy->load('catalogItem'),
        ]);
    }

    public function storeBulk(Request $request, CatalogItem $catalogItem)
    {
        // Convert empty strings to null
        $data = $request->all();
        if (empty($data['location'])) {
            $data['location'] = null;
        }
        if (empty($data['branch'])) {
            $data['branch'] = null;
        }

        $rules = [
            'number_of_copies' => 'required|integer|min:2|max:50',
            'branch' => 'nullable|string|max:255',
            'location' => 'nullable|string',
            'status' => 'required|in:Available,Borrowed,Reserved,Lost,Under Repair',
        ];

        // Only validate location exists if it's provided
        if (!empty($data['location'])) {
            $rules['location'] = 'nullable|string|exists:locations,name';
        }

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $numberOfCopies = $data['number_of_copies'];
        $createdCopies = [];

        // Use database transaction to prevent race conditions
        \DB::beginTransaction();
        try {
            for ($i = 0; $i < $numberOfCopies; $i++) {
                $accessionNo = CatalogItemCopy::generateAccessionNo();
                $copyNo = CatalogItemCopy::getNextCopyNo($catalogItem->id);

                $copy = CatalogItemCopy::create([
                    'catalog_item_id' => $catalogItem->id,
                    'accession_no' => $accessionNo,
                    'copy_no' => $copyNo,
                    'branch' => $data['branch'],
                    'location' => $data['location'],
                    'status' => $data['status'],
                ]);

                $createdCopies[] = $copy;
            }
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'errors' => ['general' => 'Failed to create copies: ' . $e->getMessage()],
            ], 500);
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

    public function nextAccessionNo()
    {
        return response()->json([
            'next_accession_no' => CatalogItemCopy::generateAccessionNo(),
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
        // Convert empty strings to null
        $data = $request->all();
        if (empty($data['location'])) {
            $data['location'] = null;
        }
        if (empty($data['branch'])) {
            $data['branch'] = null;
        }

        $rules = [
            'accession_no' => [
                'required',
                'string',
                'size:7',
                'unique:catalog_item_copies,accession_no,' . $copy->id,
                'unique:catalog_items,accession_no',
            ],
            'branch' => 'nullable|string|max:255',
            'location' => 'nullable|string',
            'status' => 'required|in:Available,Borrowed,Reserved,Lost,Under Repair,Paid,Pending',
            'reserved_by_member_id' => 'nullable|exists:members,id',
        ];

        // Only validate location exists if it's provided
        if (!empty($data['location'])) {
            $rules['location'] = 'nullable|string|exists:locations,name';
        }

        // If status is Reserved, member is required
        if ($data['status'] === 'Reserved') {
            $rules['reserved_by_member_id'] = 'required|exists:members,id';
        }

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $updateData = [
            'accession_no' => $data['accession_no'],
            'branch' => $data['branch'],
            'location' => $data['location'],
            'status' => $data['status'],
        ];

        // Handle reservation fields
        if ($data['status'] === 'Reserved' && !empty($data['reserved_by_member_id'])) {
            $updateData['reserved_by_member_id'] = $data['reserved_by_member_id'];
            // Only set reserved_at if it's a new reservation
            if ($copy->status !== 'Reserved' || $copy->reserved_by_member_id !== $data['reserved_by_member_id']) {
                $updateData['reserved_at'] = now();
            }
        } else {
            // Clear reservation if status is not Reserved
            $updateData['reserved_by_member_id'] = null;
            $updateData['reserved_at'] = null;
        }

        $copy->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Copy updated successfully',
            'copy' => $copy->load(['catalogItem', 'reservedByMember']),
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
                // Get the actual return status from book_return if available
                $bookReturn = $request->bookReturn;
                $returnStatus = $bookReturn?->status ?? null;

                // Determine display status: use book_return status if available, else book_request status
                $displayStatus = $returnStatus ?? $request->status;

                return [
                    'id' => $request->id,
                    'type' => 'borrow',
                    'member_id' => $request->member_id,
                    'member_name' => $request->member->name ?? $request->full_name,
                    'member_no' => $request->member->member_no ?? 'N/A',
                    'member_type' => $request->member->type ?? 'N/A',
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'date_borrowed' => $request->created_at->toDateString(),
                    'due_date' => $request->return_date?->toDateString(),
                    'date_returned' => $bookReturn?->return_date,
                    'status' => $displayStatus,
                    // Book return specific fields
                    'condition_on_return' => $bookReturn?->condition_on_return,
                    'penalty_amount' => $bookReturn?->penalty_amount,
                    'return_status' => $returnStatus,
                    'remarks' => $bookReturn?->remarks,
                ];
            })->toArray();

        // Get current reservation if exists
        $reservationHistory = [];
        if ($copy->reserved_by_member_id && $copy->status === 'Reserved') {
            $copy->load('reservedByMember');
            $reservationHistory[] = [
                'id' => 'res-' . $copy->id,
                'type' => 'reservation',
                'member_id' => $copy->reserved_by_member_id,
                'member_name' => $copy->reservedByMember?->name ?? 'Unknown',
                'member_no' => $copy->reservedByMember?->member_no ?? 'N/A',
                'member_type' => $copy->reservedByMember?->type ?? 'N/A',
                'email' => $copy->reservedByMember?->email ?? '',
                'phone' => $copy->reservedByMember?->phone ?? null,
                'address' => $copy->reservedByMember?->address ?? null,
                'date_borrowed' => $copy->reserved_at?->toDateString(),
                'due_date' => null,
                'date_returned' => null,
                'status' => 'Reserved',
                'condition_on_return' => null,
                'penalty_amount' => null,
                'return_status' => null,
                'remarks' => null,
            ];
        }

        // Merge and sort by date (reservations first as they are current)
        $allRecords = array_merge($reservationHistory, $borrowHistory);

        return response()->json([
            'success' => true,
            'copy' => $copy->load('reservedByMember'),
            'records' => $allRecords,
        ]);
    }
}
