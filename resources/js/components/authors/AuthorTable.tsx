import { Eye, Pencil, Trash2 } from 'lucide-react';

const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] dark:from-[#3a3a3a] dark:via-[#4a4a4a] dark:to-[#3a3a3a]";

function AuthorTableRowSkeleton() {
    return (
        <tr className="border-b border-gray-200 transition-colors duration-300 dark:border-[#3a3a3a]">
            <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                <div className={`${shimmerClass} h-4 w-12 rounded`} />
            </td>
            <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                <div className="flex items-center gap-2">
                    <div className="text-sm space-y-1.5">
                        <div className={`${shimmerClass} h-4 w-40 rounded`} />
                        <div className="flex items-center gap-2">
                            <div className={`${shimmerClass} h-3 w-24 rounded`} />
                            <div className={`${shimmerClass} h-4 w-12 rounded-full`} />
                        </div>
                    </div>
                </div>
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 sm:table-cell sm:px-4">
                <div className={`${shimmerClass} h-4 w-24 rounded`} />
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 sm:table-cell sm:px-4">
                <div className={`${shimmerClass} h-5 w-16 rounded-full`} />
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-center sm:px-4">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                </div>
            </td>
        </tr>
    );
}

interface Author {
    id: number;
    name: string;
    country: string;
    bio?: string;
    is_published: boolean;
    items_count: number;
    created_at: string;
}

interface AuthorTableProps {
    authors: Author[];
    onView: (author: Author) => void;
    onEdit: (author: Author) => void;
    onDelete: (author: Author) => void;
    isLoading?: boolean;
}

export default function AuthorTable({ authors, onView, onEdit, onDelete, isLoading = false }: AuthorTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            Name
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:table-cell sm:px-4">
                            Country
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:table-cell sm:px-4">
                            Items Count
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white transition-colors duration-300 dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <AuthorTableRowSkeleton key={index} />
                        ))
                    ) : (
                        authors.map((author) => (
                            <tr key={author.id} className="transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3a]">
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                    {author.id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                                {author.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 transition-colors duration-300 dark:text-gray-400">
                                                <span className="sm:hidden">{author.country}</span>
                                                <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                                                    author.is_published
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                }`}>
                                                    {author.is_published ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:table-cell sm:px-4">
                                    {author.country}
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:table-cell sm:px-4">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        {author.items_count} items
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-center text-sm sm:px-4">
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() => onView(author)}
                                            className="rounded p-1 text-blue-600 transition-colors duration-300 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                            title="View"
                                        >
                                            <Eye size={16} className="sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(author)}
                                            className="rounded p-1 text-green-600 transition-colors duration-300 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                                            title="Edit"
                                        >
                                            <Pencil size={16} className="sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(author)}
                                            className="rounded p-1 text-red-600 transition-colors duration-300 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} className="sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {!isLoading && authors.length === 0 && (
                <div className="py-12 text-center text-gray-500 transition-colors duration-300 dark:text-gray-400">
                    No authors found. Click "Add Author" to create one.
                </div>
            )}
        </div>
    );
}
