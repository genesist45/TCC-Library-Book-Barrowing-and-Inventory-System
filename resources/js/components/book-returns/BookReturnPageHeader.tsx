import { Search, Plus, RefreshCw } from 'lucide-react';

interface BookReturnPageHeaderProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddReturn: () => void;
    onRefresh: () => void;
    isRefreshing: boolean;
}

export default function BookReturnPageHeader({
    searchValue,
    onSearchChange,
    onAddReturn,
    onRefresh,
    isRefreshing,
}: BookReturnPageHeaderProps) {
    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] sm:flex sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800 transition-colors duration-300 dark:text-gray-100">
                    Book Returns
                </h1>
                <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                    Manage all returned books and update their condition
                </p>
            </div>

            <div className="mt-4 flex items-center gap-3 sm:mt-0">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search returns..."
                        value={searchValue}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Refresh Button */}
                <button
                    onClick={onRefresh}
                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-gray-200 dark:hover:bg-[#4a4a4a]"
                    title="Refresh list"
                >
                    <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>

                {/* Add Return Button */}
                <button
                    onClick={onAddReturn}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    <Plus className="h-4 w-4" />
                    Add Return
                </button>
            </div>
        </div>
    );
}
