import { CatalogItem, User } from "@/types";
import SearchBar from "./SearchBar";
import FilterOptions from "./FilterOptions";
import PopularBooksSection from "./PopularBooksSection";

interface SearchResult {
    id: number;
    title: string;
    cover_image?: string;
    type: string;
    year?: string;
    is_active: boolean;
}

interface BookCatalogSectionProps {
    user: User | null;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    searchResults: SearchResult[];
    showDropdown: boolean;
    isSearching: boolean;
    onSearchFocus: () => void;
    onSearchResultClick: (bookId: number) => void;
    typeFilter: string;
    yearFilter: string;
    availabilityFilter: string;
    onTypeFilterChange: (value: string) => void;
    onYearFilterChange: (value: string) => void;
    onAvailabilityFilterChange: (value: string) => void;
    filteredBooks: CatalogItem[];
    onBookClick: (book: CatalogItem) => void;
}

export default function BookCatalogSection({
    user,
    searchQuery,
    onSearchChange,
    searchResults,
    showDropdown,
    isSearching,
    onSearchFocus,
    onSearchResultClick,
    typeFilter,
    yearFilter,
    availabilityFilter,
    onTypeFilterChange,
    onYearFilterChange,
    onAvailabilityFilterChange,
    filteredBooks,
    onBookClick,
}: BookCatalogSectionProps) {
    return (
        <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-7xl">
                {/* Search Card */}
                <div className="relative rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-md transition-shadow hover:shadow-lg sm:p-10">
                    {/* Decorative Elements */}
                    <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-200 opacity-20 blur-2xl"></div>
                    <div className="pointer-events-none absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-purple-200 opacity-20 blur-2xl"></div>

                    {/* Content */}
                    <div className="relative">
                        {/* Book Catalog Title & Search/Filters Section */}
                        <div className="mb-6">
                            {/* Book Catalog Title - Left Aligned */}
                            <div className="mb-4">
                                <h2 className="font-jakarta text-2xl font-extrabold tracking-tight sm:text-3xl">
                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        Catalogs
                                    </span>
                                </h2>
                                <p className="mt-1 font-jakarta text-xs font-medium text-gray-600 sm:text-sm">
                                    Explore our extensive collection of books,
                                    journals, and resources.
                                </p>
                            </div>

                            {/* Search Bar and Filters Row */}
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                                <SearchBar
                                    searchQuery={searchQuery}
                                    onSearchChange={onSearchChange}
                                    searchResults={searchResults}
                                    showDropdown={showDropdown}
                                    isSearching={isSearching}
                                    onFocus={onSearchFocus}
                                    onResultClick={onSearchResultClick}
                                />

                                <FilterOptions
                                    typeFilter={typeFilter}
                                    yearFilter={yearFilter}
                                    availabilityFilter={availabilityFilter}
                                    onTypeChange={onTypeFilterChange}
                                    onYearChange={onYearFilterChange}
                                    onAvailabilityChange={
                                        onAvailabilityFilterChange
                                    }
                                />
                            </div>
                        </div>

                        {/* Horizontal Divider */}
                        <hr className="border-gray-200" />

                        {/* Popular Books Section */}
                        <PopularBooksSection
                            books={filteredBooks}
                            user={user}
                            onBookClick={onBookClick}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
