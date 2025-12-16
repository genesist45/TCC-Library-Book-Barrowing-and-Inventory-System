import { useState } from "react";
import { BookOpen } from "lucide-react";
import { CatalogItemCopy } from "@/types";
import Pagination from "@/components/common/Pagination";

interface AvailableCopiesTableProps {
    copies: CatalogItemCopy[] | undefined;
    callNo?: string | null;
    allCopiesBorrowed: boolean;
    hasPendingOrActiveRequest: boolean;
    onRequestCopy: (copy: CatalogItemCopy) => void;
}

const DEFAULT_ITEMS_PER_PAGE = 10;

export default function AvailableCopiesTable({
    copies,
    callNo,
    allCopiesBorrowed,
    hasPendingOrActiveRequest,
    onRequestCopy,
}: AvailableCopiesTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

    if (!copies || copies.length === 0) {
        return <EmptyState allCopiesBorrowed={allCopiesBorrowed} hasPendingOrActiveRequest={hasPendingOrActiveRequest} />;
    }

    // Calculate pagination
    const totalItems = copies.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCopies = copies.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Branch
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Accession No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Call No
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Copy No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Location
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Availability
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {paginatedCopies.map((copy) => (
                            <tr key={copy.id} className="transition-colors hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                    {copy.branch || "—"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                    {copy.accession_no}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                    {callNo || "—"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-600">
                                    {copy.copy_no}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                    {copy.location || "—"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${copy.status === "Available"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {copy.status === "Available" ? "Yes" : "No"}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                    {copy.status === "Available" ? (
                                        <button
                                            onClick={() => onRequestCopy(copy)}
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Request
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400">Unavailable</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[10, 25, 50]}
                showRowsPerPage={true}
            />
        </div>
    );
}

interface EmptyStateProps {
    allCopiesBorrowed: boolean;
    hasPendingOrActiveRequest: boolean;
}

function EmptyState({ allCopiesBorrowed, hasPendingOrActiveRequest }: EmptyStateProps) {
    return (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />

            {allCopiesBorrowed ? (
                <>
                    <p className="mt-2 text-sm font-medium text-red-600">
                        All copies are currently borrowed
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        This book is checked out and not available for borrowing at this time.
                    </p>
                    {hasPendingOrActiveRequest && (
                        <p className="mt-2 text-xs text-amber-600">
                            There is already a pending or active request for this book.
                        </p>
                    )}
                </>
            ) : hasPendingOrActiveRequest ? (
                <>
                    <p className="mt-2 text-sm font-medium text-red-600">
                        This book is currently borrowed
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        No copies available - book is checked out.
                    </p>
                </>
            ) : (
                <>
                    <p className="mt-2 text-sm font-medium text-gray-600">
                        No copies available for this catalog item
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        This title currently has no physical copies in the library inventory.
                        Please check back later or contact the library staff.
                    </p>
                </>
            )}
        </div>
    );
}
