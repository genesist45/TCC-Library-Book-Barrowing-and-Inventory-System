import { RefreshCw, Calendar, X } from 'lucide-react';

interface CirculationReportPageHeaderProps {
    isRefreshing: boolean;
    activeFilter: string | null;
    onRefresh: () => void;
    onOpenFilter: () => void;
    onClearFilter: () => void;
}

/**
 * Page header component for Circulation Reports
 * Includes title, subtitle, refresh button, and filter button
 */
export function CirculationReportPageHeader({
    isRefreshing,
    activeFilter,
    onRefresh,
    onOpenFilter,
    onClearFilter,
}: CirculationReportPageHeaderProps) {
    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            {/* Mobile View */}
            <div className="sm:hidden">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            Circulation Reports
                        </h2>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            View borrowing transaction statistics
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-gray-700"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={onOpenFilter}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${activeFilter
                                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            title="Filter Data"
                        >
                            <Calendar className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                {activeFilter && (
                    <div className="mt-2 flex items-center gap-2">
                        <ActiveFilterBadge filter={activeFilter} onClear={onClearFilter} />
                    </div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-shrink-0">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            Circulation Reports
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                View borrowing transaction statistics and lending activity
                            </p>
                            {activeFilter && (
                                <ActiveFilterBadge filter={activeFilter} onClear={onClearFilter} showPrefix />
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={onOpenFilter}
                            className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${activeFilter
                                    ? 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Calendar className="h-4 w-4" />
                            Filter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Badge component to display active filter status
 */
function ActiveFilterBadge({
    filter,
    onClear,
    showPrefix = false
}: {
    filter: string;
    onClear: () => void;
    showPrefix?: boolean;
}) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Calendar className="h-3 w-3" />
            {showPrefix && 'Filtered: '}{filter}
            <button
                onClick={onClear}
                className="ml-1 hover:text-blue-600"
            >
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}
