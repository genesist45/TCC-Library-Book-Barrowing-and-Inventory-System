import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { CatalogItem, User } from '@/types';
import BookCard from '@/components/books/BookCard';

interface PopularBooksSectionProps {
    books: CatalogItem[];
    user: User | null;
    onBookClick: (book: CatalogItem) => void;
}

export default function PopularBooksSection({ books, user, onBookClick }: PopularBooksSectionProps) {
    if (books.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        Popular Books
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Discover our featured titles from the collection
                    </p>
                </div>
                {user && (
                    <Link
                        href={route('dashboard')}
                        className="hidden text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 sm:block"
                    >
                        View All →
                    </Link>
                )}
            </div>

            {/* Books Grid - 5 per row on desktop */}
            {books.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
                    {books.slice(0, 10).map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onClick={() => onBookClick(book)}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">No books found</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Try adjusting your filters to see more results
                    </p>
                </div>
            )}

            {/* Mobile View All Link */}
            {user && (
                <div className="mt-6 text-center sm:hidden">
                    <Link
                        href={route('dashboard')}
                        className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                    >
                        View All →
                    </Link>
                </div>
            )}
        </div>
    );
}
