/**
 * Type definitions for Catalog Reports feature
 */

export interface BooksByType {
    [key: string]: number;
}

export interface ChartDataItem {
    name: string;
    count: number;
    percentage: number;
    [key: string]: string | number;
}

export interface LowStockBook {
    id: number;
    title: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
}

export interface AvailabilityItem {
    name: string;
    count: number;
    percentage: number;
    color: string;
    [key: string]: string | number;
}

export interface CatalogSummary {
    totalBooks: number;
    totalCopies: number;
    availableCopies: number;
    borrowedBooks: number;
    booksByType: BooksByType;
}

export interface CatalogReportsProps {
    summary: CatalogSummary;
    booksByCategory: ChartDataItem[];
    booksByPublisher: ChartDataItem[];
    lowStockBooks: LowStockBook[];
    availabilityBreakdown: AvailabilityItem[];
}

export type DateRangeType = 'all' | 'last30' | 'last90' | 'thisYear' | 'custom';

export interface DateFilterState {
    selectedDateRange: DateRangeType;
    customFromDate: string;
    customToDate: string;
    activeFilter: string | null;
}

// Color constants for charts
export const CHART_COLORS = [
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
