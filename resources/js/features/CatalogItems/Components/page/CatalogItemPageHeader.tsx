import { Search, Plus, RefreshCw, Printer, ChevronDown, X } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useState, useRef, useEffect } from 'react';

interface FilterOption {
    id: number;
    name: string;
}

interface CatalogItemPageHeaderProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddItem: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
    // Filter props
    authors?: { id: number; name: string }[];
    publishers?: FilterOption[];
    categories?: FilterOption[];
    selectedAuthorId?: number | null;
    selectedPublisherId?: number | null;
    selectedCategoryId?: number | null;
    onAuthorChange?: (id: number | null) => void;
    onPublisherChange?: (id: number | null) => void;
    onCategoryChange?: (id: number | null) => void;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    selectedId: number | null;
    onChange: (id: number | null) => void;
    placeholder?: string;
}

function FilterDropdown({ label, options, selectedId, onChange, placeholder = "All" }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => o.id === selectedId);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center rounded-lg border border-gray-300 bg-white shadow-sm transition-colors dark:border-[#3a3a3a] dark:bg-[#2a2a2a] overflow-hidden">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#3a3a3a] transition-colors"
                >
                    <span className="text-gray-500 dark:text-gray-400">{label}:</span>
                    <span className="font-medium max-w-[100px] truncate">{selectedOption?.name || placeholder}</span>
                    {!selectedId && <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>

                {selectedId && (
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="flex items-center border-l border-gray-200 px-2 py-[11px] text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:border-[#3a3a3a] dark:hover:bg-[#3a3a3a] transition-colors"
                        title={`Clear ${label} filter`}
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-100 dark:border-[#3a3a3a]">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Search ${label.toLowerCase()}...`}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#1a1a1a] dark:text-gray-100 dark:placeholder-gray-500"
                            autoFocus
                        />
                    </div>

                    {/* Options list with max height and scroll */}
                    <div className="max-h-48 overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => {
                                onChange(null);
                                setIsOpen(false);
                                setSearch('');
                            }}
                            className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3a3a] ${!selectedId ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            All {label}
                        </button>
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                No {label.toLowerCase()} found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3a3a] ${selectedId === option.id ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    {option.name}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CatalogItemPageHeader({
    searchValue,
    onSearchChange,
    onAddItem,
    onRefresh,
    isRefreshing = false,
    authors = [],
    publishers = [],
    categories = [],
    selectedAuthorId = null,
    selectedPublisherId = null,
    selectedCategoryId = null,
    onAuthorChange,
    onPublisherChange,
    onCategoryChange,
}: CatalogItemPageHeaderProps) {
    const handlePrint = () => {
        window.print();
    };

    // Authors already have a name field matching FilterOption interface
    const authorOptions: FilterOption[] = authors;



    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] print:hidden">
            {/* Mobile View */}
            <div className="sm:hidden">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Catalog Items</h2>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            Manage library catalog items and media
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <PrimaryButton onClick={onAddItem} className="flex items-center gap-2 whitespace-nowrap !bg-[#030229] !text-white hover:!bg-[#030229]/90 dark:!bg-[#2a2a2a] dark:!text-gray-100 dark:hover:!bg-[#3a3a3a] border border-transparent">
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                        </PrimaryButton>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                            placeholder="Search items..."
                        />
                    </div>

                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                        title="Refresh items"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={handlePrint}
                        className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                        title="Print items"
                    >
                        <Printer className="h-4 w-4" />
                    </button>
                </div>

                {/* Mobile filters - horizontal scroll */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                    <FilterDropdown
                        label="Author"
                        options={authorOptions}
                        selectedId={selectedAuthorId}
                        onChange={(id) => onAuthorChange?.(id)}
                    />
                    <FilterDropdown
                        label="Publisher"
                        options={publishers}
                        selectedId={selectedPublisherId}
                        onChange={(id) => onPublisherChange?.(id)}
                    />
                    <FilterDropdown
                        label="Category"
                        options={categories}
                        selectedId={selectedCategoryId}
                        onChange={(id) => onCategoryChange?.(id)}
                    />
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
                {/* Header Row: Title+Subtitle on left, Action Buttons on right (vertically centered) */}
                <div className="flex items-center justify-between gap-4 mb-3">
                    {/* Left side: Title and Subtitle */}
                    <div className="flex-shrink-0">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Catalog Items</h2>
                        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                            Manage library catalog items and media
                        </p>
                    </div>

                    {/* Right side: Action buttons */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                            title="Refresh items"
                        >
                            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:bg-gray-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                            title="Print items"
                        >
                            <Printer className="h-5 w-5" />
                        </button>

                        <PrimaryButton onClick={onAddItem} className="flex items-center gap-2 whitespace-nowrap !bg-[#030229] !text-white hover:!bg-[#030229]/90 dark:!bg-[#2a2a2a] dark:!text-gray-100 dark:hover:!bg-[#3a3a3a] border border-transparent">
                            <Plus className="h-5 w-5" />
                            Add Catalog Item
                        </PrimaryButton>
                    </div>
                </div>

                {/* Separator Line */}
                <hr className="border-gray-200 dark:border-[#3a3a3a] mb-3" />

                {/* Search and Filters Row */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative w-56 lg:w-64">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                            placeholder="Search by title, type..."
                        />
                    </div>

                    <FilterDropdown
                        label="Author"
                        options={authorOptions}
                        selectedId={selectedAuthorId}
                        onChange={(id) => onAuthorChange?.(id)}
                    />
                    <FilterDropdown
                        label="Publisher"
                        options={publishers}
                        selectedId={selectedPublisherId}
                        onChange={(id) => onPublisherChange?.(id)}
                    />
                    <FilterDropdown
                        label="Category"
                        options={categories}
                        selectedId={selectedCategoryId}
                        onChange={(id) => onCategoryChange?.(id)}
                    />
                </div>
            </div>
        </div>
    );
}
