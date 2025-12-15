import Modal from "@/components/modals/Modal";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import BorrowRecordDetailModal from "@/components/catalog-items/BorrowRecordDetailModal";
import { useState, useEffect } from "react";
import { Eye, Calendar, History, X } from "lucide-react";
import axios from "axios";

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

interface CopyInfo {
    id: number;
    accession_no: string;
    copy_no: number;
    location?: string;
    status: string;
}

interface CopyBorrowHistoryModalProps {
    show: boolean;
    copy: CopyInfo | null;
    catalogItemTitle?: string;
    onClose: () => void;
}

export default function CopyBorrowHistoryModal({
    show,
    copy,
    catalogItemTitle,
    onClose,
}: CopyBorrowHistoryModalProps) {
    const [records, setRecords] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(
        null,
    );

    useEffect(() => {
        if (show && copy) {
            fetchBorrowHistory();
        }
    }, [show, copy]);

    const fetchBorrowHistory = async () => {
        if (!copy) return;

        setLoading(true);
        try {
            const response = await axios.get(
                route("admin.copies.borrow-history", copy.id),
            );
            // Add book title and accession info to each record
            const recordsWithInfo = (response.data.records || []).map(
                (record: BorrowRecord) => ({
                    ...record,
                    book_title: catalogItemTitle,
                    accession_no: copy.accession_no,
                    copy_no: copy.copy_no,
                }),
            );
            setRecords(recordsWithInfo);
        } catch (error) {
            console.error("Failed to fetch borrow history:", error);
            setRecords([]);
        } finally {
            setLoading(false);
        }
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
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    Paid
                </span>
            );
        }
        if (status === "Pending") {
            return (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    Pending
                </span>
            );
        }
        if (status === "Returned" || dateReturned) {
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Returned
                </span>
            );
        }
        if (status === "Approved") {
            return (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Borrowed
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
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

    const handleClose = () => {
        setRecords([]);
        onClose();
    };

    return (
        <>
            <Modal show={show} onClose={handleClose} maxWidth="2xl">
                <div className="flex max-h-[80vh] flex-col overflow-hidden p-4">
                    {/* Header */}
                    <div className="mb-3 flex flex-shrink-0 items-start justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-gray-100">
                                <History
                                    size={18}
                                    className="text-indigo-500"
                                />
                                Borrow History
                            </h2>
                            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                                Copy #{copy?.copy_no}
                                {catalogItemTitle && (
                                    <>
                                        {" "}
                                        -{" "}
                                        <span className="font-medium">
                                            {catalogItemTitle}
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Copy Info Card */}
                    {copy && (
                        <div className="mb-3 flex flex-shrink-0 flex-wrap gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Accession:{" "}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {copy.accession_no}
                                </span>
                            </div>
                            {copy.location && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Location:{" "}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {copy.location}
                                    </span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Status:{" "}
                                </span>
                                <span
                                    className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${copy.status === "Available"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        : copy.status === "Borrowed"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                        }`}
                                >
                                    {copy.status}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500"></div>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                    Loading history...
                                </span>
                            </div>
                        ) : records.length === 0 ? (
                            <div className="py-8 text-center">
                                <Calendar className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    No borrow history found for this copy.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-[#3a3a3a]">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-gray-200 bg-gray-50 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Member
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Borrowed
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Due Date
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Returned
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Status
                                            </th>
                                            <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                                        {records.map((record) => (
                                            <tr
                                                key={record.id}
                                                className="transition-colors hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                                            >
                                                <td className="whitespace-nowrap px-3 py-2">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {record.member_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {record.member_no}
                                                    </p>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(
                                                        record.date_borrowed,
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(
                                                        record.due_date,
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(
                                                        record.date_returned,
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2">
                                                    {getStatusBadge(
                                                        record.status,
                                                        record.date_returned,
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleViewRecord(
                                                                record,
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center rounded-lg bg-indigo-100 p-1 text-indigo-600 transition hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                                                        title="View Details"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Summary */}
                                <div className="border-t border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Total:{" "}
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {records.length}
                                        </span>{" "}
                                        {records.length === 1
                                            ? "record"
                                            : "records"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 flex flex-shrink-0 justify-end">
                        <SecondaryButton onClick={handleClose}>
                            Close
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>

            {/* Detail Modal */}
            <BorrowRecordDetailModal
                show={showDetailModal}
                record={selectedRecord}
                onClose={handleCloseDetailModal}
            />
        </>
    );
}
