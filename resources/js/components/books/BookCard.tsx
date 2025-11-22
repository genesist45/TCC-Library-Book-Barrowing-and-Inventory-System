import { CatalogItem } from '@/types';
import { BookOpen } from 'lucide-react';

interface BookCardProps {
    book: CatalogItem;
    onClick?: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
            {/* Book Cover Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {book.cover_image ? (
                    <img
                        src={`/storage/${book.cover_image}`}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                )}

                {/* Status Badge */}
                {book.status === 'Borrowed' && (
                    <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                            Borrowed
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Book Details */}
            <div className="p-4">
                {/* Book Title */}
                <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                    {book.title}
                </h3>

                {/* Author Name */}
                {book.authors && book.authors.length > 0 ? (
                    <p className="text-sm text-gray-600">
                        {book.authors.map((author) => author.name).join(', ')}
                    </p>
                ) : (
                    <p className="text-sm italic text-gray-400">No author listed</p>
                )}
            </div>
        </div>
    );
}
