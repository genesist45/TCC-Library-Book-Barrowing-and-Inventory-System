import { useState, useCallback, useEffect, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import type { DateRangeType, DateFilterState } from '../types/catalogReports';

/**
 * Helper to format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Helper to calculate date range based on filter type
 */
function calculateDateRange(filterType: DateRangeType, customFrom?: string, customTo?: string): {
    dateFrom: string | null;
    dateTo: string | null;
    label: string | null;
} {
    const today = new Date();

    switch (filterType) {
        case 'last30': {
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - 30);
            return {
                dateFrom: formatDate(fromDate),
                dateTo: formatDate(today),
                label: 'Last 30 Days',
            };
        }
        case 'last90': {
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - 90);
            return {
                dateFrom: formatDate(fromDate),
                dateTo: formatDate(today),
                label: 'Last 90 Days',
            };
        }
        case 'thisYear': {
            const year = today.getFullYear();
            return {
                dateFrom: `${year}-01-01`,
                dateTo: formatDate(today),
                label: `This Year (${year})`,
            };
        }
        case 'custom': {
            if (customFrom && customTo) {
                return {
                    dateFrom: customFrom,
                    dateTo: customTo,
                    label: `${customFrom} to ${customTo}`,
                };
            }
            return { dateFrom: null, dateTo: null, label: null };
        }
        default:
            return { dateFrom: null, dateTo: null, label: null };
    }
}

/**
 * Determine filter type from URL params
 */
function determineFilterTypeFromParams(dateFrom: string | null, dateTo: string | null): {
    filterType: DateRangeType;
    label: string | null;
} {
    if (!dateFrom || !dateTo) {
        return { filterType: 'all', label: null };
    }

    const today = new Date();
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    // Check if it's Last 30 Days
    const last30From = new Date();
    last30From.setDate(last30From.getDate() - 30);
    if (formatDate(fromDate) === formatDate(last30From) && formatDate(toDate) === formatDate(today)) {
        return { filterType: 'last30', label: 'Last 30 Days' };
    }

    // Check if it's Last 90 Days
    const last90From = new Date();
    last90From.setDate(last90From.getDate() - 90);
    if (formatDate(fromDate) === formatDate(last90From) && formatDate(toDate) === formatDate(today)) {
        return { filterType: 'last90', label: 'Last 90 Days' };
    }

    // Check if it's This Year
    const year = today.getFullYear();
    if (dateFrom === `${year}-01-01` && formatDate(toDate) === formatDate(today)) {
        return { filterType: 'thisYear', label: `This Year (${year})` };
    }

    // Otherwise it's a Custom Range
    return { filterType: 'custom', label: `${dateFrom} to ${dateTo}` };
}

/**
 * Custom hook for managing circulation reports filter state and actions
 * Supports URL persistence for filter state
 */
export function useCirculationReportsFilter() {
    const { url } = usePage();

    // Parse URL params on mount
    const urlParams = useMemo(() => {
        const params = new URLSearchParams(url.split('?')[1] || '');
        return {
            dateFrom: params.get('date_from'),
            dateTo: params.get('date_to'),
        };
    }, [url]);

    // Initialize filter state from URL params
    const initialFilterState = useMemo((): DateFilterState => {
        const { filterType, label } = determineFilterTypeFromParams(
            urlParams.dateFrom,
            urlParams.dateTo
        );

        return {
            selectedDateRange: filterType,
            customFromDate: filterType === 'custom' ? (urlParams.dateFrom || '') : '',
            customToDate: filterType === 'custom' ? (urlParams.dateTo || '') : '',
            activeFilter: label,
        };
    }, [urlParams.dateFrom, urlParams.dateTo]);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterState, setFilterState] = useState<DateFilterState>(initialFilterState);

    // Update filter state when URL params change (e.g., from browser back/forward)
    useEffect(() => {
        const { filterType, label } = determineFilterTypeFromParams(
            urlParams.dateFrom,
            urlParams.dateTo
        );

        setFilterState({
            selectedDateRange: filterType,
            customFromDate: filterType === 'custom' ? (urlParams.dateFrom || '') : '',
            customToDate: filterType === 'custom' ? (urlParams.dateTo || '') : '',
            activeFilter: label,
        });
    }, [urlParams.dateFrom, urlParams.dateTo]);

    // Handle refresh - preserves current filters
    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        router.reload({
            only: ['summary', 'mostBorrowedBooks', 'activeLoansData', 'borrowingTrends', 'returnRateStats', 'popularCategories'],
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    }, []);

    // Handle filter apply
    const handleApplyFilter = useCallback(() => {
        const { dateFrom, dateTo, label } = calculateDateRange(
            filterState.selectedDateRange,
            filterState.customFromDate,
            filterState.customToDate
        );

        // Validate custom date range
        if (filterState.selectedDateRange === 'custom') {
            if (!filterState.customFromDate || !filterState.customToDate) {
                alert('Please select both start and end dates');
                return;
            }
            if (new Date(filterState.customFromDate) > new Date(filterState.customToDate)) {
                alert('Start date must be before end date');
                return;
            }
        }

        setFilterState(prev => ({ ...prev, activeFilter: label }));
        setShowFilterModal(false);

        // Build query params
        const params: Record<string, string> = {};
        if (dateFrom && dateTo) {
            params.date_from = dateFrom;
            params.date_to = dateTo;
        }

        router.get(
            route('admin.reports.circulation'),
            params,
            {
                preserveScroll: true,
                preserveState: false,
            }
        );
    }, [filterState.selectedDateRange, filterState.customFromDate, filterState.customToDate]);

    // Handle clear filter
    const handleClearFilter = useCallback(() => {
        setFilterState({
            selectedDateRange: 'all',
            customFromDate: '',
            customToDate: '',
            activeFilter: null,
        });
        setShowFilterModal(false);

        router.get(
            route('admin.reports.circulation'),
            {},
            {
                preserveScroll: true,
                preserveState: false,
            }
        );
    }, []);

    // Update date range
    const setSelectedDateRange = useCallback((range: DateRangeType) => {
        setFilterState(prev => ({ ...prev, selectedDateRange: range }));
    }, []);

    // Update custom dates
    const setCustomFromDate = useCallback((date: string) => {
        setFilterState(prev => ({ ...prev, customFromDate: date }));
    }, []);

    const setCustomToDate = useCallback((date: string) => {
        setFilterState(prev => ({ ...prev, customToDate: date }));
    }, []);

    return {
        // State
        isRefreshing,
        showFilterModal,
        filterState,

        // Actions
        handleRefresh,
        handleApplyFilter,
        handleClearFilter,
        setShowFilterModal,
        setSelectedDateRange,
        setCustomFromDate,
        setCustomToDate,
    };
}
