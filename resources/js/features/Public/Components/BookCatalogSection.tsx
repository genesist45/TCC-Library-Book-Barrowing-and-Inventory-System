import { CatalogItem, User } from "@/types";
import SearchBar from "./SearchBar";
import FilterOptions from "./FilterOptions";
import PopularBooksSection from "./PopularBooksSection";
import { Library } from "lucide-react";

interface BookCatalogSectionProps {
    user: User | null;
    searchQuery: string;
    onSearchChange: (value: string) => void;
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
        <section id="catalogs-section" className="bg-white py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                <div className="mx-auto max-w-6xl">
                    {/* Section Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-2 text-sm font-medium text-rose-600 shadow-sm">
                            <Library className="h-4 w-4" />
                            Browse Collection
                        </div>
                        <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Our Catalog
                        </h2>
                        <p className="mx-auto max-w-xl text-gray-600">
                            Explore our extensive collection of books, journals, and resources.
                        </p>
                    </div>

                    {/* Search and Filters Card */}
                    <div className="mb-6 rounded-xl border border-pink-100 bg-gradient-to-r from-pink-50/50 via-white to-rose-50/50 p-4 sm:p-6 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            <div className="flex-1">
                                <SearchBar
                                    searchQuery={searchQuery}
                                    onSearchChange={onSearchChange}
                                />
                            </div>
                            <FilterOptions
                                typeFilter={typeFilter}
                                yearFilter={yearFilter}
                                availabilityFilter={availabilityFilter}
                                onTypeChange={onTypeFilterChange}
                                onYearChange={onYearFilterChange}
                                onAvailabilityChange={onAvailabilityFilterChange}
                            />
                        </div>
                    </div>

                    {/* Books Table */}
                    <PopularBooksSection
                        books={filteredBooks}
                        user={user}
                        onBookClick={onBookClick}
                    />
                </div>
            </div>
        </section>
    );
}
