import { Search, Plus, RefreshCw } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';

interface PublisherPageHeaderProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddPublisher: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export default function PublisherPageHeader({ searchValue, onSearchChange, onAddPublisher, onRefresh, isRefreshing = false }: PublisherPageHeaderProps) {
    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] sm:p-6">
            <div className="sm:hidden">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Publisher Management</h2>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            Manage publishers and their information
                        </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                        <PrimaryButton onClick={onAddPublisher} className="flex items-center gap-2 whitespace-nowrap">
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                        </PrimaryButton>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                            placeholder="Search publishers..."
                        />
                    </div>
                    
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                        title="Refresh publishers"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div className="flex-shrink-0">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Publisher Management</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Manage publishers and their information
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative w-64 lg:w-80">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                            placeholder="Search publishers by name or country..."
                        />
                    </div>
                    
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                        title="Refresh publishers"
                    >
                        <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    
                    <PrimaryButton onClick={onAddPublisher} className="flex items-center gap-2 whitespace-nowrap">
                        <Plus className="h-5 w-5" />
                        Add Publisher
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}
