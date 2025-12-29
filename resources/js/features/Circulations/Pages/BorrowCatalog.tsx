import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useState, useEffect } from "react";
import { Search, RefreshCw, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination";
import { FilterDropdown } from "../Components/borrow";
import type {
    CatalogItemFull,
    Author,
    Publisher,
    Category,
    FilterOption,
} from "../types/borrow";

interface Props extends PageProps {
    catalogItems: CatalogItemFull[];
    authors: Author[];
    publishers: Publisher[];
    categories: Category[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function BorrowCatalog({
    catalogItems,
    authors,
    publishers,
    categories,
    flash,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter states
    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
    const [selectedPublisherId, setSelectedPublisherId] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedAuthorId, selectedPublisherId, selectedCategoryId]);

    const handleItemClick = (item: CatalogItemFull) => {
        // Navigate to available copies page (which will have tabs for Item Info and Available Copies)
        router.visit(route("admin.book-requests.available-copies", item.id));
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false),
        });
    };

    // Filter items
    const filteredItems = catalogItems.filter((item) => {
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch =
            (item.title?.toLowerCase() || "").includes(searchLower) ||
            (item.type?.toLowerCase() || "").includes(searchLower) ||
            (item.category?.name?.toLowerCase() || "").includes(searchLower) ||
            (item.publisher?.name?.toLowerCase() || "").includes(searchLower) ||
            (item.isbn?.toLowerCase() || "").includes(searchLower) ||
            (item.isbn13?.toLowerCase() || "").includes(searchLower) ||
            item.authors?.some((a) => a.name?.toLowerCase().includes(searchLower));

        const matchesAuthor =
            !selectedAuthorId || item.authors?.some((author) => author.id === selectedAuthorId);

        const matchesPublisher = !selectedPublisherId || item.publisher?.id === selectedPublisherId;

        const matchesCategory = !selectedCategoryId || item.category?.id === selectedCategoryId;

        return matchesSearch && matchesAuthor && matchesPublisher && matchesCategory;
    });

    // Pagination
    const totalItems = filteredItems.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    // Authors already have name field matching FilterOption interface
    const authorOptions: FilterOption[] = authors;

    return (
        <AuthenticatedLayout>
            <Head title="Select a Book to Borrow" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a] sm:p-6">
                        {/* Title Row with Actions */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                                    Select a Book to Borrow
                                </h2>
                                <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                                    Browse catalog items and select a copy for borrowing
                                </p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <button
                                    onClick={handleRefresh}
                                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-gray-200 dark:hover:bg-[#4a4a4a]"
                                    title="Refresh list"
                                >
                                    <RefreshCw
                                        className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Separator */}
                        <hr className="border-gray-200 dark:border-[#3a3a3a] mb-4" />

                        {/* Search and Filters Row */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search catalogs..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white dark:placeholder-gray-500"
                                />
                            </div>
                            <FilterDropdown
                                label="Author"
                                options={authorOptions}
                                selectedId={selectedAuthorId}
                                onChange={setSelectedAuthorId}
                            />
                            <FilterDropdown
                                label="Publisher"
                                options={publishers}
                                selectedId={selectedPublisherId}
                                onChange={setSelectedPublisherId}
                            />
                            <FilterDropdown
                                label="Category"
                                options={categories}
                                selectedId={selectedCategoryId}
                                onChange={setSelectedCategoryId}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-200 bg-gray-50 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Title
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Authors/Editors
                                        </th>
                                        <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 md:table-cell">
                                            Publisher
                                        </th>
                                        <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 lg:table-cell">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Copies
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                                    {isRefreshing ? (
                                        // Loading skeleton
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="h-20 w-14 rounded bg-gray-200 dark:bg-[#3a3a3a]" />
                                                        <div className="space-y-2">
                                                            <div className="h-4 w-48 rounded bg-gray-200 dark:bg-[#3a3a3a]" />
                                                            <div className="h-3 w-32 rounded bg-gray-200 dark:bg-[#3a3a3a]" />
                                                            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-[#3a3a3a]" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-[#3a3a3a]" />
                                                </td>
                                                <td className="hidden px-4 py-4 md:table-cell">
                                                    <div className="h-4 w-28 rounded bg-gray-200 dark:bg-[#3a3a3a]" />
                                                </td>
                                                <td className="hidden px-4 py-4 lg:table-cell">
                                                    <div className="h-4 w-20 rounded bg-gray-200 dark:bg-[#3a3a3a]" />
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <div className="mx-auto h-6 w-12 rounded bg-gray-200 dark:bg-[#3a3a3a]" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : paginatedItems.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <BookOpen className="h-10 w-10 text-gray-300" />
                                                    <p>No catalog items found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedItems.map((item) => {
                                            const available = item.available_copies_count ?? 0;
                                            const total = item.copies_count ?? 0;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    onClick={() => handleItemClick(item)}
                                                    className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                                                >
                                                    {/* Title Column with Thumbnail and Details */}
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-start gap-4">
                                                            {/* Thumbnail */}
                                                            <div className="flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-[#3a3a3a] border border-gray-200 dark:border-[#4a4a4a]">
                                                                {item.cover_image ? (
                                                                    <img
                                                                        src={`/storage/${item.cover_image}`}
                                                                        alt={item.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <BookOpen className="h-6 w-6 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Title and Metadata */}
                                                            <div className="min-w-0 flex-1">
                                                                <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 line-clamp-2">
                                                                    {item.title}
                                                                </h3>
                                                                <div className="mt-1 space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                                    {item.edition && (
                                                                        <p>
                                                                            <span className="text-gray-400">Edition:</span>{" "}
                                                                            <span className="italic">{item.edition}</span>
                                                                        </p>
                                                                    )}
                                                                    {item.volume && (
                                                                        <p>
                                                                            <span className="text-gray-400">Volume:</span>{" "}
                                                                            <span className="italic">{item.volume}</span>
                                                                        </p>
                                                                    )}
                                                                    {item.year && (
                                                                        <p>
                                                                            <span className="text-gray-400">Year:</span>{" "}
                                                                            <span>{item.year}</span>
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Authors/Editors Column */}
                                                    <td className="px-4 py-4 align-top">
                                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                                            {item.authors && item.authors.length > 0 ? (
                                                                <div className="space-y-0.5">
                                                                    {item.authors.slice(0, 3).map((author, idx) => (
                                                                        <p key={author.id || idx} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                                                            {author.name}
                                                                        </p>
                                                                    ))}
                                                                    {item.authors.length > 3 && (
                                                                        <p className="text-gray-400 text-xs">
                                                                            +{item.authors.length - 3} more
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Publisher Column */}
                                                    <td className="hidden px-4 py-4 align-top md:table-cell">
                                                        <span className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                                            {item.publisher?.name || (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </span>
                                                    </td>

                                                    {/* Type Column */}
                                                    <td className="hidden px-4 py-4 align-top lg:table-cell">
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {item.type || "-"}
                                                        </span>
                                                    </td>

                                                    {/* Copies Column */}
                                                    <td className="px-4 py-4 text-center align-top">
                                                        <span className="inline-flex items-center justify-center min-w-[3rem] rounded-full bg-indigo-100 px-2.5 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                            {available}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalItems > 0 && (
                            <div className="border-t border-gray-200 dark:border-[#3a3a3a]">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={totalItems}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                    showRowsPerPage={true}
                                    itemsPerPageOptions={[10, 20, 30, 50]}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
