import { PageProps, CatalogItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import PublicHeader from "@/components/common/PublicHeader";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useState, useEffect } from "react";
import Toast from "@/components/common/Toast";
import axios from "axios";
import { HeroSection, BookCatalogSection } from "@/components/welcome";

interface SearchResult {
    id: number;
    title: string;
    cover_image?: string;
    type: string;
    year?: string;
    is_active: boolean;
}

export default function Welcome({
    auth,
    popularBooks = [],
}: PageProps<{ popularBooks: CatalogItem[] }>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Filter states
    const [typeFilter, setTypeFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");

    // Filter popular books based on selected filters
    const filteredPopularBooks = popularBooks.filter((book) => {
        if (typeFilter && book.type !== typeFilter) return false;
        if (yearFilter) {
            if (yearFilter === "older") {
                const bookYear = parseInt(book.year || "0");
                if (bookYear >= 2019) return false;
            } else if (book.year !== yearFilter) {
                return false;
            }
        }
        // Check availability based on copies
        if (availabilityFilter === "available") {
            const hasAvailableCopy =
                book.copies?.some((copy) => copy.status === "Available") ??
                false;
            if (!hasAvailableCopy) return false;
        }
        if (availabilityFilter === "borrowed") {
            const allCopiesBorrowed = book.copies?.length
                ? book.copies.every((copy) => copy.status !== "Available")
                : false;
            if (!allCopiesBorrowed) return false;
        }
        return true;
    });

    // Navigate to book details page
    const handleBookClick = (book: CatalogItem) => {
        router.visit(route("books.show", book.id));
    };

    useEffect(() => {
        if (searchQuery.length >= 1) {
            setIsSearching(true);
            const timer = setTimeout(() => {
                axios
                    .get(route("books.search"), {
                        params: { query: searchQuery },
                    })
                    .then((response) => {
                        setSearchResults(response.data);
                        setShowDropdown(true);
                        setIsSearching(false);
                    })
                    .catch(() => {
                        setIsSearching(false);
                    });
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    }, [searchQuery]);

    // Navigate to book details page when clicking a search result
    const handleSearchResultClick = (bookId: number) => {
        setShowDropdown(false);
        setSearchQuery("");
        router.visit(route("books.show", bookId));
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-jakarta">
                <PublicHeader user={auth.user} />

                <HeroSection user={auth.user} />

                <BookCatalogSection
                    user={auth.user}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchResults={searchResults}
                    showDropdown={showDropdown}
                    isSearching={isSearching}
                    onSearchFocus={() =>
                        searchResults.length > 0 && setShowDropdown(true)
                    }
                    onSearchResultClick={handleSearchResultClick}
                    typeFilter={typeFilter}
                    yearFilter={yearFilter}
                    availabilityFilter={availabilityFilter}
                    onTypeFilterChange={setTypeFilter}
                    onYearFilterChange={setYearFilter}
                    onAvailabilityFilterChange={setAvailabilityFilter}
                    filteredBooks={filteredPopularBooks}
                    onBookClick={handleBookClick}
                />

                <ScrollToTop />
            </div>

            <Toast />
        </>
    );
}
