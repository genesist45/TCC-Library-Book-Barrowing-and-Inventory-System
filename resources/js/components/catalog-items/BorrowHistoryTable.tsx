import { useState, useMemo } from "react";
import { Eye, BookOpen, Calendar } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import BorrowRecordDetailModal from "@/components/catalog-items/BorrowRecordDetailModal";

interface BorrowRecord {
    id: number;
    member_id: number;
    member_name: string;
    member_no: string;
    member_type: string;
    email: string;
    phone: string | null;
    address?: string | null;
    date_borrowed: string;
    date_returned: string | null;
    due_date: string;
    status: string;
    book_title?: string;
    accession_no?: string;
    copy_no?: number;
    notes?: string | null;
    // Book return specific fields
    condition_on_return?: string | null;
    penalty_amount?: number | null;
    return_status?: string | null;
    remarks?: string | null;
}

interface BorrowHistoryTableProps {
    records: BorrowRecord[];
    title?: string;
}

const DEFAULT_ITEMS_PER_PAGE = 10;

export default function BorrowHistoryTable({
    records,
    title = "Borrow History",
}: BorrowHistoryTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(
        null,
    );

    // Calculate paginated records
    const paginatedRecords = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return records.slice(startIndex, endIndex);
    }, [records, currentPage, itemsPerPage]);

    // Reset to first page when records change
    useMemo(() => {
        const totalPages = Math.ceil(records.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [records.length, itemsPerPage]);

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleViewRecord = (record: BorrowRecord) => {
        setSelectedRecord(record);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedRecord(null);
    };

    const getStatusBadge = (status: string, dateReturned: string | null) => {
        // Handle book_return statuses first (Paid, Pending from lost books)
        if (status === "Paid") {
            return (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    Paid
                </span>
            );
        }
        if (status === "Pending") {
            return (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    Pending
                </span>
            );
        }
        if (status === "Returned" || dateReturned) {
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Returned
                </span>
            );
        }
        if (status === "Approved") {
            return (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Borrowed
                </span>
            );
        }
        if (status === "Disapproved") {
            return (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    Disapproved
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (records.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <BookOpen
                            size={20}
                            className="text-gray-500 dark:text-gray-400"
                        />
                        {title}
                    </h3>
                </div>
                <div className="p-6 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No borrow history found for this item.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <BookOpen
                        size={20}
                        className="text-gray-500 dark:text-gray-400"
                    />
                    {title}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {records.length}{" "}
                    {records.length === 1 ? "record" : "records"}
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                Book Title
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                Accession No.
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                Member
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                Borrowed
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                Due Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                Returned
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white transition-colors duration-300 dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                        {paginatedRecords.map((record) => (
                            <tr
                                key={record.id}
                                className="transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                            >
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {record.id}
                                </td>
                                <td className="px-4 py-3">
                                    <p
                                        className="max-w-[200px] truncate text-sm font-medium text-gray-900 dark:text-gray-100"
                                        title={record.book_title}
                                    >
                                        {record.book_title || "-"}
                                    </p>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {record.accession_no || "-"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {record.member_name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {record.member_no}
                                    </p>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(record.date_borrowed)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(record.due_date)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(record.date_returned)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    {getStatusBadge(
                                        record.status,
                                        record.date_returned,
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleViewRecord(record)}
                                        className="inline-flex items-center justify-center rounded-lg bg-indigo-100 p-1.5 text-indigo-600 transition hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={records.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[10, 25, 50]}
                className="border-t border-gray-200 dark:border-[#3a3a3a]"
            />

            {/* Detail Modal */}
            <BorrowRecordDetailModal
                show={showDetailModal}
                record={selectedRecord}
                onClose={handleCloseDetailModal}
            />
        </div>
    );
}
