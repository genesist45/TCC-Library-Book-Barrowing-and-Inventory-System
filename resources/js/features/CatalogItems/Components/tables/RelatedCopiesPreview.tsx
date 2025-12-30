import { Plus, Copy, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { useState } from "react";

export interface PreviewCopy {
    id: number;
    accession_no: string;
    copy_no: number;
    branch?: string;
    location?: string;
    status: string;
}

interface RelatedCopiesPreviewProps {
    copies: PreviewCopy[];
    onAddCopy: () => void;
    onAddMultipleCopies: () => void;
    onEditCopy: (copy: PreviewCopy) => void;
    onDeleteCopy: (id: number) => void;
}

export default function RelatedCopiesPreview({
    copies,
    onAddCopy,
    onAddMultipleCopies,
    onEditCopy,
    onDeleteCopy,
}: RelatedCopiesPreviewProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [copyToDelete, setCopyToDelete] = useState<PreviewCopy | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleDeleteClick = (copy: PreviewCopy) => {
        setCopyToDelete(copy);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (copyToDelete) {
            onDeleteCopy(copyToDelete.id);
        }
        setShowDeleteModal(false);
        setCopyToDelete(null);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setCopyToDelete(null);
    };

    // Calculate paginated copies
    const totalItems = copies.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCopies = copies.slice(startIndex, endIndex);

    // Reset to first page if current page exceeds total pages
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }

    if (copies.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                {/* Header with Title and Buttons */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Related Copies
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onAddMultipleCopies}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            <Copy size={16} />
                            Add Multiple Copies
                        </button>
                        <button
                            type="button"
                            onClick={onAddCopy}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            <Plus size={16} />
                            Add New Copy
                        </button>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No copies available. Add at least one copy before submitting.
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
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({totalItems} {totalItems === 1 ? "copy" : "copies"})
                    </span>
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onAddMultipleCopies}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        <Copy size={16} />
                        Add Multiple Copies
                    </button>
                    <button
                        type="button"
                        onClick={onAddCopy}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        <Plus size={16} />
                        Add New Copy
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                    <thead className="border-b border-gray-200 bg-gray-50 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                        <tr>
                            <th className="w-[12%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300">
                                Copy No.
                            </th>
                            <th className="w-[20%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300">
                                Accession No.
                            </th>
                            <th className="w-[18%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300">
                                Branch
                            </th>
                            <th className="w-[18%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300">
                                Location
                            </th>
                            <th className="w-[16%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300">
                                Status
                            </th>
                            <th className="w-[16%] px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300">
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
                                <td className="px-4 py-3 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400">
                                    Copy #{copy.copy_no}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                    {copy.accession_no}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400">
                                    {copy.branch || <span className="italic text-gray-400 dark:text-gray-500">Not Set</span>}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400">
                                    {copy.location || <span className="italic text-gray-400 dark:text-gray-500">Not Set</span>}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                        {copy.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center text-sm">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEditCopy(copy)}
                                            className="flex items-center justify-center rounded-lg bg-blue-100 p-1.5 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick(copy)}
                                            className="flex items-center justify-center rounded-lg bg-red-100 p-1.5 text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
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
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                itemsPerPageOptions={[10, 25, 50]}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Copy"
                message={`Are you sure you want to delete copy #${copyToDelete?.copy_no}?`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                variant="danger"
            />
        </div>
    );
}
