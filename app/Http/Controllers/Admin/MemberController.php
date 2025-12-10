<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\Member;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class MemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Members', [
            'members' => Member::orderBy('created_at', 'desc')->get()
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/members/Add');
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
        return Inertia::render('admin/members/View', [
            'member' => $member
        ]);
    }

    public function edit(Member $member): Response
    {
        return Inertia::render('admin/members/Edit', [
            'member' => $member
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
}
