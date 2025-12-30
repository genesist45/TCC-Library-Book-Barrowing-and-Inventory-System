import { PageProps, CatalogItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import PublicHeader from "@/components/common/PublicHeader";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useState } from "react";
import Toast from "@/components/common/Toast";
import { HeroSection, BookCatalogSection } from "../Components";

export default function Welcome({
    auth,
    popularBooks = [],
}: PageProps<{ popularBooks: CatalogItem[] }>) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter states
    const [typeFilter, setTypeFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");

    // Filter popular books based on selected filters and search query
    const filteredPopularBooks = popularBooks.filter((book) => {
        // Filter by search query (title or location)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesTitle = book.title.toLowerCase().includes(query);
            const matchesLocation = book.location?.toLowerCase().includes(query);
            if (!matchesTitle && !matchesLocation) return false;
        }

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
