import { Trophy } from 'lucide-react';
import type { MostBorrowedBook } from '../../types/circulationReports';

interface MostBorrowedBooksTableProps {
    data: MostBorrowedBook[];
}

/**
 * Get rank badge for top 3 positions
 */
function getRankBadge(rank: number): string {
    switch (rank) {
        case 1:
            return '🥇';
        case 2:
            return '🥈';
        case 3:
            return '🥉';
        default:
            return rank.toString();
    }
}

/**
 * Table component for displaying most borrowed books
 */
export function MostBorrowedBooksTable({ data }: MostBorrowedBooksTableProps) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Most Checked Out Books
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Books with the highest circulation activity
                    </p>
                </div>
            </div>

            {data && data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-16">
                                    Rank
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Title
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Category
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Total Checkouts
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Last Checked Out
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
                                        } ${book.rank <= 3 ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}
                                >
                                    <td className="py-3 px-4 text-center">
                                        <span className={`text-lg ${book.rank <= 3 ? 'font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {getRankBadge(book.rank)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                        <span className="block max-w-[250px] truncate">
                                            {book.title}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                        {book.category}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                            {book.borrowCount}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                        {book.lastBorrowed}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-gray-500 dark:text-gray-400">
                        No borrowing activity yet
                    </p>
                </div>
            )}
        </div>
    );
}
