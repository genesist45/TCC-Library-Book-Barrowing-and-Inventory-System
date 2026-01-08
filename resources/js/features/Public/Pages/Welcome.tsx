import { PageProps, CatalogItem } from "@/types";
import { Head, router, useRemember } from "@inertiajs/react";
import PublicHeader from "@/components/common/PublicHeader";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useState, useEffect, useRef } from "react";
import Toast from "@/components/common/Toast";
import { HeroSection, BookCatalogSection } from "../Components";

export default function Welcome({
    auth,
    popularBooks = [],
}: PageProps<{ popularBooks: CatalogItem[] }>) {
    const [searchQuery, setSearchQuery] = useRemember("", "Welcome/searchQuery");

    // Filter states
    const [typeFilter, setTypeFilter] = useRemember("", "Welcome/typeFilter");
    const [yearFilter, setYearFilter] = useRemember("", "Welcome/yearFilter");
    const [availabilityFilter, setAvailabilityFilter] = useRemember("", "Welcome/availabilityFilter");
    const [currentPage, setCurrentPage] = useRemember(1, "Welcome/currentPage");
    const [itemsPerPage, setItemsPerPage] = useRemember(9, "Welcome/itemsPerPage");

    const isFirstRender = useRef(true);
    // Reset pagination when filters change
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setCurrentPage(1);
    }, [searchQuery, typeFilter, yearFilter, availabilityFilter]);

    // Handle initial scroll to #catalogs-section
    useEffect(() => {
        if (window.location.hash === '#catalogs-section') {
            const section = document.getElementById('catalogs-section');
            if (section) {
                // Small timeout to ensure everything is rendered
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, []);

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
            const allCopiesCheckedOut = book.copies?.length
                ? book.copies.every((copy) => copy.status !== "Available")
                : false;
            if (!allCopiesCheckedOut) return false;
        }
        return true;
    });

    // Pagination logic
    const totalItems = filteredPopularBooks.length;
    const paginatedBooks = filteredPopularBooks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to catalogs section
        const section = document.getElementById('catalogs-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                    filteredBooks={paginatedBooks}
                    totalBooks={totalItems}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={setItemsPerPage}
                    onBookClick={handleBookClick}
                />

                <ScrollToTop />
            </div>

            <Toast />
        </>
    );
}
