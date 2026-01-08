import { CatalogItem } from "@/types";
import { BookOpen } from "lucide-react";

interface BookCardProps {
    book: CatalogItem;
    onClick?: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
    // Compute availability based on copies instead of book.status
    const hasAvailableCopy =
        book.copies?.some((copy) => copy.status === "Available") ?? false;
    const hasCopies = (book.copies?.length ?? 0) > 0;
    const isAllBorrowed = hasCopies && !hasAvailableCopy;

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-[#2a2a2a] dark:shadow-lg"
        >
            {/* Book Cover Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#3a3a3a] dark:to-[#2a2a2a]">
                {book.cover_image ? (
                    <img
                        src={`/storage/${book.cover_image}`}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                    </div>
                )}

                {/* Status Badge - Only show if all copies are borrowed */}
                {isAllBorrowed && (
                    <div className="absolute right-2 top-2">
                        <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                            Checked Out
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Book Details */}
            <div className="p-3 dark:bg-[#2a2a2a]">
                {/* Book Title */}
                <h3 className="mb-1 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                    {book.title}
                </h3>

                {/* Author Name */}
                {book.authors && book.authors.length > 0 ? (
                    <p className="line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
                        {book.authors.map((author) => author.name).join(", ")}
                    </p>
                ) : (
                    <p className="text-xs italic text-gray-400 dark:text-gray-500">
                        No author listed
                    </p>
                )}
            </div>
        </div>
    );
}
