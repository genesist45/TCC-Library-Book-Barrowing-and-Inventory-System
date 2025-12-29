/**
 * Overdue Reports Page
 * 
 * Displays late return statistics and overdue management including:
 * - Summary cards (overdue count, members with overdue, avg days overdue)
 * - Overdue Books table with severity highlighting
 * - Members with Overdue Books table
 * - Overdue by Category chart
 * 
 * Features refresh and date filter capabilities.
 */
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

// Components
import {
    DateFilterModal,
    OverdueReportPageHeader,
    OverdueSummaryCards,
    OverdueBooksTable,
    MembersWithOverdueTable,
    OverdueByCategoryChart,
} from '../Components';

// Hooks
import { useOverdueReportsFilter } from '../Hooks/useOverdueReportsFilter';

// Types
import type { OverdueReportsProps } from '../types/overdueReports';

/**
 * Overdue Reports Page
 * Displays late return statistics and overdue management
 */
export default function OverdueReports({
    summary,
    overdueBooks,
    membersWithOverdue,
    overdueByCategory,
}: OverdueReportsProps) {
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
    } = useOverdueReportsFilter();

    return (
        <AuthenticatedLayout>
            <Head title="Overdue Reports" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <OverdueReportPageHeader
                        isRefreshing={isRefreshing}
                        activeFilter={{
                            dateFrom: filterState.customFromDate || null,
                            dateTo: filterState.customToDate || null,
                        }}
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

                    {/* Summary Cards */}
                    <OverdueSummaryCards data={summary} />

                    {/* Overdue Books Table */}
                    <OverdueBooksTable data={overdueBooks} />

                    {/* Two Column Layout for Members and Category Chart */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {/* Members with Overdue Books */}
                        <div className="xl:col-span-1">
                            <MembersWithOverdueTable data={membersWithOverdue} />
                        </div>

                        {/* Overdue by Category Chart */}
                        <div className="xl:col-span-1">
                            <OverdueByCategoryChart data={overdueByCategory} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
