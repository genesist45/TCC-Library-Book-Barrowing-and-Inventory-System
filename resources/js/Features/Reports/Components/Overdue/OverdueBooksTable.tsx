import { BookX, CheckCircle } from 'lucide-react';
import type { OverdueBook } from '../../types/overdueReports.d';
import { SEVERITY_COLORS } from '../../types/overdueReports.d';

interface OverdueBooksTableProps {
    data: OverdueBook[];
}

/**
 * Table component for displaying overdue books
 * Shows urgency with row highlighting based on days overdue
 */
export function OverdueBooksTable({ data }: OverdueBooksTableProps) {
    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <BookX className="h-5 w-5 text-red-500" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Overdue Books
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Books that have not been returned by their due date
                    </p>
                </div>
            </div>

            {data && data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Book Title
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Member Name
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Category
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Due Date
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Days Overdue
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Fine Amount
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((book) => {
                                const severityColors = SEVERITY_COLORS[book.severity];

                                return (
                                    <tr
                                        key={book.id}
                                        className={`border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${severityColors.row}`}
                                    >
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                            <span className="block max-w-[200px] truncate">
                                                {book.bookTitle}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                            <div>
                                                <p className="font-medium">{book.memberName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {book.memberNo}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {book.category}
                                        </td>
                                        <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                            {book.dueDate}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`text-sm font-bold ${severityColors.text}`}>
                                                {book.daysOverdue} days
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                                            {book.fineFormatted}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800 dark:bg-red-900/50 dark:text-red-300">
                                                OVERDUE
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex h-32 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-center">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                        <p className="mt-2 text-sm font-medium text-green-700 dark:text-green-400">
                            No overdue books at this time. All loans are current!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
