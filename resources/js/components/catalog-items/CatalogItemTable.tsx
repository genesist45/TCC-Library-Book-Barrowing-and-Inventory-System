import { Eye, Pencil, Trash2, Copy } from "lucide-react";
import { router } from "@inertiajs/react";
import { CatalogItem } from "@/types";

const shimmerClass =
    "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] dark:from-[#3a3a3a] dark:via-[#4a4a4a] dark:to-[#3a3a3a]";

function CatalogItemTableRowSkeleton() {
    return (
        <tr className="border-b border-gray-200 transition-colors duration-300 dark:border-[#3a3a3a]">
            <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                <div className={`${shimmerClass} h-4 w-12 rounded`} />
            </td>
            <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                <div className="text-sm space-y-1.5">
                    <div className={`${shimmerClass} h-4 w-48 rounded`} />
                    <div
                        className={`${shimmerClass} h-3 w-20 rounded sm:hidden`}
                    />
                </div>
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 sm:table-cell sm:px-4">
                <div className={`${shimmerClass} h-4 w-24 rounded`} />
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 md:table-cell sm:px-4">
                <div className={`${shimmerClass} h-4 w-28 rounded`} />
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 lg:table-cell sm:px-4">
                <div className={`${shimmerClass} h-4 w-16 rounded`} />
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 lg:table-cell sm:px-4">
                <div className={`${shimmerClass} h-4 w-16 rounded`} />
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 lg:table-cell sm:px-4">
                <div className={`${shimmerClass} h-4 w-8 rounded`} />
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 lg:table-cell sm:px-4">
                <div className={`${shimmerClass} h-6 w-20 rounded-full`} />
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-center sm:px-4">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                </div>
            </td>
        </tr>
    );
}

interface CatalogItemWithAvailability extends CatalogItem {
    available_copies_count?: number;
}

interface CatalogItemTableProps {
    items: CatalogItemWithAvailability[];
    onView: (item: CatalogItem) => void;
    onCopy: (item: CatalogItem) => void;
    onEdit: (item: CatalogItem) => void;
    onDelete: (item: CatalogItem) => void;
    isLoading?: boolean;
}

/**
 * Compute the display status based on available copies
 * - "Available" if at least one copy is available
 * - "Borrowed" if all copies are borrowed (available_copies_count === 0)
 * - "No Copies" if there are no copies at all
 */
function getComputedStatus(item: CatalogItemWithAvailability): {
    label: string;
    isAvailable: boolean;
} {
    const totalCopies = item.copies_count ?? 0;
    const availableCopies = item.available_copies_count ?? 0;

    if (totalCopies === 0) {
        return { label: "No Copies", isAvailable: false };
    }

    if (availableCopies > 0) {
        return { label: "Available", isAvailable: true };
    }

    return { label: "Borrowed", isAvailable: false };
}

export default function CatalogItemTable({
    items,
    onView,
    onCopy,
    onEdit,
    onDelete,
    isLoading = false,
}: CatalogItemTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            Title
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:table-cell sm:px-4">
                            Type
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 md:table-cell sm:px-4">
                            Category
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 lg:table-cell sm:px-4">
                            Publisher
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 lg:table-cell sm:px-4">
                            Year
                        </th>
                        <th className="hidden px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 lg:table-cell sm:px-4">
                            Availability
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 lg:table-cell sm:px-4">
                            Status
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 print:hidden sm:px-4">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white transition-colors duration-300 dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                    {isLoading
                        ? Array.from({
                            length: items.length > 0 ? items.length : 5,
                        }).map((_, index) => (
                            <CatalogItemTableRowSkeleton key={index} />
                        ))
                        : items.map((item) => {
                            const { label: statusLabel, isAvailable } =
                                getComputedStatus(item);

                            return (
                                <tr
                                    key={item.id}
                                    className="transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                                >
                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                        {item.id}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                                {item.title}
                                            </div>
                                            <div className="text-xs text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:hidden">
                                                {item.type}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:table-cell sm:px-4">
                                        {item.type}
                                    </td>
                                    <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 md:table-cell sm:px-4">
                                        {item.category?.name || "-"}
                                    </td>
                                    <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 lg:table-cell sm:px-4">
                                        {item.publisher?.name || "-"}
                                    </td>
                                    <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 lg:table-cell sm:px-4">
                                        {item.year || "-"}
                                    </td>
                                    <td className="hidden whitespace-nowrap px-3 py-2 text-center lg:table-cell sm:px-4">
                                        {(() => {
                                            const available = item.available_copies_count ?? 0;
                                            const total = item.copies_count ?? 0;
                                            let badgeClass = '';
                                            if (total === 0) {
                                                badgeClass = 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
                                            } else if (available === 0) {
                                                badgeClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
                                            } else if (available === total) {
                                                badgeClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
                                            } else {
                                                badgeClass = 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
                                            }
                                            return (
                                                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
                                                    {available}
                                                    <span className="mx-0.5 opacity-60">/</span>
                                                    {total}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="hidden whitespace-nowrap px-3 py-2 lg:table-cell sm:px-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isAvailable
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                : statusLabel ===
                                                    "No Copies"
                                                    ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                }`}
                                        >
                                            {statusLabel}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2 text-center text-sm print:hidden sm:px-4">
                                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                                            <button
                                                onClick={() => onView(item)}
                                                className="flex items-center justify-center rounded-lg bg-blue-100 p-1.5 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                                title="View"
                                            >
                                                <Eye
                                                    size={16}
                                                    className="sm:h-4 sm:w-4"
                                                />
                                            </button>
                                            <button
                                                onClick={() => onCopy(item)}
                                                className="flex items-center justify-center rounded-lg bg-purple-100 p-1.5 text-purple-600 transition hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
                                                title="Copy Book"
                                            >
                                                <Copy
                                                    size={16}
                                                    className="sm:h-4 sm:w-4"
                                                />
                                            </button>
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="flex items-center justify-center rounded-lg bg-amber-100 p-1.5 text-amber-600 transition hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                                                title="Edit"
                                            >
                                                <Pencil
                                                    size={16}
                                                    className="sm:h-4 sm:w-4"
                                                />
                                            </button>
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="flex items-center justify-center rounded-lg bg-red-100 p-1.5 text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                title="Delete"
                                            >
                                                <Trash2
                                                    size={16}
                                                    className="sm:h-4 sm:w-4"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
            {!isLoading && items.length === 0 && (
                <div className="py-12 text-center text-gray-500 transition-colors duration-300 dark:text-gray-400">
                    No catalog items found. Click "Add Catalog Item" to create
                    one.
                </div>
            )}
        </div>
    );
}
