/**
 * Type definitions for Circulation Reports feature
 */

export interface CirculationSummary {
    totalTransactions: number;
    activeLoans: number;
    returnedBooks: number;
    avgLoanDuration: number;
}

export interface MostBorrowedBook {
    rank: number;
    id: number;
    title: string;
    category: string;
    borrowCount: number;
    lastBorrowed: string;
}

export interface ActiveLoan {
    id: number;
    memberName: string;
    bookTitle: string;
    borrowDate: string;
    dueDate: string;
    daysRemaining: number | null;
    status: 'On Time' | 'Due Soon' | 'Overdue';
}

export interface BorrowingTrendItem {
    date: string;
    fullDate: string;
    count: number;
    [key: string]: string | number;
}

export interface ReturnRateStats {
    onTimeReturns: {
        count: number;
        percentage: number;
    };
    lateReturns: {
        count: number;
        percentage: number;
    };
    overallReturnRate: {
        returned: number;
        total: number;
        percentage: number;
    };
    stillBorrowed: number;
}

export interface PopularCategory {
    name: string;
    count: number;
    percentage: number;
    [key: string]: string | number;
}

export interface CirculationReportsProps {
    summary: CirculationSummary;
    mostBorrowedBooks: MostBorrowedBook[];
    activeLoansData: ActiveLoan[];
    borrowingTrends: BorrowingTrendItem[];
    returnRateStats: ReturnRateStats;
    popularCategories: PopularCategory[];
}

// Reuse date filter types from catalog reports
export type { DateRangeType, DateFilterState } from './catalogReports';

// Chart colors for circulation reports
export const CIRCULATION_CHART_COLORS = [
    "#3B82F6", // blue-500
    "#10B981", // emerald-500
    "#F59E0B", // amber-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#06B6D4", // cyan-500
    "#EF4444", // red-500
    "#84CC16", // lime-500
    "#F97316", // orange-500
    "#6366F1", // indigo-500
] as const;

// Status badge colors
export const STATUS_COLORS = {
    'On Time': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-400' },
    'Due Soon': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-400' },
    'Overdue': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400' },
} as const;
