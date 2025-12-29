import { Link } from "@inertiajs/react";
import { BookPlus, ExternalLink, BookOpen } from "lucide-react";
import type { NewArrivalItem } from "../types/dashboard";

interface NewArrivalsCardProps {
    items: NewArrivalItem[];
}

export const NewArrivalsCard = ({ items }: NewArrivalsCardProps) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#3a3a3a]">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-emerald-500 bg-opacity-10 p-1.5 dark:bg-opacity-20">
                        <BookPlus className="h-4 w-4 text-emerald-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        New Arrivals
                    </h3>
                </div>
                <Link
                    href={route("admin.catalog-items.index")}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                >
                    View All
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </div>

            {/* Content */}
            <div className="max-h-[320px] overflow-y-auto">
                {items.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-[#3a3a3a]">
                        {items.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={route(
                                        "admin.catalog-items.show",
                                        item.id,
                                    )}
                                    className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                                >
                                    {/* Book Cover */}
                                    <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                                        {item.cover_image ? (
                                            <img
                                                src={`/storage/${item.cover_image}`}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <BookOpen className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Info */}
                                    <div className="min-w-0 flex-1">
                                        <h4
                                            className="truncate text-sm font-medium text-gray-900 dark:text-white"
                                            title={item.title}
                                        >
                                            {item.title}
                                        </h4>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                            {item.isbn || item.isbn13 ? (
                                                <>
                                                    <span className="font-medium">
                                                        ISBN:
                                                    </span>{" "}
                                                    {item.isbn || item.isbn13}
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-medium">
                                                        Type:
                                                    </span>{" "}
                                                    {item.type || "Book"}
                                                </>
                                            )}
                                        </p>
                                        {item.authors &&
                                            item.authors.length > 0 && (
                                                <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">
                                                    by{" "}
                                                    {item.authors
                                                        .map((a) => a.name)
                                                        .join(", ")}
                                                </p>
                                            )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                        <BookPlus className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            No new arrivals yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
