import { Users, CheckCircle, Eye } from 'lucide-react';
import type { MemberWithOverdue } from '../../types/overdueReports';
import { SEVERITY_COLORS } from '../../types/overdueReports';

interface MembersWithOverdueTableProps {
    data: MemberWithOverdue[];
}

/**
 * Table component for displaying members with overdue books
 * Groups overdue books by member
 */
export function MembersWithOverdueTable({ data }: MembersWithOverdueTableProps) {
    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Members with Overdue Books
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Library members who have books past their due date
                    </p>
                </div>
            </div>

            {data && data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Member Name
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Member ID
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Overdue Books
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Total Days Late
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Total Fine
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Contact
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((member) => {
                                const severityColors = SEVERITY_COLORS[member.severity];

                                return (
                                    <tr
                                        key={member.memberId || member.memberNo}
                                        className={`border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${severityColors.row}`}
                                    >
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {member.memberName}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {member.memberNo}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${severityColors.bg} ${severityColors.text}`}>
                                                {member.overdueCount} {member.overdueCount === 1 ? 'book' : 'books'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`text-sm font-bold ${severityColors.text}`}>
                                                {member.totalDaysOverdue} days
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center text-sm font-bold text-red-600 dark:text-red-400">
                                            {member.totalFineFormatted}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div>
                                                <p className="truncate max-w-[150px]">{member.email}</p>
                                                {member.phone !== 'N/A' && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        {member.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-[#333] dark:text-gray-200 dark:hover:bg-[#444]"
                                                title="View member details"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </button>
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
                            All members have returned their books on time!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
