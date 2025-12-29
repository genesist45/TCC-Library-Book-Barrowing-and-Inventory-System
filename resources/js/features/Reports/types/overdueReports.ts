/**
 * Type definitions for Overdue Reports feature
 */

// Summary data for overdue statistics
export interface OverdueSummary {
    totalOverdueBooks: number;
    membersWithOverdue: number;
    avgDaysOverdue: number;
}

// Individual overdue book record
export interface OverdueBook {
    id: number;
    bookTitle: string;
    memberName: string;
    memberId: number | null;
    memberNo: string;
    category: string;
    dueDate: string;
    dueDateRaw: string;
    daysOverdue: number;
    fineAmount: number;
    fineFormatted: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

// Member with overdue books (grouped)
export interface MemberWithOverdue {
    memberId: number | null;
    memberName: string;
    memberNo: string;
    email: string;
    phone: string;
    overdueCount: number;
    totalDaysOverdue: number;
    totalFine: number;
    totalFineFormatted: string;
    severity: 'medium' | 'high' | 'critical';
}

// Overdue by category chart data
export interface OverdueByCategory {
    name: string;
    count: number;
    percentage: number;
}

// Page props from backend
export interface OverdueReportsProps {
    summary: OverdueSummary;
    overdueBooks: OverdueBook[];
    membersWithOverdue: MemberWithOverdue[];
    overdueByCategory: OverdueByCategory[];
}

// Chart colors for overdue reports (red/orange theme for urgency)
export const OVERDUE_CHART_COLORS = [
    '#EF4444', // red-500
    '#F97316', // orange-500
    '#F59E0B', // amber-500
    '#DC2626', // red-600
    '#EA580C', // orange-600
    '#D97706', // amber-600
    '#B91C1C', // red-700
    '#C2410C', // orange-700
    '#B45309', // amber-700
    '#991B1B', // red-800
];

// Severity colors for badges and highlights
export const SEVERITY_COLORS = {
    low: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800',
        row: 'bg-yellow-50/50 dark:bg-yellow-900/10',
    },
    medium: {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-800 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        row: 'bg-orange-50/50 dark:bg-orange-900/10',
    },
    high: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        row: 'bg-red-50/50 dark:bg-red-900/15',
    },
    critical: {
        bg: 'bg-red-200 dark:bg-red-900/50',
        text: 'text-red-900 dark:text-red-300',
        border: 'border-red-300 dark:border-red-700',
        row: 'bg-red-100/70 dark:bg-red-900/25',
    },
};
