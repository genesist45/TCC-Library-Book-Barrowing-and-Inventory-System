<?php

namespace App\Services\Reports;

use App\Models\BookRequest;
use App\Models\Category;
use Carbon\Carbon;

/**
 * Service for generating Overdue Reports data
 * Handles all business logic for late return statistics
 */
class OverdueReportService
{
    private const FINE_RATE_PER_DAY = 0.50;

    /**
     * Generate all overdue report data
     */
    public function generateReportData(?string $dateFrom, ?string $dateTo): array
    {
        $overdueBooks = $this->getOverdueBooks($dateFrom, $dateTo);
        
        return [
            'summary' => $this->getSummary($overdueBooks),
            'overdueBooks' => $overdueBooks,
            'membersWithOverdue' => $this->getMembersWithOverdue($dateFrom, $dateTo),
            'overdueByCategory' => $this->getOverdueByCategory($overdueBooks),
        ];
    }

    /**
     * Get summary statistics
     */
    private function getSummary(array $overdueBooks): array
    {
        $totalOverdue = count($overdueBooks);
        
        $uniqueMembers = collect($overdueBooks)
            ->pluck('memberId')
            ->unique()
            ->count();

        $totalDaysOverdue = collect($overdueBooks)->sum('daysOverdue');
        $avgDaysOverdue = $totalOverdue > 0 
            ? round($totalDaysOverdue / $totalOverdue, 1) 
            : 0;

        return [
            'totalOverdueBooks' => $totalOverdue,
            'membersWithOverdue' => $uniqueMembers,
            'avgDaysOverdue' => $avgDaysOverdue,
        ];
    }

    /**
     * Get all overdue books with details
     */
    private function getOverdueBooks(?string $dateFrom, ?string $dateTo): array
    {
        $today = Carbon::today();

        $query = BookRequest::where('status', 'Approved')
            ->whereDoesntHave('bookReturn')
            ->where('return_date', '<', $today)
            ->with(['member', 'catalogItem.category']);

        // Filter by when the book became overdue (due date range)
        if ($dateFrom && $dateTo) {
            $query->whereDate('return_date', '>=', $dateFrom)
                  ->whereDate('return_date', '<=', $dateTo);
        }

        return $query->orderByRaw('DATEDIFF(NOW(), return_date) DESC')
            ->get()
            ->map(function ($request) use ($today) {
                $dueDate = Carbon::parse($request->return_date);
                $daysOverdue = $today->diffInDays($dueDate);
                $fineAmount = $daysOverdue * self::FINE_RATE_PER_DAY;

                return [
                    'id' => $request->id,
                    'bookTitle' => $request->catalogItem?->title ?? 'Unknown',
                    'memberName' => $request->member?->name ?? $request->full_name ?? 'Unknown',
                    'memberId' => $request->member_id,
                    'memberNo' => $request->member?->member_no ?? 'N/A',
                    'category' => $request->catalogItem?->category?->name ?? 'Uncategorized',
                    'dueDate' => $dueDate->format('M d, Y'),
                    'dueDateRaw' => $dueDate->format('Y-m-d'),
                    'daysOverdue' => $daysOverdue,
                    'fineAmount' => round($fineAmount, 2),
                    'fineFormatted' => '$' . number_format($fineAmount, 2),
                    'severity' => $this->getSeverityLevel($daysOverdue),
                ];
            })
            ->toArray();
    }

    /**
     * Determine severity level based on days overdue
     */
    private function getSeverityLevel(int $daysOverdue): string
    {
        if ($daysOverdue >= 14) return 'critical';
        if ($daysOverdue >= 7) return 'high';
        if ($daysOverdue >= 3) return 'medium';
        return 'low';
    }

    /**
     * Get members with overdue books (grouped)
     */
    private function getMembersWithOverdue(?string $dateFrom, ?string $dateTo): array
    {
        $today = Carbon::today();

        $query = BookRequest::where('status', 'Approved')
            ->whereDoesntHave('bookReturn')
            ->where('return_date', '<', $today)
            ->with(['member']);

        if ($dateFrom && $dateTo) {
            $query->whereDate('return_date', '>=', $dateFrom)
                  ->whereDate('return_date', '<=', $dateTo);
        }

        $overdueRequests = $query->get();

        return $overdueRequests
            ->groupBy('member_id')
            ->map(function ($requests, $memberId) use ($today) {
                $member = $requests->first()->member;
                $overdueCount = $requests->count();
                
                $totalDaysOverdue = $requests->sum(function ($request) use ($today) {
                    return $today->diffInDays(Carbon::parse($request->return_date));
                });

                $totalFine = $totalDaysOverdue * self::FINE_RATE_PER_DAY;

                return [
                    'memberId' => $memberId,
                    'memberName' => $member?->name ?? $requests->first()->full_name ?? 'Unknown',
                    'memberNo' => $member?->member_no ?? 'N/A',
                    'email' => $member?->email ?? $requests->first()->email ?? 'N/A',
                    'phone' => $member?->phone ?? $requests->first()->phone ?? 'N/A',
                    'overdueCount' => $overdueCount,
                    'totalDaysOverdue' => $totalDaysOverdue,
                    'totalFine' => round($totalFine, 2),
                    'totalFineFormatted' => '$' . number_format($totalFine, 2),
                    'severity' => $this->getMemberSeverity($overdueCount),
                ];
            })
            ->sortByDesc('totalDaysOverdue')
            ->values()
            ->toArray();
    }

    /**
     * Determine member severity based on overdue count
     */
    private function getMemberSeverity(int $overdueCount): string
    {
        if ($overdueCount >= 4) return 'critical';
        if ($overdueCount >= 2) return 'high';
        return 'medium';
    }

    /**
     * Get overdue books grouped by category
     */
    private function getOverdueByCategory(array $overdueBooks): array
    {
        $totalOverdue = count($overdueBooks);
        
        if ($totalOverdue === 0) {
            return [];
        }

        return collect($overdueBooks)
            ->groupBy('category')
            ->map(function ($books, $category) use ($totalOverdue) {
                $count = $books->count();
                return [
                    'name' => $category,
                    'count' => $count,
                    'percentage' => round(($count / $totalOverdue) * 100, 1),
                ];
            })
            ->sortByDesc('count')
            ->values()
            ->take(10)
            ->toArray();
    }
}
