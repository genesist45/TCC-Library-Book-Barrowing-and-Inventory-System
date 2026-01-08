import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

// Minimum number of items required to show pagination
const MIN_ITEMS_FOR_PAGINATION = 10;

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    itemsPerPageOptions?: number[];
    showRowsPerPage?: boolean;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [10, 25, 50, 100],
    showRowsPerPage = true,
    className = "",
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startItem =
        totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Don't render if no items or if total items is less than minimum threshold
    if (totalItems === 0 || totalItems < MIN_ITEMS_FOR_PAGINATION) {
        return null;
    }

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= totalPages) {
            onPageChange(value);
        }
    };

    const handleItemsPerPageChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        if (onItemsPerPageChange) {
            onItemsPerPageChange(newItemsPerPage);
            // Reset to first page when changing items per page
            onPageChange(1);
        }
    };

    return (
        <div
            className={`flex flex-col items-center justify-between gap-4 rounded-b-lg bg-gray-50 px-4 py-3 transition-colors duration-300 sm:flex-row dark:bg-[#2a2a2a] ${className}`}
        >
            {/* Left side - Rows per page selector */}
            <div className="flex items-center gap-4">
                {showRowsPerPage && onItemsPerPageChange && (
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="rows-per-page"
                            className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400"
                        >
                            Rows per page
                        </label>
                        <select
                            id="rows-per-page"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="h-8 min-w-[70px] rounded-lg border border-gray-200 bg-white py-0 pl-2 pr-2 text-sm leading-8 text-gray-700 transition-colors duration-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#3a3a3a] dark:text-gray-300"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Items range info */}
                <p className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {startItem}-{endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {totalItems}
                    </span>{" "}
                    rows
                </p>
            </div>

            {/* Right side - Navigation controls */}
            <div className="flex items-center gap-2">
                {/* First page button */}
                <button
                    onClick={() => handlePageClick(1)}
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#3a3a3a] dark:text-gray-400 dark:hover:bg-[#4a4a4a] dark:hover:text-gray-200"
                    title="First page"
                >
                    <ChevronsLeft size={16} />
                </button>

                {/* Previous page button */}
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#3a3a3a] dark:text-gray-400 dark:hover:bg-[#4a4a4a] dark:hover:text-gray-200"
                    title="Previous page"
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page indicator */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={currentPage}
                        onChange={handlePageInputChange}
                        className="h-8 w-12 rounded-lg border border-gray-200 bg-white text-center text-sm text-gray-900 transition-colors duration-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#3a3a3a] dark:text-gray-100 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        title="Current page"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        of{" "}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            {totalPages}
                        </span>
                    </span>
                </div>

                {/* Next page button */}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#3a3a3a] dark:text-gray-400 dark:hover:bg-[#4a4a4a] dark:hover:text-gray-200"
                    title="Next page"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                </button>

                {/* Last page button */}
                <button
                    onClick={() => handlePageClick(totalPages)}
                    disabled={currentPage === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3a3a3a] dark:bg-[#3a3a3a] dark:text-gray-400 dark:hover:bg-[#4a4a4a] dark:hover:text-gray-200"
                    title="Last page"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
}
