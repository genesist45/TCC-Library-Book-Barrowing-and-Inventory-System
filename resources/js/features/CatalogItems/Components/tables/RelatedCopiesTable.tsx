import { Plus, Copy, Pencil, Trash2, History } from "lucide-react";
import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { EditCopyModal, CopyBorrowHistoryModal } from "../modals";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";

const DEFAULT_ITEMS_PER_PAGE = 10;

interface CopyItem {
    id: number;
    accession_no: string;
    copy_no: number;
    branch?: string;
    location?: string;
    status: string;
    reserved_by_member_id?: number | null;
    reserved_by_member?: {
        id: number;
        name: string;
        member_no: string;
        type?: string;
    } | null;
    reserved_at?: string | null;
}

interface RelatedCopiesTableProps {
    copies: CopyItem[];
    catalogItemTitle?: string;
    onRefresh: () => void;
    onAddCopy?: () => void;
    onAddMultipleCopies?: () => void;
}

export default function RelatedCopiesTable({
    copies,
    catalogItemTitle,
    onRefresh,
    onAddCopy,
    onAddMultipleCopies,
}: RelatedCopiesTableProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCopy, setEditingCopy] = useState<CopyItem | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyCopy, setHistoryCopy] = useState<CopyItem | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [copyToDelete, setCopyToDelete] = useState<CopyItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

    // Calculate paginated copies
    const paginatedCopies = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return copies.slice(startIndex, endIndex);
    }, [copies, currentPage, itemsPerPage]);

    // Reset to first page when copies change
    useMemo(() => {
        const totalPages = Math.ceil(copies.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [copies.length, itemsPerPage]);

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleEdit = (copy: CopyItem) => {
        setEditingCopy(copy);
        setShowEditModal(true);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setEditingCopy(null);
        onRefresh();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingCopy(null);
    };

    const handleViewHistory = (copy: CopyItem) => {
        setHistoryCopy(copy);
        setShowHistoryModal(true);
    };

    const handleCloseHistoryModal = () => {
        setShowHistoryModal(false);
        setHistoryCopy(null);
    };

    const handleDeleteClick = (copy: CopyItem) => {
        setCopyToDelete(copy);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!copyToDelete) return;

        setDeletingId(copyToDelete.id);

        try {
            const response = await axios.delete(
                route("admin.copies.destroy", copyToDelete.id),
            );

            if (response.data.success) {
                toast.success("Copy deleted successfully");
                onRefresh();
            }
        } catch (error) {
            toast.error("Failed to delete copy");
            console.error("Delete error:", error);
        } finally {
            setDeletingId(null);
            setShowDeleteModal(false);
            setCopyToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setCopyToDelete(null);
    };

    if (copies.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                {/* Header with Title and Buttons */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Related Copies
                    </h3>
                    <div className="flex items-center gap-2">
                        {onAddMultipleCopies && (
                            <button
                                onClick={onAddMultipleCopies}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                <Copy size={16} />
                                Add Multiple Copies
                            </button>
                        )}
                        {onAddCopy && (
                            <button
                                onClick={onAddCopy}
                                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                <Plus size={16} />
                                Add New Copy
                            </button>
                        )}
                    </div>
                </div>
                <div className="p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No copies available for this catalog item.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            {/* Header with Title and Buttons */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Related Copies
                </h3>
                <div className="flex items-center gap-2">
                    {onAddMultipleCopies && (
                        <button
                            onClick={onAddMultipleCopies}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            <Copy size={16} />
                            Add Multiple Copies
                        </button>
                    )}
                    {onAddCopy && (
                        <button
                            onClick={onAddCopy}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            <Plus size={16} />
                            Add New Copy
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                                Copy No.
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                                Accession No.
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                                Branch
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                                Location
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                                Status
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white transition-colors duration-300 dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                        {paginatedCopies.map((copy) => (
                            <tr
                                key={copy.id}
                                className="transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                            >
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                    Copy #{copy.copy_no}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-900 transition-colors duration-300 dark:text-gray-100 sm:px-4">
                                    {copy.accession_no}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                    {copy.branch || "-"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                    {copy.location || "-"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${copy.status === "Available"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                            : copy.status === "Borrowed"
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                : copy.status === "Reserved"
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                                    : copy.status === "Lost"
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                            }`}
                                    >
                                        {copy.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-center text-sm sm:px-4">
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() =>
                                                handleViewHistory(copy)
                                            }
                                            className="flex items-center justify-center rounded-lg bg-indigo-100 p-1.5 text-indigo-600 transition hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                                            title="Borrow History"
                                        >
                                            <History
                                                size={16}
                                                className="sm:h-4 sm:w-4"
                                            />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(copy)}
                                            className="flex items-center justify-center rounded-lg bg-blue-100 p-1.5 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                            title="Edit"
                                        >
                                            <Pencil
                                                size={16}
                                                className="sm:h-4 sm:w-4"
                                            />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(copy)}
                                            disabled={deletingId === copy.id}
                                            className="flex items-center justify-center rounded-lg bg-red-100 p-1.5 text-red-600 transition hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
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
                        ))}
                    </tbody>
                </table>
            </div>

            <EditCopyModal
                show={showEditModal}
                copy={editingCopy}
                onClose={handleCloseEditModal}
                onSuccess={handleEditSuccess}
            />

            <CopyBorrowHistoryModal
                show={showHistoryModal}
                copy={historyCopy}
                catalogItemTitle={catalogItemTitle}
                onClose={handleCloseHistoryModal}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Copy"
                message={`Are you sure you want to delete copy #${copyToDelete?.copy_no}?`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                processing={deletingId !== null}
                variant="danger"
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={copies.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[10, 25, 50]}
                className="border-t border-gray-200 dark:border-[#3a3a3a]"
            />
        </div>
    );
}
