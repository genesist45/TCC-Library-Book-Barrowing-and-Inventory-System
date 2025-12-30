<?php

namespace App\Http\Controllers\Shared\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Display a listing of branches.
     */
    public function index()
    {
        $branches = Branch::where('is_published', true)
            ->orderBy('name')
            ->get();

        return response()->json(['branches' => $branches]);
    }

    /**
     * Store a newly created branch.
     */
    public function store(StoreBranchRequest $request)
    {
        $branch = Branch::create([
            'name' => $request->name,
            'address' => $request->address,
            'description' => $request->description,
            'is_published' => true,
        ]);

        // Return JSON for AJAX quick-add functionality
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'branch' => $branch,
                'message' => 'Branch created successfully.',
            ]);
        }

        return redirect()->back()->with('success', 'Branch created successfully.');
    }

    /**
     * Display the specified branch.
     */
    public function show(Branch $branch)
    {
        return response()->json(['branch' => $branch]);
    }

    /**
     * Update the specified branch.
     */
    public function update(UpdateBranchRequest $request, Branch $branch)
    {
        $branch->update([
            'name' => $request->name,
            'address' => $request->address,
            'description' => $request->description,
        ]);

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'branch' => $branch,
                'message' => 'Branch updated successfully.',
            ]);
        }

        return redirect()->back()->with('success', 'Branch updated successfully.');
    }

    /**
     * Remove the specified branch.
     */
    public function destroy(Branch $branch)
    {
        $branch->delete();

        return response()->json([
            'success' => true,
            'message' => 'Branch deleted successfully.',
        ]);
    }
}
