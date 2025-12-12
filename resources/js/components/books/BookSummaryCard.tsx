import { BookOpen } from "lucide-react";
import { CatalogItem } from "@/types";

interface BookSummaryCardProps {
    catalogItem: CatalogItem;
}

export default function BookSummaryCard({ catalogItem }: BookSummaryCardProps) {
    const authorsText =
        catalogItem.authors && catalogItem.authors.length > 0
            ? catalogItem.authors.map((a) => a.name).join(", ")
            : null;

    return (
        <div className="flex items-start gap-6 bg-gray-50 px-6 py-6 border-b border-gray-200">
            {/* Cover Image */}
            <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
                {catalogItem.cover_image ? (
                    <img
                        src={`/storage/${catalogItem.cover_image}`}
                        alt={catalogItem.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Title & Info */}
            <div>
                <h3 className="text-lg font-bold text-gray-900">{catalogItem.title}</h3>
                {authorsText && (
                    <div className="mt-2 text-sm text-gray-600">
                        <span>By {authorsText}</span>
                    </div>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="rounded bg-gray-200 px-2 py-1 font-medium text-gray-700">
                        ID: #{catalogItem.id}
                    </span>
                    <span className="rounded bg-indigo-50 px-2 py-1 font-medium text-indigo-700">
                        {catalogItem.type}
                    </span>
                    {catalogItem.year && (
                        <span className="rounded bg-gray-100 px-2 py-1 font-medium text-gray-600">
                            {catalogItem.year}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
