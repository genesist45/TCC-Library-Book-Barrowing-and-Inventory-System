import { BookOpen } from 'lucide-react';
import type { ActiveLoan } from '../../types/circulationReports';
import { STATUS_COLORS } from '../../types/circulationReports';

interface ActiveLoansTableProps {
    data: ActiveLoan[];
}

/**
 * Format days remaining display with user-friendly text
 */
function formatDaysRemaining(days: number | null): string {
    if (days === null) return 'N/A';

    // Handle overdue (negative values)
    if (days < 0) {
        const absDays = Math.abs(days);
        if (absDays < 1) {
            const hours = Math.round(absDays * 24);
            return hours <= 1 ? '1 hour overdue' : `${hours} hours overdue`;
        }
        const roundedDays = Math.ceil(absDays);
        return roundedDays === 1 ? '1 day overdue' : `${roundedDays} days overdue`;
    }

    // Handle due today or very soon
    if (days === 0) return 'Due today';
    if (days < 1) {
        const hours = Math.round(days * 24);
        if (hours <= 1) return 'Due in 1 hour';
        if (hours < 24) return `Due in ${hours} hours`;
        return 'Due tomorrow';
    }

    // Handle 1+ days
    const roundedDays = Math.round(days);
    if (roundedDays === 0) return 'Due today';
    if (roundedDays === 1) return 'Due tomorrow';
    return `${roundedDays} days left`;
}

/**
 * Table component for displaying active loans
 */
export function ActiveLoansTable({ data }: ActiveLoansTableProps) {
    return (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Active Checkouts
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Currently checked out books that have not been returned
                    </p>
                </div>
            </div>

            {data && data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Member Name
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Book Title
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Borrow Date
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Due Date
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Days Left
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((loan, index) => {
                                const statusColors = STATUS_COLORS[loan.status];
                                const isOverdue = loan.status === 'Overdue';

                                return (
                                    <tr
                                        key={loan.id}
                                        className={`border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${isOverdue
                                            ? 'bg-red-50/50 dark:bg-red-900/10'
                                            : index % 2 === 0
                                                ? 'bg-white dark:bg-[#2a2a2a]'
                                                : 'bg-gray-50/50 dark:bg-[#252525]'
                                            }`}
                                    >
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {loan.memberName}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="block max-w-[200px] truncate">
                                                {loan.bookTitle}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                            {loan.borrowDate}
                                        </td>
                                        <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                            {loan.dueDate}
                                        </td>
                                        <td className="py-3 px-4 text-center text-sm">
                                            <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                                                {formatDaysRemaining(loan.daysRemaining)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                                                {loan.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex h-32 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="text-center">
                        <BookOpen className="mx-auto h-8 w-8 text-emerald-500" />
                        <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                            No books are currently checked out
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
