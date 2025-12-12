import { BookOpen } from "lucide-react";
import { CatalogItem, User } from "@/types";
import { router } from "@inertiajs/react";

interface PopularBooksSectionProps {
    books: CatalogItem[];
    user: User | null;
    onBookClick: (book: CatalogItem) => void;
}

export default function PopularBooksSection({
    books,
    user,
    onBookClick,
}: PopularBooksSectionProps) {
    if (books.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            {/* Books Table */}
            {books.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">
                                        Authors/Editors
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">
                                        Publisher
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white">
                                        Copies
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {books.slice(0, 10).map((book) => (
                                    <tr
                                        key={book.id}
                                        onClick={() =>
                                            router.visit(
                                                route("books.show", book.id),
                                            )
                                        }
                                        className="cursor-pointer border-b border-gray-200 transition-colors hover:bg-indigo-50/50"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-start gap-3">
                                                {/* Book Cover Thumbnail */}
                                                <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                                                    {book.cover_image ? (
                                                        <img
                                                            src={`/storage/${book.cover_image}`}
                                                            alt={book.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                            <BookOpen className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Title and Details */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-indigo-600 hover:text-indigo-700">
                                                        {book.title}
                                                    </p>
                                                    <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                                                        {book.edition && (
                                                            <p>
                                                                <span className="text-gray-400">
                                                                    Edition:
                                                                </span>{" "}
                                                                <span className="italic">
                                                                    {
                                                                        book.edition
                                                                    }
                                                                </span>
                                                            </p>
                                                        )}
                                                        {book.volume && (
                                                            <p>
                                                                <span className="text-gray-400">
                                                                    Volume:
                                                                </span>{" "}
                                                                <span className="italic">
                                                                    {
                                                                        book.volume
                                                                    }
                                                                </span>
                                                            </p>
                                                        )}
                                                        {book.year && (
                                                            <p>
                                                                <span className="text-gray-400">
                                                                    Year:
                                                                </span>{" "}
                                                                <span className="italic">
                                                                    {book.year}
                                                                </span>
                                                            </p>
                                                        )}
                                                        {book.isbn && (
                                                            <p>
                                                                <span className="text-gray-400">
                                                                    ISBN:
                                                                </span>{" "}
                                                                {book.isbn}
                                                            </p>
                                                        )}
                                                        {book.isbn13 && (
                                                            <p>
                                                                <span className="text-gray-400">
                                                                    ISBN 13:
                                                                </span>{" "}
                                                                {book.isbn13}
                                                            </p>
                                                        )}
                                                        {book.issn && (
                                                            <p>
                                                                <span className="text-gray-400">
                                                                    ISSN:
                                                                </span>{" "}
                                                                {book.issn}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {book.authors &&
                                            book.authors.length > 0 ? (
                                                <div className="space-y-0.5">
                                                    {book.authors.map(
                                                        (author) => (
                                                            <p
                                                                key={author.id}
                                                                className="text-sm text-indigo-600 hover:underline"
                                                            >
                                                                {author.name}
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {book.publisher ? (
                                                <p className="text-sm text-indigo-600 hover:underline">
                                                    {book.publisher.name}
                                                </p>
                                            ) : (
                                                <span className="text-sm text-gray-400">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">
                                                {book.type || "—"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm font-medium text-gray-700">
                                                {book.copies_count ??
                                                    book.copies?.length ??
                                                    0}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer with page info */}
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="text-sm text-gray-600">
                            Showing {Math.min(books.length, 10)} of{" "}
                            {books.length} titles
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        No books found
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Try adjusting your filters to see more results
                    </p>
                </div>
            )}
        </div>
    );
}
