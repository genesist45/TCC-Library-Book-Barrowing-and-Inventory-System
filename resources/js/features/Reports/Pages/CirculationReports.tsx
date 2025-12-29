/**
 * Circulation Reports Page
 * 
 * Displays comprehensive borrowing transaction statistics including:
 * - Summary cards (total transactions, active loans, returned, avg duration)
 * - Most Borrowed Books table with rankings
 * - Active Loans table with status indicators
 * - Borrowing Trends chart over time
 * - Return Rate Statistics cards
 * - Popular Categories chart
 * 
 * Features refresh and date filter capabilities.
 */
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Components
import {
    CirculationReportPageHeader,
    DateFilterModal,
    CirculationSummaryCards,
    MostBorrowedBooksTable,
    ActiveLoansTable,
    BorrowingTrendsChart,
    ReturnRateStatsCards,
    PopularCategoriesChart,
} from '../Components';

// Hooks
import { useCirculationReportsFilter } from '../Hooks/useCirculationReportsFilter';

// Types
import type { CirculationReportsProps } from '../types/circulationReports';

export default function CirculationReports({
    summary,
    mostBorrowedBooks,
    activeLoansData,
    borrowingTrends,
    returnRateStats,
    popularCategories,
}: CirculationReportsProps) {
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
    } = useCirculationReportsFilter();

    return (
        <AuthenticatedLayout>
            <Head title="Circulation Reports" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Page Header with Refresh and Filter */}
                    <CirculationReportPageHeader
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
                    <CirculationSummaryCards summary={summary} />

                    {/* Most Borrowed Books Table */}
                    <MostBorrowedBooksTable data={mostBorrowedBooks} />

                    {/* Active Loans Table */}
                    <ActiveLoansTable data={activeLoansData} />

                    {/* Borrowing Trends Chart */}
                    <BorrowingTrendsChart data={borrowingTrends} />

                    {/* Return Rate Statistics */}
                    <ReturnRateStatsCards stats={returnRateStats} />

                    {/* Popular Categories Chart */}
                    <PopularCategoriesChart data={popularCategories} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
