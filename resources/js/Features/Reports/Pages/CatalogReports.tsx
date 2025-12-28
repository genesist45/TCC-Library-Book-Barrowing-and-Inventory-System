/**
 * Catalog Reports Page
 * 
 * Displays comprehensive library inventory statistics including:
 * - Summary cards (total books, available copies, borrowed, types)
 * - Books by Category pie chart
 * - Books by Publisher bar chart
 * - Low Stock Alert table
 * - Availability Status Breakdown chart
 * 
 * Features refresh and date filter capabilities.
 */
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Components
import {
    CatalogReportPageHeader,
    DateFilterModal,
    SummaryCards,
    CategoryPieChart,
    PublisherBarChart,
    LowStockAlertTable,
    AvailabilityBreakdownChart,
} from '../Components';

// Hooks
import { useCatalogReportsFilter } from '../Hooks/useCatalogReportsFilter';

// Types
import type { CatalogReportsProps } from '../types/catalogReports.d';

export default function CatalogReports({
    summary,
    booksByCategory,
    booksByPublisher,
    lowStockBooks,
    availabilityBreakdown,
}: CatalogReportsProps) {
    // Filter and refresh state management
    const {
        isRefreshing,
        showFilterModal,
        filterState,
        handleRefresh,
        handleApplyFilter,
        handleClearFilter,
        setShowFilterModal,
        setSelectedDateRange,
        setCustomFromDate,
        setCustomToDate,
    } = useCatalogReportsFilter();

    return (
        <AuthenticatedLayout>
            <Head title="Catalog Reports" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Page Header with Refresh and Filter */}
                    <CatalogReportPageHeader
                        isRefreshing={isRefreshing}
                        activeFilter={filterState.activeFilter}
                        onRefresh={handleRefresh}
                        onOpenFilter={() => setShowFilterModal(true)}
                        onClearFilter={handleClearFilter}
                    />

                    {/* Date Filter Modal */}
                    <DateFilterModal
                        isOpen={showFilterModal}
                        onClose={() => setShowFilterModal(false)}
                        selectedDateRange={filterState.selectedDateRange}
                        customFromDate={filterState.customFromDate}
                        customToDate={filterState.customToDate}
                        onDateRangeChange={setSelectedDateRange}
                        onCustomFromDateChange={setCustomFromDate}
                        onCustomToDateChange={setCustomToDate}
                        onApply={handleApplyFilter}
                        onClear={handleClearFilter}
                    />

                    {/* Summary Statistics Cards */}
                    <SummaryCards summary={summary} />

                    {/* Charts Section - Two columns on desktop */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <CategoryPieChart data={booksByCategory} />
                        <PublisherBarChart data={booksByPublisher} />
                    </div>

                    {/* Low Stock Alert */}
                    <LowStockAlertTable data={lowStockBooks} />

                    {/* Availability Status Breakdown */}
                    <AvailabilityBreakdownChart data={availabilityBreakdown} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
