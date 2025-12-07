import { Search, BookOpen } from 'lucide-react';

interface SearchResult {
    id: number;
    title: string;
    cover_image?: string;
    type: string;
    year?: string;
    is_active: boolean;
}

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    searchResults: SearchResult[];
    showDropdown: boolean;
    isSearching: boolean;
    onFocus: () => void;
    onResultClick: (bookId: number) => void;
}

export default function SearchBar({
    searchQuery,
    onSearchChange,
    searchResults,
    showDropdown,
    isSearching,
    onFocus,
    onResultClick,
}: SearchBarProps) {
    return (
        <div className="relative flex-1">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder="Search for books by title..."
                    className="w-full rounded-lg border-2 border-gray-200 bg-white py-2 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                {isSearching && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
                    </div>
                )}
            </div>

            {/* Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-xl">
                    <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((book, index) => (
                            <button
                                key={book.id}
                                onClick={() => onResultClick(book.id)}
                                className={`flex w-full items-center gap-4 p-3 text-left transition hover:bg-indigo-50 ${
                                    index !== searchResults.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                            >
                                <div className="flex h-14 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                                    {book.cover_image ? (
                                        <img
                                            src={`/storage/${book.cover_image}`}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <BookOpen className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="truncate text-sm font-semibold text-gray-900">{book.title}</h4>
                                    <p className="text-xs text-gray-600">
                                        {book.type} {book.year && `• ${book.year}`}
                                        {!book.is_active && (
                                            <span className="ml-2 text-red-600">• Inactive</span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="rounded-full bg-indigo-100 p-1.5">
                                        <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showDropdown && searchQuery.length >= 1 && searchResults.length === 0 && !isSearching && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white p-6 text-center shadow-lg">
                    <div className="mb-2 flex justify-center">
                        <div className="rounded-full bg-gray-100 p-3">
                            <BookOpen className="h-6 w-6 text-gray-400" />
                        </div>
                    </div>
                    <p className="font-medium text-gray-900">No books found</p>
                    <p className="mt-1 text-sm text-gray-500">
                        We couldn't find any books matching "{searchQuery}"
                    </p>
                </div>
            )}
        </div>
    );
}
