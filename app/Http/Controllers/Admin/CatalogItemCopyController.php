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
}
