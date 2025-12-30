import { Search, Plus, RefreshCw, Printer } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { Link } from '@inertiajs/react';
import FilterDropdown from '@/components/common/FilterDropdown';

interface MemberPageHeaderProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
    // Filter props
    selectedType?: string | null;
    selectedStatus?: string | null;
    onTypeChange?: (type: string | null) => void;
    onStatusChange?: (status: string | null) => void;
}

export default function MemberPageHeader({
    searchValue,
    onSearchChange,
    onRefresh,
    isRefreshing = false,
    selectedType = null,
    selectedStatus = null,
    onTypeChange,
    onStatusChange
}: MemberPageHeaderProps) {
    const handlePrint = () => {
        window.print();
    };

    const typeOptions = [
        { id: 'Student', name: 'Student' },
        { id: 'Faculty', name: 'Faculty' },
        { id: 'Privileged', name: 'Privileged' },
    ];

    const statusOptions = [
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
    ];

    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] print:hidden">
            {/* Desktop View */}
            <div className="hidden sm:block">
                <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex-shrink-0">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Member Management</h2>
                        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                            Manage library members and their information
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                            title="Refresh members"
                        >
                            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:bg-gray-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                            title="Print list"
                        >
                            <Printer className="h-5 w-5" />
                        </button>

                        <Link href={route('admin.members.create')}>
                            <PrimaryButton className="flex items-center gap-2 whitespace-nowrap !bg-[#030229] !text-white hover:!bg-[#030229]/90 dark:!bg-[#2a2a2a] dark:!text-gray-100 dark:hover:!bg-[#3a3a3a] border border-transparent">
                                <Plus className="h-5 w-5" />
                                Add Member
                            </PrimaryButton>
                        </Link>
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
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                            placeholder="Search by name, number, or email..."
                        />
                    </div>

                    <FilterDropdown
                        label="Type"
                        options={typeOptions}
                        selectedId={selectedType}
                        onChange={(id) => onTypeChange?.(id as string)}
                    />

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
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Members</h2>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            Manage library members
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <Link href={route('admin.members.create')}>
                            <PrimaryButton className="p-2 !bg-[#030229] !text-white hover:!bg-[#030229]/90 dark:!bg-[#2a2a2a] dark:!text-gray-100 dark:hover:!bg-[#3a3a3a] border border-transparent">
                                <Plus className="h-4 w-4" />
                            </PrimaryButton>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]"
                            placeholder="Search..."
                        />
                    </div>
                    <button onClick={onRefresh} className="rounded-lg border border-gray-300 p-2 dark:border-[#3a3a3a]">
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={handlePrint} className="rounded-lg border border-gray-300 p-2 dark:border-[#3a3a3a]">
                        <Printer className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <FilterDropdown
                        label="Type"
                        options={typeOptions}
                        selectedId={selectedType}
                        onChange={(id) => onTypeChange?.(id as string)}
                    />
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
