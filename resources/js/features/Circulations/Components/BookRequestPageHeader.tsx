import { Search, RefreshCw, Printer, UserPlus } from 'lucide-react';
import FilterDropdown from '@/components/common/FilterDropdown';

interface BookRequestPageHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onRefresh: () => void;
    onPrint: () => void;
    onAddBorrow: () => void;
    isLoading: boolean;
    // Filter props
    selectedStatus?: string | null;
    onStatusChange?: (status: string | null) => void;
}

export default function BookRequestPageHeader({
    searchQuery,
    onSearchChange,
    onRefresh,
    onPrint,
    onAddBorrow,
    isLoading,
    selectedStatus = null,
    onStatusChange
}: BookRequestPageHeaderProps) {
    const statusOptions = [
        { id: 'Pending', name: 'Pending' },
        { id: 'Approved', name: 'Approved' },
        { id: 'Disapproved', name: 'Disapproved' },
        { id: 'Returned', name: 'Returned' },
        { id: 'Paid', name: 'Paid' },
    ];

    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] print:hidden">
            {/* Desktop View */}
            <div className="hidden sm:block">
                <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex-shrink-0">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Book Requests</h2>
                        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                            Manage all book borrow requests from members
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                            title="Refresh list"
                        >
                            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                            onClick={onPrint}
                            className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:bg-gray-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                            title="Print list"
                        >
                            <Printer className="h-5 w-5" />
                        </button>

                        <button
                            onClick={onAddBorrow}
                            className="flex items-center gap-2 rounded-lg bg-[#030229] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#030229]/90 dark:bg-[#2a2a2a] dark:hover:bg-[#3a3a3a]"
                        >
                            <UserPlus className="h-5 w-5" />
                            <span>Add Borrow Member</span>
                        </button>
                    </div>
                </div>

                <hr className="border-gray-200 dark:border-[#3a3a3a] mb-3" />

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative w-64 lg:w-80">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                            placeholder="Search requests..."
                        />
                    </div>

                    <FilterDropdown
                        label="Status"
                        options={statusOptions}
                        selectedId={selectedStatus}
                        onChange={(id) => onStatusChange?.(id as string)}
                    />
                </div>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Book Requests</h2>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            Manage borrow requests
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <button
                            onClick={onAddBorrow}
                            className="rounded-lg bg-[#030229] p-2 text-white hover:bg-[#030229]/90 dark:bg-[#2a2a2a] dark:hover:bg-[#3a3a3a]"
                        >
                            <UserPlus className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]"
                            placeholder="Search..."
                        />
                    </div>
                    <button onClick={onRefresh} className="rounded-lg border border-gray-300 p-2 dark:border-[#3a3a3a]">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={onPrint} className="rounded-lg border border-gray-300 p-2 dark:border-[#3a3a3a]">
                        <Printer className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <FilterDropdown
                        label="Status"
                        options={statusOptions}
                        selectedId={selectedStatus}
                        onChange={(id) => onStatusChange?.(id as string)}
                    />
                </div>
            </div>
        </div>
    );
}
