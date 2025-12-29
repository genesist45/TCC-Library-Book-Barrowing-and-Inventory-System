import { RefreshCw, Filter, Calendar, AlertTriangle, X } from 'lucide-react';

interface OverdueReportPageHeaderProps {
    isRefreshing: boolean;
    activeFilter: { dateFrom: string | null; dateTo: string | null };
    onRefresh: () => void;
    onOpenFilter: () => void;
    onClearFilter: () => void;
}

/**
 * Page header component for Overdue Reports
 * Includes title, refresh button, and date filter
 */
export function OverdueReportPageHeader({
    isRefreshing,
    activeFilter,
    onRefresh,
    onOpenFilter,
    onClearFilter,
}: OverdueReportPageHeaderProps) {
    const hasActiveFilter = activeFilter.dateFrom && activeFilter.dateTo;

    const formatDateRange = (from: string, to: string) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        return `${fromDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${toDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Overdue Reports
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Track late returns and manage overdue books
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Active filter badge */}
                    {hasActiveFilter && (
                        <div className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDateRange(activeFilter.dateFrom!, activeFilter.dateTo!)}</span>
                            <button
                                onClick={onClearFilter}
                                className="ml-1 rounded-full p-0.5 hover:bg-red-200 dark:hover:bg-red-800"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}

                    {/* Refresh button */}
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-[#333] dark:text-gray-200 dark:hover:bg-[#444]"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>

                    {/* Filter button */}
                    <button
                        onClick={onOpenFilter}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${hasActiveFilter
                            ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-[#333] dark:text-gray-200 dark:hover:bg-[#444]'
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>
                </div>
            </div>
        </div>
    );
}
