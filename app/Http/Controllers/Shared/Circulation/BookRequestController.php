<?php

namespace App\Http\Controllers\Shared\Circulation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Circulation\StoreApprovedBookRequestRequest;
use App\Http\Requests\Circulation\UpdateBookRequestRequest;
use App\Models\CatalogItem;
use App\Services\Circulation\BookRequestService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * Controller for Book Requests
 * Keeps methods thin - delegates to BookRequestService for business logic
 */
class BookRequestController extends Controller
{
    public function __construct(
        private BookRequestService $bookRequestService
    ) {}

    /**
     * Display a listing of book requests
     */
    public function index(): Response
    {
        return inertia('features/Circulations/Pages/Index', [
            'bookRequests' => $this->bookRequestService->getAllBookRequests(),
            'catalogItems' => $this->bookRequestService->getCatalogItemsForBorrowing(),
        ]);
    }

    /**
     * Display the specified resource
     */
    public function show(int $id): Response
    {
        return inertia('features/Circulations/Pages/Show', [
            'bookRequest' => $this->bookRequestService->getBookRequest($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource
     */
    public function edit(int $id): Response
    {
        return inertia('features/Circulations/Pages/Edit', [
            'bookRequest' => $this->bookRequestService->getBookRequest($id),
        ]);
    }

    /**
     * Update the specified resource in storage
     */
    public function update(UpdateBookRequestRequest $request, int $id): RedirectResponse
    {
        try {
            $this->bookRequestService->update($id, $request->validated());

            return redirect()
                ->route('admin.book-requests.index')
                ->with('success', 'Book request updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->bookRequestService->delete($id);

        return redirect()
            ->back()
            ->with('success', 'Book request deleted successfully.');
    }

    /**
     * Approve a book request
     */
    public function approve(int $id): RedirectResponse
    {
        try {
            $this->bookRequestService->approve($id);

            return back()->with('success', 'Book request approved and reminder scheduled.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Disapprove a book request
     */
    public function disapprove(int $id): RedirectResponse
    {
        try {
            $this->bookRequestService->disapprove($id);

            return back()->with('success', 'Book request disapproved.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Store a new book request with auto-approval (for admin/staff use)
     */
    public function storeApproved(StoreApprovedBookRequestRequest $request): RedirectResponse
    {
        try {
            $this->bookRequestService->storeApproved($request->validated());

            return back()->with('success', 'Borrow record created and approved successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the borrow catalog page
     */
    public function borrowCatalog(): Response
    {
        return inertia('features/Circulations/Pages/BorrowCatalog', 
            $this->bookRequestService->getBorrowCatalogData()
        );
    }

    /**
     * Display the available copies page for a catalog item
     */
    public function availableCopies(CatalogItem $catalogItem): Response
    {
        return inertia('features/Circulations/Pages/AvailableCopiesPage', [
            'catalogItem' => $this->bookRequestService->getCatalogItemWithCopies($catalogItem),
        ]);
    }
}
