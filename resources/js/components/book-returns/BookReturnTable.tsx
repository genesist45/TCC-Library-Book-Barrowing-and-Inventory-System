import { Eye, Pencil, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/components/common/Loading';
import { BookReturn } from '@/types';

interface BookReturnTableProps {
    bookReturns: BookReturn[];
    onView: (bookReturn: BookReturn) => void;
    onEdit: (bookReturn: BookReturn) => void;
    onDelete: (bookReturn: BookReturn) => void;
    isLoading: boolean;
}

export default function BookReturnTable({
    bookReturns,
    onView,
    onEdit,
    onDelete,
    isLoading,
}: BookReturnTableProps) {
    const getStatusBadge = (status: string) => {
        const styles = {
            Returned: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3a3a3a]">
                <thead className="bg-gray-50 dark:bg-[#3a3a3a]">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            Member Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            Book Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                    {isLoading ? (
                        <TableSkeleton rowCount={bookReturns.length} columns={6} />
                    ) : bookReturns.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                No book returns found
                            </td>
                        </tr>
                    ) : (
                        bookReturns.map((bookReturn) => (
                            <tr
                                key={bookReturn.id}
                                className="transition-colors hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                            >
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {bookReturn.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                    {bookReturn.member?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                    {bookReturn.catalog_item?.title || 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(bookReturn.return_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}{' '}
                                    {bookReturn.return_time ? new Date(`2000-01-01T${bookReturn.return_time}`).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    }) : ''}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(bookReturn.status)}`}
                                    >
                                        {bookReturn.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        {/* View Button */}
                                        <button
                                            onClick={() => onView(bookReturn)}
                                            className="flex items-center justify-center rounded-lg bg-blue-100 p-1.5 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                            title="View full details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => onEdit(bookReturn)}
                                            className="flex items-center justify-center rounded-lg bg-amber-100 p-1.5 text-amber-600 transition hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                                            title="Edit this return"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => onDelete(bookReturn)}
                                            className="flex items-center justify-center rounded-lg bg-red-100 p-1.5 text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                            title="Delete this return"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
