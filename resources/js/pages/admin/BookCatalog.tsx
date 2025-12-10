import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Search, RefreshCw, BookOpen } from 'lucide-react';
import { CatalogItem } from '@/types';
import BookCard from '@/components/books/BookCard';
import BorrowBookModal from '@/components/books/BorrowBookModal';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';

interface BookCatalogProps {
    catalogItems: CatalogItem[];
}

export default function BookCatalog({ catalogItems }: BookCatalogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedBook, setSelectedBook] = useState<CatalogItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['catalogItems'],
            onFinish: () => {
                setTimeout(() => {
                    setIsRefreshing(false);
                }, 500);
            },
        });
    };

    // Filter books
    const filteredBooks = catalogItems.filter((book) => {
        // Search query
        if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Type filter
        if (typeFilter && book.type !== typeFilter) {
            return false;
        }

        // Year filter
        if (yearFilter) {
            if (yearFilter === 'older') {
                const bookYear = parseInt(book.year || '0');
                if (bookYear >= 2019) return false;
            } else if (book.year !== yearFilter) {
                return false;
            }
        }

        // Status filter
        if (statusFilter === 'available' && book.status !== 'Available') return false;
        if (statusFilter === 'borrowed' && book.status !== 'Borrowed') return false;

        return true;
    });

    const handleBookClick = (book: CatalogItem) => {
        // Check if book is already borrowed
        if (book.status === 'Borrowed') {
            toast.error('This book is already borrowed');
            return;
        }

        setSelectedBook(book);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Book Catalog" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] sm:p-6">
                        {/* Mobile Layout */}
                        <div className="sm:hidden">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Book Catalog</h2>
                                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                    Browse and manage book requests from our library collection
                                </p>
                            </div>

                            {/* Search and Refresh */}
                            <div className="mb-3 flex items-center gap-2">
                                <div className="relative flex-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                                        placeholder="Search books..."
                                    />
                                </div>

                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                                    title="Refresh books"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-3 gap-2">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                >
                                    <option value="">All Types</option>
                                    <option value="Book">Book</option>
                                    <option value="Journal">Journal</option>
                                    <option value="Magazine">Magazine</option>
                                    <option value="Thesis">Thesis</option>
                                    <option value="Reference">Reference</option>
                                </select>

                                <select
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                >
                                    <option value="">All Years</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="older">2019 & Older</option>
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                >
                                    <option value="">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="borrowed">Borrowed</option>
                                </select>
                            </div>
                        </div>

                        {/* Desktop/Tablet Layout */}
                        <div className="hidden sm:block">
                            <div className="flex items-center justify-between gap-4">
                                {/* Left: Title */}
                                <div className="flex-shrink-0">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Book Catalog</h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Browse and manage book requests from our library collection
                                    </p>
                                </div>

                                {/* Right: Search + Filters */}
                                <div className="flex items-center gap-3">
                                    <div className="relative w-64 lg:w-80">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                                            placeholder="Search books by title..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                                        title="Refresh books"
                                    >
                                        <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="mt-4 flex items-center gap-3">
                                <div className="relative w-48">
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                    >
                                        <option value="">All Types</option>
                                        <option value="Book">Book</option>
                                        <option value="Journal">Journal</option>
                                        <option value="Magazine">Magazine</option>
                                        <option value="Thesis">Thesis</option>
                                        <option value="Reference">Reference</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="relative w-48">
                                    <select
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                    >
                                        <option value="">All Years</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                        <option value="2021">2021</option>
                                        <option value="2020">2020</option>
                                        <option value="older">2019 & Older</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="relative w-48">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                    >
                                        <option value="">All Status</option>
                                        <option value="available">Available</option>
                                        <option value="borrowed">Borrowed</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Books Grid - 4 per row */}
                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
                            {filteredBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onClick={() => handleBookClick(book)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">No books found</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Try adjusting your filters to see more results
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Borrow Book Modal */}
            {selectedBook && (
                <BorrowBookModal
                    book={selectedBook}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}
