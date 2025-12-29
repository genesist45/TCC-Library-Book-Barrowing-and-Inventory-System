import { CheckCircle } from 'lucide-react';
import type { LowStockBook } from '../../types/catalogReports';

interface LowStockAlertTableProps {
    data: LowStockBook[];
}

/**
 * Table component for displaying books with low stock
 */
export function LowStockAlertTable({ data }: LowStockAlertTableProps) {
    return (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Low Stock Alert
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Books with low availability requiring attention
                </p>
            </div>

            {data && data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Title
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Category
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Total Copies
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Available
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((book, index) => (
                                <tr
                                    key={book.id}
                                    className={`border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${index % 2 === 0
                                        ? 'bg-white dark:bg-[#2a2a2a]'
                                        : 'bg-gray-50/50 dark:bg-[#252525]'
                                        }`}
                                >
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                        <span className="block max-w-[200px] truncate">
                                            {book.title}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                        {book.category}
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                        {book.totalCopies}
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                                        {book.availableCopies}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                            Low Stock
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex h-32 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="text-center">
                        <CheckCircle className="mx-auto h-8 w-8 text-emerald-500" />
                        <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                            All books have adequate stock levels
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
