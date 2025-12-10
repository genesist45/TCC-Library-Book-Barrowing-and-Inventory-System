import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Copy {
    id: number;
    accession_no: string;
    copy_no: number;
    branch?: string;
    location?: string;
    status: string;
}

interface RelatedCopiesTableProps {
    copies: Copy[];
    onRefresh: () => void;
}

export default function RelatedCopiesTable({ copies, onRefresh }: RelatedCopiesTableProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (copy: Copy) => {
        if (!confirm(`Are you sure you want to delete copy #${copy.copy_no}?`)) {
            return;
        }

        setDeletingId(copy.id);

        try {
            const response = await axios.delete(route('admin.copies.destroy', copy.id));

            if (response.data.success) {
                toast.success('Copy deleted successfully');
                onRefresh();
            }
        } catch (error) {
            toast.error('Failed to delete copy');
            console.error('Delete error:', error);
        } finally {
            setDeletingId(null);
        }
    };

    if (copies.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No copies available for this catalog item.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                                ID
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                                Accession No.
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                                Copy No.
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
                        {copies.map((copy) => (
                            <tr key={copy.id} className="transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3a]">
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                    {copy.id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 transition-colors duration-300 dark:text-gray-100 sm:px-4">
                                    {copy.accession_no}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                    Copy #{copy.copy_no}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                    {copy.branch || '-'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                    {copy.location || '-'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            copy.status === 'Available'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : copy.status === 'Borrowed'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                : copy.status === 'Reserved'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                : copy.status === 'Lost'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                        }`}
                                    >
                                        {copy.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-center text-sm sm:px-4">
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() => handleDelete(copy)}
                                            disabled={deletingId === copy.id}
                                            className="flex items-center justify-center rounded-lg bg-red-100 p-1.5 text-red-600 transition hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} className="sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
