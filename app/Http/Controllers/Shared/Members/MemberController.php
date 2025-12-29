<?php

namespace App\Http\Controllers\Shared\Members;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\BookRequest;
use App\Models\Member;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class MemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('features/Members/Pages/Index', [
            'members' => Member::orderBy('created_at', 'desc')->get()
        ]);
    }

    /**
     * Search members for AJAX autocomplete
     */
    public function search(\Illuminate\Http\Request $request)
    {
        $query = $request->input('query', '');

        $members = Member::query()
            ->where('status', 'Active')
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                    ->orWhere('member_no', 'LIKE', "%{$query}%");
            })
            ->limit(10)
            ->get(['id', 'member_no', 'name', 'type', 'borrower_category', 'status']);

        return response()->json($members);
    }

    /**
     * Find a member by member number (API endpoint)
     */
    public function findByMemberNo(string $memberNo)
    {
        $member = Member::where('member_no', $memberNo)->first();
        
        if (!$member) {
            return response()->json(['error' => 'Member not found'], 404);
        }
        
        return response()->json($member);
    }

    public function create(): Response
    {
        return Inertia::render('features/Members/Pages/Create');
    }

    public function store(StoreMemberRequest $request): RedirectResponse
    {
        Member::create($request->validated());

        return redirect()
            ->route('admin.members.index')
            ->with('success', 'Member created successfully.');
    }

    public function show(Member $member): Response
    {
        $borrowHistory = $this->getMemberBorrowHistory($member);

        return Inertia::render('features/Members/Pages/Show', [
            'member' => $member,
            'borrowHistory' => $borrowHistory,
        ]);
    }

    public function edit(Member $member): Response
    {
        $borrowHistory = $this->getMemberBorrowHistory($member);

        return Inertia::render('features/Members/Pages/Edit', [
            'member' => $member,
            'borrowHistory' => $borrowHistory,
        ]);
    }

    public function update(UpdateMemberRequest $request, Member $member): RedirectResponse
    {
        $member->update($request->validated());

        return redirect()
            ->route('admin.members.index')
            ->with('success', 'Member updated successfully.');
    }

    public function destroy(Member $member): RedirectResponse
    {
        $member->delete();

        return redirect()
            ->route('admin.members.index')
            ->with('success', 'Member deleted successfully.');
    }

    /**
     * Get borrow history for a specific member.
     */
    private function getMemberBorrowHistory(Member $member): array
    {
        return BookRequest::where('member_id', $member->id)
            ->with(['catalogItem', 'bookReturn'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) use ($member) {
                return [
                    'id' => $request->id,
                    'member_id' => $request->member_id,
                    'member_name' => $member->name,
                    'member_no' => $member->member_no,
                    'catalog_item_id' => $request->catalog_item_id,
                    'book_title' => $request->catalogItem->title ?? 'Unknown',
                    'accession_no' => $request->catalogItem->accession_no ?? '-',
                    'date_borrowed' => $request->created_at->toDateString(),
                    'due_date' => $request->return_date ? Carbon::parse($request->return_date)->toDateString() : '-',
                    'date_returned' => $request->bookReturn?->return_date ? Carbon::parse($request->bookReturn->return_date)->toDateString() : null,
                    'status' => $request->bookReturn ? $request->bookReturn->status : $request->status,
                    'penalty_amount' => $request->bookReturn?->penalty_amount ?? null,
                ];
            })
            ->toArray();
    }
}
