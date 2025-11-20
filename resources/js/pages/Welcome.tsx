import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import PublicHeader from '@/components/common/PublicHeader';
import ScrollToTop from '@/components/common/ScrollToTop';
import { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { Toaster } from 'sonner';
import axios from 'axios';

interface SearchResult {
    id: number;
    title: string;
    cover_image?: string;
    type: string;
    year?: string;
    is_active: boolean;
}

export default function Welcome({ auth }: PageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (searchQuery.length >= 1) {
            setIsSearching(true);
            const timer = setTimeout(() => {
                axios
                    .get(route('books.search'), {
                        params: {
                            query: searchQuery,
                        },
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

    const handleSearchResultClick = (bookId: number) => {
        router.visit(route('books.show', bookId));
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-jakarta">
                {/* Header */}
                <PublicHeader user={auth.user} />

                {/* Main Content */}
                <main className="container mx-auto flex min-h-screen items-center px-4 pt-20 pb-16 sm:px-6 lg:px-12">
                    <div className="w-full max-w-4xl">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                            Welcome to the
                        </h2>
                        <h3 className="mt-2 text-2xl font-bold text-indigo-600 sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
                            Library Management System
                        </h3>
                        <p className="mt-4 max-w-2xl text-base text-gray-600 sm:mt-6 sm:text-lg">
                            Discover and borrow from our extensive collection of books. Your next adventure awaits in our library.
                        </p>

                        {!auth.user && (
                            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                                <Link
                                    href={route('login')}
                                    className="rounded-lg bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-8 sm:text-base"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:px-8 sm:text-base"
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                {/* Book Search Section */}
                <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-20">
                    <div className="mx-auto max-w-4xl">
                        {/* Search Card */}
                        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-md transition-shadow hover:shadow-lg sm:p-10">
                            {/* Decorative Elements */}
                            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-200 opacity-20 blur-2xl"></div>
                            <div className="pointer-events-none absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-purple-200 opacity-20 blur-2xl"></div>

                            {/* Content */}
                            <div className="relative">
                                {/* Search Bar - Now at the top */}
                                <div className="relative mb-6">
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                                            placeholder="Search for books by title..."
                                            className="w-full rounded-xl border-2 border-indigo-200 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                        />
                                        {isSearching && (
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Search Dropdown */}
                                    {showDropdown && searchResults.length > 0 && (
                                        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                                            <div className="max-h-96 overflow-y-auto">
                                                {searchResults.map((book, index) => (
                                                    <button
                                                        key={book.id}
                                                        onClick={() => handleSearchResultClick(book.id)}
                                                        className={`flex w-full items-center gap-4 p-4 text-left transition hover:bg-indigo-50 ${index !== searchResults.length - 1 ? 'border-b border-gray-100' : ''
                                                            }`}
                                                    >
                                                        <div className="flex h-16 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                                                            {book.cover_image ? (
                                                                <img
                                                                    src={`/storage/${book.cover_image}`}
                                                                    alt={book.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <BookOpen className="h-6 w-6 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="truncate font-semibold text-gray-900">{book.title}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {book.type} {book.year && `• ${book.year}`}
                                                                {!book.is_active && (
                                                                    <span className="ml-2 text-red-600">• Inactive</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="rounded-full bg-indigo-100 p-2">
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
                                        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg">
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

                                {/* Icon, Title and Description - Now below */}
                                <div className="text-center">
                                    <div className="mb-4 flex items-center justify-center">
                                        <div className="rounded-full bg-indigo-600 p-3 shadow-lg">
                                            <Search className="h-6 w-6 text-white" />
                                        </div>
                                    </div>

                                    <h3 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                                        Search Our Library
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Find your next great read from our extensive collection
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Scroll to Top Button with Progress */}
                <ScrollToTop />
            </div>
            <Toaster position="top-right" richColors />
        </>
    );
}
