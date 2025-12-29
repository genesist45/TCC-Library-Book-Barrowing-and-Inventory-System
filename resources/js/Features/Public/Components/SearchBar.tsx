import { Search, BookOpen, ArrowRight } from 'lucide-react';

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
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-rose-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder="Search books by title..."
                    className="w-full rounded-lg border border-pink-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-pink-100"
                />
                {isSearching && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-pink-200 border-t-rose-500"></div>
                    </div>
                )}
            </div>

            {/* Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-xl">
                    <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((book, index) => (
                            <button
                                key={book.id}
                                onClick={() => onResultClick(book.id)}
                                className={`flex w-full items-center gap-3 p-3 text-left transition hover:bg-blue-50 ${index !== searchResults.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                            >
                                <div className="flex h-12 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100">
                                    {book.cover_image ? (
                                        <img
                                            src={`/storage/${book.cover_image}`}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <BookOpen className="h-4 w-4 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="truncate text-sm font-medium text-gray-900">{book.title}</h4>
                                    <p className="text-xs text-gray-500">
                                        {book.type} {book.year && `• ${book.year}`}
                                    </p>
                                </div>
                                <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showDropdown && searchQuery.length >= 1 && searchResults.length === 0 && !isSearching && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white p-6 text-center shadow-lg">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No books found</p>
                    <p className="mt-1 text-xs text-gray-500">
                        Try a different search term
                    </p>
                </div>
            )}
        </div>
    );
}
