import { BookOpen, Calendar, User as UserIcon, Copy, ArrowRight, MapPin } from "lucide-react";
import { CatalogItem, User } from "@/types";
import { router } from "@inertiajs/react";

interface PopularBooksSectionProps {
    books: CatalogItem[];
    user: User | null;
    onBookClick: (book: CatalogItem) => void;
    showFooter?: boolean;
}

export default function PopularBooksSection({
    books,
    user,
    onBookClick,
    showFooter = true,
}: PopularBooksSectionProps) {
    if (books.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    No books found
                </h3>
                <p className="text-sm text-gray-500">
                    Try adjusting your filters to see more results
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Books Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((book) => {
                    return (
                        <div
                            key={book.id}
                            onClick={() => router.visit(route("books.show", book.id))}
                            className="group cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-rose-300 hover:shadow-md"
                        >
                            <div className="flex gap-4">
                                {/* Book Cover */}
                                <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                                    {book.cover_image ? (
                                        <img
                                            src={`/storage/${book.cover_image}`}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <BookOpen className="h-6 w-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Book Info */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                                        {book.title}
                                    </h3>

                                    {/* Author */}
                                    {book.authors && book.authors.length > 0 && (
                                        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                                            <UserIcon className="h-3 w-3" />
                                            <span className="line-clamp-1">
                                                {book.authors.map(a => a.name).join(", ")}
                                            </span>
                                        </div>
                                    )}

                                    {/* Meta Info */}
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        {/* Type Badge */}
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                            {book.type || "Book"}
                                        </span>

                                        {/* Year */}
                                        {book.year && (
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {book.year}
                                            </span>
                                        )}

                                        {/* Location */}
                                        {book.location && (
                                            <span className="inline-flex items-center gap-1 text-xs text-rose-400">
                                                <MapPin className="h-3 w-3" />
                                                <span className="line-clamp-1">{book.location}</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Copies Info */}
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Copy className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs text-gray-500">
                                                {book.copies_count ?? book.copies?.length ?? 0} copies
                                            </span>
                                        </div>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${(book.available_copies_count ?? 0) > 0
                                            ? "bg-green-50 text-green-700"
                                            : "bg-amber-50 text-amber-700"
                                            }`}>
                                            {(book.available_copies_count ?? 0) > 0 ? "Available" : "Checked Out"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showFooter && (
                <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-medium">{Math.min(books.length, 9)}</span> of{" "}
                        <span className="font-medium">{books.length}</span> titles
                    </p>
                    {books.length > 9 && (
                        <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                            View all
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
