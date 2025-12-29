import { Calendar, X } from 'lucide-react';
import type { DateRangeType } from '../../types/catalogReports.d';

interface DateFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDateRange: DateRangeType;
    customFromDate: string;
    customToDate: string;
    onDateRangeChange: (range: DateRangeType) => void;
    onCustomFromDateChange: (date: string) => void;
    onCustomToDateChange: (date: string) => void;
    onApply: () => void;
    onClear: () => void;
}

/**
 * Modal component for date range filtering
 */
export function DateFilterModal({
    isOpen,
    onClose,
    selectedDateRange,
    customFromDate,
    customToDate,
    onDateRangeChange,
    onCustomFromDateChange,
    onCustomToDateChange,
    onApply,
    onClear,
}: DateFilterModalProps) {
    if (!isOpen) return null;

    const dateRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'last30', label: 'Last 30 Days' },
        { value: 'last90', label: 'Last 90 Days' },
        { value: 'thisYear', label: 'This Year' },
        { value: 'custom', label: 'Custom Range' },
    ] as const;

    const isApplyDisabled = selectedDateRange === 'custom' && (!customFromDate || !customToDate);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-[#2a2a2a]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Filter Catalog Data
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Calendar className="h-4 w-4" />
                        Show books added:
                    </p>

                    {dateRangeOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="dateRange"
                                value={option.value}
                                checked={selectedDateRange === option.value}
                                onChange={(e) => onDateRangeChange(e.target.value as DateRangeType)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {option.label}
                            </span>
                        </label>
                    ))}

                    {selectedDateRange === 'custom' && (
                        <div className="ml-7 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    From:
                                </label>
                                <input
                                    type="date"
                                    value={customFromDate}
                                    onChange={(e) => onCustomFromDateChange(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    To:
                                </label>
                                <input
                                    type="date"
                                    value={customToDate}
                                    onChange={(e) => onCustomToDateChange(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClear}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                        Clear Filter
                    </button>
                    <button
                        onClick={onApply}
                        disabled={isApplyDisabled}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Apply Filter
                    </button>
                </div>
            </div>
        </div>
    );
}
